-- Create enum types
create type public.app_role as enum ('admin', 'hr', 'team_lead', 'ceo', 'investor');
create type public.candidate_status as enum ('new', 'shortlisted', 'interviewed', 'rejected', 'hired');
create type public.employee_availability as enum ('available', 'assigned', 'busy');
create type public.project_status as enum ('active', 'completed', 'on-hold');

-- Create candidates table
create table public.candidates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text unique not null,
  phone text,
  resume_url text,
  resume_text text,
  skills text[] default '{}',
  experience_years numeric default 0,
  current_ctc numeric,
  expected_ctc numeric,
  education text,
  location text,
  domain text,
  ats_score numeric default 0,
  status candidate_status default 'new',
  applied_date timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Create profiles table for user data
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  email text,
  name text not null,
  role app_role default 'hr',
  created_at timestamp with time zone default now()
);

-- Create employees table
create table public.employees (
  id uuid primary key default gen_random_uuid(),
  candidate_id uuid references public.candidates(id),
  name text not null,
  email text unique not null,
  phone text,
  skills text[] default '{}',
  experience_years numeric default 0,
  ctc numeric not null,
  education text,
  location text,
  domain text,
  current_project_id uuid,
  availability employee_availability default 'available',
  performance_rating numeric default 3 check (performance_rating >= 1 and performance_rating <= 5),
  projects_completed numeric default 0,
  joining_date date default current_date,
  created_at timestamp with time zone default now()
);

-- Create projects table
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  required_skills text[] default '{}',
  required_experience numeric default 0,
  team_size numeric default 1,
  timeline text,
  status project_status default 'active',
  progress_percentage numeric default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
  start_date date,
  end_date date,
  created_at timestamp with time zone default now()
);

-- Add foreign key for employees after projects table exists
alter table public.employees
  add constraint fk_current_project
  foreign key (current_project_id)
  references public.projects(id)
  on delete set null;

-- Create project_assignments table
create table public.project_assignments (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade not null,
  employee_id uuid references public.employees(id) on delete cascade not null,
  assigned_date timestamp with time zone default now(),
  tasks_completed numeric default 0,
  performance_notes text,
  unique(project_id, employee_id)
);

-- Create salary_predictions table
create table public.salary_predictions (
  id uuid primary key default gen_random_uuid(),
  role text not null,
  skills text[] default '{}',
  experience_years numeric default 0,
  location text,
  industry text,
  company_size text,
  education text,
  predicted_min numeric not null,
  predicted_ideal numeric not null,
  predicted_max numeric not null,
  confidence numeric default 80,
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.candidates enable row level security;
alter table public.profiles enable row level security;
alter table public.employees enable row level security;
alter table public.projects enable row level security;
alter table public.project_assignments enable row level security;
alter table public.salary_predictions enable row level security;

-- Create function to handle new user profile creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce((new.raw_user_meta_data->>'role')::app_role, 'hr')
  );
  return new;
end;
$$;

-- Trigger for auto-creating profiles
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Helper function to get user role
create or replace function public.get_user_role(user_id uuid)
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from public.profiles where id = user_id;
$$;

-- RLS Policies for candidates
create policy "HR and Admin can view all candidates"
  on public.candidates for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr')
    )
  );

create policy "HR and Admin can insert candidates"
  on public.candidates for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr')
    )
  );

create policy "HR and Admin can update candidates"
  on public.candidates for update
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr')
    )
  );

-- RLS Policies for profiles
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Admin can view all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role = 'admin'
    )
  );

-- RLS Policies for employees
create policy "Authenticated users can view employees"
  on public.employees for select
  using (auth.uid() is not null);

create policy "HR and Admin can manage employees"
  on public.employees for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr')
    )
  );

-- RLS Policies for projects
create policy "Authenticated users can view projects"
  on public.projects for select
  using (auth.uid() is not null);

create policy "HR, Admin, Team Lead can manage projects"
  on public.projects for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr', 'team_lead')
    )
  );

-- RLS Policies for project_assignments
create policy "Authenticated users can view assignments"
  on public.project_assignments for select
  using (auth.uid() is not null);

create policy "HR, Admin, Team Lead can manage assignments"
  on public.project_assignments for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr', 'team_lead')
    )
  );

-- RLS Policies for salary_predictions
create policy "Authenticated users can view predictions"
  on public.salary_predictions for select
  using (auth.uid() is not null);

create policy "HR and Admin can create predictions"
  on public.salary_predictions for insert
  with check (
    exists (
      select 1 from public.profiles
      where id = auth.uid()
      and role in ('admin', 'hr')
    )
  );