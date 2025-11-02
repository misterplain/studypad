import { configureStore } from "@reduxjs/toolkit";
import { createLogger } from "redux-logger";
import authReducer from "./authSlice";
import noteReducer from "./noteSlice";

const logger = createLogger({
  collapsed: true,
  diff: true,
});

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: noteReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Allow non-serializable values if needed
    }).concat(logger),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
