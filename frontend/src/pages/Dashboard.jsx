import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import Alert from '../components/Alert';

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSummary() {
      try {
        const data = await api.getDashboard();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadSummary();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="loading">
          <div className="spinner"></div>
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return <Alert type="error" message={error} />;
  }

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '1.75rem' }}>
        <div className="card stat-card">
          <div className="stat-label">Total Products</div>
          <div className="stat-value-row">
            <div className="stat-value">{summary.total_products}</div>
            <div className="stat-trend">+4.2%</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Customers</div>
          <div className="stat-value-row">
            <div className="stat-value">{summary.total_customers}</div>
            <div className="stat-trend">+2.1%</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Total Orders</div>
          <div className="stat-value-row">
            <div className="stat-value">{summary.total_orders}</div>
            <div className="stat-trend">+1.5%</div>
          </div>
        </div>
        <div className="card stat-card">
          <div className="stat-label">Low Stock Items</div>
          <div className="stat-value-row">
            <div className="stat-value">{summary.low_stock_products.length}</div>
            <div className="stat-trend negative">(Alert)</div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="page-header" style={{ marginBottom: '1rem' }}>
          <h2 style={{ margin: 0, fontSize: '1.15rem' }}>⚠️ Low Stock Products</h2>
          <Link to="/products" className="btn btn-primary">
            Manage Products
          </Link>
        </div>
        {summary.low_stock_products.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">✅</div>
            All products are sufficiently stocked.
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
                </tr>
              </thead>
              <tbody>
                {summary.low_stock_products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ fontWeight: 600 }}>{product.name}</td>
                    <td>
                      <span className="badge badge-primary">{product.sku}</span>
                    </td>
                    <td>${product.price.toFixed(2)}</td>
                    <td>
                      <span className={`badge ${product.quantity_in_stock === 0 ? 'badge-danger' : 'badge-warning'}`}>
                        {product.quantity_in_stock}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
