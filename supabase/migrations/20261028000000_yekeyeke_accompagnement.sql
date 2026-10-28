-- Article YèkèYèkè 2025 : précision sur l'accompagnement du maire de Grand-Popo.
update public.posts
set title = 'YèkèYèkè 2025 : accompagnement du maire de Grand-Popo',
    excerpt = 'Le cabinet FM Consulting accompagne le maire de Grand-Popo dans les activités culturelles et cultuelles, notamment lors de la fête YèkèYèkè 2025.',
    content = replace(replace(content::text,
      'Soutien du cabinet FM Consulting à la mairie de Grand-Popo lors de la fête cultuelle YèkèYèkè 2025.',
      'Accompagnement du maire de Grand-Popo par le cabinet FM Consulting dans les activités culturelles et cultuelles, lors de la fête YèkèYèkè 2025.'),
      '"caption":"Fête cultuelle YèkèYèkè 2025 à Grand-Popo"',
      '"caption":"YèkèYèkè 2025 : accompagnement du maire de Grand-Popo dans les activités culturelles et cultuelles"')::jsonb
where slug = 'fete-yekeyeke-grand-popo-2025';
