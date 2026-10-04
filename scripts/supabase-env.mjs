#!/usr/bin/env node
// Écrit .env.development.local avec l'URL et la clé publique du Supabase local.
// Ce fichier n'est lu que par `pnpm dev` (mode development) : le build de production
// continue d'utiliser .env (projet Supabase en ligne).

import { execSync } from "node:child_process";
import { writeFileSync } from "node:fs";

let status;
try {
  status = JSON.parse(execSync("npx supabase status -o json", { stdio: ["ignore", "pipe", "ignore"] }).toString());
} catch {
  console.error("Supabase local n'est pas démarré : lancez `pnpm db:start`.");
  process.exit(1);
}

writeFileSync(
  ".env.development.local",
  `# Généré par scripts/supabase-env.mjs : Supabase local (Docker). Ne pas commiter.
VITE_SUPABASE_URL=${status.API_URL}
VITE_SUPABASE_ANON_KEY=${status.ANON_KEY}
`,
);

console.log(`✓ .env.development.local → ${status.API_URL}`);
console.log(`  Studio (interface de la base) : ${status.STUDIO_URL}`);
console.log("  Relancez `pnpm dev` si le serveur tournait déjà.");
