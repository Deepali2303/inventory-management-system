import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

const emptyForm = {
  full_name: '',
  email: '',
  phone: '',
};

function validateCustomerForm(form) {
  const errors = {};
  if (!form.full_name.trim()) errors.full_name = 'Full name is required';
  if (!form.email.trim()) errors.email = 'Email is required';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Enter a valid email address';
  }
  if (!form.phone.trim()) errors.phone = 'Phone number is required';
  return errors;
}

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadCustomers() {
    setLoading(true);
    try {
      const data = await api.getCustomers();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateCustomerForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    try {
      await api.createCustomer({
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
      });
      setMessage('Customer created successfully');
      setShowModal(false);
      setForm(emptyForm);
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await api.deleteCustomer(id);
      setMessage('Customer deleted successfully');
      await loadCustomers();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Customers</h1>
        <button type="button" className="btn btn-primary" onClick={() => { setForm(emptyForm); setErrors({}); setShowModal(true); }}>
          + Add Customer
        </button>
      </div>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            No customers yet. Add your first customer.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={{ fontWeight: 600 }}>{customer.full_name}</td>
                    <td>{customer.email}</td>
                    <td>{customer.phone}</td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(customer.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Add Customer" onClose={() => setShowModal(false)}>
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="customer-fullname">Full Name</label>
              <input
                id="customer-fullname"
                placeholder="e.g. John Doe"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
              {errors.full_name && <span className="form-error">{errors.full_name}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="customer-email">Email</label>
                <input
                  id="customer-email"
                  type="email"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="customer-phone">Phone</label>
                <input
                  id="customer-phone"
                  placeholder="+1 (555) 123-4567"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
                {errors.phone && <span className="form-error">{errors.phone}</span>}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Create Customer
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
