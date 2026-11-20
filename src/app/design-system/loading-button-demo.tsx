"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function LoadingButtonDemo() {
  const [loading, setLoading] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  return (
    <Button
      variant="secondary"
      loading={loading}
      onClick={() => {
        setLoading(true);
        timer.current = window.setTimeout(() => setLoading(false), 1500);
      }}
    >
      {loading ? "Saving…" : "Click to load"}
    </Button>
  );
}
