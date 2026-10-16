import "./index.css";

function VrWebsiteContactUsSection({ data }) {
  const image = data?.imageUrl ?? "";
  const headingLines = Array.isArray(data?.headingLines) ? data.headingLines : [];

  return (
    <main className="vr-contact-us-demo">
      <div className="VRWebsite-background-section m-2 shadow-lg">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-7 d-flex flex-column justify-content-center order-1 order-md-2">
              <div className="text-center pt-5">
                <h1 className="VRWebsite-heading">
                  {headingLines[0] ?? ""}
                  <br />
                  {headingLines[1] ?? ""}
                </h1>
                <div className="text-center pt-3 d-md-none">
                  <img src={image} className="w-100 d-md-none" alt={data?.imageAlt ?? ""} loading="lazy" decoding="async" />
                </div>
                <div className="text-center pt-3 pb-5">
                  <button className="castome-button" type="button">{data?.buttonLabel ?? ""}</button>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-5 order-1 order-md-1">
              <div className="text-center pt-5 pb-5 d-none d-md-block">
                <img src={image} className="w-100" alt={data?.imageAlt ?? ""} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default VrWebsiteContactUsSection;
