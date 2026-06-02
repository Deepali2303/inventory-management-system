import { useEffect, useState } from 'react';
import { api } from '../api/client';
import Alert from '../components/Alert';
import Modal from '../components/Modal';

const emptyForm = {
  name: '',
  sku: '',
  price: '',
  quantity_in_stock: '',
};

function validateProductForm(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = 'Product name is required';
  if (!form.sku.trim()) errors.sku = 'SKU is required';
  if (!form.price || Number(form.price) <= 0) errors.price = 'Price must be greater than 0';
  if (form.quantity_in_stock === '' || Number(form.quantity_in_stock) < 0) {
    errors.quantity_in_stock = 'Quantity cannot be negative';
  }
  return errors;
}

export default function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreateModal() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setShowModal(true);
  }

  function openEditModal(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      sku: product.sku,
      price: String(product.price),
      quantity_in_stock: String(product.quantity_in_stock),
    });
    setErrors({});
    setShowModal(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateProductForm(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    const payload = {
      name: form.name.trim(),
      sku: form.sku.trim(),
      price: Number(form.price),
      quantity_in_stock: Number(form.quantity_in_stock),
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, payload);
        setMessage('Product updated successfully');
      } else {
        await api.createProduct(payload);
        setMessage('Product created successfully');
      }
      setShowModal(false);
      setForm(emptyForm);
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setMessage('Product deleted successfully');
      await loadProducts();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>Products</h1>
        <button type="button" className="btn btn-primary" onClick={openCreateModal}>
          + Add Product
        </button>
      </div>

      <Alert type="success" message={message} onClose={() => setMessage('')} />
      <Alert type="error" message={error} onClose={() => setError('')} />

      <div className="card">
        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            Loading products...
          </div>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            No products yet. Add your first product.
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td>
                      <span className="badge badge-primary">{product.sku}</span>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      {product.quantity_in_stock === 0 ? (
                        <span className="badge badge-danger">{product.quantity_in_stock}</span>
                      ) : product.quantity_in_stock <= 10 ? (
                        <span className="badge badge-warning">{product.quantity_in_stock}</span>
                      ) : (
                        <span className="badge badge-success">{product.quantity_in_stock}</span>
                      )}
                    </td>
                    <td className="actions">
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(product.id)}
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
        <Modal
          title={editingId ? 'Update Product' : 'Add Product'}
          onClose={() => setShowModal(false)}
        >
          <form className="form-grid" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="product-name">Product Name</label>
                <input
                  id="product-name"
                  placeholder="e.g. Wireless Mouse"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="product-sku">SKU / Code</label>
                <input
                  id="product-sku"
                  placeholder="e.g. WM-001"
                  value={form.sku}
                  onChange={(e) => setForm({ ...form, sku: e.target.value })}
                />
                {errors.sku && <span className="form-error">{errors.sku}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="product-price">Price ($)</label>
                <input
                  id="product-price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                {errors.price && <span className="form-error">{errors.price}</span>}
              </div>
              <div className="form-group">
                <label htmlFor="product-quantity">Quantity in Stock</label>
                <input
                  id="product-quantity"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={form.quantity_in_stock}
                  onChange={(e) => setForm({ ...form, quantity_in_stock: e.target.value })}
                />
                {errors.quantity_in_stock && (
                  <span className="form-error">{errors.quantity_in_stock}</span>
                )}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
