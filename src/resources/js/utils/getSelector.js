//© 2023 Cognizant. All rights reserved. Cognizant Confidential and/or Trade Secret.

const getName = (node) => {
  const name = node.nodeName;
  return node.nodeType === 1 ?
      name.toLowerCase() : name.toUpperCase().replace(/^#/, '');
}

export const getSelector = (node, maxLen) => {
  let sel = '';

  try {
    while (node && node.nodeType !== 9) {
      const el = (node);
      const part = el.id ? '#' + el.id : getName(el) + (
          (el.className && el.className.length) ?
          '.' + el.className.replace(/\s+/g, '.') : '');
      if (sel.length + part.length > (maxLen || 100) - 1) return sel || part;
      sel = sel ? part + '>' + sel : part;
      if (el.id) break;
      node = el.parentNode;
    }
  } catch (err) {
    // Do nothing...
  }
  return sel;
};
