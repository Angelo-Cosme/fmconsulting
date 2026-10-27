-- Vidéo « Visite des hommes d'affaires martiniquais : rencontre avec la Ministre de l'Enseignement supérieur »
-- ajoutée à l'article correspondant, avant la mention finale. Sans effet si elle y figure déjà.
update public.posts
set content = jsonb_insert(
  content,
  '{content,-1}',
  '{"type":"video","attrs":{"src":"media/videos/ministre-mesrs-hommes-affaires-martiniquais.mp4","poster":"media/videos/ministre-mesrs-hommes-affaires-martiniquais.webp","width":480,"height":854,"caption":"Visite des hommes d''affaires martiniquais : rencontre avec la Ministre de l''Enseignement supérieur du Bénin"}}'::jsonb
)
where slug = 'case-pilote-ministere-enseignement-superieur-2024'
  and content::text not like '%ministre-mesrs-hommes-affaires-martiniquais%';
