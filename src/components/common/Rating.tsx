import { Rating } from "./common";
import { message } from "antd";
import React from "react";
import { ratingDoc } from "../../../apis/documents";
type Props = {
  isDisable : boolean,
  style : "col" | "row",
  isAuth : boolean,
  rate : number,
  setIsAuth : (value:boolean) => void,
  docId : number
};

function Rate({ rate,isAuth,isDisable,style,setIsAuth,docId}: Props) {

    const [rated, setRated] = React.useState(Math.floor(rate));
    const typeColor:any = ["","red","amber","amber","amber","amber"]

    const handleRating = async (value:number) =>{
      try{
          await ratingDoc(docId,value);
         
          message.success(`Bạn đã đánh giá ${value} Sao cho tài liệu`);
      }catch (error)
      {
        message.error("Đánh giá thất bại");
        console.log(error);
        return;
        
      }
      setRated(value);
      setIsAuth(true);
      
    }

  return (
    <>
        <Rating ratedColor={typeColor[Math.floor(rated)]} readonly={isDisable} value={rated} className={`flex ${style == "col" ? "flex-col":""}`} onChange={(value) => handleRating(value)} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />
      
    </>
  );
}

export default Rate;
