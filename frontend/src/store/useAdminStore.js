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
  leaves: [],
  workouts: [],
  diets: [],
  isLoading: false,

  fetchData: async (activeTab, forceRefresh = false) => {
    const state = get();
    
    // OPTIMIZATION 1: Caching to prevent redundant network requests.
    // If we already have the data and didn't explicitly request a refresh, skip fetching.
    if (!forceRefresh) {
        if (activeTab === "dashboard" || activeTab === "users" || activeTab === "staffs" || activeTab === "feedbacks" || activeTab === "payroll") {
            if (state.users.length > 0 && state.staffs.length > 0 && state.payments.length > 0) {
                return; // Data already cached, instant loading!
            }
        }
    }

    set({ isLoading: true });
    try {
      let endpoints = [];
      if (activeTab === "dashboard" || activeTab === "users" || activeTab === "staffs" || activeTab === "feedbacks" || activeTab === "payroll") {
        endpoints = ["users", "payments", "attendance", "consultations", "staffs", "feedbacks", "leaves", "workouts", "diets"];
      } else {
        const endpointMap = {
          "trainers": "staffs",
          "memberships": "membership-plans",
          "requests": "leaves",
          "payments": "payments",
          "attendance": "attendance"
        };
        endpoints = [endpointMap[activeTab] || activeTab];
      }

      const ts = new Date().getTime();
      const results = await Promise.all(
        endpoints.map(ep => axiosInstance.get(`/${ep}?_t=${ts}`).then(r => r.data).catch(() => []))
      );

      if (activeTab === "dashboard" || activeTab === "users" || activeTab === "staffs" || activeTab === "feedbacks" || activeTab === "payroll") {
        const standardUsers = (Array.isArray(results[0]) ? results[0] : []).filter(u => {
            const r = u.role ? u.role.toUpperCase() : '';
            return !['ADMIN', 'STAFF', 'TRAINER', 'FRONT OFFICE'].includes(r);
        });
        const paymentsData = Array.isArray(results[1]) ? results[1] : [];
        
        // OPTIMIZATION 2: O(1) Dictionary Lookups instead of O(N*M) nested loops
        // Pre-group payments by user ID
        const paymentsByUserId = {};
        for (const p of paymentsData) {
            const uid = p.user?.id || p.userId;
            if (uid) {
                if (!paymentsByUserId[uid]) paymentsByUserId[uid] = [];
                paymentsByUserId[uid].push(p);
            }
        }

        const enhancedUsers = standardUsers.map(user => {
            const userPayments = paymentsByUserId[user.id] || [];
            if (userPayments.length > 0) {
                userPayments.sort((a, b) => new Date(a.paymentDate) - new Date(b.paymentDate));
                const latestPayment = userPayments[userPayments.length - 1];
                
                let calculatedExpiry = latestPayment.planEndDate || user.expiryDate;
                if (!calculatedExpiry && latestPayment.paymentDate) {
                    const payDate = new Date(latestPayment.paymentDate);
                    const planDuration = latestPayment.planName === "Annual" ? 12 : latestPayment.planName === "Half-Yearly" ? 6 : latestPayment.planName === "Quarterly" ? 3 : 1;
                    payDate.setMonth(payDate.getMonth() + planDuration);
                    calculatedExpiry = payDate.toISOString().split('T')[0];
                }

                return { 
                  ...user, 
                  expiryDate: calculatedExpiry,
                  startDate: latestPayment.planStartDate || user.startDate || latestPayment.paymentDate.split('T')[0],
                  membershipPlan: latestPayment.planName || user.membershipPlan || user.membershipType
                };
            }
            
            let calculatedExpiry = user.expiryDate;
            if (!calculatedExpiry && user.createdAt) {
                const createdDate = new Date(user.createdAt);
                createdDate.setMonth(createdDate.getMonth() + 1);
                calculatedExpiry = createdDate.toISOString().split('T')[0];
            }

            return {
                ...user,
                expiryDate: calculatedExpiry,
                startDate: user.startDate || (user.createdAt ? user.createdAt.split('T')[0] : null)
            };
        });
        
        const allAttendances = Array.isArray(results[2]) ? results[2] : [];
        const rawStaffs = Array.isArray(results[4]) ? results[4] : [];
        
        // OPTIMIZATION 3: O(1) Dictionary Lookup for Attendance
        const attendanceCountByStaffId = {};
        for (const a of allAttendances) {
            const sid = a.staff?.id || a.user?.id;
            if (sid && (a.status === "PRESENT" || a.status === "Present" || !a.status)) {
                attendanceCountByStaffId[sid] = (attendanceCountByStaffId[sid] || 0) + 1;
            }
        }

        const daysPassed = new Date().getDate();
        const enhancedStaffs = rawStaffs.map(s => {
          const daysWorked = attendanceCountByStaffId[s.id] || 0;
          return { ...s, leaves: Math.max(0, daysPassed - daysWorked) };
        });

        set({
          users: enhancedUsers,
          payments: paymentsData,
          attendance: allAttendances,
          consultations: Array.isArray(results[3]) ? results[3] : [],
          staffs: enhancedStaffs,
          feedbacks: Array.isArray(results[5]) ? results[5] : [],
          leaves: Array.isArray(results[6]) ? results[6] : [],
          workouts: Array.isArray(results[7]) ? results[7] : [],
          diets: Array.isArray(results[8]) ? results[8] : []
        });
      } else {
        const data = Array.isArray(results[0]) ? results[0] : [];
        if (activeTab === "payments") set({ payments: data });
        else if (activeTab === "attendance") set({ attendance: data });
        else if (activeTab === "feedbacks") set({ feedbacks: data });
        else if (activeTab === "consultations") set({ consultations: data });
        else if (activeTab === "requests") set({ leaves: data });
        else if (activeTab === "users") set({ users: data.filter(u => {
            const r = u.role ? u.role.toUpperCase() : '';
            return !['ADMIN', 'STAFF', 'TRAINER', 'FRONT OFFICE'].includes(r);
        }) });
        else if (activeTab === "staffs" || activeTab === "trainers") set({ staffs: data });
        // memberships, products etc don't have dedicated arrays in the store, 
        // modules fetch them independently.
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
      const errMsg = err.response?.data?.message || "Error processing staff removal.";
      toast.error(errMsg);
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
      set((state) => ({ consultations: state.consultations.filter(c => c.id !== id) }));
      toast.success("Lead removed");
      return true;
    } catch(e) { toast.error("Failed to delete lead"); return false; }
  },

  addConsultation: async (data) => {
    try {
      const res = await axiosInstance.post('/consultations', data);
      set((state) => ({ consultations: [...state.consultations, res.data] }));
      toast.success("Lead added successfully");
      return true;
    } catch(e) { toast.error("Failed to add lead"); return false; }
  },

  updateConsultationStatus: async (id, status) => {
    try {
      await axiosInstance.put(`/consultations/${id}/status`, { status });
      set((state) => ({
        consultations: state.consultations.map(c => c.id === id ? { ...c, status } : c)
      }));
      toast.success(`Lead marked as ${status}`);
      return true;
    } catch(e) { toast.error("Failed to update lead"); return false; }
  },

  updateLeaveStatus: async (id, status) => {
    try {
      await axiosInstance.put(`/leaves/${id}/status`, { status });
      set((state) => ({
        leaves: state.leaves.map(l => l.id === id ? { ...l, status } : l)
      }));
      toast.success(`Leave request ${status.toLowerCase()}`);
      return true;
    } catch (err) {
      log.error("Failed to update leave status", err);
      toast.error("Failed to update leave status");
      return false;
    }
  },

  addWorkout: async (data) => {
    try {
      const res = await axiosInstance.post('/workouts', data);
      set((state) => ({ workouts: [...state.workouts, res.data] }));
      toast.success("Workout plan added successfully");
      return true;
    } catch (e) { toast.error("Failed to add workout plan"); return false; }
  },

  deleteWorkout: async (id) => {
    try {
      await axiosInstance.delete(`/workouts/${id}`);
      set((state) => ({ workouts: state.workouts.filter(w => w.id !== id) }));
      toast.success("Workout plan deleted");
      return true;
    } catch (e) { toast.error("Failed to delete workout plan"); return false; }
  },

  addDiet: async (data) => {
    try {
      const res = await axiosInstance.post('/diets', data);
      set((state) => ({ diets: [...state.diets, res.data] }));
      toast.success("Diet plan added successfully");
      return true;
    } catch (e) { toast.error("Failed to add diet plan"); return false; }
  },

  deleteDiet: async (id) => {
    try {
      await axiosInstance.delete(`/diets/${id}`);
      set((state) => ({ diets: state.diets.filter(d => d.id !== id) }));
      toast.success("Diet plan deleted");
      return true;
    } catch (e) { toast.error("Failed to delete diet plan"); return false; }
  }
}));
