"use client";

import { ThemeProvider as NextThemeProvider, type ThemeProviderProps } from "next-themes";

export const ThemeProvider = ({
  children,
  attribute = "class",
  defaultTheme = "light",
  enableSystem = true,
  ...props
}: ThemeProviderProps) => (
  <NextThemeProvider
    attribute={attribute}
    defaultTheme={defaultTheme}
    enableSystem={enableSystem}
    disableTransitionOnChange
    {...props}
  >
    {children}
  </NextThemeProvider>
);
