# Security Notice

## Credential Rotation Required

Supabase credentials (URL and anon key) were previously hardcoded in `frontend/ai-server-forge/src/lib/supabase.ts` and exist in git history prior to commit `e842fec`.

**Action required:** Rotate the following credentials in your Supabase dashboard:
1. Go to your Supabase project Settings > API
2. Regenerate the `anon` public key
3. Update your `.env` file with the new values

The credentials have been removed from source code and are now loaded exclusively from environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).

## Environment Variables

All secrets must be set via environment variables or `.env` files (which are gitignored):

| Variable | Location | Required |
|----------|----------|----------|
| `VITE_SUPABASE_URL` | Frontend `.env` | Yes |
| `VITE_SUPABASE_ANON_KEY` | Frontend `.env` | Yes |
| `JWT_SECRET_KEY` | Backend `.env` | Yes |
| `GOOGLE_CLIENT_ID` | Backend `.env` | Only for Google OAuth |
| `GOOGLE_CLIENT_SECRET` | Backend `.env` | Only for Google OAuth |

See `.env.example` files in both `frontend/ai-server-forge/` and `backend/mcp_studio_backend/` for templates.
