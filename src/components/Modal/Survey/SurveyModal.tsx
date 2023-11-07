import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { Space, Tag } from "antd";
import Select from "react-select";
import makeAnimated from "react-select/animated";

import { Category } from "@/atoms/CategoryAtom";
import { setCookie } from "cookies-next";
import {
  addDoc,
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { getFullCate } from "../../../../apis/category";
import { firestore } from "../../../firebase/clientApp";

type Selection = {
  value: string;
  label: string;
  categoryId: number;
  description: string;
};

type SurveyModelProps = {
  open: boolean;
  handleClose: () => void;
  userId: number;
};

const SurveyModal: React.FC<SurveyModelProps> = ({
  open,
  handleClose,
  userId,
}) => {
  const animatedComponents = makeAnimated();
  const [options, setOptions] = useState<Selection[]>([]);
  const [userChoice, setUserChoice] = useState<any>([]);
  const [isGet, setIsGet] = useState(false);

  const [visibleTags, setVisibleTags] = useState(13); // Số lượng thẻ ban đầu hiển thị

  const handleShowMoreTags = () => {
    setVisibleTags(options.length); // Hiển thị tất cả thẻ còn lại
  };
  const hideTags = () => {
    setVisibleTags(13); // Hiển thị tất cả thẻ còn lại
  };

  const loadUserChoice = async (userId: number) => {
    if (userId == -1 || isGet == true) return;
    const userChoiceRef = collection(firestore, "userChoiceDB");

    const q = query(userChoiceRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);
      setIsGet(true);
      if (!querySnapshot.empty) {
        // Nếu có dữ liệu userChoice cho userId, cập nhật userChoice trong state
        const userChoiceData = querySnapshot.docs[0].data();
        setUserChoice(userChoiceData.choices);
        setCookie("survey", userChoiceData.choices);
      }
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu userChoice:", error);
    }
  };

  const updateChoice = async (userId: number, userChoice: Selection[]) => {
    const userChoiceRef = collection(firestore, "userChoiceDB");

    // Tạo một truy vấn để tìm tài liệu userChoice của người dùng dựa trên userId
    const q = query(userChoiceRef, where("userId", "==", userId));

    try {
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        // Nếu không tìm thấy tài liệu userChoice cho userId, tạo một tài liệu mới
        const newDocRef = await addDoc(userChoiceRef, {
          userId,
          choices: userChoice,
        });
        console.log("Tạo userChoice mới thành công:", newDocRef.id);
      } else {
        // Nếu tìm thấy tài liệu userChoice cho userId, cập nhật nó
        querySnapshot.forEach(async (doc) => {
          await updateDoc(doc.ref, { choices: userChoice });
          console.log("Cập nhật userChoice thành công:", doc.id);
        });
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật userChoice:", error);
    }
  };

  const color = [
    "magenta", // Vật lý
    "red", // Hóa học
    "volcano", // Sinh học
    "orange", // Toán học
    "gold", // Công nghệ thông tin
    "lime", // Kỹ thuật
    "purple", // Triết học
    "green", // Kinh tế học
    "cyan", // Xã hội học
    "blue", // Lịch sử
    "geekblue", // Chính trị học
    "warning", // Tâm lý học
    "orange", // toán học
    "volcano", // Giáo dục học
    "gold", // Nghệ thuật
    "magenta", // Văn hóa
    "green", // Y học
    "geekblue", // Thể thao
  ];

  const getListCate = async () => {
    try {
      const getData = await getFullCate();
      const dataCate = getData.data;
      const updatedOptions = dataCate.map((data: Category) => ({
        value: data.categoryName,
        label: data.categoryName,
        categoryId: data.categoryId,
        description: data.description,
      }));

      setOptions(updatedOptions);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelectChange = (newValue: any) => {
    setUserChoice(newValue);
  };

  const handleTagClick = (value: string) => {
    // Kiểm tra xem thẻ đã được chọn chưa
    const isSelected = isSelectedStatus(value);

    if (isSelected) {
      // Nếu đã được chọn, loại bỏ thẻ khỏi userChoice
      const updatedUserChoice = userChoice.filter(
        (item: Selection) => item.value !== value,
      );
      setUserChoice(updatedUserChoice);
    } else {
      // Nếu chưa được chọn, thêm thẻ vào userChoice
      const selectedTag = options.find(
        (item: Selection) => item.value === value,
      );
      if (selectedTag) {
        setUserChoice([...userChoice, selectedTag]);
      }
    }
  };

  const isSelectedStatus = (value: string): boolean => {
    return userChoice.some((item: Selection) => item.value === value);
  };

  useEffect(() => {
    getListCate();
    loadUserChoice(userId);
  }, []);

  return (
    <>
      <Modal isOpen={open} onClose={handleClose} size="2xl">
        <ModalOverlay />
        <ModalContent top={"100px"}>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          ></ModalHeader>

          <Box pl={3} pr={3}>
            <ModalCloseButton />
            <Text className="text-center font-bold">
              Bạn đang quan tâm điều gì ?
            </Text>
            <ModalBody display="flex" flexDirection="column" padding="10px 0px">
              <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                onChange={handleSelectChange} // Use the explicitly typed function
                defaultValue={null}
                isDisabled={false}
                isMulti={true} // Use boolean directly
                options={options}
                value={userChoice}
                className="mb-10"
              />
              <>
                <Space size={[6, 8]} wrap className=" content-center">
                  {options
                    .slice(0, visibleTags)
                    .map((value: Selection, index: number) => (
                      <Tag
                        className="hover:scale-110 text-[14px] px-4 py-2"
                        bordered={isSelectedStatus(value.value)}
                        color={color[index]}
                        key={index}
                        onClick={() => handleTagClick(value.value)}
                      >
                        {value.value}
                      </Tag>
                    ))}
                  {visibleTags < options.length ? (
                    <Tag
                      className="hover:scale-110 text-[14px] px-4 py-2 "
                      bordered={false}
                      onClick={handleShowMoreTags}
                    >
                      <div className="font-bold text-green-500 ">
                        Hiện thêm +
                      </div>
                    </Tag>
                  ) : (
                    <Tag
                      className="hover:scale-110 text-[14px] px-4 py-2"
                      bordered={false}
                      onClick={hideTags}
                    >
                      <div className="font-bold  text-red-600">Ẩn bớt</div>
                    </Tag>
                  )}
                </Space>
              </>
              <Button
                background={"twitter.600"}
                className="w-[20%] mt-8 mx-auto"
                onClick={() => {
                  updateChoice(userId, userChoice);
                  handleClose();
                }}
              >
                Lưu
              </Button>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SurveyModal;
