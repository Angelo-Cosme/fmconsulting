import { isConfigured, SUPABASE_ANON_KEY, SUPABASE_URL } from "./news";

export type ContactMessage = {
  name: string;
  email: string;
  phone: string;
  organization: string;
  subject: string;
  message: string;
};

/** Enregistre un message du formulaire de contact (lisible uniquement depuis le dashboard). */
export async function sendMessage(message: ContactMessage) {
  if (!isConfigured) throw new Error("L'envoi de messages n'est pas encore configuré.");
  const res = await fetch(`${SUPABASE_URL}/rest/v1/messages`, {
    method: "POST",
    headers: { apikey: SUPABASE_ANON_KEY, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify(message),
  });
  if (!res.ok) throw new Error("L'envoi a échoué. Merci de réessayer ou de nous écrire directement par email.");
}
