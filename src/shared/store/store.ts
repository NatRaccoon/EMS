import { configureStore } from "@reduxjs/toolkit";
import { httpService } from "../lib/http-service";

export const store = configureStore({
  reducer: {
    [httpService.reducerPath]: httpService.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(httpService.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
