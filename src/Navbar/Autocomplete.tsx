import { useColorModeValue } from "@chakra-ui/react";
import React from "react";

import { AutoComplete, Input } from "antd";
import { useRouter } from "next/navigation";
import { HiUserGroup } from "react-icons/hi";
import { PiNewspaperClippingBold } from "react-icons/pi";
import { searchGroup, searchPost } from "../../apis/searching";

type UserBase = {
  userName: string;
  role: string;
};
type SearchInputProps = {
  options: any;
  searchKey: string;
  setOptions: (value: any) => void;
  setKey: (value: any) => void;
};

const AutoSuggest: React.FC<SearchInputProps> = ({
  options,
  setOptions,
  setKey,
  searchKey,
}) => {
  const bg = useColorModeValue("gray.100", "whiteAlpha.100");
  const iconColor = useColorModeValue("gray.300", "white");
  const focusedInputBg = useColorModeValue("white", "#171923");
  const searchBorder = useColorModeValue("gray.200", "#4A5568");
  const router = useRouter();
  // const options: SelectProps['options'] = [];

  // Populate the options array

  const handleChange = (value: string) => {
    getSuggest(value);
    setKey(value);
  };

  const getSuggest = async (searchKey: string) => {
    try {
      const res = await searchGroup(searchKey);
      const resPost = await searchPost(searchKey);
      const grSuggest = res.data;
      let suggestList: any = [];
      grSuggest?.map((value: any) => {
        suggestList.push({
          label: value.groupName,
          value: `/group/${value.groupId}`,
        });
      });
      resPost.data?.map((value: any) => {
        suggestList.push({
          label: value.titles,
          value: `/group/post/${value.postId}`,
        });
      });

      setOptions(suggestList);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (url: string) => {
    router.push(url);
    setKey("");
  };

  const dropdownRender = (menu: React.ReactNode) => (
    <div>
      {options.length === 0 || !searchKey ? (
        <span>Không có kết quả nào</span>
      ) : (
        <>
          {options.map((option: any) => (
            <div
              key={option.value}
              onClick={() => handleClick(option.value)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "8px",
                cursor: "pointer",
              }}
            >
              <span>{option.label}</span>
              {option.value.includes("post") ? (
                <PiNewspaperClippingBold /> // Render HiUserGroup icon if 'group' is in the value
              ) : (
                <HiUserGroup /> // Render PiNewspaperClippingBold icon otherwise
              )}
            </div>
          ))}
        </>
      )}
    </div>
  );

  return (
    <AutoComplete
      dropdownRender={dropdownRender}
      // allowClear
      filterOption={false}
      allowClear
      value={searchKey}
      placeholder={"Bạn đang muốn tìm kiếm gì ?"}
      style={{ width: "100%", height: "35px" }}
      onChange={handleChange}
      // tokenSeparators={[',']}

      options={options}
      autoClearSearchValue
      onSelect={(value: any) => {
        handleClick(value);
      }}
      size="large"
      notFoundContent={!searchKey ? "Mời nhập..." : "Không tìm thấy !"}
    >
      {" "}
      <Input.Search size="large" placeholder="input here" enterButton />
    </AutoComplete>
  );
};
export default AutoSuggest;
