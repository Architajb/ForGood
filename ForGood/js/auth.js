import { CONFIG } from './config.js';

let currentUser = null;
let supabase = null;

export function getSupabase() {
  return supabase;
}

export async function initAuth() {
  if (CONFIG.SUPABASE_URL && CONFIG.SUPABASE_ANON_KEY) {
    supabase = window.supabase.createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_ANON_KEY);

    // Set up auth state listener
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        const role = session.user.user_metadata?.role || 'citizen';
        currentUser = {
          id: session.user.id,
          email: session.user.email,
          role: role
        };
        const { renderNavbars } = await import('./ui.js');
        renderNavbars(currentUser);
        if (window.location.hash === '#/login' || window.location.hash === '') {
          window.location.hash = '#/home';
        }
      } else if (event === 'SIGNED_OUT') {
        currentUser = null;
        const { removeNavbars } = await import('./ui.js');
        removeNavbars();
        window.location.hash = '#/login';
      }
    });

    const { data, error } = await supabase.auth.getSession();
    if (data && data.session) {
      const role = data.session.user.user_metadata?.role || 'citizen';
      currentUser = {
        id: data.session.user.id,
        email: data.session.user.email,
        role: role
      };
    }
  } else {
    console.warn("Supabase credentials missing. Authentication will fail.");
  }
}

export function getCurrentUser() {
  return currentUser;
}

export async function login(email, password) {
  if (!supabase) throw new Error("Supabase is not initialized. Please check config.");

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);

  // onAuthStateChange handles the rest
  return data.user;
}

export async function signUp(email, password, name, role) {
  if (!supabase) throw new Error("Supabase is not initialized. Please check config.");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        role
      }
    }
  });
  if (error) throw new Error(error.message);

  return data.user;
}

export async function logout() {
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.warn("Supabase logout error", e);
    }
  }
}
