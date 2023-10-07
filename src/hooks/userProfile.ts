
    import { useRouter } from "next/router";
    import React, { useEffect } from "react";

    import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
    import { authModelState } from "../atoms/authModalAtom";
    import { CommunityState } from "../atoms/CommunitiesAtom";
    import { userState,User } from "@/atoms/userAtom";
    import { disLike, like } from "../../apis/posts";
    import { getUserData } from "../../apis/profile";

    const userProfile = () => {
    const [user, setUser] = useRecoilState(userState);
    const router = useRouter();
    const setAuthModalState = useSetRecoilState(authModelState);

    const onLoad = async (
        slug : string
    ) => {
        
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
        onLoad
    };
    };

    export default userProfile;
