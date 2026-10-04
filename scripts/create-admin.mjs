#!/usr/bin/env node
// Crée (ou promeut) un compte administrateur du dashboard /admin.
//
// En local (Supabase démarré avec `pnpm db:start`) : les clés sont lues automatiquement.
//   pnpm admin:create prenom.nom@exemple.com "MotDePasse"
//
// En ligne : fournir l'URL du projet et la clé secrète (service_role), jamais commitée.
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... pnpm admin:create email "MotDePasse"

import { execSync } from "node:child_process";

const [email, password] = process.argv.slice(2);
if (!email || !password) {
  console.error('Usage : pnpm admin:create <email> "<mot de passe>"');
  process.exit(1);
}
if (password.length < 8) {
  console.error("Le mot de passe doit contenir au moins 8 caractères.");
  process.exit(1);
}

let url = process.env.SUPABASE_URL;
let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  try {
    const status = JSON.parse(execSync("npx supabase status -o json", { stdio: ["ignore", "pipe", "ignore"] }).toString());
    url = status.API_URL;
    key = status.SERVICE_ROLE_KEY;
    console.log(`Supabase local détecté : ${url}`);
  } catch {
    console.error("Supabase local introuvable : lancez `pnpm db:start`, ou fournissez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.");
    process.exit(1);
  }
}

const headers = { apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" };

async function call(path, init = {}) {
  const res = await fetch(`${url}${path}`, { ...init, headers: { ...headers, ...init.headers } });
  const body = await res.text();
  return { ok: res.ok, status: res.status, data: body ? JSON.parse(body) : null };
}

async function findUserId(target) {
  for (let page = 1; page < 50; page++) {
    const { data } = await call(`/auth/v1/admin/users?page=${page}&per_page=100`);
    const users = data?.users ?? [];
    const user = users.find((u) => u.email?.toLowerCase() === target.toLowerCase());
    if (user) return user.id;
    if (users.length < 100) return null;
  }
  return null;
}

const created = await call("/auth/v1/admin/users", {
  method: "POST",
  body: JSON.stringify({ email, password, email_confirm: true }),
});

let userId = created.data?.id;
if (!created.ok) {
  userId = await findUserId(email);
  if (!userId) {
    console.error(`Création impossible : ${created.data?.msg ?? created.data?.message ?? created.status}`);
    process.exit(1);
  }
  console.log("Ce compte existe déjà : il est conservé (mot de passe inchangé).");
}

const promoted = await call("/rest/v1/admins?on_conflict=user_id", {
  method: "POST",
  headers: { Prefer: "resolution=ignore-duplicates" },
  body: JSON.stringify({ user_id: userId }),
});
if (!promoted.ok) {
  console.error(`Ajout aux administrateurs impossible : ${promoted.data?.message ?? promoted.status}`);
  process.exit(1);
}

console.log(`✓ ${email} est administrateur du dashboard.`);
