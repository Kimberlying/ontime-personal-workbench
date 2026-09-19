-- ==========================================
-- 有序工作台 (Orderly Workbench) Supabase Schema
-- ==========================================

-- 1. 用户个人配置与权益表 (Profiles)
create table if not exists public.profiles (
  id uuid references auth.users not null primary key,
  email text,
  plan_type text default 'free', -- 可选值: 'free', 'pro', 'ultimate'
  subscription_status text default 'inactive', -- 可选值: 'inactive', 'active', 'canceled'
  stripe_customer_id text,
  used_storage bigint default 0, -- 已用云存储字节数 (Bytes)
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- 自动为新注册用户创建 profile 记录的 Trigger
create or replace function public.handle_new_user() 
returns trigger as $$
begin
  insert into public.profiles (id, email, plan_type, subscription_status)
  values (new.id, new.email, 'free', 'inactive');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. 项目表 (Projects) - 记录总数限制与归档
create table if not exists public.projects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  deadline date,
  type text default 'short', -- 'short' (短期), 'long' (长期)
  progress int default 0, -- 0 - 100
  next_step text default '',
  is_archived boolean default false, -- 是否归档（归档后不占用活跃数量限制）
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

alter table public.projects enable row level security;

create policy "Users can CRUD own projects" 
  on public.projects for all 
  using (auth.uid() = user_id);


-- 3. 任务表 (Tasks) - 倒排工期生成的每日清单
create table if not exists public.tasks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references public.projects(id) on delete cascade,
  title text not null,
  assigned_date date not null, -- 倒排后分配给哪一天 (YYYY-MM-DD)
  status text default 'pending', -- 状态: 'pending', 'completed'
  completed_at timestamp with time zone,
  attachments jsonb default '[]'::jsonb, -- 存放附件元数据: [{"name":"合同.pdf", "size":102400, "url":"..."}]
  created_at timestamp with time zone default now()
);

alter table public.tasks enable row level security;

create policy "Users can CRUD own tasks" 
  on public.tasks for all 
  using (auth.uid() = user_id);

-- 创建索引以加快按日期和项目查询
create index if not exists idx_tasks_user_date on public.tasks (user_id, assigned_date);
create index if not exists idx_tasks_project on public.tasks (project_id);


-- 4. 团队协作者表 (Project Members) - 仅旗舰版可用
create table if not exists public.project_members (
  id uuid default gen_random_uuid() primary key,
  project_id uuid references public.projects(id) on delete cascade,
  member_email text not null,
  role text default 'editor', -- 'editor', 'viewer'
  created_at timestamp with time zone default now()
);

alter table public.project_members enable row level security;

create policy "Project owners can manage members" 
  on public.project_members for all 
  using (
    exists (
      select 1 from public.projects 
      where projects.id = project_members.project_id 
      and projects.user_id = auth.uid()
    )
  );

create policy "Members can view their shared projects" 
  on public.project_members for select 
  using (auth.jwt() ->> 'email' = member_email);
