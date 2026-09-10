const projects = [
  ['01', 'Railway signalling & safety systems', 'Installation and maintenance support for safer train operations.'],
  ['02', 'Civil construction & development', 'Durable, carefully managed execution for site and infrastructure works.'],
  ['03', 'Electrical installation & maintenance', 'Power infrastructure that supports safe, uninterrupted operations.'],
  ['04', 'Workforce and logistics support', 'The people and material supply required to keep work on track.']
]

export default function Projects() {
  return (
    <section className="projects" id="projects">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">Our work</div>
            <h2>Solutions for the<br/>real world.</h2>
          </div>
          <p>Our scope is shaped around the operational needs of infrastructure, industrial and commercial projects.</p>
        </div>
        <div className="project-list">
          {projects.map(([no, title, text]) => (
            <article className="project" key={no}>
              <span>{no}</span>
              <h3>{title}</h3>
              <p>{text}</p>
              <b className="arrow">↗</b>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
