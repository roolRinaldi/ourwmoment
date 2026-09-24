import "server-only";

import { createClient } from "@supabase/supabase-js";

function requireServerEnvironment(name: "NEXT_PUBLIC_SUPABASE_URL" | "SUPABASE_SECRET_KEY") {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required server environment variable: ${name}`);
  }
  return value;
}

const supabaseUrl = requireServerEnvironment("NEXT_PUBLIC_SUPABASE_URL");
const supabaseSecretKey = requireServerEnvironment("SUPABASE_SECRET_KEY");

export const supabaseAdmin = createClient(supabaseUrl, supabaseSecretKey, {
  auth: {
    autoRefreshToken: false,
    detectSessionInUrl: false,
    persistSession: false,
  },
});
