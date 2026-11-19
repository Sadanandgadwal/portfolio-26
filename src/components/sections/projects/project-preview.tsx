"use client";

import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import type { Project } from "@/lib/content";
import { cn } from "@/lib/utils";

type ProjectPreviewProps = {
  project: Pick<Project, "title" | "category" | "media">;
  /** Hover/focus state from the parent card. */
  active: boolean;
  sizes: string;
  priority?: boolean;
};

/**
 * Static cover by default. While active: plays the video/GIF preview (fetched only on first
 * activation), or slowly pans a tall screenshot when there is no preview. Without any cover,
 * renders a typographic frame instead of filler imagery.
 */
export function ProjectPreview({ project, active, sizes, priority }: ProjectPreviewProps) {
  const { cover, coverAlt, preview, previewType } = project.media;
  const reduceMotion = usePrefersReducedMotion();
  const canPreview = Boolean(preview) && previewType !== "none" && !reduceMotion;
  const playing = canPreview && active;

  // Mount heavy media only after the first activation (lazy, no network cost up front).
  const [mounted, setMounted] = useState(false);
  if (playing && !mounted) setMounted(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (playing)
      video.play()?.catch(() => {}); // autoplay may be blocked; stay on the cover
    else video.pause();
  }, [playing, mounted]);

  if (!cover) {
    return (
      <div className="relative grid h-full place-items-center overflow-hidden bg-subtle p-8">
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_center,black,transparent_75%)] bg-size-[40px_40px] transition-transform duration-700 ease-out-expo group-hover/project:scale-105"
        />
        <div className="relative text-center">
          {project.category && <p className="label-mono">{project.category}</p>}
          <p className="mt-2 text-headline font-semibold">{project.title}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-subtle" data-playing={playing || undefined}>
      <Image
        src={cover}
        alt={coverAlt || `${project.title} screenshot`}
        fill
        sizes={sizes}
        priority={priority}
        className={cn(
          "object-cover object-top",
          "transition-[object-position,scale] ease-out-expo",
          !canPreview && "duration-[6s] ease-in-out group-hover/project:object-bottom",
          "duration-700 group-hover/project:scale-[1.02]",
        )}
      />

      {mounted && previewType === "video" && (
        <video
          ref={videoRef}
          src={preview}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          data-testid="project-preview-video"
          className={cn(
            "absolute inset-0 size-full object-cover object-top transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}
      {mounted && previewType === "gif" && (
        <Image
          src={preview}
          alt=""
          fill
          unoptimized
          sizes={sizes}
          data-testid="project-preview-gif"
          className={cn(
            "object-cover object-top transition-opacity duration-500",
            playing ? "opacity-100" : "opacity-0",
          )}
        />
      )}

      {canPreview && (
        <span
          aria-hidden
          className={cn(
            "absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border bg-surface-raised/90 px-2.5 py-1 font-mono text-[10px] tracking-wider text-muted-foreground uppercase shadow-sm backdrop-blur transition-opacity duration-300 max-lg:hidden",
            playing && "opacity-0",
          )}
        >
          <Play className="size-3" /> Hover to preview
        </span>
      )}
    </div>
  );
}
