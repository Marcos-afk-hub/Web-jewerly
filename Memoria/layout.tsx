import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { StoreProvider } from "@/components/store-provider";
import { WhatsAppButton } from "@/components/whatsapp-button";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "HILO MÍO | Joyería y accesorios · Estado de México",
    template: "%s | HILO MÍO",
  },
  description:
    "HILO MÍO es una joyería mexicana con sede en el Estado de México: collares, pulseras, aretes, anillos, cadenas y accesorios personalizados. Conoce MEMORIA, nuestra línea que transforma fragmentos de prendas en joyería.",
  applicationName: "HILO MÍO",
  keywords: ["joyería", "Estado de México", "plata .925", "joyería personalizada", "MEMORIA", "recuerdos en joyería"],
  openGraph: {
    title: "HILO MÍO | Joyas que cuentan historias",
    description: "Joyería y accesorios con envío a todo México. Nueva línea MEMORIA: hay recuerdos que merecen acompañarnos siempre.",
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es-MX">
      <body>
        <StoreProvider>
          <SiteHeader />
          {children}
          <SiteFooter />
          <CartDrawer />
          <WhatsAppButton />
        </StoreProvider>
      </body>
    </html>
  );
}
