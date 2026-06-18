import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';
import log from '../utils/logger';
import toast from 'react-hot-toast';

export const useAdminStore = create((set, get) => ({
  users: [],
  staffs: [],
  payments: [],
  attendance: [],
  consultations: [],
  feedbacks: [],
  isLoading: false,

  fetchData: async (activeTab) => {
    set({ isLoading: true });
    try {
      if (activeTab === "payroll") {
        set({ isLoading: false });
        return;
      }

      const endpoints = activeTab === "dashboard" || activeTab === "users" || activeTab === "staffs" || activeTab === "feedbacks"
        ? ["users", "payments", "attendance", "consultations", "staffs", "feedbacks"]
        : [activeTab];

      const ts = new Date().getTime();
      const results = await Promise.all(
        endpoints.map(ep => axiosInstance.get(`/${ep}?_t=${ts}`).then(r => r.data).catch(() => []))
      );

      if (activeTab === "dashboard" || activeTab === "users" || activeTab === "staffs" || activeTab === "feedbacks") {
        const standardUsers = (Array.isArray(results[0]) ? results[0] : []).filter(u => !['admin', 'ADMIN'].includes(u.role));
        const paymentsData = Array.isArray(results[1]) ? results[1] : [];
        
        const enhancedUsers = standardUsers.map(user => {
            const userPayments = paymentsData.filter(p => p.user?.id === user.id || p.userId === user.id);
            if (userPayments.length > 0) {
                userPayments.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));
                const latestPayment = userPayments[userPayments.length - 1];
                return { 
                  ...user, 
                  expiryDate: latestPayment.planEndDate || user.expiryDate,
                  startDate: latestPayment.planStartDate || user.startDate,
                  membershipPlan: latestPayment.planName || user.membershipPlan || user.membershipType
                };
            }
            return user;
        });
        
        const allAttendances = Array.isArray(results[2]) ? results[2] : [];
        const rawStaffs = Array.isArray(results[4]) ? results[4] : [];
        const daysPassed = new Date().getDate();
        const enhancedStaffs = rawStaffs.map(s => {
          const staffLogs = allAttendances.filter(a => (a.staff?.id === s.id || a.user?.id === s.id) && (a.status === "PRESENT" || a.status === "Present" || !a.status));
          const daysWorked = staffLogs.length;
          return { ...s, leaves: Math.max(0, daysPassed - daysWorked) };
        });

        set({
          users: enhancedUsers,
          payments: paymentsData,
          attendance: allAttendances,
          consultations: Array.isArray(results[3]) ? results[3] : [],
          staffs: enhancedStaffs,
          feedbacks: Array.isArray(results[5]) ? results[5] : []
        });
      } else {
        const data = Array.isArray(results[0]) ? results[0] : [];
        if (activeTab === "payments") set({ payments: data });
        else if (activeTab === "attendance") set({ attendance: data });
        else if (activeTab === "feedbacks") set({ feedbacks: data });
        else set({ consultations: data });
      }
    } catch (e) {
      log.error("Failed to fetch admin data", e);
    } finally {
      set({ isLoading: false });
    }
  },

  addUser: async (userData) => {
    try {
      const res = await axiosInstance.post("/users/register", userData);
      const savedUser = res.data;
      
      set((state) => ({ users: [savedUser, ...state.users] }));
      
      if (userData.paymentAmount) {
        try {
          const paymentData = {
            amount: parseFloat(userData.paymentAmount),
            planName: userData.membershipPlan || "Standard",
            paymentStatus: "SUCCESS",
            paymentDate: new Date().toISOString().split('T')[0] + "T00:00:00",
            paymentMethod: userData.paymentMode || "Cash",
            planStartDate: userData.startDate ? `${userData.startDate}T00:00:00` : null,
            planEndDate: userData.expiryDate ? `${userData.expiryDate}T00:00:00` : null
          };
          const payRes = await axiosInstance.post(`/payments/user/${savedUser.id}`, paymentData);
          set((state) => ({ 
            payments: [{...payRes.data, paymentMode: userData.paymentMode || "Cash", paymentDate: new Date().toISOString().split('T')[0]}, ...state.payments]
          }));
        } catch (payErr) {
          log.error("Failed to save payment:", payErr);
          toast.error("User saved, but failed to record payment in the database.");
        }
      }
      toast.success("MEMBER ENLISTED AND SAVED TO DATABASE SUCCESSFULLY!");
      return true;
    } catch (err) {
      toast.error(`Failed to save to database: ${err.response?.data?.error || err.message}`);
      return false;
    }
  },

  updateUser: async (id, updatedData) => {
    try {
      const res = await axiosInstance.put(`/users/${id}`, updatedData);
      
      if (updatedData.expiryDate) {
        try {
          const paymentData = {
            amount: 0,
            planName: updatedData.membershipPlan || updatedData.membershipType || "Manual Adjustment",
            paymentStatus: "SUCCESS",
            paymentDate: new Date().toISOString().split('T')[0] + "T00:00:00",
            paymentMethod: "Manual Adjustment",
            planStartDate: updatedData.startDate ? `${updatedData.startDate}T00:00:00` : null,
            planEndDate: `${updatedData.expiryDate}T00:00:00`
          };
          await axiosInstance.post(`/payments/user/${id}`, paymentData);
          // Refresh data to show new expiry date
          await get().fetchData("users"); 
          return true;
        } catch (e) {
          log.error("Failed to update expiry date via payment logic:", e);
        }
      }
      
      const updatedUser = res.data;
      set((state) => ({
        users: state.users.map(u => (u.id === id || u.memberId === id) ? updatedUser : u)
      }));
      return true;
    } catch (err) {
      set((state) => ({
        users: state.users.map(u => (u.id === id || u.memberId === id) ? { ...u, ...updatedData } : u)
      }));
      return true;
    }
  },

  deleteUser: async (id) => {
    try {
      await axiosInstance.delete(`/users/${id}`);
      set((state) => ({
        users: state.users.filter(u => u.id !== id && u.memberId !== id)
      }));
      toast.success("User completely deleted from the database.");
      return true;
    } catch (err) {
      if (id.toString().startsWith("u_")) {
        set((state) => ({
          users: state.users.filter(u => u.id !== id && u.memberId !== id)
        }));
        return true;
      } else {
        toast.error("Failed to delete user from the database.");
        return false;
      }
    }
  },

  addStaff: async (staffData) => {
    try {
      const response = await axiosInstance.post("/staffs/register", staffData);
      const savedStaffData = response.data;
      set((state) => ({ staffs: [savedStaffData, ...state.staffs] }));
      toast.success("Staff member added successfully!");
      return true;
    } catch (error) {
      log.error(error);
      toast.error(`Cannot connect to server to save staff. (Network/CORS error): ${error.message}`);
      return false;
    }
  },

  updateStaff: async (id, updatedData) => {
    try {
      const res = await axiosInstance.put(`/staffs/${id}`, updatedData);
      set((state) => ({
        staffs: state.staffs.map(s => s.id === id ? res.data : s)
      }));
      toast.success("Staff updated successfully.");
      return true;
    } catch (err) {
      log.error(err);
      set((state) => ({
        staffs: state.staffs.map(s => s.id === id ? { ...s, ...updatedData } : s)
      }));
      toast.success("Staff updated locally.");
      return true;
    }
  },

  deleteStaff: async (id) => {
    try {
      await axiosInstance.delete(`/staffs/${id}`);
      set((state) => ({
        staffs: state.staffs.filter(s => s.id !== id)
      }));
      toast.success("Staff removed successfully.");
      return true;
    } catch (err) {
      log.error(err);
      toast.error("Error processing staff removal.");
      return false;
    }
  },

  deleteFeedback: async (id) => {
    try {
      await axiosInstance.delete(`/feedbacks/${id}`);
      set((state) => ({
        feedbacks: state.feedbacks.filter(f => f.id !== id)
      }));
      toast.success("Feedback deleted successfully.");
      return true;
    } catch (err) {
      log.error(err);
      toast.error("Error deleting feedback.");
      return false;
    }
  },

  deleteConsultation: async (id) => {
    try {
      await axiosInstance.delete(`/consultations/${id}`);
      set((state) => ({
        consultations: state.consultations.filter(c => c.id !== id)
      }));
      toast.success("Lead converted/deleted successfully.");
      return true;
    } catch (err) {
      log.error(err);
      toast.error("Error updating lead status.");
      return false;
    }
  }
}));
