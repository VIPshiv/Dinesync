// src/pages/Admin/Admin.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', price: '', description: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    const fetchData = async () => {
      try {
        const menuResponse = await axios.get('http://localhost:5000/api/menu', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMenuItems(menuResponse.data.items);

        const ordersResponse = await axios.get('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(ordersResponse.data.orders);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    fetchData();
  }, [token, navigate]);

  const handleAddItem = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/menu', newItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Menu item added!');
      setNewItem({ name: '', price: '', description: '' });
      const response = await axios.get('http://localhost:5000/api/menu', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(response.data.items);
    } catch (err) {
      console.error('Error adding item:', err);
      alert('Failed to add item');
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/menu/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMenuItems(menuItems.filter(item => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      alert('Failed to delete item');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/orders/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const response = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.orders);
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  return (
    <div className="admin">
      <h1 className="admin-title">Admin Dashboard</h1>
      <h2 className="admin-subtitle">Add Menu Item</h2>
      <form onSubmit={handleAddItem} className="admin-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            className="form-input"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Price:</label>
          <input
            type="number"
            className="form-input"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea
            className="form-textarea"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
        </div>
        <button type="submit" className="form-submit">Add Item</button>
      </form>

      <h2 className="admin-subtitle">Menu Items</h2>
      <div className="admin-menu-items">
        {menuItems.map(item => (
          <div key={item._id} className="admin-menu-item">
            <div>
              <h3 className="admin-menu-item-title">{item.name}</h3>
              <p className="admin-menu-item-price">Price: ${item.price}</p>
              <p className="admin-menu-item-description">{item.description}</p>
            </div>
            <button
              onClick={() => handleDeleteItem(item._id)}
              className="admin-delete-button"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2 className="admin-subtitle">Orders</h2>
      <div className="admin-orders">
        {orders.map(order => (
          <div key={order._id} className="admin-order">
            <p className="admin-order-total">Total: ${order.total}</p>
            <p className="admin-order-status">Status: {order.status}</p>
            <div className="admin-order-actions">
              <button
                onClick={() => handleUpdateStatus(order._id, 'Pending')}
                className="admin-status-button pending"
              >
                Set to Pending
              </button>
              <button
                onClick={() => handleUpdateStatus(order._id, 'Preparing')}
                className="admin-status-button preparing"
              >
                Set to Preparing
              </button>
              <button
                onClick={() => handleUpdateStatus(order._id, 'Delivered')}
                className="admin-status-button delivered"
              >
                Set to Delivered
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;