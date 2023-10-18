import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type PageContentProps = {
  children: any;
};

const CommentContent: React.FC<PageContentProps> = ({ children }) => {
  const router = useRouter();
  const uid = router.query;

  return (
    <Flex justify="center" p="16px 0px">
      <Flex
        width="95%"
        justify="center"
        maxWidth={true ? "1200px" : "860px"}
      >
        {/* Left */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "70%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children && children[0 as keyof typeof children]}
        </Flex>
    

        {/* Right */}
        <Flex
          direction="column"
          display={{ base: "none", md: "flex" }}
          width={{ md: "30%" }} // Set the width for the right column
          flexGrow={1}
        >
          {children && children[1 as keyof typeof children]}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default CommentContent;
