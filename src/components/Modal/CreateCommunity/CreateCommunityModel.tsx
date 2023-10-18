import {
  Box,
  Button,
  Checkbox,
  Flex,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";

import { auth, firestore } from "../../../firebase/clientApp";
import useDirectory from "../../../hooks/useDirectory";
import { createGroup } from "../../../../apis/groups";
import Tag from "@/components/hashtag/Tag";

type CreateGroup = {
  groupName: string,
  description: string;
  timeCreate: Date;
  category: string;
  hashtag: string;
}

type CreateCommunityModelProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModel: React.FC<CreateCommunityModelProps> = ({
  open,
  handleClose,
}) => {
  const isAlphaNumeric = (str: string) => /^[a-zA-Z0-9\s]+$/.test(str);
  const [user] = useAuthState(auth);
  const [CommunitiesName, setCommunities] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toggleMenuOpen } = useDirectory();
  const bg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const [name, setName] = useState("");
  const [depcriptions, setDepcriptions] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // if (event.target.value.length > 21) return;

    setCommunities(event.target.value);
    // setCharsRemaining(21 - event.target.value.length);
  };


  const handleCreateCommunity = async () => {
    // if (error) setError("");
    // console.log("create");
    
    // // if (!isAlphaNumeric(CommunitiesName) || CommunitiesName.length < 3) {
    // //   return setError(
    // //     "Tên phải dài ít nhất 3 kí tự và không chứa kí tự đặc biệt"
    // //   );
    // // }
  
    // // if (!isAlphaNumeric(depcriptions)) {
    // //   return setError(
    // //     "Tên không được chứa kí tự đặc biệt"
    // //   );
    // // }
    const data:CreateGroup = {
      groupName : name,
      description : depcriptions,
      timeCreate: new Date(),
      category: localStorage.getItem('cate') ?? "",
      hashtag: localStorage.getItem('hashtag') ?? "",

    }
    await createGroup(data);
    setLoading(true);
  
    try {
      // ...
    } catch (error: any) {
      console.log("HandleCreateCommunity Error", error);
      setError(error.message);
    }
  
    setLoading(false);
  };

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Tạo nhóm
          </ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <div className='container flex items-center h-full max-w-3xl mx-auto'>
                <div className='relative bg-white w-full h-fit rounded-lg space-y-6'>
                  <div>
                    <h3 className="font-[700] text-[24px] ">Tên</h3>
                    <p className='font-[300] text-[14px] pb-2 text-red-600 font-bold '>
                      Chú ý tên nhóm đặt không thể đổi !
                    </p>
                    <div className='relative'>
                      <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
                      </p>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className='pl-6'                       
                        variant='flushed' placeholder='Nhập tên nhóm...'
                      />
                    </div>
                  </div>
                  <Tag></Tag>
                 
                  <div>
                    <h3 className="font-[700] text-xl ">Mô tả nhóm</h3>
                    <p className='font-[300] text-sm pb-2'>
                     Mô tả nhóm của bạn
                    </p>
                    <div className='relative'>
                      <p className='absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400'>
                      </p>
                      <Input
                        value={depcriptions}
                        onChange={(e) => setDepcriptions(e.target.value)}
                        className='pl-6'
                        variant='flushed' placeholder='Nhập mô tả nhóm...'
                      />
                    </div>
                  </div>

                  <div className='flex justify-end gap-4'>

                    {/* <Button
            isLoading={false}
            disabled={input.length === 0}
            onClick={() => createCommunity()}>
            Create Community
          </Button> */}
                  </div>



                </div>
              </div>
            </ModalBody>
          </Box>
          <ModalFooter bg={bg} borderRadius="0px 0px 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={()=> handleCreateCommunity()}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateCommunityModel;
