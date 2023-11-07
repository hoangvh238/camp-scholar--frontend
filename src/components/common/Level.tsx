import { Badge, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

type Props = {
  point: number;
};

function Level({ point}: Props) {

  const [level,setLevel] = useState(0);
  const levelTag = ["Người mới","Chuyên cần","Chuyên sâu","Chuyên gia","Chuyên gia ưu tú"];
  const levelColor = ["gray","green","blue","yellow","red"];
  const depcriptions = ["Cấp độ 1 : Cấp độ ban đầu của người dùng mới", "Cấp độ 2 : Cấp độ của người dùng tích cực hoạt động trong hệ thống","Cấp độ 3 : Cấp độ của người dùng được mọi người đánh giá tốt trong hệ thống","Cấp độ 4 : Cấp độ người dùng có độ uy tín cao, được mọi người đánh giá cao trong hệ thống","Cấp độ 5: Cấp độ người dùng cao nhất, được đánh giá trên mức cao nhất của hệ thống"]
  //0-1000 người mới // bạc phơ 
  //1000-1999 chuyên cần // xanh lá 
  //2000-2999 chuyên sâu  // blue
  //3000-3999 chuyên gia  // vàng 
  //4000-max chuyên gia ưu tú  // đỏ 


  const getLevel = () => {
    if (point < 1000) {
        setLevel(0);
    } else if (point < 2000) {
        setLevel(1);
    } else if (point < 3000) {
        setLevel(2);
    } else if (point < 4000) {
        setLevel(3);
    } else {
        setLevel(4);
    }
}
  useEffect(()=>{
    getLevel();
  },[point])
  return (
    <>
      <Tooltip className="text-center"label={depcriptions[level]} hasArrow arrowSize={15}>
      <Badge className="text-center align-middle"colorScheme={levelColor[level]}>{levelTag[level]}</Badge>
    </Tooltip>
      
    </>
  );
}

export default Level;
