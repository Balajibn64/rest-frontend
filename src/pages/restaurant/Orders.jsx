import React, { useState, useEffect } from 'react';
import { 
  getCurrentOrders, 
  acceptOrRejectOrder, 
  getAcceptedOrders, 
  getDeliveredOrders 
} from '../../api/restaurantApi';
import '../../styles/orders.css';

const Orders = () => {
  const [currentOrders, setCurrentOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    setError('');
    try {
      const [current, accepted, delivered] = await Promise.all([
        getCurrentOrders(),
        getAcceptedOrders(),
        getDeliveredOrders()
      ]);
      setCurrentOrders(current.data || []);
      setAcceptedOrders(accepted.data || []);
      setDeliveredOrders(delivered.data || []);
    } catch (err) {
      setError('Failed to load orders.');
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptReject = async (orderId, accept) => {
    try {
      await acceptOrRejectOrder(orderId, accept);
      await loadOrders();
      alert(`Order ${accept ? 'accepted' : 'rejected'} successfully!`);
    } catch (err) {
      alert('Failed to update order status.');
      console.error('Error updating order:', err);
    }
  };

  const getOrdersByTab = () => {
    switch (activeTab) {
      case 'current':
        return currentOrders;
      case 'accepted':
        return acceptedOrders;
      case 'delivered':
        return deliveredOrders;
      default:
        return currentOrders;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'current':
        return 'Current Orders';
      case 'accepted':
        return 'Accepted Orders';
      case 'delivered':
        return 'Delivered Orders';
      default:
        return 'Orders';
    }
  };

  const renderOrderCard = (order) => (
    <div className="order-card" key={order.id || order.orderId}>
      <div className="order-header">
        <strong>Order #{order.id || order.orderId}</strong>
        <span>Status: <b>{order.status}</b></span>
      </div>
      <p>👤 Customer: {order.customerName || order.customer?.name || 'N/A'}</p>
      <p>🕒 Ordered At: {new Date(order.orderedAt || order.createdAt).toLocaleString()}</p>
      <div className="order-items">
        <p>🍽️ Items:</p>
        <ul>
          {(order.items || order.orderItems || []).map((item, i) => (
            <li key={i}>
              {item.name || item.dish?.name} × {item.quantity}
            </li>
          ))}
        </ul>
      </div>
      <p>💰 Total: ₹ {order.totalAmount || order.total}</p>
      {activeTab === 'current' && (
        <div className="order-actions">
          <button 
            className="accept-btn"
            onClick={() => handleAcceptReject(order.id || order.orderId, true)}
          >
            Accept
          </button>
          <button 
            className="reject-btn"
            onClick={() => handleAcceptReject(order.id || order.orderId, false)}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="orders-container"><p>Loading orders...</p></div>;
  }
  if (error) {
    return <div className="orders-container"><p style={{color: 'red'}}>{error}</p></div>;
  }
  const orders = getOrdersByTab();
  return (
    <div className="orders-container">
      <h2>📦 Order Management</h2>
      <div className="order-tabs">
        <button 
          className={activeTab === 'current' ? 'active' : ''}
          onClick={() => setActiveTab('current')}
        >
          Current ({currentOrders.length})
        </button>
        <button 
          className={activeTab === 'accepted' ? 'active' : ''}
          onClick={() => setActiveTab('accepted')}
        >
          Accepted ({acceptedOrders.length})
        </button>
        <button 
          className={activeTab === 'delivered' ? 'active' : ''}
          onClick={() => setActiveTab('delivered')}
        >
          Delivered ({deliveredOrders.length})
        </button>
      </div>
      <h3>{getTabTitle()}</h3>
      {orders.length === 0 ? (
        <p>No {activeTab} orders found.</p>
      ) : (
        <div className="order-list">
          {orders.map(renderOrderCard)}
        </div>
      )}
    </div>
  );
};

export default Orders; 