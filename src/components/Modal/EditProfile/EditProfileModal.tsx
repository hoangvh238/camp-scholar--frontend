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
  Stack,
  useColorModeValue,
} from "@chakra-ui/react";

import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

import { User } from "@/atoms/userAtom";
import FormImages from "@/components/form/form-images";
import { ImCheckboxChecked } from "react-icons/im";
import {
  updateImageUser,
  updateImageUserPhone,
} from "../../../../apis/profile";
import EditPhoneModal from "./EditPhoneModal";
interface ProfileSettingsFormType {
  name: string;
  email: string;
  images: File[];
  bannerImages: File[];
}

type EditProfileModal = {
  open: boolean;
  handleClose: () => void;
  user: User;
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
  const [phone, setPhone] = useState<string>("");
  const [error, setError] = useState(false);
  const [editPhone, setEditPhone] = useState(false);

  const handleCloseEditPhone = () => {
    setEditPhone(false);
  };

  const handleEditPhone = () => {
    setEditPhone(true);
    handleClose();
  };
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Lấy giá trị nhập vào từ input
    const inputValue = event.target.value;

    // Sử dụng biểu thức chính quy để kiểm tra chuỗi
    const regex = /^[0-9]*$/; // Chỉ cho phép chữ số (0-9)

    if (
      regex.test(inputValue) &&
      inputValue.length > 0 &&
      inputValue.length <= 10
    ) {
      // Nếu chuỗi chỉ chứa chữ số, thì cập nhật state phone
      setError(false);
      setPhone(inputValue);
    } else {
      // Nếu chuỗi chứa ký tự đặc biệt, không thực hiện cập nhật state và có thể thông báo lỗi cho người dùng
      setError(true);
      console.log("Chuỗi chứa ký tự đặc biệt");
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileSettingsFormType>({
    defaultValues: {
      name: "",
      email: "",
      bannerImages: [],
      images: [],
    },
  });

  const setImage = (file: File[]) => {
    setValue("images", file);
  };

  const setBanner = (file: File[]) => {
    setValue("bannerImages", file);
  };

  const onSubmit = async (data: ProfileSettingsFormType) => {
    setLoading(true);
    let avatar: string = "";
    let cover: string = "";
    if (data.bannerImages != null)
      try {
        const PRESET = "camp_scholar";
        const COULD_NAME = "ds0av2boe";
        const formData = new FormData();
        formData.append("file", data.bannerImages[0]);
        formData.append("upload_preset", PRESET); // Create an upload preset in Cloudinary

        // Make a POST request to Cloudinary's upload endpoint
        await fetch(
          `https://api.cloudinary.com/v1_1/${COULD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        )
          .then((response) => response.json())
          .then((data) => {
            // `data.url` contains the URL of the uploaded image on Cloudinary
            cover = data.url;
            console.log(cover);
          })
          .catch((error) => {
            console.error("Error uploading image to Cloudinary", error);
          });
      } catch (error) {
        console.log("onUploader Image", error);
      }

    if (data.images != null)
      try {
        const PRESET = "camp_scholar";
        const COULD_NAME = "ds0av2boe";
        const formData = new FormData();
        formData.append("file", data.images[0]);
        formData.append("upload_preset", PRESET); // Create an upload preset in Cloudinary

        // Make a POST request to Cloudinary's upload endpoint
        await fetch(
          `https://api.cloudinary.com/v1_1/${COULD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          },
        )
          .then((response) => response.json())
          .then((data) => {
            // `data.url` contains the URL of the uploaded image on Cloudinary
            avatar = data.url;
          })
          .catch((error) => {
            console.error("Error uploading image to Cloudinary", error);
          });
      } catch (error) {
        console.log("onUploader Image", error);
      }
    try {
      if (phone != user.phone && !error)
        await updateImageUserPhone(avatar, cover, phone);
      else await updateImageUser(avatar, cover);
      setLoading(false);
      window.location.reload();
    } catch (error) {
      console.log("onUploader Image", error);
      setLoading(false);
      window.location.reload();
    }
  };

  const draftImageFile = watch("images")[0];
  const draftBannerImageFile = watch("bannerImages")[0];

  return (
    <>
      <EditPhoneModal
        handClose={handleCloseEditPhone}
        open={editPhone}
        user={user}
      ></EditPhoneModal>
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
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col"
                >
                  <div className="space-y-6">
                    <Stack spacing={3} flexDirection={"row"}>
                      <Input
                        required
                        disabled
                        placeholder="Chưa xác thực"
                        mb={2}
                        isInvalid
                        errorBorderColor={error ? "crimson" : "green.100"}
                        onChange={onChange}
                        fontSize="10pt"
                        _placeholder={{ color: placeholderColor }}
                        _hover={{
                          bg: focusedInputBg,
                          border: "1px solid",
                          borderColor: searchBorder,
                        }}
                        bg={inputBg}
                        value={user.phone}
                      />
                      {user.phone ? (
                        <div className="flex justify-center content-center h-full mt-1 ">
                          {" "}
                          <ImCheckboxChecked
                            color="green"
                            size={30}
                          ></ImCheckboxChecked>
                        </div>
                      ) : (
                        <Button onClick={handleEditPhone}>Xác thực ngay</Button>
                      )}
                    </Stack>
                  </div>
                  <input
                    type="file"
                    {...register("images")}
                    className="hidden"
                  />
                  <input
                    type="file"
                    {...register("bannerImages")}
                    className="hidden"
                  />

                  <div className="mt-[100px] flex justify-center rounded-md ">
                    <Button
                      className="w-[100%] ml-auto"
                      type="submit"
                      isLoading={loading} // Sử dụng isLoading prop và thiết lập giá trị từ biến loading
                      loadingText="Đang cập nhật"
                      colorScheme="teal"
                      variant="outline"
                    >
                      {loading ? "Updating..." : "Submit"}{" "}
                      {/* Sử dụng biểu thức ba ngôi để điều khiển văn bản */}
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
