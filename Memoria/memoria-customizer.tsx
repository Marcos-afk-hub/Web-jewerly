"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useStore } from "@/components/store-provider";
import { garmentMethods } from "@/lib/fulfillment";
import { formatPrice } from "@/lib/format";
import {
  chainApplies,
  defaultDesign,
  describeDesign,
  garmentRequirements,
  getMemoriaProduct,
  memoriaCharms,
  memoriaChains,
  memoriaFinishes,
  memoriaMaterials,
  memoriaProducts,
  memoriaShapes,
  memoriaStones,
  memoriaTones,
  occasions,
  priceBreakdown,
  textileTypes,
  type MemoriaOption,
} from "@/lib/memoria-options";
import type { MemoriaDesign } from "@/lib/types";

const steps = [
  { number: 1, title: "Tu pieza", hint: "¿Qué quieres crear?" },
  { number: 2, title: "Diseño", hint: "Materiales y detalles" },
  { number: 3, title: "Tu prenda", hint: "Lo que vamos a conservar" },
  { number: 4, title: "Personalización", hint: "Observaciones" },
  { number: 5, title: "Resumen", hint: "Confirma y compra" },
];

const textileExamples = [
  { image: "/images/detalle-textil.jpg", title: "Bordados y tejidos", text: "Elegimos el motivo más representativo y lo sellamos bajo cristal." },
  { image: "/images/atelier-manos.jpg", title: "Algodón, mezclilla y playeras", text: "Un fragmento de 3 × 3 cm basta para una pieza." },
  { image: "/images/estuche-memoria.jpg", title: "Varias piezas de una prenda", text: "Con 8 × 8 cm hacemos un set completo o piezas para toda la familia." },
];

