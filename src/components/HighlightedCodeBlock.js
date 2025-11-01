import React, { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml"; // html/xml
import bash from "highlight.js/lib/languages/bash";
import json from "highlight.js/lib/languages/json";
import css from "highlight.js/lib/languages/css";
import python from "highlight.js/lib/languages/python";
import "highlight.js/styles/github.css";

// Register a few common languages
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("json", json);
hljs.registerLanguage("css", css);
hljs.registerLanguage("python", python);

function normalizeLang(lang) {
  if (!lang) return undefined;
  const m = {
    js: "javascript",
    ts: "typescript",
    html: "xml",
    sh: "bash",
  };
  return m[lang] || lang;
}

const HighlightedCodeBlock = ({ language, code }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    const el = codeRef.current;
    if (!el) return;
    try {
      hljs.highlightElement(el);
    } catch (_) {
      // ignore if language not registered
    }
  }, [language, code]);

  const langClass = normalizeLang(language);

  return (
    <pre className="mb-3">
      <code
        ref={codeRef}
        className={langClass ? `language-${langClass}` : undefined}
      >
        {code}
      </code>
    </pre>
  );
};

export default HighlightedCodeBlock;
