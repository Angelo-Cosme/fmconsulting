/** Extrait l'ID d'une vidéo YouTube depuis un lien (watch, youtu.be, shorts, embed, live) ou un ID brut. */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    const host = url.hostname.replace(/^(www\.|m\.|music\.)/, "");
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
    else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      id = url.searchParams.get("v");
      const match = url.pathname.match(/^\/(?:shorts|embed|live|v)\/([\w-]{11})/);
      if (!id && match) id = match[1];
    }
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const youTubeThumb = (id: string) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
