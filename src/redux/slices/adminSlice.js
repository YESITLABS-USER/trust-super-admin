import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import * as api from "../Api.js";

// Utility to check if we're in the browser environment
const isBrowser = typeof window != "undefined";

// Login async thunk
export const login = createAsyncThunk("admin/login", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.login(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// checkUser action
export const checkUser = createAsyncThunk("admin/checkUser", async () => {
  try {
    const response = await api.checkUser();
    return response.data;
  } catch (error) {
    throw error;
  }
});

// getAllFirms action
export const getAllFirms = createAsyncThunk("admin/getAllFirms", async () => {
  try {
    const response = await api.getAllFirms();
    return response.data;
  } catch (error) {
    throw error;
  }
});

// AddFirms action
export const addFirms = createAsyncThunk("admin/addFirms", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.addFirms(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Update Firms Access action
export const updateFirmsAccess = createAsyncThunk("admin/updateFirmsAccess", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFirmsAccess(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


// Update Suspend Status action
export const updateSuspendStatus = createAsyncThunk("admin/updateSuspendStatus", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateSuspendStatus(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
// Update Firm action
export const updateFirm = createAsyncThunk("admin/updateFirm", async (formData, { rejectWithValue }) => {
  try {
    const response = await api.updateFirm(formData);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Delete Firm action
export const deleteFirm = createAsyncThunk("admin/deleteFirm", async (id, { rejectWithValue }) => {
  try {
    const response = await api.deleteFirm(id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});


// All Notifications action
export const getAllNotification = createAsyncThunk("admin/getAllNotification", async () => {
  try {
    const response = await api.getAllNotification();
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

// Mark as Read action
export const markAsRead = createAsyncThunk("admin/markAsRead", async (notification_id, { rejectWithValue }) => {
  try {
    const response = await api.markAsRead(notification_id);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});
const authSlice = createSlice({
  name: "auth",
  initialState: {
    admin: null,
    loading: false,
    allFirmsUsers: [],
    notification: [],
    userLogedOut: isBrowser ? !localStorage.getItem("trust-superAdmin") : true,
    error: null,
    message: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Login slice
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.userLogedOut = false;
        state.admin = action.payload;
        if (typeof window != "undefined") {
          if (action?.payload?.role == "superadmin") {
            // localStorage.setItem("trust-superAdmin", JSON.stringify(action?.payload));
            localStorage.setItem("trust-superAdmin", JSON.stringify({ "token": action?.payload?.token, "role": action.payload?.role }));
          } else {
            toast.error("Invalid Credential")
          }
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Login failed";
        toast.error(action.payload?.message)
      })

      // checkUser slice
      .addCase(checkUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkUser.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        if (action?.payload?.user?.role != "superadmin") {
          toast.error("session expired, please login again!")
          localStorage.removeItem("trust-superAdmin");
          setTimeout(() => {
            window.location.href = '/';
          }, 1000);
        }
      })

      .addCase(checkUser.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })

      // GetAllFirms slice
      .addCase(getAllFirms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFirms.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.allFirmsUsers = action?.payload?.data;
      })
      .addCase(getAllFirms.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })


      // AddFirms slice
      .addCase(addFirms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFirms.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message);
      })
      .addCase(addFirms.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message);
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })

      // Update Firms Access slice
      .addCase(updateFirmsAccess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFirmsAccess.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message);
      })
      .addCase(updateFirmsAccess.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message);
        console.log(typeof window)
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })


      // Update-Suspend-Status slice
      .addCase(updateSuspendStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSuspendStatus.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        toast.success(action?.payload?.message);
      })
      .addCase(updateSuspendStatus.rejected, (state, action) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        toast.error(action?.payload?.message);
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })

      // Update Firm slice
      .addCase(updateFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFirm.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
      })
      .addCase(updateFirm.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        console.log(typeof window)
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })


      // Update Firm slice
      .addCase(deleteFirm.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFirm.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
      })
      .addCase(deleteFirm.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        console.log(typeof window)
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })


      // Get All Notification slice
      .addCase(getAllNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllNotification.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
        state.notification = action?.payload?.data;
      })
      .addCase(getAllNotification.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        console.log(typeof window)
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })

      // Mark As Read slice
      .addCase(markAsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        state.admin = null;
        state.userLogedOut = false;
        state.loading = false;
      })
      .addCase(markAsRead.rejected, (state) => {
        state.loading = false;
        state.admin = null;
        state.error = null;
        state.userLogedOut = true;
        // if (typeof window != "undefined") {
        //   toast.error("session expired, please login again!")
        //   localStorage.removeItem("trust-superAdmin");
        // }
        // setTimeout(() => {
        //   window.location.href = '/';
        // }, 1000);
      })

  },
});

export default authSlice.reducer;