function OptionList({ label, options, value, onChange, note }: { label: string; options: MemoriaOption[]; value: string; onChange: (id: string) => void; note?: string }) {
  return (
    <div className="cz-group">
      <div className="cz-group__label"><span>{label}</span>{note ? <small>{note}</small> : null}</div>
      <div className="cz-options">
        {options.map((option) => (
          <button key={option.id} type="button" className={`cz-option${value === option.id ? " cz-option--active" : ""}`} onClick={() => onChange(option.id)} aria-pressed={value === option.id}>
            <span className="cz-option__name">{option.name}</span>
            {option.description ? <span className="cz-option__desc">{option.description}</span> : null}
            <span className="cz-option__price">{option.extra > 0 ? `+${formatPrice(option.extra)}` : "Incluido"}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DesignPreview({ design }: { design: MemoriaDesign }) {
  const product = getMemoriaProduct(design.product);
  return (
    <div className="memoria-preview" data-tone={design.tone} aria-label="Representación ilustrativa de tu pieza">
      <div className="memoria-preview__chain" data-chain={chainApplies(design.product) ? design.chain : "none"} />
      <div className={`memoria-preview__pendant memoria-preview__pendant--${design.shape} memoria-preview__pendant--${design.finish}`}>
        <div className={`memoria-preview__textile memoria-preview__textile--${design.textileType}`} />
        {design.stone !== "ninguna" ? <span className={`memoria-preview__stone memoria-preview__stone--${design.stone}`} /> : null}
      </div>
      {design.charm !== "ninguno" ? <span className="memoria-preview__charm">{design.charm === "inicial" ? "A" : design.charm === "fecha" ? "12·03" : design.charm === "corazon" ? "♥" : "✦"}</span> : null}
      <span className="memoria-preview__caption">{product?.name} · representación ilustrativa</span>
    </div>
  );
}

export function MemoriaCustomizer({ initialProduct }: { initialProduct?: string }) {
  const router = useRouter();
  const { addLine } = useStore();
  const [design, setDesign] = useState<MemoriaDesign>(() => ({
    ...defaultDesign,
    product: getMemoriaProduct(initialProduct ?? "") ? (initialProduct as MemoriaDesign["product"]) : defaultDesign.product,
  }));
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [feedback, setFeedback] = useState("");

  const product = getMemoriaProduct(design.product);
  const breakdown = useMemo(() => priceBreakdown(design), [design]);
  const availableTones = memoriaTones.filter((tone) => tone.materials.includes(design.material));

  const update = (patch: Partial<MemoriaDesign>) => setDesign((current) => ({ ...current, ...patch }));

  const selectMaterial = (material: string) => {
    const tones = memoriaTones.filter((tone) => tone.materials.includes(material));
    update({ material, tone: tones.some((tone) => tone.id === design.tone) ? design.tone : tones[0]?.id ?? "dorado" });
  };

  const canContinue = () => {
    if (step === 3) return agreed && design.textileDescription.trim().length >= 3;
    return true;
  };

  const goNext = () => {
    if (!canContinue()) {
      setFeedback("Describe brevemente tu prenda y confirma que está limpia y seca para continuar.");
      return;
    }
    setFeedback("");
    setStep((current) => Math.min(5, current + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const buildLine = () => ({
    kind: "memoria" as const,
    slug: `memoria-${design.product}`,
    name: `MEMORIA · ${product?.name ?? "Pieza"}`,
    image: product?.image ?? "/images/dije-lumbre.jpg",
    unitPrice: breakdown.total,
    quantity: design.piecesFromGarment,
    category: "Línea MEMORIA",
    summary: describeDesign(design),
    design,
  });

  const addToBag = () => {
    addLine(buildLine());
    setFeedback("Tu diseño se agregó a la bolsa.");
  };

  const addAndCheckout = () => {
    addLine(buildLine());
    router.push("/checkout");
  };

  return (
    <div className="cz-layout">
      <ol className="cz-steps" aria-label="Pasos del personalizador">
        {steps.map((item) => (
          <li key={item.number} className={`cz-step${step === item.number ? " cz-step--active" : ""}${step > item.number ? " cz-step--done" : ""}`}>
            <button type="button" onClick={() => item.number < step && setStep(item.number)} disabled={item.number > step}>
              <span className="cz-step__number">{step > item.number ? "✓" : item.number}</span>
              <span className="cz-step__text"><strong>{item.title}</strong><small>{item.hint}</small></span>
            </button>
          </li>
        ))}
      </ol>

      <div className="cz-body">
        <section className="cz-panel" aria-live="polite">
          {step === 1 ? (
            <>
              <div className="cz-panel__heading"><span className="eyebrow eyebrow--memoria">Paso 1 de 5</span><h2>¿Qué pieza quieres crear?</h2><p>Todas se elaboran con un fragmento de la prenda que elijas. El precio final depende del diseño.</p></div>
              <div className="cz-product-grid">
                {memoriaProducts.map((item) => (
                  <button key={item.id} type="button" className={`cz-product-card${design.product === item.id ? " cz-product-card--active" : ""}`} onClick={() => update({ product: item.id })} aria-pressed={design.product === item.id}>
                    <span className="cz-product-card__image"><Image src={item.image} alt={item.name} fill sizes="(max-width: 700px) 45vw, 20vw" /></span>
                    <span className="cz-product-card__body">
                      <strong>{item.name}</strong>
                      <small>{item.description}</small>
                      <span className="cz-product-card__meta"><span>Desde {formatPrice(item.basePrice)}</span><span>Textil: {item.textile}</span></span>
                    </span>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          {step === 2 ? (
            <>
              <div className="cz-panel__heading"><span className="eyebrow eyebrow--memoria">Paso 2 de 5</span><h2>Diseña tu {product?.name.toLocaleLowerCase("es-MX")}</h2><p>Elige materiales, tono, forma y detalles. Los precios adicionales se suman al precio base.</p></div>
              <OptionList label="Material" options={memoriaMaterials} value={design.material} onChange={selectMaterial} note={design.product === "set" ? "El material se aplica a las tres piezas" : undefined} />
              <div className="cz-group">
                <div className="cz-group__label"><span>Tono del metal</span><small>Según el material elegido</small></div>
                <div className="cz-options cz-options--tones">
                  {availableTones.map((tone) => (
                    <button key={tone.id} type="button" className={`cz-option cz-option--tone${design.tone === tone.id ? " cz-option--active" : ""}`} onClick={() => update({ tone: tone.id })} aria-pressed={design.tone === tone.id}>
                      <span className={`cz-tone-swatch cz-tone-swatch--${tone.id}`} aria-hidden="true" />
                      <span className="cz-option__name">{tone.name}</span>
                      <span className="cz-option__price">{tone.extra > 0 ? `+${formatPrice(tone.extra)}` : "Incluido"}</span>
                    </button>
                  ))}
                </div>
              </div>
              {chainApplies(design.product) ? <OptionList label="Cadena" options={memoriaChains} value={design.chain} onChange={(chain) => update({ chain })} /> : null}
              <OptionList label="Forma del engaste" options={memoriaShapes} value={design.shape} onChange={(shape) => update({ shape })} />
              <OptionList label="Piedra" options={memoriaStones} value={design.stone} onChange={(stone) => update({ stone })} />
              <OptionList label="Dije adicional" options={memoriaCharms} value={design.charm} onChange={(charm) => update({ charm })} />
              <OptionList label="Acabado" options={memoriaFinishes} value={design.finish} onChange={(finish) => update({ finish })} />
            </>
          ) : null}

          {step === 3 ? (
            <>
              <div className="cz-panel__heading"><span className="eyebrow eyebrow--memoria">Paso 3 de 5</span><h2>Cuéntanos sobre tu prenda</h2><p>Trabajamos con la mayoría de los textiles. Para {product?.name.toLocaleLowerCase("es-MX")} necesitamos un fragmento de aproximadamente <strong>{product?.textile}</strong>.</p></div>
              <div className="cz-group">
                <div className="cz-group__label"><span>Tipo de textil</span></div>
                <div className="cz-options cz-options--textiles">
                  {textileTypes.map((type) => (
                    <button key={type.id} type="button" className={`cz-option${design.textileType === type.id ? " cz-option--active" : ""}`} onClick={() => update({ textileType: type.id })} aria-pressed={design.textileType === type.id}>
                      <span className="cz-option__name">{type.name}</span>
                      <span className="cz-option__desc">{type.note}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="memory-note-field">
                <span>Describe tu prenda <small>Obligatorio</small></span>
                <textarea rows={3} maxLength={400} value={design.textileDescription} onChange={(event) => update({ textileDescription: event.target.value })} placeholder="Ej. La camisa azul a cuadros de mi papá; me gustaría conservar la parte del bolsillo." />
              </label>
              <label className="cz-number-field">
                <span>¿Cuántas piezas iguales quieres de esta prenda?</span>
                <div className="quantity-stepper">
                  <button type="button" onClick={() => update({ piecesFromGarment: Math.max(1, design.piecesFromGarment - 1) })} aria-label="Menos piezas">−</button>
                  <span>{design.piecesFromGarment}</span>
                  <button type="button" onClick={() => update({ piecesFromGarment: Math.min(10, design.piecesFromGarment + 1) })} aria-label="Más piezas">+</button>
                </div>
                <small>Ideal para familias: con un solo fragmento elaboramos varias piezas iguales.</small>
              </label>
              <div className="cz-requirements">
                <h3>Requisitos del textil</h3>
                <ul>{garmentRequirements.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="cz-examples">
                {textileExamples.map((example) => (
                  <figure key={example.title}>
                    <span className="cz-examples__image"><Image src={example.image} alt={example.title} fill sizes="(max-width: 700px) 90vw, 30vw" /></span>
                    <figcaption><strong>{example.title}</strong><span>{example.text}</span></figcaption>
                  </figure>
                ))}
              </div>
              <label className="checkout-consent cz-consent">
                <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
                <span>Confirmo que la prenda está limpia y seca, y entiendo que se cortará un fragmento pequeño para elaborar la pieza. El resto de la prenda se devuelve junto con mi pedido.</span>
              </label>
            </>
          ) : null}

          {step === 4 ? (
            <>
              <div className="cz-panel__heading"><span className="eyebrow eyebrow--memoria">Paso 4 de 5</span><h2>Personalización adicional</h2><p>Estos detalles nos ayudan a cuidar tu historia. Son opcionales, pero muy valiosos para el taller.</p></div>
              <div className="cz-group">
                <div className="cz-group__label"><span>¿Qué recuerdo conserva esta pieza?</span><small>Opcional</small></div>
                <div className="cz-options cz-options--occasions">
                  {occasions.map((occasion) => (
                    <button key={occasion.id} type="button" className={`cz-option${design.occasion === occasion.id ? " cz-option--active" : ""}`} onClick={() => update({ occasion: occasion.id })} aria-pressed={design.occasion === occasion.id}>
                      <span className="cz-option__name">{occasion.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              <label className="memory-note-field">
                <span>Observaciones y preferencias <small>Opcional</small></span>
                <textarea rows={5} maxLength={600} value={design.notes} onChange={(event) => update({ notes: event.target.value })} placeholder="Ej. Quiero que se vea la raya roja del uniforme; prefiero que el grabado sea una fecha: 14·02·2012; es un regalo para mi mamá." />
                <small className="memory-note-help">Si eliges inicial o fecha grabada, indícanos aquí el texto exacto.</small>
              </label>
            </>
          ) : null}

          {step === 5 ? (
            <>
              <div className="cz-panel__heading"><span className="eyebrow eyebrow--memoria">Paso 5 de 5</span><h2>Tu pieza, lista para confirmar</h2><p>Revisa el resumen. Al finalizar tu compra elegirás cómo hacernos llegar tu prenda y cómo recibir tu pieza.</p></div>
              <div className="cz-summary-grid">
                <DesignPreview design={design} />
                <div className="cz-summary-details">
                  <h3>{product?.name} MEMORIA</h3>
                  <p className="cz-summary-details__design">{describeDesign(design)}</p>
                  <dl>
                    <div><dt>Textil</dt><dd>{textileTypes.find((type) => type.id === design.textileType)?.name} · {design.textileDescription || "Sin descripción"}</dd></div>
                    <div><dt>Piezas</dt><dd>{design.piecesFromGarment} {design.piecesFromGarment === 1 ? "pieza" : "piezas iguales"}</dd></div>
                    <div><dt>Recuerdo</dt><dd>{occasions.find((item) => item.id === design.occasion)?.name}</dd></div>
                    <div><dt>Tiempo de elaboración</dt><dd>{product?.leadTime} después de recibir tu prenda</dd></div>
                    {design.notes ? <div><dt>Observaciones</dt><dd>{design.notes}</dd></div> : null}
                  </dl>
                  <div className="cz-breakdown">
                    {breakdown.lines.map((line) => (
                      <div key={line.label}><span>{line.label}</span><span>{line.amount > 0 ? formatPrice(line.amount) : "Incluido"}</span></div>
                    ))}
                    <div className="cz-breakdown__total"><span>Precio por pieza</span><strong>{formatPrice(breakdown.total)}</strong></div>
                    {design.piecesFromGarment > 1 ? <div className="cz-breakdown__total"><span>Total ({design.piecesFromGarment} piezas)</span><strong>{formatPrice(breakdown.total * design.piecesFromGarment)}</strong></div> : null}
                  </div>
                </div>
              </div>
              <div className="cz-garment-preview">
                <h3>Después de pagar, elige cómo nos haces llegar tu prenda</h3>
                <div className="cz-garment-options">
                  {garmentMethods.map((method) => (
                    <div key={method.id}><strong>{method.name}</strong><span>{method.note}</span></div>
                  ))}
                </div>
                <Link href="/memoria#como-enviar" className="text-link">Ver detalles de cada opción <span aria-hidden="true">→</span></Link>
              </div>
              <p className="cz-disclaimer">La vista previa es ilustrativa. Cada pieza se elabora a mano y el textil se corta y acomoda según su textura. Te compartimos fotografías del avance antes de cerrar la pieza. Recomendamos retirar la joya para bañarte o nadar.</p>
            </>
          ) : null}

          {feedback ? <p className="cz-feedback" role="status">{feedback}</p> : null}

          <div className="cz-nav">
            {step > 1 ? <button type="button" className="button button--ghost" onClick={() => { setStep((current) => current - 1); setFeedback(""); }}>← Atrás</button> : <span />}
            {step < 5 ? (
              <button type="button" className="button button--memoria" onClick={goNext}>Continuar <span aria-hidden="true">→</span></button>
            ) : (
              <div className="cz-nav__actions">
                <button type="button" className="button button--ghost" onClick={addToBag}>Agregar a la bolsa</button>
                <button type="button" className="button button--memoria" onClick={addAndCheckout}>Confirmar y pagar <span>{formatPrice(breakdown.total * design.piecesFromGarment)}</span></button>
              </div>
            )}
          </div>
        </section>

        <aside className="cz-sidebar">
          <DesignPreview design={design} />
          <div className="cz-sidebar__summary">
            <span className="eyebrow eyebrow--memoria">Tu diseño</span>
            <h3>{product?.name}</h3>
            <p>{describeDesign(design)}</p>
            <div className="cz-sidebar__price"><span>Precio por pieza</span><strong>{formatPrice(breakdown.total)}</strong></div>
            <small>Tiempo estimado: {product?.leadTime} tras recibir tu prenda.</small>
          </div>
        </aside>
      </div>
    </div>
  );
}
