const headingElements = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
};

function ContentBlock({ block }) {
  if (!block || typeof block !== "object") return null;
  const className = typeof block.className === "string" ? block.className : undefined;

  if (headingElements[block.type]) {
    const Heading = headingElements[block.type];
    return <Heading className={className}>{block.text || ""}</Heading>;
  }
  if (block.type === "paragraph") return <p className={className}>{block.text || ""}</p>;
  if (block.type === "image") {
    return <img className={className} src={block.src || ""} alt={block.alt || ""} loading="lazy" decoding="async" />;
  }
  if (block.type === "list") {
    return <ul className={className}>{(Array.isArray(block.items) ? block.items : []).map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul>;
  }
  if (block.type === "button") {
    return <button className={className} type="button">{block.label || ""}</button>;
  }
  if (block.type === "link") {
    return <a className={className} href={block.href || ""}>{block.label || ""}</a>;
  }
  return null;
}

function ProjectAction({ action }) {
  if (action.action_type === "link") {
    return <a className="database-project-action" href={action.href}>{action.label}</a>;
  }
  return <button className="database-project-action" type="button">{action.label}</button>;
}

function DatabaseProjectPreview({ project }) {
  return (
    <main className="database-project-preview">
      <header className="database-project-header">
        {project.image && <img src={project.image} alt={project.imageAlt || ""} loading="lazy" decoding="async" />}
        <h1>{project.title}</h1>
        <p>{project.description}</p>
      </header>
      {(Array.isArray(project.sections) ? project.sections : []).map((section) => (
        <section className="database-project-section" key={section.slug}>
          {section.title && <h2>{section.title}</h2>}
          {section.body && <p>{section.body}</p>}
          {(Array.isArray(section.content?.blocks) ? section.content.blocks : []).map((block, index) => (
            <ContentBlock block={block} key={`${section.slug}-${index}`} />
          ))}
          {section.actions.map((action) => <ProjectAction action={action} key={action.action_key} />)}
        </section>
      ))}
      <div className="database-project-actions">
        {project.actions.map((action) => <ProjectAction action={action} key={action.action_key} />)}
      </div>
    </main>
  );
}

export default DatabaseProjectPreview;
