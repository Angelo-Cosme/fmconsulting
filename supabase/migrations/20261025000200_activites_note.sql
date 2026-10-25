-- Articles « Activités » : catégories et précisions issues de la note de synthèse du cabinet (juin 2026).
update public.posts set category = 'Coopération internationale'
  where slug in ('signature-accords-cooperation-aout-2025', 'delegation-martinique-mairie-ouidah',
                 'afrodescendants-recus-maires-ouidah-save', 'delegation-save-en-martinique', 'case-pilote-centre-eya-cotonou');
update public.posts set category = 'Représentation institutionnelle'
  where slug = 'delegation-martinique-ministere-affaires-etrangeres-2024';
update public.posts set category = 'Partenariats'
  where slug in ('case-pilote-ministere-enseignement-superieur-2024', 'fete-yekeyeke-grand-popo-2025');

update public.posts set
  excerpt = 'Août 2025 : signature des accords de coopération préparés par le cabinet FM Consulting dans le cadre du jumelage entre la commune de Savè (Bénin) et la ville de Case-Pilote (Martinique).',
  content = jsonb_set(content, '{content,0,content,0,text}',
    '"Août 2025 : signature des accords de coopération entre les deux maires, dans le cadre du jumelage entre la commune de Savè (Bénin) et la ville de Case-Pilote (Martinique), dont le cabinet FM Consulting assure la conception, la coordination et l''accompagnement."')
  where slug = 'signature-accords-cooperation-aout-2025';

update public.posts set
  title = 'Visite officielle du maire de Savè en Martinique',
  excerpt = 'Mai 2024 : organisée et accompagnée par le cabinet FM Consulting, la visite officielle de la délégation de la mairie de Savè (Bénin) en Martinique : soirée de gala, visite de la Fondation Clément et réception.',
  content = jsonb_set(content, '{content,0,content,0,text}',
    '"Mai 2024 : visite officielle du maire de Savè en Martinique, organisée et accompagnée par le cabinet FM Consulting dans le cadre du jumelage avec la ville de Case-Pilote. Soirée de gala pour la délégation de la mairie de Savè (Bénin)."')
  where slug = 'delegation-save-en-martinique';

update public.posts set
  excerpt = 'Audiences avec la Ministre de l''Enseignement supérieur et de la Recherche scientifique (MESRS), Mme Eléonore Ladékan Yayi, avec une délégation de Case-Pilote (Martinique), en 2024.'
  where slug = 'case-pilote-ministere-enseignement-superieur-2024';
