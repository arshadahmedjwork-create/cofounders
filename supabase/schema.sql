-- COFOUNDER MATRIMONY: FULL DATABASE RESET & SCHEMA SETUP --
-- Execute this entire script in your Supabase SQL Editor --

-- 1. CLEANUP: Drop all existing tables to ensure a clean slate
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.connection_requests CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- 2. USER PROFILES: Stores all co-founder professional identities
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'Founder',
    industry TEXT NOT NULL DEFAULT 'Other',
    city TEXT NOT NULL DEFAULT 'Remote',
    experience TEXT NOT NULL, -- Professional Headline / Detailed Bio
    work TEXT NOT NULL,       -- Specific Current Role / Company (Mandatory)
    time_commitment TEXT NOT NULL, -- <10, 10-20, 20+
    looking_for TEXT NOT NULL,
    idea TEXT,                -- Startup concept or goal
    skills TEXT[] DEFAULT '{}', -- Preference Keywords / Tags
    education_history JSONB DEFAULT '[]'::jsonb,
    experience_history JSONB DEFAULT '[]'::jsonb,
    linkedin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CONNECTION REQUESTS: Stores the networking state between users
CREATE TABLE public.connection_requests (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    post_id TEXT, -- Optional ID for specific forum posts if applicable
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(sender_id, receiver_id) -- Prevent duplicate requests
);

-- 4. MESSAGES: Real-time chat history
CREATE TABLE public.messages (
    id BIGSERIAL PRIMARY KEY,
    sender_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. ASSESSMENTS: Stores SYNAPSE™ matching test results
CREATE TABLE public.assessments (
    id BIGSERIAL PRIMARY KEY,
    user_email TEXT NOT NULL,
    answers JSONB NOT NULL DEFAULT '{}'::jsonb,
    results JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. INDEXES for Performance
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_connection_requests_receiver ON public.connection_requests(receiver_id);
CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id);

-- 7. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connection_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- 7.1 User Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- 7.2 Connection Requests Policies
CREATE POLICY "Users can view their own requests" ON public.connection_requests FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can create requests" ON public.connection_requests FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own received requests" ON public.connection_requests FOR UPDATE USING (auth.uid() = receiver_id);

-- 7.3 Messages Policies
CREATE POLICY "Users can view their own messages" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- 7.4 Assessments Policies
CREATE POLICY "Users can view their own assessments" ON public.assessments FOR SELECT USING (true);
CREATE POLICY "Anyone can save assessments" ON public.assessments FOR INSERT WITH CHECK (true);

-- 8. REALTIME CONFIGURATION
-- Enable realtime for notifications and messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.connection_requests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
