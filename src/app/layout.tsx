import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

/* ─── Fuentes ───────────────────────────────────────────────── */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

/* ─── Metadata SEO + PWA ────────────────────────────────────── */
export const metadata: Metadata = {
  title: {
    default: "Restobar Tinku | Restaurante y Bar en Quinta Normal, Santiago",
    template: "%s | Restobar Tinku",
  },
  description:
    "Restobar Tinku en Nueva Extremadura #4402, Quinta Normal, Santiago. Carta de comida chilena, tragos, vinos, desayunos y postres. Reservas por WhatsApp. Abierto todos los días.",
  keywords: [
    "restobar quinta normal",
    "restaurante quinta normal",
    "bar quinta normal",
    "restobar tinku",
    "carta digital tinku",
    "comida chilena santiago",
    "pisco sour quinta normal",
    "reservas restaurante santiago",
    "menú digital quinta normal",
    "Nueva Extremadura 4402",
    "restaurant santiago centro",
    "ceviche santiago",
    "chorrillana santiago",
  ],
  authors: [{ name: "Restobar Tinku", url: "https://tinkubar.cl" }],
  creator: "Restobar Tinku",
  publisher: "Restobar Tinku",
  metadataBase: new URL("https://tinkubar.cl"),
  alternates: {
    canonical: "https://tinkubar.cl",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Restobar Tinku",
  },
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    url: "https://tinkubar.cl",
    siteName: "Restobar Tinku",
    title: "Restobar Tinku | Restaurante y Bar en Quinta Normal, Santiago",
    description:
      "Carta de comida chilena, tragos, vinos y desayunos. Reservas por WhatsApp. Nueva Extremadura #4402, Quinta Normal.",
    locale: "es_CL",
    images: [
      {
        url: "https://tinkubar.cl/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Restobar Tinku — Nueva Extremadura #4402, Quinta Normal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Restobar Tinku | Quinta Normal, Santiago",
    description:
      "Carta de comida chilena, tragos, vinos y desayunos. Reservas por WhatsApp.",
    images: ["https://tinkubar.cl/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-placeholder",
  },
  category: "restaurant",
};

export const viewport: Viewport = {
  themeColor: "#0e0c0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

/* ─── JSON-LD Schema.org ────────────────────────────────────── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: "Restobar Tinku",
  url: "https://tinkubar.cl",
  telephone: "+56989058820",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Nueva Extremadura #4402",
    addressLocality: "Quinta Normal",
    addressRegion: "Región Metropolitana",
    addressCountry: "CL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -33.4372,
    longitude: -70.7028,
  },
  servesCuisine: ["Chilena", "Peruana", "Internacional"],
  priceRange: "$$",
  hasMenu: "https://tinkubar.cl",
  acceptsReservations: "True",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "12:00",
      closes: "23:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Friday", "Saturday"],
      opens: "12:00",
      closes: "00:30",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday"],
      opens: "12:00",
      closes: "22:00",
    },
  ],
  sameAs: [
    "https://g.page/r/CXL3cIT1CTiyEAE/review",
  ],
  image: "https://tinkubar.cl/og-image.jpg",
  description:
    "Restobar Tinku en Quinta Normal, Santiago. Comida chilena, tragos, vinos, desayunos y postres. Reservas disponibles.",
};

/* ─── Root Layout ───────────────────────────────────────────── */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${inter.variable} ${playfair.variable} h-full`}
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className="min-h-full flex flex-col antialiased overflow-x-hidden"
        style={{ backgroundColor: "#FDFBF7", color: "#1c1917" }}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
