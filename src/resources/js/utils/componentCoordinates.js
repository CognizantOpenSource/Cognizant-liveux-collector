export const getComponentCoordinates = (component) => {
  const rect = component.getBoundingClientRect();
  const leftTop = [rect.left, rect.top];
  const rightBottom = [rect.right, rect.bottom];

  return [ leftTop, rightBottom ];
}