import { getSupabase, unwrap } from '../lib/supabase.js'
import { mapUser } from './mappers.js'

export const registerUserAPI = async ({ email, password }) => {
  const data = unwrap(await getSupabase().auth.signUp({
    email: email.trim(), password,
    options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
  }))
  return { ...mapUser(data.user), requiresConfirmation: !data.session }
}
export const signIn = async ({ email, password }) => {
  const data = unwrap(await getSupabase().auth.signInWithPassword({ email: email.trim(), password }))
  return mapUser(data.user)
}
export const signOut = async () => {
  unwrap(await getSupabase().auth.signOut({ scope: 'local' }))
}
