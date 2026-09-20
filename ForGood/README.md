# ForGood - Civic Issue Reporting Platform

ForGood is a civic tool web application prototype that empowers citizens to report social, safety, and infrastructure issues in their community, while allowing authorities to track, cluster, and resolve them efficiently.

**Problem:** Communities often lack a unified, transparent way to report and track local issues like infrastructure failures, safety concerns, or child welfare violations.
**Solution:** A real-time map-based reporting tool that automatically clusters similar nearby reports into actionable "Hotspots" for authorities.
**Tech Stack:** Vanilla JavaScript, HTML5, CSS3, Tailwind CSS (CDN), Leaflet.js, Supabase (PostgreSQL + Auth + Realtime).

---

## 🚀 Live Demo
<!-- [Insert Vercel/Netlify Live Link Here] -->
> To run locally, simply serve the directory with any static web server (e.g. `npx serve`, `python -m http.server`, or VS Code Live Server).

## 🔑 Getting Started
You can easily explore the platform by signing up.
- Use the **Sign Up** toggle on the login page to create an account.
- Choose **Citizen** to report issues.
- Choose **Authority** to access the Authority Dashboard.

*(Note: The role selection during sign-up is a prototype simplification for testing purposes. In a real application, authority roles would be strictly provisioned by an administrator.)*

## 🌟 Features
1. **Interactive Live Map:** View all issues categorized by color and icon on an interactive Leaflet map.
2. **Issue Reporting:** Logged-in citizens can report issues (Infrastructure, Safety, Child Welfare, Environment, Other) by dropping a pin on the map or using their GPS location.
3. **Automatic Hotspot Detection:** The system uses the Haversine formula to detect when 3 or more unresolved reports of the same category are within 500 meters of each other, highlighting them as a "Hotspot".
4. **Authority Dashboard:** A dedicated view for authorities to see statistics, view all reports, and update statuses (Reported -> In Progress -> Resolved).

## 🛠️ Setup Instructions (Supabase Integration)

To connect the prototype to a real database:

1. **Create a Supabase Project:**
   - Go to [Supabase](https://supabase.com) and create a new project.
2. **Run the Schema:**
   - Go to the SQL Editor in Supabase.
   - Copy the contents of `supabase/schema.sql` and run it. This sets up the tables, Row Level Security (RLS), and Storage buckets.
3. **Configure the App:**
   - Open `js/config.js`.
   - Paste your Supabase Project URL into `SUPABASE_URL`.
   - Paste your Supabase Anon Key into `SUPABASE_ANON_KEY`.
4. **Disable Email Confirmation (For Demo):**
   - In Supabase > Authentication > Providers > Email, disable "Confirm email".
5. **(Optional) Seed Data:**
   - Run `supabase/seed.sql` in the SQL Editor to populate the map with realistic data and hotspots.

## 📁 File Structure
- `index.html`: Main SPA container.
- `css/styles.css`: Theme variables and custom styles.
- `js/app.js`: Main router and event binding.
- `js/config.js`: Configuration and constants.
- `js/data.js`: Supabase Data Access Layer.
- `js/hotspots.js`: Haversine formula and clustering logic.
- `js/map.js`: Leaflet map implementation.
- `js/ui.js`, `js/report.js`, `js/dashboard.js`, `js/myreports.js`: View-specific logic.

## 📝 License
MIT License.
