import Tag from "@/components/hashtag/Tag";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";
import { message } from "antd";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { resetToken } from "../../../../apis/auth";
import { createGroup } from "../../../../apis/groups";

type CreateGroup = {
  groupName: string;
  description: string;
  timeCreate: Date;
  category: number;
  hashtag: string;
};

type CreateCommunityModelProps = {
  open: boolean;
  handleClose: () => void;
};

const CreateCommunityModel: React.FC<CreateCommunityModelProps> = ({
  open,
  handleClose,
}) => {
  const [CommunitiesName, setCommunities] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
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
    const data: CreateGroup = {
      groupName: name,
      description: depcriptions,
      timeCreate: new Date(),
      category: Number(localStorage.getItem("cate")) ?? null,
      hashtag: localStorage.getItem("hashtag") ?? "",
    };
    setLoading(true);
    try {
      const res = await createGroup(data);
      message.success("Tạo nhóm thành công !");
      const newToken = await resetToken();
      setCookie("token", newToken.data);
      handleClose();
      router.push(`/group/${res.data.data.groupId}`);
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
              <div className="container flex items-center h-full max-w-3xl mx-auto">
                <div className="relative bg-white w-full h-fit rounded-lg space-y-6">
                  <div>
                    <h3 className="font-[700] text-[24px] ">Tên</h3>
                    <p className="font-[300] text-[14px] pb-2 text-red-600 font-bold ">
                      Chú ý tên nhóm đặt không thể đổi !
                    </p>
                    <div className="relative">
                      <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400"></p>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-6"
                        variant="flushed"
                        placeholder="Nhập tên nhóm..."
                      />
                    </div>
                  </div>
                  <Tag></Tag>

                  <div>
                    <h3 className="font-[700] text-xl ">Mô tả nhóm</h3>
                    <p className="font-[300] text-sm pb-2">
                      Mô tả nhóm của bạn
                    </p>
                    <div className="relative">
                      <p className="absolute text-sm left-0 w-8 inset-y-0 grid place-items-center text-zinc-400"></p>
                      <Input
                        value={depcriptions}
                        onChange={(e) => setDepcriptions(e.target.value)}
                        className="pl-6"
                        variant="flushed"
                        placeholder="Nhập mô tả nhóm..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
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
              onClick={() => handleCreateCommunity()}
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
