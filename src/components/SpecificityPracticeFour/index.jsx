import "./index.css";

function SpecificityPracticeFour({ data }) {
  return (
    <main className="specificity-practice-four">
      <div className="language-container" style={{ backgroundColor: "lightgray" }}>
        <h1 className="blue-text">{data?.heading ?? ""}</h1>
        <p className="language-description" id="description">
          {data?.description ?? ""}
        </p>
        <button type="button" style={{ backgroundColor: "orange" }}>{data?.buttonLabel ?? ""}</button>
      </div>
    </main>
  );
}

export default SpecificityPracticeFour;
