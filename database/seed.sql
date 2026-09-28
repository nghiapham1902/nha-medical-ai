-- Idempotent: never overwrites existing category edits, never creates products.
insert into public.categories(name,slug,icon,sort_order,active) values
 ('Thiết bị phòng thí nghiệm','thiet-bi-phong-thi-nghiem','Microscope',10,true),
 ('Vật tư y tế','vat-tu-y-te','Package',20,true),
 ('Thiết bị y tế','thiet-bi-y-te','HeartPulse',30,true),
 ('Dụng cụ xét nghiệm','dung-cu-xet-nghiem','TestTubes',40,true),
 ('Hóa chất','hoa-chat','FlaskConical',50,true),
 ('Thiết bị bảo hộ','thiet-bi-bao-ho','ShieldCheck',60,true)
on conflict (slug) do nothing;
