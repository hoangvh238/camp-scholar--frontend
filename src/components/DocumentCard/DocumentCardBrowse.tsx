"use client";
import React, { useEffect, useState } from "react";

import { Document } from "@/atoms/DocumentAtom";
import { Flex, Stack, Tag, useColorModeValue } from "@chakra-ui/react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Typography,
} from "@material-tailwind/react";
import { getCookie } from "cookies-next";
import { LuView } from "react-icons/lu";
import { formatTimeToNow } from "../../../ultils/utils";
import DocumentReviewModalBrowse from "../Modal/DocumentReview/DocumentReviewModalBrowse";
import Level from "../common/Level";

type DocumentCard = {
  document: Document;
  onResetList: any;
};
const DocumentCardBrowse: React.FC<DocumentCard> = ({
  document,
  onResetList,
}) => {
  const [hoverCard, setHoverCard] = useState(false);
  const [openReview, setOpenReview] = useState(false);
  const [urlImg, setUrlImg] = useState<any>();
  const [isAuth, setIsAuth] = React.useState(false);
  const bg = useColorModeValue("white", "#1A202C");
  const bgOpacity = useColorModeValue("blackAlpha.500", "black");

  const fetchImage = async (doc: Document) => {
    try {
      const response = await fetch(
        `http://localhost:8080/doc/preview/cover/${doc.documentId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${getCookie("token")}`, // Add an authorization header if required
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setUrlImg(url);
      } else {
        throw new Error("Failed to fetch image");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const onActionDoc = () => {
    onResetList();
    setOpenReview(false);
  };

  useEffect(() => {
    fetchImage(document);
  }, []);

  useEffect(() => {
    console.log("url" + urlImg);
  }, [urlImg]);
  return (
    <Card
      className="w-[350px] h-50"
      nonce={undefined}
      onResize={undefined}
      onResizeCapture={undefined}
    >
      {document ? (
        <DocumentReviewModalBrowse
          onResetList={onActionDoc}
          open={openReview}
          document={document}
          handleClose={() => {
            setOpenReview(false);
          }}
          urlImg={urlImg}
        ></DocumentReviewModalBrowse>
      ) : (
        ""
      )}
      <CardHeader
        shadow={false}
        floated={false}
        className="h-[200px]"
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <Flex
          zIndex={1}
          className="relative w-full flex justify-start pl-2 top-2"
          color=""
        >
          <Flex
            className="absolute rounded-[8px]  flex justify-center content-center"
            bg={bgOpacity}
          >
            <Tag
              size={"sm"}
              fontWeight={"extrabold"}
              key={"sm"}
              variant="solid"
              colorScheme={bgOpacity}
            >
              {formatTimeToNow(new Date(document.time))}
            </Tag>
          </Flex>
        </Flex>

        <Flex
          zIndex={1}
          className="relative w-full flex justify-start pl-2 top-[148px]"
        >
          <Flex
            className="absolute flex justify-start content-center"
            bg={bgOpacity}
          >
            <Tag
              size={"md"}
              key={"md"}
              variant="solid"
              className="bg-white"
              rounded={0}
            >
              <div className="flex items-center absolute gap-2">
                <div>
                  <Stack direction="row" className="pr-1">
                    <Level point={document.authorPoints}></Level>
                  </Stack>
                  <Typography
                    variant="small"
                    color="white"
                    className="text-[12px] bg-black font-semibold "
                    nonce={undefined}
                    onResize={undefined}
                    onResizeCapture={undefined}
                  >
                    {document.author}
                  </Typography>
                </div>
              </div>
            </Tag>
          </Flex>
        </Flex>

        <Flex zIndex={0} className="relative">
          <img src={urlImg} alt="Your Image" className="w-full h-auto" />

          <div className="absolute inset-0 bg-black bg-opacity-25"></div>
        </Flex>
      </CardHeader>
      <CardBody
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <div className="mb-2 flex items-center justify-start">
          <Typography
            color="blue-gray"
            className="font-medium text-start font-semibold  "
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
          >
            {document.documentName}
          </Typography>
          <Typography
            color="blue-gray"
            className="font-medium"
            nonce={undefined}
            onResize={undefined}
            onResizeCapture={undefined}
            children={undefined}
          ></Typography>
        </div>
        <Typography
          variant="small"
          color="gray"
          className="font-normal opacity-75 h-[50px]"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          <p className="line-clamp-3">{document.description}</p>
        </Typography>
      </CardBody>
      <CardFooter
        className="pt-0"
        nonce={undefined}
        onResize={undefined}
        onResizeCapture={undefined}
      >
        <Button
          onMouseMove={() => setHoverCard(true)}
          onMouseLeave={() => setHoverCard(false)}
          onClick={() => {
            setOpenReview(true);
          }}
          ripple={false}
          fullWidth={true}
          className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100"
          nonce={undefined}
          onResize={undefined}
          onResizeCapture={undefined}
        >
          {hoverCard ? (
            <div className="w-full flex justify-center">
              {" "}
              <LuView className="w-[15px] h-[15px]" />
            </div>
          ) : (
            "Duyệt ngay"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DocumentCardBrowse;
