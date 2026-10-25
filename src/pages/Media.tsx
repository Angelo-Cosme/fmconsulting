import { useCallback, useEffect, useState } from "react";
import { usePage } from "@/content/SiteContent";
import { imageSrc } from "@/lib/news";
import { PostImage, VideoPlayer } from "@/components/news";
import { Arrow, CtaBand, PageHeader, Reveal, SectionTitle } from "@/components/ui";

export function Media() {
  const { header, videos, photos } = usePage("media");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items = photos.items.filter((p) => p.image);

  useEffect(() => {
    document.title = "Médiathèque · FM Consulting";
  }, []);

  return (
    <>
      <PageHeader eyebrow={header.eyebrow} title={header.title} text={header.text} />

      {videos.visible && videos.items.length > 0 && (
        <section className="container-site pb-24">
          <SectionTitle eyebrow={videos.eyebrow} title={videos.title} />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
            {videos.items.map((item, i) => (
              <Reveal key={i} delay={(i % 4) * 100}>
                <VideoPlayer video={item.video} title={item.title} className="aspect-[9/16]" />
                <p className="mt-3 text-sm leading-snug font-semibold md:text-[15px]">{item.title}</p>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {photos.visible && items.length > 0 && (
        <section className="block-wide bg-mist py-24 md:py-32">
          <div className="container-site">
            <SectionTitle eyebrow={photos.eyebrow} title={photos.title} />
            <div className="mt-12 columns-1 gap-4 sm:columns-2 md:gap-6 lg:columns-3">
              {items.map((item, i) => (
                <Reveal key={i} className="mb-4 break-inside-avoid md:mb-6">
                  <button type="button" onClick={() => setLightbox(i)} className="group block w-full cursor-zoom-in text-left" aria-label={`Agrandir : ${item.caption}`}>
                    <span className="block overflow-hidden rounded-2xl">
                      <PostImage image={item.image} sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="h-auto w-full transition-transform duration-700 group-hover:scale-[1.04]" />
                    </span>
                    {item.caption && <span className="mt-3 block text-sm leading-snug text-ink-soft">{item.caption}</span>}
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {lightbox !== null && <Lightbox items={items} index={lightbox} onChange={setLightbox} />}

      <CtaBand />
    </>
  );
}

function Lightbox({
  items,
  index,
  onChange,
}: {
  items: { image: Parameters<typeof imageSrc>[0] | null; caption: string }[];
  index: number;
  onChange: (i: number | null) => void;
}) {
  const go = useCallback((step: number) => onChange((index + step + items.length) % items.length), [index, items.length, onChange]);
  const item = items[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [go, onChange]);

  if (!item?.image) return null;
  return (
    <div role="dialog" aria-modal="true" aria-label="Photo agrandie" className="fixed inset-0 z-[100] flex flex-col bg-ink/95 p-4 backdrop-blur" onClick={() => onChange(null)}>
      <div className="flex justify-between text-sm text-white/70">
        <span>
          {index + 1} / {items.length}
        </span>
        <button type="button" onClick={() => onChange(null)} className="cursor-pointer text-white hover:text-sun">
          Fermer ✕
        </button>
      </div>
      <div className="flex min-h-0 flex-1 items-center justify-center gap-4 py-4" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => go(-1)} aria-label="Photo précédente" className="hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:flex">
          <Arrow className="rotate-180" />
        </button>
        <figure className="flex max-h-full min-h-0 flex-col items-center">
          <img src={imageSrc(item.image, 1600)} alt={item.image.alt} className="max-h-[78vh] w-auto rounded-xl object-contain" />
          {item.caption && <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/80">{item.caption}</figcaption>}
        </figure>
        <button type="button" onClick={() => go(1)} aria-label="Photo suivante" className="hidden h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 md:flex">
          <Arrow />
        </button>
      </div>
      <div className="flex justify-center gap-3 md:hidden" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={() => go(-1)} aria-label="Photo précédente" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <Arrow className="rotate-180" />
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Photo suivante" className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white">
          <Arrow />
        </button>
      </div>
    </div>
  );
}
