import React, { useRef, useState } from 'react';
import MathJax from 'react-mathjax2';
import { MathJaxProvider, Tex2SVG } from './MathJax';

const tex = 'f(x) = \\int_{-\\infty}^\\infty\\hat f(\\xi)\\,e^{2 \\pi i \\xi x}\\,d\\xi';

// window.MathJax = {
//
// };

const mathJaxOptions = {
  chtml: {
    scale: 1, // global scaling factor for all expressions
    minScale: 0.5, // smallest scaling factor to use
    matchFontHeight: true, // true to match ex-height of surrounding font
    mtextInheritFont: false, // true to make mtext elements use surrounding font
    merrorInheritFont: true, // true to make merror text use surrounding font
    mathmlSpacing: false, // true for MathML spacing rules, false for TeX rules
    skipAttributes: {}, // RFDa and other attributes NOT to copy to the output
    exFactor: 0.5, // default size of ex in em units
    displayAlign: 'left', // default for indentalign when set to 'auto'
    displayIndent: '0', // default for indentshift when set to 'auto'
    fontURL: '[mathjax]/components/output/chtml/fonts/woff-v2', // The URL where the fonts are found
    adaptiveCSS: true, // true means only produce CSS that is used in the processed equations
  },
};

function MathJaxContent({ content }) {
  console.log(content);
  return (
    <div>
      <MathJaxProvider options={mathJaxOptions}>
        <Tex2SVG latex={`${content}`} />
      </MathJaxProvider>
    </div>
  );
}

export default MathJaxContent;
