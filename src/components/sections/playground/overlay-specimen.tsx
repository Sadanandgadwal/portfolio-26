"use client";

import { useState } from "react";
import { Copy, Share2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const ACTIONS = [
  { label: "Copy link", icon: Copy },
  { label: "Share", icon: Share2 },
  { label: "Delete", icon: Trash2 },
];

/** Modal (focus trap, Esc, return focus) + tooltips on hover and keyboard focus. */
export function OverlaySpecimen() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setSent(false)}>
              Open modal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Invite a teammate</DialogTitle>
            <DialogDescription>Sample dialog. Nothing is sent.</DialogDescription>
            <form
              className="grid gap-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
                setOpen(false);
              }}
            >
              <div className="grid gap-1.5">
                <Label htmlFor="invite-email">Email</Label>
                <Input id="invite-email" type="email" placeholder="teammate@example.com" />
              </div>
              <div className="flex justify-end gap-2">
                <DialogClose asChild>
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Send invite</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <p role="status" className="min-h-5 text-sm text-muted-foreground">
          {sent ? "Invite sent (sample)." : ""}
        </p>
      </div>

      <TooltipProvider delayDuration={150}>
        <div className="flex gap-1" role="toolbar" aria-label="Sample actions">
          {ACTIONS.map(({ label, icon: Icon }) => (
            <Tooltip key={label}>
              <TooltipTrigger asChild>
                <IconButton aria-label={label} variant="outline">
                  <Icon />
                </IconButton>
              </TooltipTrigger>
              <TooltipContent>{label}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  );
}
