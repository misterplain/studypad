import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { refreshToken as refreshTokenThunk } from "./authActions";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Get auth token from state
const getAuthHeaders = (getState) => {
  const token = getState().auth.accessToken;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Helper to retry once after refreshing token on 401
const requestWithRefresh = async (requestFn, thunkAPI) => {
  const { getState, dispatch } = thunkAPI;
  try {
    return await requestFn(getAuthHeaders(getState));
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) {
      const result = await dispatch(refreshTokenThunk());
      if (result?.success) {
        // Retry once with new access token
        return await requestFn(getAuthHeaders(getState));
      }
    }
    throw error;
  }
};

// Fetch all notes (hierarchical structure)
export const fetchNotes = createAsyncThunk(
  "notes/fetchNotes",
  async (_, thunkAPI) => {
    try {
      const response = await requestWithRefresh(
        (headers) => axios.get(`${API_URL}/notes`, headers),
        thunkAPI
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch notes"
      );
    }
  }
);

// Create a new note
export const createNote = createAsyncThunk(
  "notes/createNote",
  async (noteData, thunkAPI) => {
    try {
      const response = await requestWithRefresh(
        (headers) => axios.post(`${API_URL}/notes`, noteData, headers),
        thunkAPI
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to create note"
      );
    }
  }
);

// Update a note
export const updateNote = createAsyncThunk(
  "notes/updateNote",
  async ({ id, updates }, thunkAPI) => {
    try {
      const response = await requestWithRefresh(
        (headers) => axios.put(`${API_URL}/notes/${id}`, updates, headers),
        thunkAPI
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to update note"
      );
    }
  }
);

// Delete a note
export const deleteNote = createAsyncThunk(
  "notes/deleteNote",
  async (id, thunkAPI) => {
    try {
      const response = await requestWithRefresh(
        (headers) => axios.delete(`${API_URL}/notes/${id}`, headers),
        thunkAPI
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to delete note"
      );
    }
  }
);

// Reorder notes
export const reorderNotes = createAsyncThunk(
  "notes/reorderNotes",
  async ({ parentId, itemIds }, thunkAPI) => {
    try {
      const response = await requestWithRefresh(
        (headers) =>
          axios.patch(
            `${API_URL}/notes/reorder`,
            { parentId, itemIds },
            headers
          ),
        thunkAPI
      );
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to reorder notes"
      );
    }
  }
);
