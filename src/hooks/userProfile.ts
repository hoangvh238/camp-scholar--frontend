import { userState } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import { getUserData } from "../../apis/profile";
import { useEffect } from "react";

const UserProfile = () => {
  const [user, setUser] = useRecoilState(userState);

  const onLoad = async (slug: string) => {
    try {
      const userData = await getUserData(slug);
      setUser(userData.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Gọi onLoad ở đây nếu bạn muốn nó được gọi khi component được render.
  }, []);

  return {
    user,
    setUser,
    onLoad,
  };
};

export default UserProfile;
