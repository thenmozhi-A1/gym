import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Search, X, ChevronLeft, ChevronRight, Download, Clock } from "lucide-react";
import axiosInstance from '../api/axiosInstance';
import { useAdminStore } from '../store/useAdminStore';

const AttendanceModule = () => {
  const { attendance: attendanceData, users, staffs, fetchData: onRefresh } = useAdminStore();
  const [activeTab, setActiveTab] = useState("members"); // members or staff
  const [searchTerm, setSearchTerm] = useState("");
  const [editCell, setEditCell] = useState(null);
  const [editStatus, setEditStatus] = useState("P");
  const [editCheckIn, setEditCheckIn] = useState("");
  const [editCheckOut, setEditCheckOut] = useState("");

  const [currentDate, setCurrentDate] = useState(new Date());

  const realToday = new Date();
  const todayStr = `${realToday.getFullYear()}-${String(realToday.getMonth() + 1).padStart(2, '0')}-${String(realToday.getDate()).padStart(2, '0')}`;

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };
  
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1);
    return {
      dateNum: i + 1,
      dayStr: date.toLocaleDateString('en-US', { weekday: 'short' }),
      isSunday: date.getDay() === 0,
      fullDate: `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`
    };
  });

  const listToRender = activeTab === "members" ? users : staffs;
  const filteredList = listToRender.filter(p => (p.fullName || p.name || "").toLowerCase().includes(searchTerm.toLowerCase()));

  const getLogForCell = (person, dateStr) => {
    return attendanceData.find(log => {
      const logPersonId = log.staff?.id || log.user?.id || log.userId || log.staffId;
      const logPersonName = (log.user?.fullName || log.fullName || log.name || "").toLowerCase();
      const currentPersonName = (person.fullName || person.name || "").toLowerCase();
      
      let logDate = log.date || log.attendanceDate;
      if (Array.isArray(logDate)) {
         const [y, m, d] = logDate;
         logDate = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      }
      
      if (logDate !== dateStr) return false;

      if (log.user?.id === person.id) return true;
      if (activeTab === "staff" && log.staff?.id === person.staffId) return true;
      if (logPersonId && logPersonId === person.id) return true;
      if (logPersonName && currentPersonName && logPersonName === currentPersonName) return true;
      return false;
    });
  };

  const getStatus = (log, dateStr, isSunday) => {
    if (dateStr > todayStr) return "-";
    if (log) {
       if (log.status === 'LEAVE') return 'L';
       if (log.status === 'PERMISSION') return 'PR';
       if (log.status === 'ABSENT') return 'A';
       return 'P';
    }
    if (isSunday) return "S";
    return "A";
  };

  const handleCellClick = (person, dateStr, currentLog) => {
     if (dateStr > todayStr) return; // disable future editing
     setEditCell({ person, dateStr, currentLog });
     
     if (currentLog) {
       setEditStatus(currentLog.status === 'LEAVE' ? 'L' : currentLog.status === 'PERMISSION' ? 'PR' : currentLog.status === 'ABSENT' ? 'A' : currentLog.status === 'SUNDAY' ? 'S' : 'P');
       setEditCheckIn(currentLog.checkInTime || "");
       setEditCheckOut(currentLog.checkOutTime || "");
     } else {
       setEditStatus("P");
       setEditCheckIn("");
       setEditCheckOut("");
     }
  };

  const handleSaveAttendance = async () => {
    try {
      if (editCell.currentLog && editCell.currentLog.id) {
         await axiosInstance.delete(`/attendance/${editCell.currentLog.id}`);
      }
      
      if (editStatus !== 'A') {
         const payload = {
           attendanceDate: editCell.dateStr,
           status: editStatus === 'P' ? 'PRESENT' : editStatus === 'L' ? 'LEAVE' : editStatus === 'S' ? 'SUNDAY' : 'PERMISSION',
           checkInTime: editCheckIn || "00:00:00"
         };
         if (editCheckOut) payload.checkOutTime = editCheckOut;

         if (activeTab === "members") {
           await axiosInstance.post(`/attendance/user/${editCell.person.id}`, payload);
         } else {
           await axiosInstance.post(`/attendance/staff/${editCell.person.id}`, payload);
         }
      }
      setEditCell(null);
      if (onRefresh) onRefresh("attendance");
    } catch (err) {
      console.error("Failed to update attendance", err);
      alert("Failed to update attendance: " + (err.response?.data?.error || err.message));
    }
  };

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    const headers = ["Employee/Member"];
    daysArray.forEach(d => headers.push(`${d.dateNum}`));
    headers.push("P", "A");
    csvContent += headers.join(",") + "\n";

    filteredList.forEach(person => {
      let totalP = 0, totalA = 0;
      const row = [person.fullName || person.name || "Unknown"];
      daysArray.forEach(d => {
        const currentLog = getLogForCell(person, d.fullDate);
        const status = getStatus(currentLog, d.fullDate, d.isSunday);
        if (status === "P") totalP++;
        if (status === "A") totalA++;
        row.push(status);
      });
      row.push(totalP, totalA);
      csvContent += row.join(",") + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${currentYear}_${currentMonth+1}_${activeTab}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container className="animate-in">
      <div className="module-header">
        <div className="title-area">
          <h2>ATTENDANCE <small>& ACCESS CONTROL</small></h2>
        </div>
        <div className="tab-buttons">
          <button className={activeTab === "members" ? "active" : ""} onClick={() => setActiveTab("members")}>Members</button>
          <button className={activeTab === "staff" ? "active" : ""} onClick={() => setActiveTab("staff")}>Staff</button>
        </div>
      </div>

      <div className="grid-controls" style={{ marginBottom: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button onClick={handlePrevMonth} style={{ padding: "5px", borderRadius: "50%", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-color)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronLeft size={18} /></button>
          <span style={{ fontWeight: "bold", color: "var(--text-color)", width: "150px", textAlign: "center" }}>
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth} style={{ padding: "5px", borderRadius: "50%", border: "1px solid var(--border-color)", background: "var(--card-bg)", color: "var(--text-color)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}><ChevronRight size={18} /></button>
        </div>
        <button onClick={handleExportCSV} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#10b981", color: "white", padding: "8px 16px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="legend-card">
        <div className="legend-items">
          <span className="legend-label">Legend:</span>
          <div className="legend-item"><span className="badge bg-present">P</span> Present</div>
          <div className="legend-item"><span className="badge bg-absent">A</span> Absent</div>
          <div className="legend-item"><span className="badge bg-leave">L</span> Leave</div>
          <div className="legend-item"><span className="badge bg-permission">PR</span> Permission</div>
          <div className="legend-item"><span className="badge bg-sunday">S</span> Sunday</div>
        </div>
      </div>

      <div className="grid-card">
        <div className="table-responsive">
          <table className="matrix-table">
            <thead>
              <tr>
                <th className="sticky-col">Employee / Member</th>
                {daysArray.map(d => (
                  <th key={d.dateNum} className={d.isSunday ? 'sunday-col' : ''}>
                    <div className="date-num">{d.dateNum}</div>
                    <div className="day-str">{d.dayStr}</div>
                  </th>
                ))}
                <th className="summary-th bg-present">P</th>
                <th className="summary-th bg-absent">A</th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((person, i) => {
                let totalP = 0;
                let totalA = 0;

                const rowCells = daysArray.map(d => {
                  const currentLog = getLogForCell(person, d.fullDate);
                  const status = getStatus(currentLog, d.fullDate, d.isSunday);
                  if (status === "P") totalP++;
                  if (status === "A") totalA++;
                  
                  return (
                    <td key={d.dateNum} 
                        className={`${d.isSunday ? 'sunday-col' : ''} clickable-cell`}
                        onClick={() => handleCellClick(person, d.fullDate, currentLog)}
                        title="Click to edit">
                      {status === "P" && <span className="status-badge bg-present">P</span>}
                      {status === "A" && <span className="status-badge bg-absent">A</span>}
                      {status === "L" && <span className="status-badge bg-leave">L</span>}
                      {status === "PR" && <span className="status-badge bg-permission">PR</span>}
                      {status === "S" && <span className="status-text text-muted">S</span>}
                      {status === "-" && <span className="status-text">-</span>}
                    </td>
                  );
                });

                return (
                  <tr key={person.id || i}>
                    <td className="sticky-col fw-bold">{person.fullName || person.name || "Unknown"}</td>
                    {rowCells}
                    <td className="summary-td bg-present-light fw-bold text-success">{totalP}</td>
                    <td className="summary-td bg-absent-light fw-bold text-danger">{totalA}</td>
                  </tr>
                );
              })}
              {filteredList.length === 0 && (
                <tr>
                  <td colSpan={daysInMonth + 3} className="text-center py-4 text-muted">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {editCell && (
        <div className="modal-overlay" style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000}}>
          <div className="modal-content animate-in" style={{background: 'var(--card-bg, #1e293b)', padding: '24px', borderRadius: '12px', width: '350px', border: '1px solid var(--border-color)'}}>
             <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px'}}>
                <h3 style={{margin: 0, color: 'var(--text-color)'}}>Edit Attendance</h3>
                <button style={{background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'}} onClick={() => setEditCell(null)}><X size={20}/></button>
             </div>
             <p style={{color: 'var(--text-muted)', marginBottom: '20px'}}>
               <strong>{editCell.person.fullName || editCell.person.name}</strong><br/>
               {editCell.dateStr}
             </p>
             <div style={{display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '20px'}}>
               <div>
                 <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '10px'}}>Status</label>
                 <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px'}}>
                   {[
                     { val: 'P', cls: 'bg-present', label: 'Present' },
                     { val: 'A', cls: 'bg-absent', label: 'Absent' },
                     { val: 'L', cls: 'bg-leave', label: 'Leave' },
                     { val: 'PR', cls: 'bg-permission', label: 'Permission' },
                     { val: 'S', cls: 'bg-sunday', label: 'Sunday' }
                   ].map(opt => (
                     <div 
                       key={opt.val}
                       onClick={() => setEditStatus(opt.val)}
                       style={{
                         display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                         border: editStatus === opt.val ? '2px solid var(--accent-color, #3b82f6)' : '1px solid var(--border-color)',
                         borderRadius: '6px', cursor: 'pointer', background: editStatus === opt.val ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-color)',
                         minWidth: '120px'
                       }}
                     >
                       <span className={`badge ${opt.cls}`} style={{display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '4px', fontWeight: 'bold', fontSize: '0.75rem', color: 'white'}}>{opt.val}</span>
                       <span style={{fontSize: '0.85rem', color: 'var(--text-color)', fontWeight: editStatus === opt.val ? 'bold' : 'normal'}}>{opt.label}</span>
                     </div>
                   ))}
                 </div>
               </div>
               {editStatus !== 'A' && editStatus !== 'L' && editStatus !== 'S' && (
                 <>
                   <div>
                     <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px'}}>Check In Time</label>
                     <input type="time" step="1"
                        style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)'}}
                        value={editCheckIn}
                        onChange={(e) => setEditCheckIn(e.target.value)}
                     />
                   </div>
                   <div>
                     <label style={{display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '5px'}}>Check Out Time</label>
                     <input type="time" step="1"
                        style={{width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-color)'}}
                        value={editCheckOut}
                        onChange={(e) => setEditCheckOut(e.target.value)}
                     />
                   </div>
                 </>
               )}
             </div>

             <div style={{display: 'flex', gap: '10px'}}>
                <button 
                  onClick={handleSaveAttendance}
                  style={{flex: 1, padding: '10px', background: 'var(--accent-color, #3b82f6)', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer'}}
                >
                  Save Changes
                </button>
             </div>
          </div>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex; flex-direction: column; gap: 20px;

  .module-header {
    display: flex; justify-content: space-between; align-items: center;
    h2 { margin: 0; font-size: 1.1rem; font-weight: 600; color: var(--text-color); display: flex; align-items: center; gap: 8px; }
    small { font-weight: 400; color: var(--text-muted); font-size: 0.8rem; letter-spacing: 1px; }
    
    .tab-buttons {
      display: flex; background: rgba(0,0,0,0.1); border-radius: 8px; padding: 4px;
      button { background: transparent; border: none; padding: 6px 16px; border-radius: 6px; color: var(--text-muted); cursor: pointer; font-weight: 500; }
      button.active { background: var(--card-bg, #1e293b); color: var(--text-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    }
  }

  .legend-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 8px; padding: 16px 20px; box-shadow: var(--shadow);
    .legend-items {
      display: flex; align-items: center; gap: 20px; flex-wrap: wrap;
      .legend-label { font-weight: 600; color: var(--text-muted); }
      .legend-item { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: var(--text-color); }
      .badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; color: white; }
    }
  }

  .grid-controls {
    display: flex; gap: 16px;
    .search-box {
      flex: 1; display: flex; align-items: center; gap: 8px; background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 8px; padding: 10px 16px; color: var(--text-muted);
      input { width: 100%; border: none; background: transparent; outline: none; color: var(--text-color); font-size: 0.9rem; }
    }
    .group-select {
      background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 8px; padding: 0 16px; color: var(--text-color); outline: none; cursor: pointer; min-width: 150px;
    }
  }

  .grid-card {
    background: var(--card-bg, #1e293b); border: 1px solid var(--border-color, #334155); border-radius: 12px; overflow: hidden; box-shadow: var(--shadow);
    
    .table-responsive {
      overflow-x: auto;
      max-width: 100%;
    }

    .matrix-table {
      width: 100%; border-collapse: collapse; min-width: 1200px;
      
      th, td { border: 1px solid var(--border-color, #334155); text-align: center; padding: 8px 4px; font-size: 0.85rem; }
      
      th { background: #1f2937; color: white; padding: 12px 4px; }
      .date-num { font-weight: bold; font-size: 0.9rem; margin-bottom: 2px; }
      .day-str { font-size: 0.65rem; color: #9ca3af; text-transform: uppercase; }
      
      td { background: var(--card-bg, #1e293b); color: var(--text-color); height: 45px; }
      
      .sticky-col { position: sticky; left: 0; background: #1f2937; z-index: 2; text-align: left; padding: 0 16px; min-width: 150px; border-right: 2px solid var(--border-color, #334155); }
      td.sticky-col { background: var(--card-bg, #1e293b); }
      
      .sunday-col { background: rgba(255,255,255,0.03); }
      
      .summary-th { padding: 12px; font-size: 0.9rem; }
      .summary-td { padding: 8px 12px; }
      
      .status-badge { display: inline-flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 4px; font-weight: bold; font-size: 0.75rem; color: white; }
      .status-text { font-size: 0.8rem; }
      
      .clickable-cell { cursor: pointer; transition: background 0.2s; }
      .clickable-cell:hover { background: rgba(255,255,255,0.05); }
    }
  }

  .status-btn {
    padding: 10px; border: none; border-radius: 8px; color: white; font-weight: bold; cursor: pointer; opacity: 0.9; transition: opacity 0.2s;
    &:hover { opacity: 1; }
  }

  .bg-present { background-color: #10b981; }
  .bg-absent { background-color: #ef4444; }
  .bg-leave { background-color: #f59e0b; }
  .bg-permission { background-color: #3b82f6; }
  .bg-sunday { background-color: #6b7280; }
  
  .bg-present-light { background-color: rgba(16, 185, 129, 0.1); }
  .bg-absent-light { background-color: rgba(239, 68, 68, 0.1); }
`;

export default AttendanceModule;
