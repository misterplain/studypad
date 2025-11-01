import React from "react";
import Accordion from "react-bootstrap/Accordion";
import HighlightedCodeBlock from "./HighlightedCodeBlock";
import { parseMixedContent } from "../utils/contentParser";

function renderText(text) {
  // Split on blank line to paragraphs
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.map((p, idx) => (
    <p key={idx} className="mb-2">
      {p}
    </p>
  ));
}

function AccordionList({ items, defaultActiveKey }) {
  return (
    <Accordion defaultActiveKey={defaultActiveKey} alwaysOpen>
      {items.map((item, idx) => {
        const segments = item.content
          ? Array.isArray(item.content)
            ? item.content
            : parseMixedContent(item.content)
          : [];
        return (
          <Accordion.Item eventKey={String(idx)} key={item.id ?? idx}>
            <Accordion.Header>{item.title}</Accordion.Header>
            <Accordion.Body>
              {item.link && (
                <p className="mb-2">
                  <a
                    href={
                      typeof item.link === "string" ? item.link : item.link.url
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    {typeof item.link === "string"
                      ? "Open link"
                      : item.link.label || "Open link"}
                  </a>
                </p>
              )}
              {segments.length > 0 && (
                <div className="mb-2">
                  {segments.map((seg, i) =>
                    seg.type === "code" ? (
                      <HighlightedCodeBlock
                        key={`code-${i}`}
                        language={seg.language}
                        code={seg.code}
                      />
                    ) : (
                      <div key={`text-${i}`}>{renderText(seg.text)}</div>
                    )
                  )}
                </div>
              )}
              {Array.isArray(item.children) && item.children.length > 0 && (
                <div className="ms-2">
                  <AccordionList items={item.children} />
                </div>
              )}
            </Accordion.Body>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default AccordionList;
