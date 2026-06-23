import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Search, MapPin, CheckCircle, Package } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const OrdersModule = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get('/orders');
      setOrders(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/orders/${id}/status`, { status });
      toast.success(`Order marked as ${status}`);
      fetchOrders();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredOrders = orders.filter(o => 
    o.userName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <ModuleWrapper className="animate-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1 fw-black">STORE <span className="text-warning">ORDERS</span></h2>
          <p className="text-secondary mb-0">Manage supplement orders and shipping</p>
        </div>
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search orders..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
      </div>

      <TableCard>
        {loading ? (
          <div className="text-center p-5"><div className="spinner"></div></div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center p-5 text-secondary">No orders found.</div>
        ) : (
          <div className="table-responsive">
            <table className="table interactive-table">
              <thead>
                <tr>
                  <th>ORDER ID</th>
                  <th>CUSTOMER</th>
                  <th>PRODUCT</th>
                  <th>QTY</th>
                  <th>TOTAL</th>
                  <th>PAYMENT ID</th>
                  <th>ADDRESS</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, i) => (
                  <tr key={i}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="fw-bold">{order.userName}</div>
                      <small className="text-secondary">{order.userEmail}</small>
                    </td>
                    <td>{order.productName}</td>
                    <td>{order.quantity}</td>
                    <td className="text-warning fw-bold">₹{order.totalPrice?.toLocaleString()}</td>
                    <td><small className="text-secondary">{order.razorpayPaymentId}</small></td>
                    <td>
                      <div className="d-flex align-items-center gap-1" title={order.shippingAddress}>
                        <MapPin size={14} className="text-secondary"/>
                        <span style={{maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                          {order.shippingAddress || 'N/A'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={order.status}>{order.status}</StatusBadge>
                    </td>
                    <td>
                      {order.status === 'PAID' && (
                        <ActionBtn className="primary" onClick={() => updateStatus(order.id, 'SHIPPED')}>
                          <Package size={14}/> Ship
                        </ActionBtn>
                      )}
                      {order.status === 'SHIPPED' && (
                        <ActionBtn className="success" onClick={() => updateStatus(order.id, 'DELIVERED')}>
                          <CheckCircle size={14}/> Deliver
                        </ActionBtn>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </TableCard>
    </ModuleWrapper>
  );
};

export default OrdersModule;

// STYLED COMPONENTS
const ModuleWrapper = styled.div`
  .search-box {
    display: flex;
    align-items: center;
    background: #1e293b;
    border: 1px solid #334155;
    padding: 8px 15px;
    border-radius: 8px;
    gap: 10px;
    input { background: none; border: none; color: white; outline: none; }
    svg { color: #64748b; }
  }
`;

const TableCard = styled.div`
  background: #1e293b;
  border-radius: 12px;
  border: 1px solid #334155;
  overflow: hidden;
  
  .table {
    width: 100%;
    margin: 0;
    color: white;
    th {
      background: #0f172a;
      padding: 15px;
      font-size: 0.8rem;
      font-weight: 700;
      color: #94a3b8;
      border-bottom: 1px solid #334155;
    }
    td {
      padding: 15px;
      vertical-align: middle;
      border-bottom: 1px solid #334155;
    }
  }
`;

const StatusBadge = styled.span`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${props => 
    props.status === 'PAID' ? 'rgba(59, 130, 246, 0.1)' : 
    props.status === 'SHIPPED' ? 'rgba(245, 158, 11, 0.1)' : 
    props.status === 'DELIVERED' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(100, 116, 139, 0.1)'};
  color: ${props => 
    props.status === 'PAID' ? '#3b82f6' : 
    props.status === 'SHIPPED' ? '#f59e0b' : 
    props.status === 'DELIVERED' ? '#22c55e' : '#94a3b8'};
`;

const ActionBtn = styled.button`
  background: none;
  border: none;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 5px;
  cursor: pointer;
  transition: all 0.2s;

  &.primary {
    background: rgba(59, 130, 246, 0.1);
    color: #3b82f6;
    &:hover { background: #3b82f6; color: white; }
  }
  &.success {
    background: rgba(34, 197, 94, 0.1);
    color: #22c55e;
    &:hover { background: #22c55e; color: white; }
  }
`;
