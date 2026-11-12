/**
 * Fotografía de producto servida desde el propio proyecto.
 *
 * Antes estas imágenes vivían en el CDN de Pexels. Se movieron a
 * `public/images/producto/` para que el sitio funcione sin depender de un
 * servicio externo: en una exposición o en una red cerrada, un `<img>` que
 * apunta a otro dominio puede fallar y dejar el catálogo a medias.
 *
 * La clave es el mismo identificador que se usaba para la URL de Pexels, de
 * modo que la correspondencia con `productSeeds` en `src/lib/catalog.ts` es
 * directa.
 */
export const productImage = (id: number) => `/images/producto/${id}.jpg`;

export const productImages: Record<number, string> = {
  29303619: productImage(29303619),
  29260960: productImage(29260960),
  21235148: productImage(21235148),
  10117804: productImage(10117804),
  11790262: productImage(11790262),
  12155925: productImage(12155925),
  8165653: productImage(8165653),
  37401770: productImage(37401770),
  38984016: productImage(38984016),
  38999386: productImage(38999386),
  39076774: productImage(39076774),
  37304690: productImage(37304690),
  2899839: productImage(2899839),
  9430429: productImage(9430429),
  15709721: productImage(15709721),
  15709728: productImage(15709728),
  16063791: productImage(16063791),
  7700270: productImage(7700270),
  7679824: productImage(7679824),
  13660667: productImage(13660667),
  9742272: productImage(9742272),
  14509641: productImage(14509641),
  14509640: productImage(14509640),
  10050219: productImage(10050219),
  8681007: productImage(8681007),
};
