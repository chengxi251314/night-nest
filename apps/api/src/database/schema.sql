# PostgreSQL schema draft for Night Nest

create table users (
  id uuid primary key,
  email text unique not null,
  created_at timestamptz not null default now()
);

create table characters (
  id text primary key,
  name text not null,
  title text not null,
  world text not null,
  created_at timestamptz not null default now()
);

create table conversations (
  id uuid primary key,
  user_id uuid not null references users(id),
  character_id text not null references characters(id),
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table messages (
  id uuid primary key,
  conversation_id uuid not null references conversations(id),
  role text not null,
  content text not null,
  created_at timestamptz not null default now()
);

create table relationship_states (
  id uuid primary key,
  user_id uuid not null references users(id),
  character_id text not null references characters(id),
  score integer not null default 0,
  stage text not null,
  mood text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, character_id)
);

create table memory_entries (
  id uuid primary key,
  user_id uuid not null references users(id),
  character_id text not null references characters(id),
  summary text not null,
  weight integer not null default 1,
  created_at timestamptz not null default now()
);

create table story_nodes (
  id text primary key,
  character_id text not null references characters(id),
  title text not null,
  body text not null,
  chapter_order integer not null
);
