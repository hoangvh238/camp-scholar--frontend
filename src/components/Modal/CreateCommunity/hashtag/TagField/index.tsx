import React, { useEffect, useState } from "react";
import Tags from "@yaireo/tagify/dist/react.tagify";
import UnlinkButton from "../UnlinkButton";
import { TagifySettings } from "@yaireo/tagify";
// import "./styling.module.scss";
import { getCookie } from "cookies-next";

import axios from "axios";
import { toast } from "react-toastify";

interface TagFieldProps {
  suggestions: string[];
  state: string[];
  isEdit: boolean;
  useTagFor: string,
  maxTag : number
}



function TagField({
  suggestions,
  state,
  isEdit,
  useTagFor,
  maxTag,
}: TagFieldProps) {
  const [data, setData] = useState<string[]>(state);
  
  const baseTagifySettings = {
    blacklist: [],
    maxTags: maxTag,
    backspace: "edit",
    placeholder: "Enter tags...",
    editTags: useTagFor === "category"?1:0,
    dropdown: {
      enabled: 0,
    },
    callbacks: {} as any,
  };

  const handleChange = (e: CustomEvent) => {
    setData(e.detail.tagify.value.map((item: { value: string }) => item.value));
    
  };

  const settings: TagifySettings<Tagify.BaseTagData> = {
    ...baseTagifySettings,
    whitelist: suggestions,
    editTags: 1,
    backspace: "edit",
    readonly: data.length >= maxTag, // Tắt chỉnh sửa nếu đạt maxTag
    callbacks: {
      add: handleChange,
      remove: handleChange,
      blur: handleChange,
      invalid: handleChange,
      click: handleChange,
      focus: handleChange,
      "edit:updated": handleChange,
      "edit:start": handleChange,
      "edit:input": handleChange,
    },
  };


  return (
    <div className="flex flex-col gap-[20px]">
      <div
        className={`form-group border-[1px] border-gray-300  rounded-[6px] p-[6px] 
        ${useTagFor === "category" ? "isCategory" : "isHashTag"}
      ${isEdit ? "" : "pointer-events-none"}`}
      >
        <Tags value={state} settings={settings} readOnly={false} />
      </div>
    </div>
  );
}

export default TagField;
