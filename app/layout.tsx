import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/site-copy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.afriekeza.com"),
  title: `${SITE_NAME} — Africa's Private Capital Markets Platform`,
  description: SITE_DESCRIPTION,
  keywords: [
    "Afriekeza",
    "Africa private markets",
    "SME finance Africa",
    "private credit Kenya",
    "capital markets Africa",
    "investor reporting",
    "startup fundraising Kenya",
    "private credit Africa",
    "fintech Kenya",
  ],
  openGraph: {
    title: `${SITE_NAME} — Africa's Private Capital Markets Platform`,
    description: SITE_DESCRIPTION,
    url: "https://www.afriekeza.com",
    siteName: SITE_NAME,
    images: [
      {
        url: "/afriekeza-logo.png",
        width: 1200,
        height: 630,
        alt: "Afriekeza — Africa Invests",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Africa's Private Capital Markets Platform`,
    description: SITE_DESCRIPTION,
    images: ["/afriekeza-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${manrope.variable} h-full scroll-smooth`}>
      <body className="flex min-h-full flex-col antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
