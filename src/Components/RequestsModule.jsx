import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CheckCircle, XCircle, Calendar, Clock, AlertCircle } from "lucide-react";
import axiosInstance from "../api/axiosInstance";
import toast from "react-hot-toast";

const RequestsModule = () => {
  const [leaves, setLeaves] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState("leaves");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [leavesRes, attRes] = await Promise.all([
        axiosInstance.get("/leaves"),
        axiosInstance.get("/attendance")
      ]);
      setLeaves(leavesRes.data);
      // Filter attendances to only those with correction requests
      const withCorrections = attRes.data.filter(a => a.correctionStatus && a.correctionStatus !== "NONE");
      setAttendances(withCorrections);
    } catch (err) {
      toast.error("Failed to fetch requests");
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/leaves/${id}/status`, { status });
      setLeaves(leaves.map(l => l.id === id ? { ...l, status } : l));
      toast.success(`Leave request ${status.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update leave status");
    }
  };

  const handleCorrectionStatus = async (id, status) => {
    try {
      await axiosInstance.put(`/attendance/${id}/correction-status`, { status });
      setAttendances(attendances.map(a => a.id === id ? { ...a, correctionStatus: status } : a));
      toast.success(`Correction request ${status.toLowerCase()}`);
    } catch (err) {
      toast.error("Failed to update correction status");
    }
  };

  return (
    <Container className="animate-in">
      <div className="table-header" style={{ marginBottom: '20px' }}>
        <h2>REQUESTS & <small>APPROVALS</small></h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <TabButton active={activeSubTab === "leaves"} onClick={() => setActiveSubTab("leaves")}>
            <Calendar size={16} style={{ marginRight: '5px' }} /> Leave Requests
          </TabButton>
          <TabButton active={activeSubTab === "corrections"} onClick={() => setActiveSubTab("corrections")}>
            <Clock size={16} style={{ marginRight: '5px' }} /> Attendance Corrections
          </TabButton>
          <button onClick={fetchRequests} className="refresh-btn">REFRESH</button>
        </div>
      </div>

      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>Loading requests...</div>
      ) : activeSubTab === "leaves" ? (
        <TableCard>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>STAFF NAME</th>
                  <th>TYPE</th>
                  <th>DATES</th>
                  <th>REASON</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No leave requests found.</td></tr>
                ) : leaves.map(l => (
                  <tr key={l.id}>
                    <td><strong>{l.staffName || "Staff"}</strong></td>
                    <td><span className="badge bg-primary-light">{l.leaveType}</span></td>
                    <td>{l.startDate} to {l.endDate}</td>
                    <td style={{ maxWidth: '250px' }}>{l.reason}</td>
                    <td>
                      <span style={{ 
                        background: l.status === 'APPROVED' ? '#d1fae5' : l.status === 'REJECTED' || l.status === 'CANCELLED' ? '#fee2e2' : '#fef3c7', 
                        color: l.status === 'APPROVED' ? '#065f46' : l.status === 'REJECTED' || l.status === 'CANCELLED' ? '#991b1b' : '#92400e', 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
                      }}>
                        {l.status}
                      </span>
                    </td>
                    <td>
                      {l.status === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn-icon text-success" onClick={() => handleLeaveStatus(l.id, 'APPROVED')} title="Approve"><CheckCircle size={20} /></button>
                          <button className="btn-icon text-danger" onClick={() => handleLeaveStatus(l.id, 'REJECTED')} title="Reject"><XCircle size={20} /></button>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>
      ) : (
        <TableCard>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>STAFF/USER NAME</th>
                  <th>DATE</th>
                  <th>CHECK IN / OUT</th>
                  <th>CORRECTION REASON</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {attendances.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>No correction requests found.</td></tr>
                ) : attendances.map(a => (
                  <tr key={a.id}>
                    <td><strong>{a.staff ? a.staff.fullName : a.user ? a.user.fullName : "Unknown"}</strong></td>
                    <td>{a.attendanceDate}</td>
                    <td>{a.checkInTime || '-'} / {a.checkOutTime || '-'}</td>
                    <td style={{ maxWidth: '250px' }}>{a.correctionReason}</td>
                    <td>
                      <span style={{ 
                        background: a.correctionStatus === 'APPROVED' ? '#d1fae5' : a.correctionStatus === 'REJECTED' ? '#fee2e2' : '#fef3c7', 
                        color: a.correctionStatus === 'APPROVED' ? '#065f46' : a.correctionStatus === 'REJECTED' ? '#991b1b' : '#92400e', 
                        padding: '4px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' 
                      }}>
                        {a.correctionStatus}
                      </span>
                    </td>
                    <td>
                      {a.correctionStatus === 'PENDING' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button className="btn-icon text-success" onClick={() => handleCorrectionStatus(a.id, 'APPROVED')} title="Approve"><CheckCircle size={20} /></button>
                          <button className="btn-icon text-danger" onClick={() => handleCorrectionStatus(a.id, 'REJECTED')} title="Reject"><XCircle size={20} /></button>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Processed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TableCard>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const TabButton = styled.button`
  background: ${props => props.active ? 'var(--accent-color)' : 'transparent'};
  color: ${props => props.active ? '#fff' : 'var(--text-color)'};
  border: 1px solid ${props => props.active ? 'var(--accent-color)' : 'var(--border-color)'};
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  &:hover {
    background: ${props => props.active ? 'var(--accent-color)' : 'var(--card-bg)'};
  }
`;

const TableCard = styled.div`
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
  .table { width: 100%; border-collapse: collapse; }
  .table th { text-align: left; padding: 15px; font-size: 0.75rem; color: var(--text-muted); border-bottom: 1px solid var(--border-color); }
  .table td { padding: 15px; font-weight: 500; font-size: 0.9rem; border-bottom: 1px solid rgba(0,0,0,0.05); }
  .table tr:last-child td { border-bottom: none; }
  .btn-icon { background: none; border: none; cursor: pointer; transition: transform 0.2s; }
  .btn-icon:hover { transform: scale(1.1); }
`;

export default RequestsModule;
