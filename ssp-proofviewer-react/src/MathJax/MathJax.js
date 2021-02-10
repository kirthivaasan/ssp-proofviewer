import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

const MathJaxContext = createContext({});
export const MathJaxProvider = ({
  options = {},
  children = null,
}) => {
  const ref = useRef(null);
  const [mathJax, setMathJax] = useState({ mathJax: window.MathJax || options });

  useEffect(() => {
    const existingScript = document.getElementById('mathjax-script');

    if (existingScript) {
      const onLoad = existingScript.onload;
      existingScript.onload = () => {
        onLoad();
        setMathJax({ mathJax: window.MathJax });
      };
    }

    if (!existingScript && !window.MathJax) {
      const script = document.createElement('script');
      window.MathJax = mathJax;
      script.id = 'mathjax-script';
      script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml-full.js';
      script.async = true;
      script.onload = () => setMathJax({ mathJax: window.MathJax });
      document.head.appendChild(script);
    }

    return () => {};
  });

  return (
    <MathJaxContext.Provider value={mathJax}>
      <span ref={ref} />
      {children}
    </MathJaxContext.Provider>
  );
};

export function useTexSVG({
  latex = '',
  onSuccess = () => {},
  onError = () => {},
  ref,
} = {}) {
  const { mathJax } = useContext(MathJaxContext);
  const [html, setHtml] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const error = !!html && !!html.outerHTML && !!html.outerHTML.match(/data-mjx-error/);

  useEffect(() => {
    async function setMathJaxHTML() {
      const isReady = (mathJax && mathJax.tex2svgPromise)
        || (mathJax && mathJax.loader && mathJax.loader.ready && await mathJax.loader.ready());

      if (isReady) {
        try {
          setIsLoading(true);
          const options = mathJax.getMetricsFor(ref.current, true);
          console.log(options, 'options');
          const mathJaxElement = await mathJax.tex2chtmlPromise(latex, options);

          setHtml(mathJaxElement);
        } catch (e) {
          console.error(
            'Something went really wrong, if this problem persists then please open an issue',
            e,
          );
        } finally {
          setIsLoading(false);
        }
      }
    }

    setMathJaxHTML();
  }, [mathJax, latex, ref]);

  useEffect(() => {
    if (html && error) onError(html);
    if (html && !error) onSuccess(html);
  }, [error, html, onError, onSuccess]);

  return [html, { error, isLoading }];
}

export const Tex2SVG = ({
  latex = '',
  onError = () => {},
  onSuccess = () => {},
  ...props
}) => {
  const ref = useRef(null);
  const [html, { error }] = useTexSVG({
    latex, onError, onSuccess, ref,
  });
  useEffect(() => {
    if (html && !error) {
      Object.keys(props).map((key) => html.setAttribute(key, props[key]));
      ref.current && ref.current.appendChild(html);
      document.head.appendChild(window.MathJax.chtmlStylesheet());
      return () => {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        ref.current && ref.current.removeChild(html);
        // document.head.removeChild(window.MathJax.chtmlStylesheet());
      };
    }

    return () => {};
  }, [props, error, html]);

  return <div ref={ref} />;
};

const Tex2SVGWithProvider = (props) => (
  <MathJaxProvider>
    <Tex2SVG {...props} />
  </MathJaxProvider>
);

export default Tex2SVGWithProvider;
