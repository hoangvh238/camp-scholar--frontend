import { documentState } from "@/atoms/DocumentAtom";
import { RootState } from "@/redux/store";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ValidationError } from "yup";
import { buyDoc, getAllBoughtDocument } from "../../apis/documents";
import { authModelState } from "../atoms/authModalAtom";

const useDocuments = () => {
  const [documentStateValue, setDocumentStateValue] =
    useRecoilState(documentState);
  const user = useSelector((state: RootState) => state.userInfor.currentUser);
  const setAuthModalState = useSetRecoilState(authModelState);

  const onGetBuyList = async () => {
    // check user ?

    try {
      const dataDTO = await getAllBoughtDocument();
      setDocumentStateValue({ ...documentStateValue, documents: dataDTO.data });
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          toast.error("Cannot view buy list");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 501 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        ) {
          return -2;
        }
      }
    }
  };
  const onBough = async (docId: number) => {
    if (!user.userName) {
      setAuthModalState({ open: true, view: "login" });
      return false;
    }

    try {
      await buyDoc(docId);
    } catch (error) {
      if (error instanceof ValidationError) {
        if (error?.name === "ValidationError") {
          toast.error("Cannot");
        }
      }
      if (axios.isAxiosError(error)) {
        if (
          error.response?.status === 501 ||
          error.response?.status === 404 ||
          error.response?.status === 400
        ) {
        }
      }
    }
  };

  return {
    documentStateValue,
    onGetBuyList,
    onBough,
  };
};

export default useDocuments;
