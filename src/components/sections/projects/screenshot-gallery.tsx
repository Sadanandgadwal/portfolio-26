"use client";

import { useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Dialog } from "radix-ui";
import { IconButton } from "@/components/ui/icon-button";

type Shot = { src: string; alt: string };

/** Screenshot grid; each opens in an accessible lightbox dialog. */
export function ScreenshotGallery({ shots }: { shots: Shot[] }) {
  const [open, setOpen] = useState<Shot | null>(null);

  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2">
        {shots.map((shot) => (
          <li key={shot.src}>
            <button
              type="button"
              data-cursor="explore"
              onClick={() => setOpen(shot)}
              className="group/shot relative block aspect-video w-full overflow-hidden rounded-xl border bg-subtle"
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover object-top transition-transform duration-700 ease-out-expo group-hover/shot:scale-[1.03]"
              />
              <span className="sr-only">Open larger view</span>
            </button>
          </li>
        ))}
      </ul>

      <Dialog.Root open={open !== null} onOpenChange={(o) => !o && setOpen(null)}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-80 bg-background/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <Dialog.Content className="fixed inset-4 z-90 grid place-items-center outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 sm:inset-10">
            <Dialog.Title className="sr-only">{open?.alt}</Dialog.Title>
            <Dialog.Description className="sr-only">Enlarged screenshot</Dialog.Description>
            {open && (
              <div className="relative size-full overflow-hidden rounded-xl border bg-surface shadow-lg">
                <Image
                  src={open.src}
                  alt={open.alt}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              </div>
            )}
            <Dialog.Close asChild>
              <IconButton
                aria-label="Close"
                variant="outline"
                className="absolute top-3 right-3 bg-surface"
              >
                <X />
              </IconButton>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
