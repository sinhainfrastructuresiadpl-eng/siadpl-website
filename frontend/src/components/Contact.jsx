import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: 'General enquiry', message: '' })
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  const update = event => {
    const { name, value } = event.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const submit = async event => {
    event.preventDefault()
    if (sending) return
    setSending(true)
    setStatus('Sending…')
    try {
      const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')
      const response = await fetch(`${apiUrl}/api/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      let data = {}
      try {
        data = await response.json()
      } catch {
        data = {}
      }
      if (!response.ok) {
        const errors = data.errors ? Object.values(data.errors).join(' ') : data.message
        throw new Error(errors || 'Request failed')
      }
      setStatus('Thank you — your enquiry has been sent. We’ll be in touch shortly.')
      setForm({ name: '', email: '', phone: '', subject: 'General enquiry', message: '' })
    } catch (error) {
      setStatus(error?.message || 'We could not send the enquiry. Please call us on +91 91311 61983.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="contact" id="contact">
      <div className="wrap contact-grid">
        <div>
          <div className="eyebrow">Contact</div>
          <h2>Let’s move your project forward.</h2>
          <p className="copy">
            Tell us what you need. Our team will respond to discuss scope, schedules and the right support for your site.
          </p>
          <div className="details">
            <div className="detail">
              <b>Phone</b>
              <a href="tel:+919131161983">+91 91311 61983</a>
            </div>
            <div className="detail">
              <b>Email</b>
              <a href="mailto:sinhainfrastructure.siadpl@gmail.com">sinhainfrastructure.siadpl@gmail.com</a>
            </div>
            <div className="detail">
              <b>Office</b>
              Sinha House, Near Asha Traders, Mopka Chowk,<br />
              Bilaspur, Chhattisgarh
            </div>
          </div>
        </div>
        <form onSubmit={submit}>
          <div className="form-row">
            <div>
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" value={form.name} onChange={update} required placeholder="Name" />
            </div>
            <div>
              <label htmlFor="phone">Phone number</label>
              <input id="phone" name="phone" value={form.phone} onChange={update} required placeholder="+91" />
            </div>
          </div>
          <label htmlFor="email">Email address</label>
          <input id="email" name="email" type="email" value={form.email} onChange={update} required placeholder="you@company.com" />
          <label htmlFor="subject">I’m enquiring about</label>
          <select id="subject" name="subject" value={form.subject} onChange={update}>
            {['General enquiry', 'Railway signalling & telecom', 'Civil infrastructure works', 'Electrical works', 'Manpower & material supply', 'Vendor registration'].map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <label htmlFor="message">Project details</label>
          <textarea id="message" name="message" value={form.message} onChange={update} required placeholder="A short note about your requirement" />
          <button className="button lime" type="submit" disabled={sending}>{sending ? 'Sending…' : 'Send enquiry ↗'}</button>
          {status && <div className="form-message" role="status" aria-live="polite">{status}</div>}
        </form>
      </div>
    </section>
  )
}