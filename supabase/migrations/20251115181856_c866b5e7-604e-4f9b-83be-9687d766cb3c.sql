-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create skin_profiles table
CREATE TABLE public.skin_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skin_concerns TEXT[] NOT NULL DEFAULT '{}',
  skin_description TEXT,
  ingredients_to_avoid TEXT,
  wants_recommendations BOOLEAN NOT NULL DEFAULT true,
  is_pregnant_nursing BOOLEAN NOT NULL DEFAULT false,
  prescription_products TEXT,
  breakout_frequency TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.skin_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own skin profile" 
ON public.skin_profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own skin profile" 
ON public.skin_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own skin profile" 
ON public.skin_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_skin_profiles_updated_at
BEFORE UPDATE ON public.skin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();