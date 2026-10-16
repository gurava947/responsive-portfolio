import "./index.css";

function SpecificityPracticeFive({ data }) {
  const paragraphs = Array.isArray(data?.paragraphs) ? data.paragraphs : [];

  return (
    <main className="specificity-practice-five">
      {paragraphs.slice(0, 3).map((text, index) => (
        <p
          className={["", "blue-bg", "blue-bg orange-bg"][index] || ""}
          key={`${text ?? "paragraph"}-${index}`}
        >
          {text ?? ""}
        </p>
      ))}
    </main>
  );
}

export default SpecificityPracticeFive;
