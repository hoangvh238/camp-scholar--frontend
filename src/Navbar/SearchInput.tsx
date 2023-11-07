import { Flex, InputGroup, useColorModeValue } from "@chakra-ui/react";
import React, { useState } from "react";

import AutoSuggest from "./Autocomplete";

type UserBase = {
  userName: string;
  role: string;
};
type SearchInputProps = {
  user?: UserBase | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  const bg = useColorModeValue("gray.100", "whiteAlpha.100");
  const iconColor = useColorModeValue("gray.300", "white");
  const focusedInputBg = useColorModeValue("white", "#171923");
  const searchBorder = useColorModeValue("gray.200", "#4A5568");

  // const options: SelectProps['options'] = [];

  const [options, setOptions] = useState<any>([]);
  const [key, setKey] = useState("");

  // Populate the options array

  return (
    <Flex flexGrow={1} maxWidth={user ? "auto" : "600px"} mr={2} align="center">
      <InputGroup>
        <AutoSuggest
          options={options}
          setOptions={setOptions}
          setKey={setKey}
          searchKey={key}
        ></AutoSuggest>
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
