"use client"
import { useDispatch, useSelector } from 'react-redux';
import { store, storeData } from '../redux/slices/userInfor';
import jwt_decode from "jwt-decode";
import { RootState } from '../redux/store';
import { getCookie } from 'cookies-next';
import { ValidationError } from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';

type UserBase = {
  userName: string,
  role: string,
};



export const storage = async () => {
  // const token = await getCookie("token");

  // if (!token) return null;
  // const dispatch = useDispatch();
  // var decoded: UserBase = jwt_decode(token);
  // const user = {
  //   userName: decoded!.userName,
  //   role: decoded!.role,
  // };
  // dispatch(
  //   store({
  //     user
  //   })
  // );
}

export const getUser = async () => { 
  storage();
  const user = useSelector((state: RootState) => state.userInfor.currentUser)
  return user;
}


export default storage