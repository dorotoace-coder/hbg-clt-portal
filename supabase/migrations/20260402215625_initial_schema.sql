-- Create users table extending auth.users
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'viewer',
  access_level TEXT DEFAULT 'basic',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Themes
CREATE TABLE public.themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  year TEXT,
  month TEXT,
  year_theme TEXT,
  month_theme TEXT,
  sub_theme TEXT,
  bible_character TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;

-- Doctrine Packs
CREATE TABLE public.doctrine_packs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  sermon_date DATE,
  summary TEXT,
  revelation_points TEXT[],
  scriptures TEXT[],
  prophetic_phrases TEXT[],
  doctrinal_boundaries TEXT[],
  active BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.doctrine_packs ENABLE ROW LEVEL SECURITY;

-- Devotionals
CREATE TABLE public.devotionals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  title TEXT NOT NULL,
  theme TEXT,
  sub_theme TEXT,
  scripture TEXT,
  key_word TEXT,
  word_focus TEXT,
  bible_story TEXT,
  prayer TEXT,
  confession TEXT,
  action_point TEXT,
  quiz_1 TEXT,
  quiz_2 TEXT,
  quiz_3 TEXT,
  status TEXT DEFAULT 'draft',
  doctrine_pack_id UUID REFERENCES public.doctrine_packs(id) ON DELETE SET NULL,
  created_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.devotionals ENABLE ROW LEVEL SECURITY;

-- Basic RLS Policies (Allow all for anon and authenticated to start, to be restricted later)

CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.themes FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.doctrine_packs FOR SELECT USING (true);
CREATE POLICY "Enable read access for all users" ON public.devotionals FOR SELECT USING (true);

-- Insert User via Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, role)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name', 'viewer');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
