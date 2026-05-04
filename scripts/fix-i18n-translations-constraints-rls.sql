-- Fix i18n translation tables: dedupe, unique constraints, and RLS policies.
-- Run this in Supabase SQL Editor.

-- 1) Remove duplicates (keep newest row) so UNIQUE can be created safely.
with ranked as (
  select id, row_number() over (
    partition by introduction_id, locale
    order by updated_at desc nulls last, created_at desc nulls last, id desc
  ) as rn
  from introduction_translations
)
delete from introduction_translations t
using ranked r
where t.id = r.id and r.rn > 1;

with ranked as (
  select id, row_number() over (
    partition by project_id, locale
    order by updated_at desc nulls last, created_at desc nulls last, id desc
  ) as rn
  from project_translations
)
delete from project_translations t
using ranked r
where t.id = r.id and r.rn > 1;

with ranked as (
  select id, row_number() over (
    partition by work_experience_id, locale
    order by updated_at desc nulls last, created_at desc nulls last, id desc
  ) as rn
  from work_experience_translations
)
delete from work_experience_translations t
using ranked r
where t.id = r.id and r.rn > 1;

with ranked as (
  select id, row_number() over (
    partition by study_id, locale
    order by updated_at desc nulls last, created_at desc nulls last, id desc
  ) as rn
  from studies_translations
)
delete from studies_translations t
using ranked r
where t.id = r.id and r.rn > 1;

with ranked as (
  select id, row_number() over (
    partition by technical_skill_id, locale
    order by updated_at desc nulls last, created_at desc nulls last, id desc
  ) as rn
  from technical_skills_translations
)
delete from technical_skills_translations t
using ranked r
where t.id = r.id and r.rn > 1;

-- 2) Add UNIQUE constraints used by app upsert/on-conflict logic.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'introduction_translations_introduction_id_locale_key'
  ) then
    alter table introduction_translations
      add constraint introduction_translations_introduction_id_locale_key
      unique (introduction_id, locale);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'project_translations_project_id_locale_key'
  ) then
    alter table project_translations
      add constraint project_translations_project_id_locale_key
      unique (project_id, locale);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'work_experience_translations_work_experience_id_locale_key'
  ) then
    alter table work_experience_translations
      add constraint work_experience_translations_work_experience_id_locale_key
      unique (work_experience_id, locale);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'studies_translations_study_id_locale_key'
  ) then
    alter table studies_translations
      add constraint studies_translations_study_id_locale_key
      unique (study_id, locale);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'technical_skills_translations_technical_skill_id_locale_key'
  ) then
    alter table technical_skills_translations
      add constraint technical_skills_translations_technical_skill_id_locale_key
      unique (technical_skill_id, locale);
  end if;
end $$;

-- 3) Enable RLS and add authenticated policies (idempotent).
alter table introduction_translations enable row level security;
alter table project_translations enable row level security;
alter table work_experience_translations enable row level security;
alter table studies_translations enable row level security;
alter table technical_skills_translations enable row level security;

drop policy if exists intro_tr_select_auth on introduction_translations;
drop policy if exists intro_tr_insert_auth on introduction_translations;
drop policy if exists intro_tr_update_auth on introduction_translations;
create policy intro_tr_select_auth on introduction_translations
  for select to authenticated using (true);
drop policy if exists intro_tr_select_anon on introduction_translations;
create policy intro_tr_select_anon on introduction_translations
  for select to anon using (true);
create policy intro_tr_insert_auth on introduction_translations
  for insert to authenticated with check (true);
create policy intro_tr_update_auth on introduction_translations
  for update to authenticated using (true) with check (true);

drop policy if exists proj_tr_select_auth on project_translations;
drop policy if exists proj_tr_insert_auth on project_translations;
drop policy if exists proj_tr_update_auth on project_translations;
create policy proj_tr_select_auth on project_translations
  for select to authenticated using (true);
drop policy if exists proj_tr_select_anon on project_translations;
create policy proj_tr_select_anon on project_translations
  for select to anon using (true);
create policy proj_tr_insert_auth on project_translations
  for insert to authenticated with check (true);
create policy proj_tr_update_auth on project_translations
  for update to authenticated using (true) with check (true);

drop policy if exists work_tr_select_auth on work_experience_translations;
drop policy if exists work_tr_insert_auth on work_experience_translations;
drop policy if exists work_tr_update_auth on work_experience_translations;
create policy work_tr_select_auth on work_experience_translations
  for select to authenticated using (true);
drop policy if exists work_tr_select_anon on work_experience_translations;
create policy work_tr_select_anon on work_experience_translations
  for select to anon using (true);
create policy work_tr_insert_auth on work_experience_translations
  for insert to authenticated with check (true);
create policy work_tr_update_auth on work_experience_translations
  for update to authenticated using (true) with check (true);

drop policy if exists studies_tr_select_auth on studies_translations;
drop policy if exists studies_tr_insert_auth on studies_translations;
drop policy if exists studies_tr_update_auth on studies_translations;
create policy studies_tr_select_auth on studies_translations
  for select to authenticated using (true);
drop policy if exists studies_tr_select_anon on studies_translations;
create policy studies_tr_select_anon on studies_translations
  for select to anon using (true);
create policy studies_tr_insert_auth on studies_translations
  for insert to authenticated with check (true);
create policy studies_tr_update_auth on studies_translations
  for update to authenticated using (true) with check (true);

drop policy if exists tech_tr_select_auth on technical_skills_translations;
drop policy if exists tech_tr_insert_auth on technical_skills_translations;
drop policy if exists tech_tr_update_auth on technical_skills_translations;
create policy tech_tr_select_auth on technical_skills_translations
  for select to authenticated using (true);
drop policy if exists tech_tr_select_anon on technical_skills_translations;
create policy tech_tr_select_anon on technical_skills_translations
  for select to anon using (true);
create policy tech_tr_insert_auth on technical_skills_translations
  for insert to authenticated with check (true);
create policy tech_tr_update_auth on technical_skills_translations
  for update to authenticated using (true) with check (true);
