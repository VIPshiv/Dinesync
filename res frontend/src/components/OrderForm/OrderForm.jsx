// src/components/OrderForm/OrderForm.jsx
import { useState } from 'react';
import axios from 'axios';
import './OrderForm.css';

const OrderForm = () => {
  const [items, setItems] = useState([{ name: '', price: '', quantity: 1 }]);
  const [total, setTotal] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/orders', { items, total });
      alert('Order placed successfully!');
      setItems([{ name: '', price: '', quantity: 1 }]);
      setTotal(0);
    } catch (err) {
      console.error('Error placing order:', err);
      alert('Failed to place order');
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: '', price: '', quantity: 1 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {items.map((item, index) => (
        <div key={index} className="order-item">
          <input
            type="text"
            className="order-input"
            placeholder="Item name"
            value={item.name}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index].name = e.target.value;
              setItems(newItems);
            }}
            required
          />
          <input
            type="number"
            className="order-input"
            placeholder="Price"
            value={item.price}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index].price = e.target.value;
              setItems(newItems);
            }}
            required
          />
          <input
            type="number"
            className="order-input"
            placeholder="Quantity"
            value={item.quantity}
            onChange={(e) => {
              const newItems = [...items];
              newItems[index].quantity = e.target.value;
              setItems(newItems);
            }}
            required
          />
        </div>
      ))}
      <button type="button" onClick={handleAddItem} className="order-add-button">
        Add Item
      </button>
      <input
        type="number"
        className="order-input"
        placeholder="Total"
        value={total}
        onChange={(e) => setTotal(e.target.value)}
        required
      />
      <button type="submit" className="order-submit">Place Order</button>
    </form>
  );
};

export default OrderForm;