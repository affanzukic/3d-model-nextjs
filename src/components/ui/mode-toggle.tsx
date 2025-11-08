"use client";

import dynamic from "next/dynamic";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { memo, useCallback } from "react";

import { Button } from "@/components/ui/button";

const ModeToggleInner = memo(() => {
  const { resolvedTheme, setTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const handleToggle = useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <Button
      aria-label="Promijeni temu"
      className="h-10 w-10 rounded-md"
      size="icon"
      variant="outline"
      onClick={handleToggle}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
});

ModeToggleInner.displayName = "ModeToggleInner";

export const ModeToggle = dynamic(async () => ModeToggleInner, { ssr: false });
