import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { Plus, Edit2, Trash2, Tag, DollarSign, Package, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

// ── Animations ──
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const shimmer = keyframes`
  0%   { background-position: -600px 0; }
  100% { background-position: 600px 0; }
`;

// ── Styled Components ──
const Container = styled.div`
  animation: ${fadeIn} 0.3s ease;
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 800;
  color: #f1f5f9;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const AddBtn = styled.button`
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: #0f172a;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(250, 204, 21, 0.3);
  }
`;

const TableContainer = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
`;

const Th = styled.th`
  background: rgba(15, 23, 42, 0.4);
  color: #94a3b8;
  padding: 14px 20px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #334155;
`;

const Td = styled.td`
  padding: 16px 20px;
  color: #e2e8f0;
  font-size: 0.9rem;
  border-bottom: 1px solid #1e293b;
  vertical-align: middle;
`;

const Tr = styled.tr`
  &:hover { background: rgba(255, 255, 255, 0.02); }
  &:last-child td { border-bottom: none; }
`;

const CategoryBadge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  background: ${p => p.$bg};
  color: ${p => p.$color};
  border: 1px solid ${p => p.$border};
`;

const StockBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  background: ${p => p.$low ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)'};
  color: ${p => p.$low ? '#f87171' : '#34d399'};
`;

const ActionBtn = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #334155;
  color: ${p => p.$danger ? '#f87171' : '#94a3b8'};
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  transition: all 0.2s;

  &:hover {
    background: ${p => p.$danger ? 'rgba(239, 68, 68, 0.1)' : 'rgba(255, 255, 255, 0.1)'};
    color: ${p => p.$danger ? '#ef4444' : '#f1f5f9'};
    border-color: ${p => p.$danger ? 'rgba(239, 68, 68, 0.3)' : '#475569'};
  }
`;

// ── Modal Components ──
const ModalOverlay = styled.div`
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex; align-items: center; justify-content: center;
`;

const ModalContent = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  width: 100%; max-width: 500px;
  padding: 24px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.5);
  animation: ${fadeIn} 0.2s ease-out;
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
  label {
    display: block; font-size: 0.8rem; color: #94a3b8; font-weight: 600; margin-bottom: 6px;
  }
  input, select, textarea {
    width: 100%; background: #0f172a; border: 1px solid #334155; border-radius: 8px;
    padding: 10px 12px; color: #f1f5f9; font-family: inherit; font-size: 0.9rem;
    &:focus { outline: none; border-color: #facc15; }
  }
`;

const ModalActions = styled.div`
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px;
`;

const SkeletonRow = styled.div`
  height: 20px; background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 600px 100%; animation: ${shimmer} 1.4s infinite; border-radius: 4px;
`;

