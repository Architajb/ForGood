-- Drop the old policy
DROP POLICY IF EXISTS "Authorities can update reports" ON reports;

-- Create the new policy based on user_metadata role
CREATE POLICY "Authorities can update reports"
  ON reports FOR UPDATE
  TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'authority')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'authority');
