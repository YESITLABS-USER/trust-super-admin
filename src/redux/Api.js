import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
 
});

export const login = (formData) => API.post("/api/login", formData);

export const checkUser = () => API.get("/api/protected", {
  headers: {
  'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}`,}
});

export const logout = (id) => API.post('/api/logout', id, {
});

export const getAllFirms = () => API.get(`/api/superadmin/get-allfirm`, {
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const addFirms = (formData) => API.post(`/api/superadmin/add-firm`, formData, {
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const updateFirm = (formData) => API.put(`/api/superadmin/update-firm`, formData,{
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const updateFirmsAccess = (formData) => API.put(`/api/superadmin/update-access-status`, formData, {
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const updateSuspendStatus = (formData) => API.put(`/api/superadmin/update-suspend-status`, formData,{
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const deleteFirm = (id) => API.delete(`/api/superadmin/delete-firm/${id}`, {
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const getAllNotification = () => API.get(`/api/superadmin/get-notifications`, {
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});

export const markAsRead = () => API.put(`/api/superadmin/mark-as-read`,notification_id, {
  headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("trust-superAdmin"))?.token}` }
});
