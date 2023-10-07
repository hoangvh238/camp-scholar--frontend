"use client"
import { useDispatch, useSelector } from 'react-redux';
import { store, storeData } from './redux/slices/userInfor';
import jwt_decode from "jwt-decode";
import { RootState } from './redux/store';
import { getCookie } from 'cookies-next';
import { getUser } from '../apis/user';
import { ValidationError } from 'yup';
import { toast } from 'react-toastify';
import axios from 'axios';

type UserBase = {
  userName: string,
  role: string,
};



export const storage = async () => {
  const token = await getCookie("token");

  if (!token) return null;
  const dispatch = useDispatch();
  var decoded: UserBase = jwt_decode(token);
  const user = {
    userName: decoded!.userName,
    role: decoded!.role,
  };
  dispatch(
    store({
      user
    })
  );
  console.log("data"+useSelector((state: RootState) => state.userInfor.currentUser));
  

}



export default storage