-- Supabase schema for FFT Content Hub & Idea Factory

-- Users table is handled by Supabase Auth (auth.users), we just reference it.

-- Ideas Table
CREATE TABLE public.ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content_angle TEXT NOT NULL,
    technical_highlight TEXT NOT NULL,
    roadmap TEXT NOT NULL,
    club_tag TEXT NOT NULL,
    creator_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Crazy Idea', -- 'Crazy Idea', 'Brainstorming & Refining', 'Production/Scripting', 'Ready for Reality'
    upvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Idea Comments Table
CREATE TABLE public.idea_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
    user_name TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Votes Table (to prevent double voting if auth is implemented)
CREATE TABLE public.votes (
    idea_id UUID REFERENCES public.ideas(id) ON DELETE CASCADE NOT NULL,
    user_id TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (idea_id, user_id)
);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

-- Create simple policies (allow all for demo purposes, restrict in production)
CREATE POLICY "Allow public read access" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.ideas FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access" ON public.ideas FOR DELETE USING (true);

CREATE POLICY "Allow public read access" ON public.idea_comments FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.idea_comments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read access" ON public.votes FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.votes FOR INSERT WITH CHECK (true);
