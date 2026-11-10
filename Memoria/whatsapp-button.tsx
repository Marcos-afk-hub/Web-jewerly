import { whatsappLink } from "@/lib/catalog-config";

export function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={whatsappLink("Hola HILO MÍO, tengo una pregunta sobre sus piezas.")}
      target="_blank"
      rel="noreferrer"
      aria-label="Escríbenos por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path d="M16 3C9 3 3.3 8.6 3.3 15.6c0 2.4.7 4.7 1.9 6.7L3 29l6.9-2.1a12.8 12.8 0 0 0 6.1 1.5c7 0 12.7-5.6 12.7-12.6S23 3 16 3Zm0 23.1c-1.9 0-3.8-.5-5.4-1.5l-.4-.2-4.1 1.3 1.3-3.9-.3-.4a10.3 10.3 0 0 1-1.7-5.7C5.4 10 10.2 5.3 16 5.3S26.6 10 26.6 15.6 21.8 26.1 16 26.1Zm5.8-7.8c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.6-1.6a9.6 9.6 0 0 1-1.8-2.2c-.2-.3 0-.5.1-.6l.5-.6.3-.5v-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7c0 1.6 1.2 3.1 1.3 3.3.2.2 2.3 3.5 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5l-.8-.3Z" />
      </svg>
      <span>¿Dudas? Escríbenos</span>
    </a>
  );
}
