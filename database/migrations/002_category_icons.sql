-- Expand the icon choices without changing existing categories or policies.
begin;
alter table public.categories drop constraint if exists categories_icon_check;
alter table public.categories add constraint categories_icon_check
  check (icon in (
    'Microscope','Package','HeartPulse','TestTubes','FlaskConical','ShieldCheck',
    'Scissors','Activity','Scan','Baby','ShieldPlus','Dna','Stethoscope','Syringe','Droplets'
  ));
commit;
