import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";
import { logger } from "./logger";

let supabase: SupabaseClient;

export const initializeDatabase = (): SupabaseClient => {
  try {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    logger.info("✅ Database connection initialized");
    return supabase;
  } catch (error) {
    logger.error("❌ Failed to initialize database:", error);
    throw error;
  }
};

export const getDatabase = (): SupabaseClient => {
  if (!supabase) {
    return initializeDatabase();
  }
  return supabase;
};

export { supabase };
