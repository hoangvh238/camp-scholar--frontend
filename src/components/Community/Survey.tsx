import { RootState } from "@/redux/store";
import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaSearchengin } from "react-icons/fa";
import { useSelector } from "react-redux";
import SurveyModal from "../Modal/Survey/SurveyModal";
import { getCookie } from "cookies-next";

const Survey: React.FC = () => {
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const userId = useSelector(
    (state: RootState) => state.userInfor.currentUser?.userId,
  );


  const handleCheck = async () =>{
    if( getCookie("survey") == null)
    setOpen(true);
  }
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(()=>{
    handleCheck();
  },[])
  return (
    <Flex
      direction="column"
      bg={bg}
      borderRadius={4}
      cursor="pointer"
      p="12px"
      border="1px solid"
      borderColor={borderColor}
    >
      {userId !== -1 ? (
        <>
          <SurveyModal userId={userId} open={open} handleClose={handleClose} />
          <Flex mb={2}>
            <Icon as={FaSearchengin} fontSize={26} color="brand.100" mt={2} />
            <Stack spacing={1} fontSize="9pt" pl={2}>
              <Text fontWeight={600}>Bạn đang quan tâm điều gì?</Text>
              <Text>Bạn có thể tùy chọn nội dung hiển thị</Text>
            </Stack>
          </Flex>
          <Button height="30px" bg="brand.100" onClick={handleOpen}>
            Nói cho tôi
          </Button>
        </>
      ) : (
        ""
      )}
    </Flex>
  );
};

export default Survey;
