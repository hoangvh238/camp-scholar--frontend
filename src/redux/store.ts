import { configureStore } from "@reduxjs/toolkit";
import app from "./slices/app";
import userInfor from "./slices/userInfor";
export const store = configureStore({
  reducer: {
    app: app,
    userInfor : userInfor
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
