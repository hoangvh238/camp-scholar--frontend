import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { Category, Hashtag } from '@/atoms/categoryAtom';
import { getFullCate, getHashTag } from '../../../apis/category';

type Selection = {
  value: string;
  label: string;
  categoryId: number;
  description: string;
}

type HashTagSelection = {
  value: string;
  label: string;
  tagId: number;
}
function Tag() {
  const animatedComponents = makeAnimated();
  const [selectedOption, setSelectedOption] = useState<Selection>(); // Explicitly specify the type here
  const [selectedOptionHashTag, setSelectedOptionHashTag] = useState<HashTagSelection[]>();
  const [count, SetCount] = useState(0);
  const [options, setOptions] = useState<Selection[]>([]);
  const [optionsHashTag, setOptionsHashTag] = useState<HashTagSelection[]>([]);

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
    }
    catch (error) {
      console.log(error);

    }
  }
  const handleSelectChange = (newValue: any) => {
    setSelectedOption(newValue);
  };

  const handleSelectHashTagChange = (newValue: any) => {
    setSelectedOptionHashTag(newValue);
  };

  const getFullHashTag = async (id: number) => {
    try {
      const getData = await getHashTag(id);
      const dataCate = getData.data;
      const updatedOptions = dataCate.map((data: Hashtag) => ({
        value: data.tagName,
        label: data.tagName,
        tagId: data.tagId

      }));

      setOptionsHashTag(updatedOptions);
    }
    catch (error) {
      console.log(error);

    }
  }
  useEffect(() => {
    if (!selectedOption) return;
    getFullHashTag(selectedOption.categoryId);
    const data:HashTagSelection[] = [

    ]
    setSelectedOptionHashTag(data);
  }, [selectedOption]);

  useEffect(() => {
    if (!selectedOptionHashTag) return;
    if (selectedOptionHashTag && Array.isArray(selectedOptionHashTag)) {
      const selectedCount = selectedOptionHashTag.length;
      SetCount(selectedCount);
    }

    if (selectedOption) {
    
      localStorage.setItem('cate', JSON.stringify(selectedOption.value));
    }
    if (selectedOptionHashTag) {
   
      const values = selectedOptionHashTag.map(option => option.value);
          
      localStorage.setItem('hashtag', JSON.stringify(values.toString()));
    }
  }, [selectedOptionHashTag])
  useEffect(() => {
    getListCate();
  }, [])

  useEffect(() => {
    // Đặt selectedOptionHashTag thành mảng rỗng khi selectedOption thay đổi
    setSelectedOptionHashTag([]);
  }, [selectedOption]);
  return (
    <>
      <div>
        <h3 className="font-[700] text-xl">{"Lĩnh vực"}</h3>
        <p className='font-[300] text-sm pb-2'>
          {"Chọn lĩnh vực hoạt động chính của trang web"}
        </p>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          onChange={handleSelectChange} // Use the explicitly typed function
          defaultValue={null}
          isDisabled={false}
          isMulti={false} // Use boolean directly
          options={options}
        />
      </div>
      <div>
        <h3 className="font-[700] text-xl">{"Chọn chuyên đề hẹp của nhóm"}</h3>
        <p className='font-[300] text-sm pb-2'>
          {"Chuyên đề hẹp giúp nhóm bạn tập trung phát triển vào nội dung cụ thể hơn"}
        </p>
        <Select
          closeMenuOnSelect={false}
          components={animatedComponents}
          onChange={handleSelectHashTagChange} // Use the explicitly typed function
          defaultValue={null}
          isDisabled={false}
          isMulti={true} // Use boolean directly
          options={optionsHashTag}
          value = {selectedOptionHashTag}
          isOptionDisabled={(option) => count >= 5}
        />
      </div></>
  );
}

export default Tag;
