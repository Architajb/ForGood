export const CONFIG = {
  // Supabase connection details - GET THESE FROM YOUR .env FILE
  SUPABASE_URL: "YOUR_SUPABASE_PROJECT_URL",
  SUPABASE_ANON_KEY: "YOUR_SUPABASE_ANON_KEY",

  // Issue Categories
  CATEGORIES: [
    { id: "infrastructure", label: "Infrastructure & Utilities", color: "marigold", hex: "#F79D1E", icon: "zap" },
    { id: "safety", label: "Safety & Security", color: "alert", hex: "#E63946", icon: "shield-alert" },
    { id: "child_welfare", label: "Child Welfare", color: "primary", hex: "#1D4E89", icon: "baby" },
    { id: "environment", label: "Environment", color: "resolved", hex: "#3A9D5D", icon: "leaf" },
    { id: "other", label: "Other", color: "text", hex: "#1B2A41", icon: "help-circle" }
  ],

  // Statuses
  STATUSES: [
    { id: "reported", label: "Reported", color: "bg-gray-200 text-gray-800" },
    { id: "in_progress", label: "In Progress", color: "bg-marigold text-[#1B2A41]" },
    { id: "resolved", label: "Resolved", color: "bg-resolved text-white" }
  ]
};
