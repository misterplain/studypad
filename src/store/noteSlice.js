import { createSlice } from "@reduxjs/toolkit";
import {
  fetchNotes,
  createNote,
  updateNote,
  deleteNote,
  reorderNotes,
  togglePin,
} from "./noteActions";

const initialState = {
  notes: [],
  loading: false,
  error: null,
  actionLoading: false, // For create/update/delete operations
  actionError: null,
  filters: {
    urgency: { 1: true, 2: true, 3: true },
  },
};

// Helpers for optimistic updates
const addTempNode = (notes, { title, content, parentId }) => {
  const tempNode = {
    id: `temp-${Date.now()}`,
    title,
    content: content || "",
    children: [],
    isTemp: true,
  };

  if (!parentId) {
    return [...notes, tempNode];
  }

  const addToParent = (arr) =>
    arr.map((n) => {
      if (n.id === parentId) {
        const children = Array.isArray(n.children) ? n.children : [];
        return { ...n, children: [...children, tempNode] };
      }
      if (Array.isArray(n.children) && n.children.length) {
        return { ...n, children: addToParent(n.children) };
      }
      return n;
    });

  return addToParent(notes);
};

const removeTempNodes = (notes) =>
  notes
    .filter((n) => !n.isTemp)
    .map((n) => ({
      ...n,
      children: n.children ? removeTempNodes(n.children) : [],
    }));

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNoteError: (state) => {
      state.error = null;
      state.actionError = null;
    },
    clearNotes: (state) => {
      state.notes = [];
      state.loading = false;
      state.error = null;
      state.actionLoading = false;
      state.actionError = null;
    },
    setUrgencyFilter: (state, action) => {
      // payload: { level: 1|2|3, checked: boolean }
      const { level, checked } = action.payload || {};
      if ([1, 2, 3].includes(level)) {
        state.filters.urgency[level] = !!checked;
      }
    },
    setAllUrgencyFilters: (state, action) => {
      const { checked } = action.payload || { checked: true };
      state.filters.urgency[1] = !!checked;
      state.filters.urgency[2] = !!checked;
      state.filters.urgency[3] = !!checked;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch notes
      .addCase(fetchNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.notes = action.payload;
      })
      .addCase(fetchNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create note
      .addCase(createNote.pending, (state, action) => {
        state.actionLoading = true;
        state.actionError = null;
        // Optimistic add
        const payload = action.meta?.arg;
        if (payload?.title) {
          // Ensure default urgency 3 for temp nodes
          state.notes = addTempNode(state.notes, { ...payload, urgency: 3 });
        }
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.actionLoading = false;
        // The API returns the entire hierarchical structure after creation
        state.notes = action.payload;
      })
      .addCase(createNote.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
        // Rollback optimistics
        state.notes = removeTempNodes(state.notes);
      })
      // Update note
      .addCase(updateNote.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        state.actionLoading = false;
        // The API returns the entire hierarchical structure after update
        state.notes = action.payload;
      })
      .addCase(updateNote.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      // Delete note
      .addCase(deleteNote.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.actionLoading = false;
        // The API returns the entire hierarchical structure after deletion
        state.notes = action.payload;
      })
      .addCase(deleteNote.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      // Reorder notes
      .addCase(reorderNotes.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(reorderNotes.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.notes = action.payload;
      })
      .addCase(reorderNotes.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      })
      // Toggle pin
      .addCase(togglePin.pending, (state) => {
        state.actionLoading = true;
        state.actionError = null;
      })
      .addCase(togglePin.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.notes = action.payload;
      })
      .addCase(togglePin.rejected, (state, action) => {
        state.actionLoading = false;
        state.actionError = action.payload;
      });
  },
});

export const { clearNoteError, clearNotes } = noteSlice.actions;
export default noteSlice.reducer;
