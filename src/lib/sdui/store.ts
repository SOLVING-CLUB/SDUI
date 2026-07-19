// Config store selector: Supabase when configured (deployed), local JSON files
// otherwise (dev/demo). Both implementations expose the same functions.

import * as fileStore from "./store-file";
import * as supabaseStore from "./store-supabase";

const useSupabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
const impl = useSupabase ? supabaseStore : fileStore;

export const { getMeta, getPublished, getDraft, saveDraft, publish, rollback } = impl;
