// src/services/api.js — Communicates with Express + MongoDB backend
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';


// Helper to get authorization headers
const getHeaders = (contentType = 'application/json') => {
  const headers = {};
  if (contentType) {
    headers['Content-Type'] = contentType;
  }
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Response helper
const handleResponse = async (response) => {
  let data;
  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      data = { message: text || response.statusText };
    }
  } catch {
    data = { message: response.statusText || 'Unable to parse server response' };
  }
  
  if (!response.ok) {
    throw new Error(data.message || `Server error (Status: ${response.status})`);
  }
  return data;
};

// Safe fetch wrapper to catch network/connectivity errors
const safeFetch = async (url, options) => {
  try {
    const response = await fetch(url, options);
    return response;
  } catch (error) {
    console.error('Fetch error details:', error);
    throw new Error('Unable to connect to the server. Please check your connection or ensure the backend server is running.');
  }
};

// ============= AUTHENTICATION =============

export const login = async (email, password) => {
  const response = await safeFetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse(response);
  // Store token and user details in localStorage
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

export const register = async (userData) => {
  const response = await safeFetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(userData),
  });
  const data = await handleResponse(response);
  if (data.token) {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return { success: true };
};

export const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  try {
    const response = await safeFetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    return await handleResponse(response);
  } catch (error) {
    console.error('getCurrentUser error:', error);
    logout();
    return null;
  }
};

// ============= SERVICE LISTINGS / ARTISTS =============

export const getServices = async (filters = {}) => {
  const { category, city, search } = filters;
  const params = new URLSearchParams();
  if (category) params.append('category', category);
  if (city) params.append('city', city);
  if (search) params.append('search', search);

  const response = await safeFetch(`${API_BASE_URL}/services?${params.toString()}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const getServiceById = async (id) => {
  const response = await safeFetch(`${API_BASE_URL}/services/${id}`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const getOwnService = async () => {
  const response = await safeFetch(`${API_BASE_URL}/services/my`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const saveOwnService = async (serviceData) => {
  const response = await safeFetch(`${API_BASE_URL}/services`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(serviceData),
  });
  return await handleResponse(response);
};

export const addServiceReview = async (serviceId, reviewData) => {
  const response = await safeFetch(`${API_BASE_URL}/services/${serviceId}/reviews`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(reviewData),
  });
  return await handleResponse(response);
};

// ============= CATEGORIES =============

export const getCategories = async () => {
  const response = await safeFetch(`${API_BASE_URL}/categories`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const createCategory = async (categoryData) => {
  const response = await safeFetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(categoryData),
  });
  return await handleResponse(response);
};

// ============= BOOKINGS =============

export const createBooking = async (bookingData) => {
  const response = await safeFetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(bookingData),
  });
  return await handleResponse(response);
};

export const getClientBookings = async () => {
  const response = await safeFetch(`${API_BASE_URL}/bookings/my`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const getArtistBookings = async () => {
  const response = await safeFetch(`${API_BASE_URL}/bookings/artist`, {
    method: 'GET',
    headers: getHeaders(),
  });
  return await handleResponse(response);
};

export const updateBookingStatus = async (bookingId, status) => {
  const response = await safeFetch(`${API_BASE_URL}/bookings/${bookingId}/status`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });
  return await handleResponse(response);
};

export const updateBookingPayment = async (bookingId, paymentData) => {
  const response = await safeFetch(`${API_BASE_URL}/bookings/${bookingId}/payment`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(paymentData),
  });
  return await handleResponse(response);
};

// ============= PROFILE & VERIFICATION =============

export const updateUserProfile = async (profileData) => {
  const response = await safeFetch(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await handleResponse(response);
  // Update cached user in localStorage
  const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...cachedUser, ...data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
};

export const submitVerification = async () => {
  const response = await safeFetch(`${API_BASE_URL}/users/verify`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  const data = await handleResponse(response);
  // Update verification status in local user cache
  const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
  cachedUser.isVerified = true;
  localStorage.setItem('user', JSON.stringify(cachedUser));
  return data;
};

export const upgradeToArtist = async () => {
  const response = await safeFetch(`${API_BASE_URL}/auth/upgrade`, {
    method: 'PUT',
    headers: getHeaders(),
  });
  const data = await handleResponse(response);
  // Update role status in local user cache
  const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
  const updatedUser = { ...cachedUser, ...data };
  localStorage.setItem('user', JSON.stringify(updatedUser));
  return updatedUser;
};

// ============= AI & DIGILOCKER VERIFICATION =============

export const aiVerifyDocument = async (docData) => {
  const response = await safeFetch(`${API_BASE_URL}/users/ai-verify-document`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(docData),
  });
  const data = await handleResponse(response);
  if (data.user) {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...cachedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return data;
};

export const verifyWithDigiLocker = async (payload) => {
  const response = await safeFetch(`${API_BASE_URL}/users/digilocker-verify`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await handleResponse(response);
  if (data.user) {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...cachedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return data;
};

// ============= QUALIFICATIONS & CERTIFICATES =============

export const addQualification = async (qualData) => {
  const response = await safeFetch(`${API_BASE_URL}/users/qualifications`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(qualData),
  });
  const data = await handleResponse(response);
  if (data.user) {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...cachedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return data;
};

export const deleteQualification = async (qualId) => {
  const response = await safeFetch(`${API_BASE_URL}/users/qualifications/${qualId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await handleResponse(response);
  if (data.user) {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...cachedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return data;
};

export const addCertificate = async (certData) => {
  const response = await safeFetch(`${API_BASE_URL}/users/certificates`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(certData),
  });
  const data = await handleResponse(response);
  if (data.user) {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...cachedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return data;
};

export const deleteCertificate = async (certId) => {
  const response = await safeFetch(`${API_BASE_URL}/users/certificates/${certId}`, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  const data = await handleResponse(response);
  if (data.user) {
    const cachedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updatedUser = { ...cachedUser, ...data.user };
    localStorage.setItem('user', JSON.stringify(updatedUser));
  }
  return data;
};
