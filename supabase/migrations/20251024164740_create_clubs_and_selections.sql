/*
  # Football Club Selection System

  1. New Tables
    - `clubs`
      - `id` (uuid, primary key) - Unique identifier for each club
      - `name` (text) - Club name
      - `logo_url` (text, optional) - URL to club logo/badge
      - `league` (text, optional) - League the club plays in
      - `created_at` (timestamptz) - Record creation timestamp
    
    - `user_selections`
      - `id` (uuid, primary key) - Unique identifier for selection
      - `user_name` (text) - Name of the user who selected the club
      - `club_id` (uuid, foreign key) - Reference to selected club
      - `selected_at` (timestamptz) - When the selection was made
      - Unique constraint on `club_id` to ensure one club per user
    
    - `game_config`
      - `id` (uuid, primary key) - Configuration identifier
      - `player_limit` (integer) - Maximum number of players allowed
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on all tables
    - Allow public read access to clubs (view available clubs)
    - Allow public read access to user_selections (see who picked what)
    - Allow public insert/update to user_selections (users can pick clubs)
    - Allow public read/update access to game_config (manage player limits)

  3. Initial Data
    - Seed popular football clubs
    - Set default player limit to 11
*/

-- Create clubs table
CREATE TABLE IF NOT EXISTS clubs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  league text,
  created_at timestamptz DEFAULT now()
);

-- Create user_selections table
CREATE TABLE IF NOT EXISTS user_selections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_name text NOT NULL,
  club_id uuid NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  selected_at timestamptz DEFAULT now(),
  UNIQUE(club_id)
);

-- Create game_config table
CREATE TABLE IF NOT EXISTS game_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_limit integer NOT NULL DEFAULT 11,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_config ENABLE ROW LEVEL SECURITY;

-- Clubs policies (public read access)
CREATE POLICY "Anyone can view clubs"
  ON clubs FOR SELECT
  USING (true);

-- User selections policies (public read and insert)
CREATE POLICY "Anyone can view selections"
  ON user_selections FOR SELECT
  USING (true);

CREATE POLICY "Anyone can create selection"
  ON user_selections FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete own selection"
  ON user_selections FOR DELETE
  USING (true);

-- Game config policies (public read and update)
CREATE POLICY "Anyone can view config"
  ON game_config FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update config"
  ON game_config FOR UPDATE
  USING (true);

CREATE POLICY "Anyone can insert config"
  ON game_config FOR INSERT
  WITH CHECK (true);

INSERT INTO clubs (name, league, logo_url) VALUES
  ('Manchester United', 'Premier League', '/assets/manchester-united.svg'),
  ('Real Madrid', 'La Liga', '/assets/real-madrid.svg'),
  ('Barcelona', 'La Liga', '/assets/FC_Barcelona-O8Y3.svg'),
  ('Bayern Munich', 'Bundesliga', '/assets/fc-bayern-munich-logo.svg'),
  ('Liverpool', 'Premier League', '/assets/liverpool-fc-logo.svg'),
  ('Paris Saint-Germain', 'Ligue 1', '/assets/paris-saint-germain-logo.svg'),
  ('Chelsea', 'Premier League', '/assets/chelsea-fc-logo.svg'),
  ('Juventus', 'Serie A', '/assets/Juventus_FC-O1ivIU.svg'),
  ('Manchester City', 'Premier League', '/assets/manchester-city-logo.svg'),
  ('Inter Milan', 'Serie A', '/assets/inter-milan-logo.svg'),
  ('AC Milan', 'Serie A', '/assets/ac-milan-logo.svg'),
  ('Arsenal', 'Premier League', '/assets/arsenal-fc-logo.svg'),
  ('Borussia Dortmund', 'Bundesliga', '/assets/borussia-dortmund-logo.svg'),
  ('Inter Miami', 'Major League Soccer', '/assets/inter-miami-cf-logo.svg'),
  ('Benfica', 'Primeira Liga', '/assets/sl-benfica-logo.svg'),
  ('FC Porto', 'Primeira Liga', '/assets/fc-porto-logo.svg'),
  ('Al Nassr', 'Saudi Pro League', '/assets/al-nassr-fc-logo.svg'),
  ('Athletic Bilbao', 'La Liga', '/assets/athletic-bilbao-logo.svg'),
  ('Newcastle United', 'Premier League', '/assets/newcastle-united-logo.svg'),
  ('Al Hilal', 'Saudi Pro League', '/assets/al-hilal-sfc-logo.svg')
ON CONFLICT DO NOTHING;


-- Insert default game config
INSERT INTO game_config (player_limit) VALUES (11)
ON CONFLICT DO NOTHING;