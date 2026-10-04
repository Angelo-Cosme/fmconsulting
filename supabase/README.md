# Actualités : Supabase (local et en ligne)

Le site reste 100 % statique (déployé avec Figma Make). Les articles, les comptes admin et les images
sont gérés par Supabase. Le dashboard est accessible sur **`/admin`**.

## En local (Docker)

Prérequis : Docker Desktop démarré.

```bash
pnpm db:start                 # lance Supabase dans Docker et écrit .env.development.local
pnpm admin:create vous@exemple.com "MotDePasse"   # crée un compte admin local
pnpm dev                      # site sur http://localhost:8443, dashboard sur /admin
```

| Service | Adresse |
| --- | --- |
| Site / dashboard | http://localhost:8443 / http://localhost:8443/admin |
| Studio (interface de la base, des fichiers et des comptes) | http://127.0.0.1:54323 |
| API Supabase | http://127.0.0.1:54321 |

Autres commandes :
- `pnpm db:stop` : arrête les conteneurs (les données sont conservées).
- `pnpm db:reset` : repart de zéro : réapplique les migrations et `seed.sql`, **efface tout** (comptes inclus).
- `pnpm db:status` : affiche les adresses et clés locales.

Le fichier `.env.development.local` n'est lu que par `pnpm dev` : le build de production utilise `.env`.

## Mise en ligne

1. Créez un projet sur https://supabase.com (région conseillée : Europe, ex. Paris `eu-west-3`).
2. Appliquez les migrations (au choix) :
   - **CLI** : `npx supabase login`, `npx supabase link --project-ref <ref>`, puis `npx supabase db push`.
   - **Manuel** : SQL Editor > New query > collez `migrations/20261004000000_news.sql` > Run.
   - Facultatif : exécutez `seed.sql` pour les 6 articles de démonstration.
3. **Authentication > Sign In / Providers** : désactivez « Allow new users to sign up »
   (laissez le fournisseur Email activé).
4. Créez le compte admin, avec la clé secrète `service_role` (Project Settings > API) :
   ```bash
   SUPABASE_URL=https://<ref>.supabase.co SUPABASE_SERVICE_ROLE_KEY=<clé secrète> \
     pnpm admin:create vous@exemple.com "MotDePasse"
   ```
   Cette clé donne tous les droits : ne la mettez jamais dans `.env` ni dans le code.
5. Copiez `.env.example` en `.env` avec l'URL du projet et la clé publique `anon`, puis déployez
   (`.figma/make/deploy` construit le site en local et utilise donc `.env`).

Pour retirer un accès : `delete from public.admins where user_id = (select id from auth.users where email = '…');`

## Fonctionnement
- **Articles** : table `posts`. Le contenu est rédigé avec l'éditeur Tiptap (titres, gras, italique,
  souligné, barré, liens, listes, citations, séparateurs, images, vidéos YouTube) et stocké en JSON
  (colonne `content`), jamais en HTML. Le site l'affiche avec son propre moteur de rendu, qui ignore
  tout élément inconnu et n'accepte que les liens `http(s)`, `mailto:` et `tel:`. Le public ne lit que les articles publiés (RLS) ;
  seuls les comptes listés dans `admins` peuvent écrire.
- **Images** : insérées par le bouton, par glisser-déposer ou par collage dans l'éditeur ; compressées dans le navigateur avant l'envoi (WebP, ou JPEG sur Safari) en 480 / 960 /
  1600 px, stockées dans le bucket public `news`. Le site charge la taille adaptée, en différé.
  Les images retirées d'un article ou d'un article supprimé sont effacées du stockage.
- **Vidéos** : bouton vidéo ou simple collage d'un lien YouTube dans l'éditeur ; le site n'affiche que la miniature et ne charge le lecteur
  (youtube-nocookie) qu'au clic.
- **Poids** : les pages publiques interrogent l'API REST sans charger `supabase-js` ni Tiptap ;
  ces librairies ne sont téléchargées que sur `/admin`.
- **Limite connue** : une image envoyée puis retirée d'un article jamais enregistré reste dans le
  stockage (Studio > Storage > news pour faire le ménage si besoin).
