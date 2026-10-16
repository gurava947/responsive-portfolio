import "./index.css";

function VrWebsiteKit({ data }) {
  const items = Array.isArray(data?.items) ? data.items : [];

  return (
    <main className="vr-kit-demo">
      <div className="VRAR-background-section shadow">
        <div className="container">
          <div className="row">
            <div className="col-12 mt-4 shadow-sm">
              <h1 className="VRAR-heading">{data?.heading ?? ""}</h1>
            </div>
            {items.map(({ image, imageAlt, label }, index) => (
              <div className="col-12 pt-3 pb-4 col-md-4 shadow-sm vr" key={`${label ?? "item"}-${index}`}>
                <div className="text-center pt-3">
                  <img className="VRAR-image" src={image ?? ""} alt={imageAlt ?? ""} loading="lazy" decoding="async" />
                  <p className="VRAR-text mt-3">{label ?? ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default VrWebsiteKit;
