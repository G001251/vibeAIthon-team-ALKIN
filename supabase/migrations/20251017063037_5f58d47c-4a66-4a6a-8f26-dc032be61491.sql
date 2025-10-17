-- Fix infinite recursion and create missing tables

-- Drop problematic policies
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create user_roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- User roles policies
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage all roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Fixed profiles policies using has_role
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

-- Company settings table
CREATE TABLE IF NOT EXISTS public.company_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL DEFAULT 'Humanet',
  logo_url text,
  locations text[] DEFAULT ARRAY['Coimbatore', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai'],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.company_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view company settings" ON public.company_settings FOR SELECT USING (true);
CREATE POLICY "Admins can manage company settings" ON public.company_settings FOR ALL USING (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.company_settings (company_name, locations)
SELECT 'Humanet', ARRAY['Coimbatore', 'Chennai', 'Bangalore', 'Hyderabad', 'Mumbai']
WHERE NOT EXISTS (SELECT 1 FROM public.company_settings LIMIT 1);

-- ATS config table
CREATE TABLE IF NOT EXISTS public.ats_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  default_threshold numeric DEFAULT 70,
  skills_keywords text[] DEFAULT ARRAY['React', 'Node.js', 'Python', 'JavaScript'],
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.ats_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view ATS config" ON public.ats_config FOR SELECT USING (true);
CREATE POLICY "HR and Admin can manage ATS config" ON public.ats_config FOR ALL
USING (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'hr'));

INSERT INTO public.ats_config (default_threshold, skills_keywords)
SELECT 70, ARRAY['React', 'Node.js', 'Python', 'JavaScript', 'TypeScript', 'AI', 'ML', 'AWS', 'Docker', 'Kubernetes']
WHERE NOT EXISTS (SELECT 1 FROM public.ats_config LIMIT 1);

-- Update handle_new_user function to create user_role entry
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE((new.raw_user_meta_data->>'role')::app_role, 'hr')
  );
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, COALESCE((new.raw_user_meta_data->>'role')::app_role, 'hr'));
  
  RETURN new;
END;
$$;