import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  audiences,
  generalObjectives,
  impact,
  problems,
  proposal,
  specificObjectives,
} from "@/lib/objectives";

export const metadata: Metadata = {
  title: "Objetivos y propuesta de valor",
  description:
    "Objetivos generales y específicos del proyecto HILO MÍO · Memoria: la necesidad que atendemos, nuestra propuesta de joyería con historia, público objetivo e impacto.",
};

export default function ObjetivosPage() {
  return (
    <main className="objetivos-page">
      <section className="catalog-hero">
        <div className="container">
          <div className="breadcrumbs">
            <Link href="/">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span>Objetivos</span>
          </div>
          <span className="eyebrow">
            <span className="eyebrow-dot" /> Proyecto
          </span>
          <h1>
            De la prenda guardada <em>a la joya que se lleva.</em>
          </h1>
          <p>
            HILO MÍO · Memoria es un proyecto de joyería con historia. Nace de una
            necesidad concreta: inmortalizar un recuerdo en un objeto que se
            pueda usar todos los días. Aquí está el problema que atendemos,
            nuestros objetivos y la propuesta que lo resuelve.
          </p>
        </div>
      </section>

      {/* ── El problema ─────────────────────────────────────────────── */}
      <section className="section container" id="problema">
        <div className="section-heading section-heading--split">
          <div>
            <span className="eyebrow">El problema</span>
            <h2>
              Tenemos muchos recuerdos <em>y muy pocas formas de llevarlos.</em>
            </h2>
            <p className="section-intro">
              Detectamos tres problemas que se repiten en las familias, las parejas
              y las personas que buscan un regalo con significado.
            </p>
          </div>
        </div>
        <div className="problem-grid">
          {problems.map((problem, index) => (
            <article className="problem-card" key={problem.id}>
              <span className="problem-card__index">0{index + 1}</span>
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Propuesta ───────────────────────────────────────────────── */}
      <section className="objetivos-proposal">
        <div className="container objectives-proposal__inner">
          <div className="objetivos-proposal__copy">
            <span className="eyebrow eyebrow--memoria">{proposal.eyebrow}</span>
            <h2>{proposal.title}</h2>
            {proposal.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <ul className="objetivos-proposal__list">
              {proposal.bullets.map((bullet) => (
                <li key={bullet}>
                  <span aria-hidden="true">✦</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
            <div className="hero-actions">
              <Link href="/memoria" className="button button--memoria">
                Conocer la línea MEMORIA <span aria-hidden="true">→</span>
              </Link>
              <Link href="/memoria/personalizar" className="text-link">
                Diseñar mi pieza <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
          <div className="objetivos-proposal__image">
            <Image
              src="/images/hero-memoria.jpg"
              alt="Dije MEMORIA con un fragmento de tela bordada bajo cristal"
              fill
              sizes="(max-width: 850px) 100vw, 45vw"
            />
          </div>
        </div>
      </section>

      {/* ── Objetivos generales ─────────────────────────────────────── */}
      <section className="section container" id="objetivos-generales">
        <div className="section-heading section-heading--split">
          <div>
            <span className="eyebrow">Objetivos generales</span>
            <h2>
              Las cinco metas <em>que guían el proyecto.</em>
            </h2>
            <p className="section-intro">
              Son los objetivos contra los que se miden todas las demás decisiones del proyecto.
            </p>
          </div>
        </div>
        <ol className="objective-list">
          {generalObjectives.map((objective, index) => (
            <li key={objective.id}>
              <span className="objective-list__number">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3>{objective.title}</h3>
                <p>{objective.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Objetivos específicos ───────────────────────────────────── */}
      <section className="objectives-specific" id="objetivos-especificos">
        <div className="container">
          <div className="section-heading section-heading--split">
            <div>
              <span className="eyebrow">Objetivos específicos</span>
              <h2>
                Lo que vamos a <em>hacer, paso a paso.</em>
              </h2>
              <p className="section-intro">
                Cada objetivo específico corresponde a una entrega concreta del
                proyecto y es verificable en el sitio web que estás viendo.
              </p>
            </div>
          </div>
          <div className="objective-cards">
            {specificObjectives.map((objective) => (
              <article className="objective-card" key={objective.id}>
                <h3>{objective.title}</h3>
                <p>{objective.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Público e impacto ───────────────────────────────────────── */}
      <section className="section container" id="publico">
        <div className="audience-impact">
          <div>
            <div className="section-heading">
              <span className="eyebrow">Público objetivo</span>
              <h2>
                A quién <em>le hablamos.</em>
              </h2>
            </div>
            <div className="audience-list">
              {audiences.map((audience) => (
                <div className="audience-row" key={audience.id}>
                  <strong>{audience.title}</strong>
                  <p>{audience.text}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="section-heading">
              <span className="eyebrow eyebrow--memoria">Impacto</span>
              <h2>
                Lo que el proyecto <em>deja atrás.</em>
              </h2>
            </div>
            <div className="impact-list">
              {impact.map((item) => (
                <div className="impact-row" key={item.id}>
                  <span className="impact-row__label">{item.label}</span>
                  <p>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="closing-cta closing-cta--slim">
        <Image
          src="/images/detalle-textil.jpg"
          alt="Detalle de un fragmento textil sellado bajo cristal"
          fill
          sizes="100vw"
        />
        <div className="closing-cta__overlay" />
        <div className="closing-cta__content">
          <span className="eyebrow eyebrow--light">Lo que te importa, siempre contigo</span>
          <h2>
            Ya sabes <em>por qué existe.</em>
          </h2>
          <p>
            Ahora descubre cómo se convierte en una pieza que puedes usar todos
            los días.
          </p>
          <div className="hero-actions">
            <Link href="/catalogo" className="button button--cream">
              Ver el catálogo <span aria-hidden="true">→</span>
            </Link>
            <Link href="/nosotros" className="text-link text-link--light">
              Conoce el proyecto <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
