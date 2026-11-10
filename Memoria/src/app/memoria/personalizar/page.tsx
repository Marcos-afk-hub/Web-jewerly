import type { Metadata } from "next";
import Link from "next/link";
import { MemoriaCustomizer } from "@/components/memoria-customizer";

export const metadata: Metadata = {
  title: "Personalizador MEMORIA",
  description: "Diseña tu pieza MEMORIA paso a paso: elige el producto, materiales y detalles, describe tu prenda y confirma tu pedido.",
};

type CustomizerPageProps = {
  searchParams: Promise<{ producto?: string }>;
};

export default async function CustomizerPage({ searchParams }: CustomizerPageProps) {
  const { producto } = await searchParams;

  return (
    <main className="customizer-page">
      <section className="customizer-hero">
        <div className="container">
          <div className="breadcrumbs"><Link href="/">Inicio</Link><span aria-hidden="true">/</span><Link href="/memoria">MEMORIA</Link><span aria-hidden="true">/</span><span>Personalizador</span></div>
          <span className="eyebrow eyebrow--memoria"><span className="eyebrow-dot" /> Personalizador MEMORIA</span>
          <h1>Diseña una pieza <em>con tu historia.</em></h1>
          <p>Cinco pasos sencillos. Verás el precio y el tiempo de elaboración antes de confirmar, y al final elegirás cómo hacernos llegar tu prenda.</p>
        </div>
      </section>
      <section className="container customizer-main">
        <MemoriaCustomizer initialProduct={producto} />
      </section>
    </main>
  );
}