// ── Helpers ──
const getCategoryColors = (cat) => {
  switch (cat) {
    case 'SUPPLEMENT': return { bg: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: 'rgba(52, 211, 153, 0.2)' };
    case 'APPAREL':    return { bg: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', border: 'rgba(96, 165, 250, 0.2)' };
    case 'EQUIPMENT':  return { bg: 'rgba(249, 115, 22, 0.1)', color: '#fb923c', border: 'rgba(251, 146, 60, 0.2)' };
    case 'ACCESSORY':  return { bg: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', border: 'rgba(192, 132, 252, 0.2)' };
    default:           return { bg: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', border: 'rgba(148, 163, 184, 0.2)' };
  }
};

const ProductModule = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'SUPPLEMENT', price: '', stockQuantity: '', sku: '', imageUrl: ''
  });

  const fetchProducts = async () => {
    setLoading(true); setError(null);
    try {
      const res = await axiosInstance.get('/products');
      setProducts(res.data.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product.id);
      setFormData({
        name: product.name, description: product.description, category: product.category,
        price: product.price, stockQuantity: product.stockQuantity, sku: product.sku, imageUrl: product.imageUrl || ''
      });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', description: '', category: 'SUPPLEMENT', price: '', stockQuantity: '', sku: '', imageUrl: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axiosInstance.put(`/products/${editingProduct}`, formData);
        toast.success("Product updated successfully");
      } else {
        await axiosInstance.post('/products', formData);
        toast.success("Product added successfully");
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axiosInstance.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  return (
    <Container>
      <HeaderRow>
        <Title><Package size={24} color="#facc15" /> Product Inventory</Title>
        <AddBtn onClick={() => openModal()}><Plus size={18} /> Add Product</AddBtn>
      </HeaderRow>

      {error ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#f87171' }}>
          <AlertCircle size={40} style={{ marginBottom: 10 }} />
          <p>{error}</p>
          <button onClick={fetchProducts} style={{ marginTop: 10, padding: '8px 16px', background: '#334155', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>Retry</button>
        </div>
      ) : (
        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>Product / SKU</Th>
                <Th>Category</Th>
                <Th>Price</Th>
                <Th>Stock</Th>
                <Th style={{ textAlign: 'right' }}>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Tr key={i}>
                    <Td><SkeletonRow /></Td><Td><SkeletonRow /></Td><Td><SkeletonRow /></Td><Td><SkeletonRow /></Td><Td><SkeletonRow /></Td>
                  </Tr>
                ))
              ) : products.length === 0 ? (
                <Tr>
                  <Td colSpan="5" style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>No active products found.</Td>
                </Tr>
              ) : (
                products.map(p => {
                  const colors = getCategoryColors(p.category);
                  const isLowStock = p.stockQuantity < 10;
                  return (
                    <Tr key={p.id}>
                      <Td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 8, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {p.imageUrl ? <img src={p.imageUrl} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} color="#475569" />}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, color: '#f8fafc' }}>{p.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 4 }}><Tag size={10} /> {p.sku}</div>
                          </div>
                        </div>
                      </Td>
                      <Td><CategoryBadge $bg={colors.bg} $color={colors.color} $border={colors.border}>{p.category}</CategoryBadge></Td>
                      <Td style={{ fontWeight: 700, color: '#facc15' }}>₹{parseFloat(p.price).toLocaleString()}</Td>
                      <Td>
                        <StockBadge $low={isLowStock}>
                          {isLowStock && <AlertCircle size={12} />} {p.stockQuantity}
                        </StockBadge>
                      </Td>
                      <Td style={{ textAlign: 'right' }}>
                        <ActionBtn onClick={() => openModal(p)}><Edit2 size={14} /></ActionBtn>
                        <ActionBtn $danger onClick={() => handleDelete(p.id)}><Trash2 size={14} /></ActionBtn>
                      </Td>
                    </Tr>
                  );
                })
              )}
            </tbody>
          </Table>
        </TableContainer>
      )}

      {isModalOpen && (
        <ModalOverlay onClick={() => setIsModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 20px 0', color: '#f8fafc' }}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleSubmit}>
              <FormGroup><label>Name</label><input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} /></FormGroup>
              <div style={{ display: 'flex', gap: 12 }}>
                <FormGroup style={{ flex: 1 }}><label>Category</label>
                  <select required value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })}>
                    <option value="SUPPLEMENT">Supplement</option><option value="APPAREL">Apparel</option>
                    <option value="EQUIPMENT">Equipment</option><option value="ACCESSORY">Accessory</option>
                  </select>
                </FormGroup>
                <FormGroup style={{ flex: 1 }}><label>SKU</label><input required value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} /></FormGroup>
              </div>
              <div style={{ display: 'flex', gap: 12 }}>
                <FormGroup style={{ flex: 1 }}><label>Price (₹)</label><input type="number" step="0.01" min="0" required value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} /></FormGroup>
                <FormGroup style={{ flex: 1 }}><label>Stock Quantity</label><input type="number" min="0" required value={formData.stockQuantity} onChange={e => setFormData({ ...formData, stockQuantity: e.target.value })} /></FormGroup>
              </div>
              <FormGroup><label>Description (Optional)</label><textarea rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} /></FormGroup>
              <FormGroup><label>Image URL (Optional)</label><input type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} /></FormGroup>
              
              <ModalActions>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', background: 'transparent', color: '#94a3b8', border: 'none', cursor: 'pointer' }}>Cancel</button>
                <AddBtn type="submit">{editingProduct ? 'Save Changes' : 'Add Product'}</AddBtn>
              </ModalActions>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

export default ProductModule;
