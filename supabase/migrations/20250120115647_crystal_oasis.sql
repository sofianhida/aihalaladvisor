/*
  # Create diet history table

  1. New Tables
    - `diet_history`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `health_conditions` (text)
      - `dietary_goals` (text)
      - `current_diet` (text)
      - `recommendations` (text)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS
    - Add policies for users to read and create their own records
*/

CREATE TABLE IF NOT EXISTS diet_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  health_conditions text NOT NULL,
  dietary_goals text NOT NULL,
  current_diet text NOT NULL,
  recommendations text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE diet_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own diet history"
  ON diet_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own diet history"
  ON diet_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);