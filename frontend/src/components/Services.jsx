const services = [
  ['01 / 04', 'Railway Signalling & Telecom', 'S&T systems, trackside works, maintenance and specialised railway support.', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=800&q=80'],
  ['02 / 04', 'Civil Infrastructure', 'Construction, site development, maintenance and general infrastructure works.', 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80'],
  ['03 / 04', 'Electrical Works', 'Installation, cabling, power systems and dependable operational maintenance.', 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=800&q=80'],
  ['04 / 04', 'Manpower & Material Supply', 'Skilled workforce, procurement support and materials when projects need them.', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80']
]

export default function Services() {
  return (
    <section className="services" id="services">
      <div className="wrap">
        <div className="section-head">
          <div>
            <div className="eyebrow">What we do</div>
            <h2>Capability across<br/>the project lifecycle.</h2>
          </div>
          <p>Specialist expertise and practical support for complex sites, delivered with a single standard: dependable work.</p>
        </div>
        <div className="service-grid">
          {services.map(([number, title, text, image]) => (
            <article className="service" key={title}>
              <img src={image} alt="" />
              <span className="number">{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
