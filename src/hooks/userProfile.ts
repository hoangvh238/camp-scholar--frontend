import { userState } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import { useEffect } from "react";
import { getUserData } from "../../apis/profile";

// Tạo một Hook riêng
const useUserProfile = () => {
  const [user, setUser] = useRecoilState(userState);

  const onLoad = async (slug: string) => {
    try {
      const userData = await getUserData(slug);
      setUser(userData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    setUser,
    onLoad,
  };
};

export default useUserProfile;
