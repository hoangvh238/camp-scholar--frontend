
import { userState } from "@/atoms/userAtom";
import { useRecoilState } from "recoil";
import { getUserData } from "../../apis/profile";

const userProfile = () => {
  const [user, setUser] = useRecoilState(userState);

  const onLoad = async (slug: string) => {
    try {
      const user = await getUserData(slug);
      setUser(user.data.data);
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

export default userProfile;
