import {
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import React from "react";
import { GiCheckedShield } from "react-icons/gi";

const Premium: React.FC = () => {
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");

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
      <Flex mb={2}>
        <Icon as={GiCheckedShield} fontSize={26} color="brand.100" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600}>Thử Camp Scholar PRO</Text>
          <Text>Trải nghiệm Camp Scholar với những tính năng nâng cao !</Text>
        </Stack>
      </Flex>
      <Button height="30px" bg="brand.100">
        Thử ngay
      </Button>
    </Flex>
  );
};
export default Premium;
