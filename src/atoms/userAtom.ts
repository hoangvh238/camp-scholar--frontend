import { atom } from "recoil";

export type User = {
  userId: number,
  userName: string,
  phone: string,
  email: string,
  avatarURL: string,
  backgroundURL: string,
  level: string,
  role: string,
  coint: number,
  activityPoint: number,
  isLocked: boolean
};

export type Bill = {
  toHistoryId: number,
  paymentId: string,
  amountToken: number,
  amountMoney: number,
  time: Date,
  status: number
}

export type Exchange = {
  requestId: number,
  time: Date,
  amountCoins: number,
  totalMoney: number,
  status: number
}


const defaultUser: User = {
  userId: 0,
  userName: "",
  phone: "",
  email: "",
  avatarURL: "",
  backgroundURL: "",
  level: "",
  role: "",
  coint: 0,
  activityPoint: 0,
  isLocked: true
};

export const userState = atom<User>({
  key: "UserState",
  default: defaultUser,
});
