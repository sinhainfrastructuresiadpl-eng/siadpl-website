import { useState } from 'react'

const apiUrl = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '')

export default function Admin() {
  const [email, setEmail] = useState('sinhainfrastructure.siadpl@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [enquiries, setEnquiries] = useState(null)
  const [credentials, setCredentials] = useState(() => sessionStorage.getItem('siadplAdminCredentials') || '')

  const fetchEnquiries = async (basicCredentials) => {
    setLoading(true)
    setError('')
    try {
      const response = await fetch(`${apiUrl}/api/admin/enquiries`, {
        headers: { Authorization: `Basic ${basicCredentials}` }
      })
      if (!response.ok) {
        throw new Error(response.status === 401 ? 'Invalid admin email or password.' : 'Could not load enquiries.')
      }
      const data = await response.json()
      setEnquiries(Array.isArray(data) ? data : [])
      setCredentials(basicCredentials)
      sessionStorage.setItem('siadplAdminCredentials', basicCredentials)
    } catch (err) {
      setEnquiries(null)
      setCredentials('')
      sessionStorage.removeItem('siadplAdminCredentials')
      setError(err?.message || 'Could not load enquiries.')
    } finally {
      setLoading(false)
    }
  }

  const login = async (event) => {
    event.preventDefault()
    const basicCredentials = btoa(`${email}:${password}`)
    await fetchEnquiries(basicCredentials)
  }

  const logout = () => {
    setEnquiries(null)
    setCredentials('')
    setPassword('')
    sessionStorage.removeItem('siadplAdminCredentials')
  }

  if (credentials && enquiries === null && !loading && !error) {
    fetchEnquiries(credentials)
  }

  if (enquiries) {
    return (
      <section style={{ padding: '100px 0' }}>
        <div className="wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24, marginBottom: 24 }}>
            <div>
              <div className="eyebrow">Admin enquiries</div>
              <h2 style={{ margin: '10px 0 0' }}>Enquiry submissions</h2>
            </div>
            <button className="button" type="button" onClick={logout}>Log out</button>
          </div>
          <div style={{ overflowX: 'auto', background: '#fff', border: '1px solid #d8dfd9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#e9ece6', textAlign: 'left' }}>
                  <th style={{ padding: 12 }}>#</th>
                  <th style={{ padding: 12 }}>Received</th>
                  <th style={{ padding: 12 }}>Name</th>
                  <th style={{ padding: 12 }}>Email</th>
                  <th style={{ padding: 12 }}>Phone</th>
                  <th style={{ padding: 12 }}>Subject</th>
                  <th style={{ padding: 12 }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map((item) => (
                  <tr key={item.id} style={{ borderTop: '1px solid #d8dfd9', verticalAlign: 'top' }}>
                    <td style={{ padding: 12 }}>{item.id}</td>
                    <td style={{ padding: 12, whiteSpace: 'nowrap' }}>{item.createdAt ? new Date(item.createdAt).toLocaleString() : '-'}</td>
                    <td style={{ padding: 12 }}>{item.name}</td>
                    <td style={{ padding: 12 }}>{item.email}</td>
                    <td style={{ padding: 12 }}>{item.phone}</td>
                    <td style={{ padding: 12 }}>{item.subject}</td>
                    <td style={{ padding: 12, minWidth: 260 }}>{item.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!enquiries.length && <p className="copy" style={{ marginTop: 16 }}>No enquiries yet.</p>}
        </div>
      </section>
    )
  }

  return (
    <section style={{ padding: '100px 0', minHeight: '100vh' }}>
      <div className="wrap" style={{ maxWidth: 460 }}>
        <div className="eyebrow">Admin login</div>
        <h2 style={{ margin: '10px 0 24px' }}>SIADPL enquiries</h2>
        <form onSubmit={login} style={{ background: '#fff', padding: 26, border: '1px solid #d8dfd9' }}>
          <label htmlFor="admin-email">Email</label>
          <input id="admin-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
          <label htmlFor="admin-password">Password</label>
          <input id="admin-password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          <button className="button lime" type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</button>
          {error && <div className="form-message" style={{ marginTop: 14 }}>{error}</div>}
        </form>
      </div>
    </section>
  )
}
