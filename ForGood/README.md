# ForGood - Civic Issue Reporting Platform

ForGood is a civic tool web application prototype that empowers citizens to report social, safety, and infrastructure issues in their community, while allowing authorities to track, cluster, and resolve them efficiently.

**Problem:** Communities often lack a unified, transparent way to report and track local issues like infrastructure failures, safety concerns, or child welfare violations.

**Solution:** A real-time map-based reporting tool that automatically clusters similar nearby reports into actionable "Hotspots" for authorities.

**Tech Stack:** Vanilla JavaScript, HTML5, CSS3, Tailwind CSS (CDN), Leaflet.js, Supabase (PostgreSQL + Auth + Realtime).

---

## 🚀 Live Demo
> To run locally, simply serve the directory with any static web server (e.g. `npx serve`, `python -m http.server`, or VS Code Live Server).

## 🔑 Getting Started
You can easily explore the platform by signing up.
- Use the **Sign Up** toggle on the login page to create an account.
- Choose **Citizen** to report issues.
- Choose **Authority** to access the Authority Dashboard.

## 🌟 Features
1. **Interactive Live Map:** View all issues categorized by color and icon on an interactive Leaflet map.
2. **Issue Reporting:** Logged-in citizens can report issues (Infrastructure, Safety, Child Welfare, Environment, Other) by dropping a pin on the map or using their GPS location.
3. **Automatic Hotspot Detection:** The system uses the Haversine formula to detect when 3 or more unresolved reports of the same category are within 500 meters of each other, highlighting them as a "Hotspot".
4. **Authority Dashboard:** A dedicated view for authorities to see statistics, view all reports, and update statuses (Reported -> In Progress -> Resolved).

