import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

const emptyItem = { product_id: '', quantity: '' };

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  // Order form state
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [formErrors, setFormErrors] = useState({});

  async function loadOrders() {
    setLoading(true);
    try {
      const data = await api.getOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadFormData() {
    try {
      const [customerData, productData] = await Promise.all([
        api.getCustomers(),
        api.getProducts(),
      ]);
      setCustomers(customerData);
      setProducts(productData);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function openCreateModal() {
    setCustomerId('');
    setItems([{ ...emptyItem }]);
    setFormErrors({});
    setShowModal(true);
    loadFormData();
  }

  function addItem() {
    setItems([...items, { ...emptyItem }]);
  }

  function removeItem(index) {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index, field, value) {
    const updated = items.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setItems(updated);
  }

  function validateForm() {
    const errors = {};
    if (!customerId) errors.customer = 'Please select a customer';

    const itemErrors = [];
    const usedProducts = new Set();
    let hasItemError = false;

    items.forEach((item, index) => {
      const ie = {};
      if (!item.product_id) {
        ie.product_id = 'Select a product';
        hasItemError = true;
      } else if (usedProducts.has(item.product_id)) {
        ie.product_id = 'Duplicate product';
        hasItemError = true;
      } else {
        usedProducts.add(item.product_id);
      }
      if (!item.quantity || Number(item.quantity) <= 0) {
        ie.quantity = 'Qty must be > 0';
        hasItemError = true;
      }
      itemErrors.push(ie);
    });

    if (hasItemError) errors.items = itemErrors;
    return errors;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validation = validateForm();
    setFormErrors(validation);
    if (Object.keys(validation).length > 0) return;

    const payload = {
      customer_id: Number(customerId),
      items: items.map((item) => ({
        product_id: Number(item.product_id),
        quantity: Number(item.quantity),
      })),
    };

    try {
      await api.createOrder(payload);
      setMessage('Order created successfully');
      setShowModal(false);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Cancel and delete this order? Stock will be restored.')) return;
    try {
      await api.deleteOrder(id);
      setMessage('Order deleted successfully');
      if (expandedOrderId === id) setExpandedOrderId(null);
      await loadOrders();
    } catch (err) {
      setError(err.message);
    }
  }

  function toggleExpand(id) {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  }

  function getProductAvailable(productId) {
    const p = products.find((pr) => pr.id === Number(productId));
    return p ? p.quantity_in_stock : 0;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Orders</h1>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          + New Order
        </button>
      </div>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            No orders yet. Create your first order.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <>
                    <tr key={order.id}>
                      <td>
                        <span className="badge badge-primary">#{order.id}</span>
                      </td>
                      <td>{order.customer_name || `Customer #${order.customer_id}`}</td>
                      <td>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</td>
                      <td style={{ fontWeight: 700 }}>${order.total_amount.toFixed(2)}</td>
                      <td style={{ color: 'var(--muted)', fontSize: '0.88rem' }}>
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="actions">
                        <button
                          type="button"
                          className="expand-btn"
                          onClick={() => toggleExpand(order.id)}
                        >
                          {expandedOrderId === order.id ? '▲ Hide' : '▼ Details'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(order.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                    {expandedOrderId === order.id && (
                      <tr key={`detail-${order.id}`}>
                        <td colSpan={6} style={{ padding: '0.5rem 0.9rem 1rem' }}>
                          <div className="order-items">
                            {order.items.map((item) => (
                              <div className="order-item-row" key={item.id}>
                                <div>
                                  <div className="order-item-name">
                                    {item.product_name || `Product #${item.product_id}`}
                                  </div>
                                  <div className="order-item-detail">
                                    Qty: {item.quantity} × ${item.unit_price.toFixed(2)}
                                  </div>
                                </div>
                                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                  ${(item.quantity * item.unit_price).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <Modal title="Create New Order" onClose={() => setShowModal(false)}>
          <form className="form-grid" onSubmit={handleSubmit}>
            {/* Customer selector */}
            <div className="form-group">
              <label htmlFor="order-customer">Customer</label>
              <select
                id="order-customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
              >
                <option value="">— Select a customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
              {formErrors.customer && (
                <span className="form-error">{formErrors.customer}</span>
              )}
            </div>

            {/* Order items */}
            <div className="form-group">
              <label>Order Items</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {items.map((item, index) => (
                  <div className="item-row" key={index}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <select
                        value={item.product_id}
                        onChange={(e) => updateItem(index, 'product_id', e.target.value)}
                      >
                        <option value="">— Product —</option>
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} (${p.price.toFixed(2)}) — Stock: {p.quantity_in_stock}
                          </option>
                        ))}
                      </select>
                      {formErrors.items?.[index]?.product_id && (
                        <span className="form-error">{formErrors.items[index].product_id}</span>
                      )}
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <input
                        type="number"
                        min="1"
                        max={item.product_id ? getProductAvailable(item.product_id) : undefined}
                        placeholder="Qty"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                      />
                      {formErrors.items?.[index]?.quantity && (
                        <span className="form-error">{formErrors.items[index].quantity}</span>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn-remove-item"
                      onClick={() => removeItem(index)}
                      disabled={items.length <= 1}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-add-item" onClick={addItem}>
                  + Add another item
                </button>
              </div>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Place Order
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
