import { Flex, useColorModeValue } from "@chakra-ui/react";

type Props = {};

function ProfileTopBar({}: Props) {
  const bg = useColorModeValue("white", "#1A202C");
  const borderColor = useColorModeValue("gray.300", "#2D3748");
  const hoverBg = useColorModeValue("gray.200", "#2A4365");

  return (
    <Flex
      justify="start"
      align="center"
      bg={bg}
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor={borderColor}
      p={2}
      mb={4}
    ></Flex>
  );
}

export default ProfileTopBar;
