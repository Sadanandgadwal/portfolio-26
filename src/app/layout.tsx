import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { portfolio } from "@/lib/content";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const { site, personal } = portfolio;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: site.titleTemplate },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: personal.name, url: site.url }],
  creator: personal.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: personal.name,
    title: site.title,
    description: site.description,
    locale: site.locale,
    ...(site.ogImage && { images: [{ url: site.ogImage }] }),
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
    ...(site.twitterHandle && { creator: site.twitterHandle }),
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the stored/OS theme before first paint to prevent a flash. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}
