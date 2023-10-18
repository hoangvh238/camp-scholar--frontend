"use client";
import { createSlice } from "@reduxjs/toolkit";
import { setCookie } from "cookies-next";

type UserBase = {
  userId : number,
  userName : string,
  role: string,
};
type UserData = {
  email: string;
  userName : string,
  phone : string,
  role: string,
  coin : number,
  level : string,
  activityPoint : number, 
  avatarURL : string,
  backgroundURL : string
};
type AppState = {
  currentUser: UserBase;
  userData : UserData;
  userPoint : UserPoint;
  userCoint : UserCoint
};

export type UserCoint = {
   coint : number,

}

export type UserPoint = {
  activityPoint : number
}

const initialState: AppState = {
  currentUser: {
    userId :-1,
    userName: "",
    role:"",
  },
  userData : {
    email: "",
    userName: "",
    phone: "",
    role: "",
    coin: 0,
    level: "",
    activityPoint: 0,
    avatarURL: "",
    backgroundURL: ""
  },
  userPoint : {
    activityPoint : 0
  },
  userCoint : {
     coint : 0
  }
};

export const counterSlice = createSlice({
  name: "userInfor",
  initialState,
  reducers: {
    login: (state, action) => {
      state.currentUser = action.payload.user;
      setCookie("token", action.payload.tokenString, {
        maxAge: 36000,
      });
    },
    logout: (state) => {
      state.currentUser = initialState.currentUser;
      setCookie("token", "", { maxAge: 0 });
    },
    store: (state, action) => {
      state.currentUser = action.payload.user;
    },
    storeData: (state, action) => {
      state.userData = action.payload.user;
    },
    updateCoint : (state,action) => {
      state.userCoint = action.payload.coint;
    },
    updatePoint : (state,action) => {
      state.userPoint = action.payload.point;
    }
  },
});

// Action creators được tạo ra cho mỗi hàm reducer
export const { login, logout,store ,storeData,updateCoint,updatePoint} = counterSlice.actions;

export default counterSlice.reducer;
