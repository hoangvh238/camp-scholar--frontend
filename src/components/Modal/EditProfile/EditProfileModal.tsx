import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useColorModeValue,
} from "@chakra-ui/react";

import { useForm } from 'react-hook-form';
import { useRouter } from "next/router";
import React, { useState } from "react";

import { User } from "@/atoms/userAtom";
import FormImages from "@/components/form/form-images";

interface ProfileSettingsFormType {
  name: string;
  email: string
  images: File[];
  bannerImages: File[];
}


type EditProfileModal = {
  open: boolean;
  handleClose: () => void;
  user: User
};

const EditProfileModal: React.FC<EditProfileModal> = ({
  open,
  handleClose,
  user,
}) => {
  const searchBorder = useColorModeValue("blue.500", "#4A5568");
  const inputBg = useColorModeValue("gray.50", "#4A5568");
  const focusedInputBg = useColorModeValue("white", "#2D3748");
  const placeholderColor = useColorModeValue("gray.500", "#CBD5E0");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [phone,setPhone] = useState<string>("");
  
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // update state
    setPhone(event.target.value);
    console.log(phone);
    
  };
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileSettingsFormType>({
    defaultValues: {
      name: '',
      email: '',
      bannerImages: [],
      images: [],
    },
  });

  const setImage = (file: File[]) => {
    setValue('images', file);
  };

  const setBanner = (file: File[]) => {
    setValue('bannerImages', file);
  };

  const onSubmit = async (data: ProfileSettingsFormType) => {

  };

  const draftImageFile = watch('images')[0];
  const draftBannerImageFile = watch('bannerImages')[0];

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Edit profile
          </ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <div>
                <FormImages
                  bannerImage={user.backgroundURL}
                  image={user.avatarURL}
                  draftBannerImageFile={draftBannerImageFile}
                  draftImageFile={draftImageFile}
                  setBanner={setBanner}
                  setImage={setImage}
                />
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
                  <div className="space-y-6">

                    <Input
                      required
                      name="phone"
                      placeholder="Enter phone..."
                      type="userName"
                      mb={2}
                      onChange={onChange}
                      fontSize="10pt"
                      _placeholder={{ color: placeholderColor }}
                      _hover={{
                        bg: focusedInputBg,
                        border: "1px solid",
                        borderColor: searchBorder,
                      }}
                      _focus={{
                        outline: "none",
                        bg: focusedInputBg,
                        border: "1px solid",
                        borderColor: searchBorder,
                      }}
                      bg={inputBg}
                      value={user.phone}
                    />
                  </div>
                  <input type="file" {...register('images')} className="hidden" />
                  <input type="file" {...register('bannerImages')} className="hidden" />

                  <div className='mt-[100px] flex justify-center rounded-md '>
                    <Button className=" w-[100%] ml-auto">
                      {loading ? 'Updating...' : 'Submit'}
                    </Button>
                  </div>
                </form>
              </div>
            </ModalBody>
          </Box>


        </ModalContent>
      </Modal>
    </>
  );
};
export default EditProfileModal;
