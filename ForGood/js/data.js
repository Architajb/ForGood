import { CONFIG } from './config.js';
import { getCurrentUser, getSupabase } from './auth.js';

export async function getReports(filters = {}) {
  const supabase = getSupabase();
  if (!supabase) return [];
  
  let query = supabase.from('reports').select('*');
  if (filters.type && filters.type !== 'all') query = query.eq('type', filters.type);
  if (filters.status && filters.status !== 'all') query = query.eq('status', filters.status);
  if (filters.userId) query = query.eq('user_id', filters.userId);
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

export async function createReport(reportData) {
  const user = getCurrentUser();
  if (!user) throw new Error("Must be logged in to report");
  
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not connected.");

  const { data, error } = await supabase.from('reports').insert([{
    ...reportData,
    user_id: user.id,
    user_email: user.email,
    status: 'reported'
  }]).select().single();
  
  if (error) throw error;
  return data;
}

export async function updateReportStatus(reportId, status) {
  const supabase = getSupabase();
  if (!supabase) throw new Error("Supabase is not connected.");

  const { data, error } = await supabase.from('reports')
    .update({ status })
    .eq('id', reportId)
    .select().single();
    
  if (error) throw error;
  return data;
}

export async function getStats() {
  const all = await getReports();
  return {
    total: all.length,
    reported: all.filter(r => r.status === 'reported').length,
    in_progress: all.filter(r => r.status === 'in_progress').length,
    resolved: all.filter(r => r.status === 'resolved').length,
    byCategory: CONFIG.CATEGORIES.map(c => ({
      id: c.id,
      label: c.label,
      color: c.hex,
      count: all.filter(r => r.type === c.id).length
    }))
  };
}
