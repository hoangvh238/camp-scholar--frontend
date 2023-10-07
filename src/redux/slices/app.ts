import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpenSlidebar: false,
  isMouseVisit: false,
  isDarkMode: false,
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleIsOpenSlidebar: (state) => {
      state.isOpenSlidebar = !state.isOpenSlidebar;
    },
    changeIsMouseVisit: (state, action) => {
      state.isMouseVisit = action.payload;
    },
    toggleIsDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
    },

  },
});

// Action creators are generated for each case reducer function
export const { toggleIsOpenSlidebar, changeIsMouseVisit, toggleIsDarkMode } =
  appSlice.actions;

export default appSlice.reducer;
