import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/logger';
import toast from 'react-hot-toast';

export const useEmployeeStore = create((set, get) => ({
  employeeData: null,
  leaves: [],
  isLoading: false,

  fetchEmployeeData: async (email) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/staffs/me");
      const me = res.data;
      
      if (me) {
        const cleanSalary = typeof me.salary === 'string' 
          ? parseInt(me.salary.replace(/[^0-9]/g, '')) 
          : (me.salary || 0);

        let attendanceLog = [];
        try {
          if (me.staffId) {
            const attRes = await axiosInstance.get(`/attendance/staff/${me.staffId}`);
          if (attRes.data && attRes.data.length > 0) {
            attendanceLog = attRes.data.map(log => {
              let durationStr = '-';
              let status = "Present";
              let permissionsUsed = 0;
              
              if (log.checkInTime && log.checkOutTime) {
                 const [inH, inM] = log.checkInTime.split(':').map(Number);
                 const [outH, outM] = log.checkOutTime.split(':').map(Number);
                 let diffMins = (outH * 60 + outM) - (inH * 60 + inM);
                 if (diffMins < 0) diffMins += 24 * 60;
                 const hrs = Math.floor(diffMins / 60);
                 const mins = diffMins % 60;
                 durationStr = `${hrs}h ${mins}m`;
                 
                 if (hrs < 4) {
                     status = "Leave";
                 } else if (hrs < 8) {
                     status = "Permission";
                     permissionsUsed = 8 - hrs;
                 } else {
                     status = "Present";
                 }
              } else if (log.checkInTime) {
                 status = "Working";
              }

              return {
                id: log.id,
                date: log.attendanceDate,
                status: status,
                checkIn: log.checkInTime || "-",
                checkOut: log.checkOutTime || "-",
                duration: durationStr,
                isLate: log.isLate,
                correctionStatus: log.correctionStatus,
                permissionsUsed
              };
            });
            }
            attendanceLog.sort((a,b) => new Date(b.date) - new Date(a.date));
          }
        } catch(e) { log.error("Failed to fetch real attendance", e); }

        const currentMonth = new Date().getMonth();
        const currentMonthLogs = attendanceLog.filter(log => new Date(log.date).getMonth() === currentMonth);
        
        const daysWorked = currentMonthLogs.filter(log => ["Present", "Permission", "Working"].includes(log.status)).length;
        
        let totalPermissionsHr = 0;
        currentMonthLogs.forEach(log => {
          if (log.permissionsUsed) totalPermissionsHr += log.permissionsUsed;
        });

        const daysPassed = new Date().getDate();
        const leavesCount = Math.max(0, daysPassed - daysWorked);

        set({
          employeeData: {
            ...me,
            salary: cleanSalary,
            attendance: attendanceLog,
            daysWorked,
            leaves: leavesCount,
            permissions: totalPermissionsHr
          }
        });

        // Fetch leaves
        try {
          if (me.id) {
            const leavesRes = await axiosInstance.get(`/leaves/staff/${me.id}`);
            if (leavesRes.data) {
              set({ leaves: leavesRes.data });
            }
          }
        } catch(e) { log.error("Failed to fetch leaves", e); }
      }
    } catch (err) {
      log.error("Failed to sync employee data:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  updateProfile: async (id, profileForm) => {
    try {
      const res = await axiosInstance.put(`/staffs/${id}`, profileForm);
      set((state) => ({
        employeeData: { ...state.employeeData, ...res.data }
      }));
      toast.success("Profile updated successfully!");
      return true;
    } catch(err) {
      log.error("Failed to update profile", err);
      toast.error("Failed to update profile");
      return false;
    }
  },

  checkIn: async (isCheckedIn, logId, staffId) => {
    try {
      if (isCheckedIn && logId) {
        await axiosInstance.put(`/attendance/${logId}/checkout`, {});
        toast.success("Checked out successfully!");
      } else {
        await axiosInstance.post(`/attendance/staff/${staffId}`, {});
        toast.success("Checked in successfully!");
      }
      return true;
    } catch (err) {
      log.error("Operation failed:", err);
      toast.error(err.response?.data?.error || "Operation failed");
      return false;
    }
  },

  requestCorrection: async (logId, reason) => {
    try {
      await axiosInstance.put(`/attendance/${logId}/correction`, { reason });
      toast.success("Correction requested successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to request correction");
      return false;
    }
  },

  applyLeave: async (staffId, leaveForm) => {
    try {
      const res = await axiosInstance.post(`/leaves/apply/${staffId}`, leaveForm);
      set((state) => ({
        leaves: [res.data, ...state.leaves]
      }));
      toast.success("Leave applied successfully!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply leave");
      return false;
    }
  },

  cancelLeave: async (id) => {
    try {
      await axiosInstance.put(`/leaves/${id}/status`, { status: 'CANCELLED' });
      set((state) => ({
        leaves: state.leaves.map(l => l.id === id ? { ...l, status: 'CANCELLED' } : l)
      }));
      toast.success("Leave cancelled");
      return true;
    } catch (err) {
      toast.error("Failed to cancel leave");
      return false;
    }
  }
}));
