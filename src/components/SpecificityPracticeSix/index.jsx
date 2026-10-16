import "./index.css";

function SpecificityPracticeSix({ data }) {
  const headings = Array.isArray(data?.headings) ? data.headings : [];

  return (
    <main className="specificity-practice-six">
      <h1>{headings[0] ?? ""}</h1>
      <h1 className="black-text green-text">{headings[1] ?? ""}</h1>
      <h1 className="black-text green-text" id="orangeText" style={{ color: "blue" }}>
        {headings[2] ?? ""}
      </h1>
    </main>
  );
}

export default SpecificityPracticeSix;
