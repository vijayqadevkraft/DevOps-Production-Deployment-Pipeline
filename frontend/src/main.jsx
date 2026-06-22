import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Building2, LogOut, Plus, Search, Users, WalletCards } from 'lucide-react';
import { apiRequest } from './api/client.js';
import './styles.css';

const emptyCustomer = { name: '', company: '', email: '', phone: '', status: 'Lead', value: 0, notes: '' };

function AuthView({ onAuth }) {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: 'admin@example.com', password: 'password123' });
  const [error, setError] = useState('');

  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      const payload = mode === 'register' ? form : { email: form.email, password: form.password };
      const data = await apiRequest(`/auth/${mode}`, { method: 'POST', body: JSON.stringify(payload) });
      onAuth(data);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-card">
        <div className="brand"><Building2 /> <span>MERN CRM</span></div>
        <h1>{mode === 'login' ? 'Welcome back' : 'Create your workspace'}</h1>
        <p>Manage leads, customers, account values, and follow-up notes in one place.</p>
        <form onSubmit={submit}>
          {mode === 'register' && <input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
          <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {error && <div className="error">{error}</div>}
          <button type="submit">{mode === 'login' ? 'Sign in' : 'Register'}</button>
        </form>
        <button className="link-button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </button>
        <small>Demo credentials after seeding: admin@example.com / password123</small>
      </section>
    </main>
  );
}

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('crm_user') || 'null'));
  const [customers, setCustomers] = useState([]);
  const [summary, setSummary] = useState({ totalCustomers: 0, pipelineValue: 0, byStatus: [] });
  const [form, setForm] = useState(emptyCustomer);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: 'all' });
  const [error, setError] = useState('');

  function handleAuth(data) {
    localStorage.setItem('crm_token', data.token);
    localStorage.setItem('crm_user', JSON.stringify(data.user));
    setUser(data.user);
  }

  async function loadData() {
    const query = new URLSearchParams(filters).toString();
    const [customerData, summaryData] = await Promise.all([
      apiRequest(`/customers?${query}`),
      apiRequest('/dashboard/summary')
    ]);
    setCustomers(customerData);
    setSummary(summaryData);
  }

  useEffect(() => {
    if (user) loadData().catch((err) => setError(err.message));
  }, [user, filters]);

  const statusCounts = useMemo(() => Object.fromEntries(summary.byStatus.map((item) => [item._id, item.count])), [summary]);

  async function saveCustomer(event) {
    event.preventDefault();
    setError('');
    const method = editingId ? 'PUT' : 'POST';
    const path = editingId ? `/customers/${editingId}` : '/customers';
    await apiRequest(path, { method, body: JSON.stringify({ ...form, value: Number(form.value) }) });
    setForm(emptyCustomer);
    setEditingId(null);
    await loadData();
  }

  function editCustomer(customer) {
    setEditingId(customer._id);
    setForm({ name: customer.name, company: customer.company, email: customer.email, phone: customer.phone || '', status: customer.status, value: customer.value, notes: customer.notes || '' });
  }

  async function deleteCustomer(id) {
    await apiRequest(`/customers/${id}`, { method: 'DELETE' });
    await loadData();
  }

  if (!user) return <AuthView onAuth={handleAuth} />;

  return (
    <main className="app-shell">
      <header className="topbar">
        <div><div className="brand"><Building2 /> <span>MERN CRM</span></div><p>Signed in as {user.name}</p></div>
        <button className="ghost" onClick={() => { localStorage.clear(); setUser(null); }}><LogOut size={18} /> Logout</button>
      </header>

      <section className="metrics">
        <article><Users /><span>Total customers</span><strong>{summary.totalCustomers}</strong></article>
        <article><WalletCards /><span>Pipeline value</span><strong>${summary.pipelineValue.toLocaleString()}</strong></article>
        <article><Plus /><span>Active prospects</span><strong>{statusCounts.Prospect || 0}</strong></article>
      </section>

      <section className="workspace">
        <form className="panel form-panel" onSubmit={saveCustomer}>
          <h2>{editingId ? 'Update customer' : 'Add customer'}</h2>
          {['name', 'company', 'email', 'phone'].map((field) => <input key={field} placeholder={field[0].toUpperCase() + field.slice(1)} value={form[field]} onChange={(e) => setForm({ ...form, [field]: e.target.value })} required={['name', 'company', 'email'].includes(field)} />)}
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            {['Lead', 'Prospect', 'Customer', 'Inactive'].map((status) => <option key={status}>{status}</option>)}
          </select>
          <input type="number" min="0" placeholder="Deal value" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          {error && <div className="error">{error}</div>}
          <button type="submit">{editingId ? 'Save changes' : 'Create customer'}</button>
        </form>

        <section className="panel list-panel">
          <div className="list-header"><h2>Customer pipeline</h2><div className="filters"><Search size={17} /><input placeholder="Search" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} /><select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}><option value="all">All</option>{['Lead', 'Prospect', 'Customer', 'Inactive'].map((status) => <option key={status}>{status}</option>)}</select></div></div>
          <div className="customer-grid">
            {customers.map((customer) => <article className="customer-card" key={customer._id}><div><strong>{customer.name}</strong><span>{customer.company}</span></div><span className={`badge ${customer.status.toLowerCase()}`}>{customer.status}</span><p>{customer.email} · {customer.phone}</p><b>${customer.value.toLocaleString()}</b><small>{customer.notes}</small><footer><button onClick={() => editCustomer(customer)}>Edit</button><button className="danger" onClick={() => deleteCustomer(customer._id)}>Delete</button></footer></article>)}
          </div>
        </section>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
