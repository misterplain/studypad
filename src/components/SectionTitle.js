import React from "react";

function SectionTitle({ title, subtitle }) {
  return (
    <header className="mb-4">
      <h1 className="h3 mb-1">{title}</h1>
      {subtitle ? <p className="text-muted mb-0">{subtitle}</p> : null}
      <hr />
    </header>
  );
}

export default SectionTitle;
