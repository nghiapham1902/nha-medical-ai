import { test, expect } from "@playwright/test";
import { PGlite } from "@electric-sql/pglite";
import { readFile } from "node:fs/promises";
import { iconNames } from "../src/lib/catalog";

// PostgreSQL in memory, no Supabase credentials/network/data writes.
// Only Supabase's auth.uid()/roles are emulated; the actual migration runs unchanged.
test('SQL migration, CRUD constraints, timestamps and RLS on ephemeral PostgreSQL',async()=>{
 test.setTimeout(120000);
 const db=new PGlite();
 const admin='11111111-1111-4111-8111-111111111111', member='22222222-2222-4222-8222-222222222222';
 async function role(name:'anon'|'authenticated',uid='') {
  await db.exec('reset role'); await db.query("select set_config('request.jwt.claim.sub',$1,false)",[uid]); await db.exec(`set role ${name}`);
 }
 try {
  await db.exec(`create role anon; create role authenticated; create schema auth; create table auth.users(id uuid primary key); create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub',true),'')::uuid $$; grant usage on schema auth to anon,authenticated; grant execute on function auth.uid() to anon,authenticated;`);
  await db.query('insert into auth.users(id) values($1),($2)',[admin,member]);
  await db.exec(await readFile('database/migrations/001_catalog.sql','utf8'));
  await db.exec(await readFile('database/migrations/002_category_icons.sql','utf8'));
  await db.exec(await readFile('database/migrations/002_category_icons.sql','utf8'));
  for (const icon of iconNames) {
    await db.query("insert into public.categories(name,slug,icon) values($1,$2,$3)", [icon, `icon-${icon.toLowerCase()}`, icon]);
  }
  await expect(db.query("insert into public.categories(name,slug,icon) values('Invalid','invalid-icon','Unknown')")).rejects.toThrow();
  await db.exec("delete from public.categories where slug like 'icon-%'");
  const seed=await readFile('database/seed.sql','utf8'); await db.exec(seed); await db.exec(seed);
  expect((await db.query('select * from public.categories')).rows).toHaveLength(6);
  expect((await db.query('select * from public.products')).rows).toHaveLength(0);
  await db.query('insert into public.catalog_admins(user_id) values($1)',[admin]);
  await role('authenticated',admin);
  const c=(await db.query<{id:string;updated_at:Date;created_at:Date}>("insert into public.categories(name,slug,active) values('Test','test-category',true) returning *")).rows[0];
  const hidden=(await db.query<{id:string}>("insert into public.categories(name,slug,active) values('Hidden','test-hidden',false) returning id")).rows[0];
  const p=(await db.query<{id:string;updated_at:Date;created_at:Date}>("insert into public.products(name,slug,sku,category_id) values('Test','test-product','TEST-1',$1) returning *",[c.id])).rows[0];
  await expect(db.query("insert into public.categories(name,slug) values('Duplicate','test-category')")).rejects.toMatchObject({code:'23505'});
  await expect(db.query("insert into public.products(name,slug,sku,category_id) values('Duplicate','test-other','TEST-1',$1)",[c.id])).rejects.toMatchObject({code:'23505'});
  await expect(db.query("delete from public.categories where id=$1",[c.id])).rejects.toMatchObject({code:'23001'});
  for(const [column,value] of [['image','javascript:alert(1)'],['sku','not upper'],['status','unknown']]) await expect(db.query(`update public.products set ${column}=$1 where id=$2`,[value,p.id])).rejects.toMatchObject({code:'23514'});
  for(const value of ['{}','[{}]','[{"name":"","value":"1","unit":"","group":""}]','[{"name":"a","value":3,"unit":"","group":""}]']) await expect(db.query('update public.products set specifications=$1::jsonb where id=$2',[value,p.id])).rejects.toMatchObject({code:'23514'});
  await expect(db.query("update public.products set documents='[{\"name\":\"Bad\",\"href\":\"//evil.example/a\"}]' where id=$1",[p.id])).rejects.toMatchObject({code:'23514'});
  for(const identity of [{name:'anon' as const,uid:''},{name:'authenticated' as const,uid:member}]) {
   await role(identity.name,identity.uid);
   expect((await db.query('select * from public.products')).rows).toHaveLength(0);
   expect((await db.query('select * from public.categories where id=$1',[hidden.id])).rows).toHaveLength(0);
   await expect(db.query("insert into public.categories(name,slug) values('Forbidden','forbidden')")).rejects.toMatchObject({code:'42501'});
   await expect(db.query("insert into public.products(name,slug,sku,category_id) values('Forbidden','forbidden','FORBIDDEN',$1)",[c.id])).rejects.toMatchObject({code:'42501'});
   if(identity.name==='anon') {
    await expect(db.query("update public.products set status='published' where id=$1 returning id",[p.id])).rejects.toMatchObject({code:'42501'});
    await expect(db.query('delete from public.categories where id=$1 returning id',[c.id])).rejects.toMatchObject({code:'42501'});
   } else {
    expect((await db.query("update public.products set status='published' where id=$1 returning id",[p.id])).rows).toEqual([]);
    expect((await db.query('delete from public.categories where id=$1 returning id',[c.id])).rows).toEqual([]);
   }
   await expect(db.query('insert into public.catalog_admins(user_id) values($1)',[member])).rejects.toMatchObject({code:'42501'});
  }
  await role('authenticated',admin);
  const specs=[{name:'Length',value:'10',unit:'mm',group:'Size'},{name:'Mode',value:'Test',unit:'',group:''}];
  const updated=(await db.query<{updated_at:Date;created_at:Date}>("update public.products set status='published',specifications=$1::jsonb,created_at='2000-01-01',updated_at='2000-01-01' where id=$2 returning *",[JSON.stringify(specs),p.id])).rows[0];
  expect(updated.created_at).toEqual(p.created_at); expect(updated.updated_at.getTime()).toBeGreaterThan(p.updated_at.getTime());
  expect((await db.query('update public.products set name=$1 where id=$2 and updated_at=$3 returning id',['Stale',p.id,p.updated_at.toISOString()])).rows).toEqual([]);
  await role('anon');
  const visible=(await db.query<{specifications:unknown}>('select * from public.products where id=$1',[p.id])).rows;
  expect(visible).toHaveLength(1); expect(visible[0].specifications).toEqual(specs);
  await role('authenticated',member);
  expect((await db.query('select * from public.products where id=$1',[p.id])).rows).toHaveLength(1);
  expect((await db.query("update public.products set name='Hacked' where id=$1 returning id",[p.id])).rows).toEqual([]);
  expect((await db.query('delete from public.products where id=$1 returning id',[p.id])).rows).toEqual([]);
  await role('authenticated',admin); await db.query('update public.categories set active=false where id=$1',[c.id]);
  await role('anon'); expect((await db.query('select * from public.products')).rows).toHaveLength(0);
  await role('authenticated',admin); expect((await db.query<{category_id:string}>('select category_id from public.products where id=$1',[p.id])).rows[0].category_id).toBe(c.id);
  await db.query('update public.products set category_id=$1 where id=$2',[hidden.id,p.id]);
  expect((await db.query('delete from public.categories where id=$1 returning id',[c.id])).rows).toHaveLength(1);
  expect((await db.query('delete from public.products where id=$1 returning id',[p.id])).rows).toHaveLength(1);
  expect((await db.query('delete from public.categories where id=$1 returning id',[hidden.id])).rows).toHaveLength(1);
  // Revocation takes effect without issuing a new JWT/session.
  await db.exec('reset role'); await db.query('delete from public.catalog_admins where user_id=$1',[admin]); await role('authenticated',admin);
  await expect(db.query("insert into public.categories(name,slug) values('Revoked','revoked')")).rejects.toMatchObject({code:'42501'});
 } finally { await db.close(); }
});

