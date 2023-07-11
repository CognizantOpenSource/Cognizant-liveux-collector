/**
 * Calculates if element is in vewport
 *
 * @param {Number} vh           Viewport height
 * @param {Array} coordinates   Array of component coordinates [left, top, right, bottom]
 * @return {Boolean}            Is element in viewport
 */

 export const isInViewport = (vh, coordinates) => {
  const top = coordinates[1];

  return top < vh;
}