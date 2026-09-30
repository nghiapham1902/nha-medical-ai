import type { Metadata } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import "./article.css";
import { siteUrl, siteDescription } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme";
const siteFont = Be_Vietnam_Pro({
  subsets: ["latin", "latin-ext", "vietnamese"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-site",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Thiết bị Y tế & Phòng thí nghiệm | NHA Medical",
    template: "%s | NHA Medical",
  },
  description: siteDescription,
  openGraph: {
    siteName: "NHA Medical",
    locale: "vi_VN",
    images: ["/opengraph-image"],
  },
  twitter: { card: "summary_large_image" },
  robots: { index: process.env.NODE_ENV === "production", follow: true },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={siteFont.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t;try{t=localStorage.getItem('nha-theme')}catch(e){}document.documentElement.dataset.theme=t==='light'||t==='dark'?t:window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
