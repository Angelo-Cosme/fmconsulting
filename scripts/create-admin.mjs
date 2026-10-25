#!/usr/bin/env node
// Crée (ou promeut) un compte administrateur du dashboard /admin.
//
// En local (Supabase démarré avec `pnpm db:start`) : les clés sont lues automatiquement.
//   pnpm admin:create prenom.nom@exemple.com "MotDePasse"
//
// En ligne (projet de VITE_SUPABASE_URL dans .env, après `npx supabase login`) :
//   pnpm admin:create prenom.nom@exemple.com --prod
// Le mot de passe est alors demandé sans s'afficher à l'écran.
// Ou en fournissant la clé secrète (service_role), jamais commitée :
//   SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=... pnpm admin:create email "MotDePasse"

import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);
const prod = args.includes("--prod");
const [email, givenPassword] = args.filter((a) => a !== "--prod");
if (!email) {
  console.error('Usage : pnpm admin:create <email> ["<mot de passe>"] [--prod]');
  process.exit(1);
}

/** Saisie masquée du mot de passe dans le terminal. */
function askHidden(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding("utf8");
    let value = "";
    stdin.on("data", function onData(ch) {
      if (ch === "\r" || ch === "\n") {
        stdin.setRawMode(false);
        stdin.pause();
        stdin.off("data", onData);
        process.stdout.write("\n");
        resolve(value);
      } else if (ch === "\u0003") process.exit(1);
      else if (ch === "\u007f") value = value.slice(0, -1);
      else value += ch;
    });
  });
}

let password = givenPassword;
if (!password) {
  password = await askHidden("Mot de passe : ");
  if ((await askHidden("Confirmez le mot de passe : ")) !== password) {
    console.error("Les deux mots de passe sont différents.");
    process.exit(1);
  }
}
if (password.length < 8) {
  console.error("Le mot de passe doit contenir au moins 8 caractères.");
  process.exit(1);
}

let url = process.env.SUPABASE_URL;
let key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if ((!url || !key) && prod) {
  url = readFileSync(".env", "utf8").match(/^VITE_SUPABASE_URL=(.+)$/m)?.[1]?.trim();
  const ref = url?.match(/^https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1];
  if (!ref) {
    console.error("VITE_SUPABASE_URL introuvable ou invalide dans .env.");
    process.exit(1);
  }
  try {
    const keys = JSON.parse(execSync(`npx supabase projects api-keys --project-ref ${ref} -o json`, { stdio: ["ignore", "pipe", "ignore"] }).toString());
    key = (keys.find((k) => k.name === "service_role") ?? keys.find((k) => k.type === "secret"))?.api_key;
  } catch {
    key = undefined;
  }
  if (!key) {
    console.error("Clé secrète introuvable : connectez-vous d'abord avec `npx supabase login`.");
    process.exit(1);
  }
  console.log(`Supabase en ligne : ${url}`);
}
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
