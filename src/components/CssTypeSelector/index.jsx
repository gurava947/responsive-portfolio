import "./index.css";

function CssTypeSelector({ data }) {
  return (
    <main className="css-type-selector-demo">
      {(Array.isArray(data?.paragraphs) ? data.paragraphs : []).map(({ id, text }, index) => (
        <p id={id || undefined} key={`${id || "paragraph"}-${index}`}>{text}</p>
      ))}
    </main>
  );
}

export default CssTypeSelector;
