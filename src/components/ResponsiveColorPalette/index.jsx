import "./index.css";

function ResponsiveColorPalette({ data }) {
  return (
    <main className="responsive-palette-demo">
      <div className="container responsive-palette-container">
        <h1 className="responsive-palette-title">{data?.title ?? ""}</h1>
        <div className="row responsive-palette-row">
          {(Array.isArray(data?.colors) ? data.colors : []).map(({ name, className, columns }, index) => (
            <div className={columns} key={`${name ?? "color"}-${index}`}>
              <div className={`bg ${className ?? ""} responsive-palette-color`}>
                {name ?? ""}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

export default ResponsiveColorPalette;
