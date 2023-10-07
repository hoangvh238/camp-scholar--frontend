import React, { useEffect, useState } from "react";
import TagField from "./TagField";

import Image from "next/image";
import EditIconAnimate from "@icon/components/Button/edit.gif";
import EditIconPause from "@icon/components/Button/edit_pause.png";
import axios from "axios";
import { toast } from "react-toastify";
import { getCookie } from "cookies-next";

type value = {
   form : string;
   message :string;
   name : string;
   max : number

}
function TagForm({form,message,name,max}:value) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [skills, setSkills] = useState<string[]>([]);

  const handleGetAllSkillSuggestions = async () => {
    const sampleSkills= [
      { value: "JavaScript" },
      { value: "React" },
      { value: "Node.js" },
      { value: "HTML" },
      { value: "CSS" },
    ];
      // Dữ liệu mẫu cho các gợi ý
      const sampleSuggestions = sampleSkills.map((skill) => skill.value);
      setSuggestions(sampleSuggestions);
  
  };
  const handleGetMemberSkill = async () => {

  };

  useEffect(() => {
    handleGetAllSkillSuggestions();
    handleGetMemberSkill();
  }, []);

  return (
    <div className="flex flex-col gap-[2px] rounded-[10px] shadow-primary">
      <div className="flex flex-row justify-between">
        <h3 className="font-[700] text-[24px] ">{name}</h3>
      </div>
      <div className="flex flex-col gap-[5px]" aria-disabled="true">
        <p className="font-[300] text-[14px]">{message}</p>
        {
          suggestions.length === 0 ? null :
          <TagField
          maxTag={max}
          suggestions={suggestions!}
          isEdit={true}
          useTagFor={form}
          state={skills}
        />
        }
      </div>
    </div>
  );
}

export default TagForm;
