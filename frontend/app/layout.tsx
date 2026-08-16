import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { CartHydration } from "@/features/cart";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NoboNG - Shop the world, delivered to Nigeria",
    template: "%s | NoboNG",
  },
  description:
    "Discover products from international stores, buy them through NoboNG, and have your order consolidated and delivered to Nigeria.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} h-full`}
    >
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CartHydration />
          <SiteHeader />
          <main className="flex-1 pb-12">{children}</main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
