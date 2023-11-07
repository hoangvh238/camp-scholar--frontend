import { Flex } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";

type PageContentProps = {
  children: any;
};

const PageSingleContent: React.FC<PageContentProps> = ({ children }) => {
  const router = useRouter();
  const uid = router.query;

  return (
    <Flex justify="center" p="16px 0px">
      <Flex width="98%" justify="center" maxWidth={true ? "1200px" : "860px"}>
        {/* Left */}
        <Flex
          direction="column"
          width={{ base: "100%", md: "100%" }}
          mr={{ base: 0, md: 6 }}
        >
          {children}
        </Flex>
      </Flex>
    </Flex>
  );
};
export default PageSingleContent;
