-- i18n tables for dynamic content (ES/EN) with fallback-ready model

create table if not exists project_translations (
  id bigserial primary key,
  project_id bigint not null references projects(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  title text not null,
  summary text not null,
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (project_id, locale)
);

create table if not exists introduction_translations (
  id bigserial primary key,
  introduction_id bigint not null references introduction(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  role text,
  description text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (introduction_id, locale)
);

create table if not exists work_experience_translations (
  id bigserial primary key,
  work_experience_id bigint not null references work_experience(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  position text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (work_experience_id, locale)
);

create table if not exists studies_translations (
  id bigserial primary key,
  study_id bigint not null references studies(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  degree text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (study_id, locale)
);

create table if not exists technical_skills_translations (
  id bigserial primary key,
  technical_skill_id bigint not null references technical_skills(id) on delete cascade,
  locale text not null check (locale in ('es', 'en')),
  name text not null,
  category text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (technical_skill_id, locale)
);

-- Seed existing monolingual content into ES translations
insert into project_translations (project_id, locale, title, summary, content)
select p.id, 'es', p.title, p.summary, p.content
from projects p
on conflict (project_id, locale) do update
set title = excluded.title,
    summary = excluded.summary,
    content = excluded.content,
    updated_at = now();

insert into introduction_translations (introduction_id, locale, role, description)
select i.id, 'es', i.role, i.description
from introduction i
on conflict (introduction_id, locale) do update
set role = excluded.role,
    description = excluded.description,
    updated_at = now();

insert into work_experience_translations (work_experience_id, locale, position, description)
select w.id, 'es', w.position, w.description
from work_experience w
on conflict (work_experience_id, locale) do update
set position = excluded.position,
    description = excluded.description,
    updated_at = now();

insert into studies_translations (study_id, locale, degree, description)
select s.id, 'es', s.degree, s.description
from studies s
on conflict (study_id, locale) do update
set degree = excluded.degree,
    description = excluded.description,
    updated_at = now();

insert into technical_skills_translations (technical_skill_id, locale, name, category)
select t.id, 'es', t.name, t.category
from technical_skills t
on conflict (technical_skill_id, locale) do update
set name = excluded.name,
    category = excluded.category,
    updated_at = now();
