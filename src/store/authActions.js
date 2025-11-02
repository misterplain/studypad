import axios from "axios";
import {
  loginStart,
  loginSuccess,
  loginFailure,
  registerStart,
  registerSuccess,
  registerFailure,
  refreshTokenSuccess,
  refreshTokenFailure,
  logout as logoutAction,
} from "./authSlice";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Login thunk
export const login = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    dispatch(loginSuccess(response.data));
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || "Login failed";
    dispatch(loginFailure(message));
    return { success: false, error: message };
  }
};

// Register thunk
export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    dispatch(registerSuccess(response.data));
    return { success: true };
  } catch (error) {
    const message = error.response?.data?.message || "Registration failed";
    dispatch(registerFailure(message));
    return { success: false, error: message };
  }
};

// Refresh token thunk
export const refreshToken = () => async (dispatch, getState) => {
  try {
    const { refreshToken: userRefreshToken } = getState().auth;
    if (!userRefreshToken) {
      throw new Error("No refresh token available");
    }
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refreshToken: userRefreshToken,
    });
    dispatch(refreshTokenSuccess(response.data));
    return { success: true, accessToken: response.data.accessToken };
  } catch (error) {
    dispatch(refreshTokenFailure());
    return { success: false };
  }
};

// Logout thunk
export const logout = () => async (dispatch, getState) => {
  try {
    const { accessToken } = getState().auth;
    if (accessToken) {
      // Optionally call server to invalidate tokens
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    dispatch(logoutAction());
  }
};

// Verify token validity (optional, for auto-login on app start)
export const verifyToken = () => async (dispatch) => {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  if (!accessToken || !refreshToken) {
    return;
  }

  try {
    const response = await axios.get(`${API_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    dispatch(
      loginSuccess({
        user: response.data.user,
        accessToken,
        refreshToken,
      })
    );
  } catch (error) {
    // Try refresh token if access token expired
    dispatch(refreshToken());
  }
};
