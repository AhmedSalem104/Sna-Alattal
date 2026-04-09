'use client';

import { useEffect } from 'react';

export function SNAHighlight() {
  useEffect(() => {
    const highlight = () => {
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null
      );

      const textNodes: Text[] = [];
      let node;
      while ((node = walker.nextNode())) {
        if (
          node.textContent &&
          (node.textContent.includes('S.N.A') || node.textContent.includes('SNA')) &&
          !node.parentElement?.classList.contains('sna-brand') &&
          !node.parentElement?.closest('nav') &&
          !node.parentElement?.closest('[data-no-sna]')
        ) {
          textNodes.push(node as Text);
        }
      }

      textNodes.forEach((textNode) => {
        const text = textNode.textContent || '';
        if (text.includes('S.N.A') || text.includes('SNA')) {
          const span = document.createElement('span');
          span.innerHTML = text
            .replace(/S\.N\.A/g, '<span class="sna-brand">S.N.A</span>')
            .replace(/\bSNA\b/g, '<span class="sna-brand">SNA</span>');
          textNode.parentNode?.replaceChild(span, textNode);
        }
      });
    };

    const timer = setTimeout(highlight, 1000);
    return () => clearTimeout(timer);
  }, []);

  return null;
}
