'use client'
import { FC, useState } from 'react'
import React from "react";
import { Avatar, Rating } from "@material-tailwind/react";

import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import { Badge, Flex, IconButton, Stack, Tag, useColorModeValue } from '@chakra-ui/react';
import { LuView } from 'react-icons/lu';



const DocumentCard = ({

}) => {

    const [hoverCard,setHoverCard] = useState(false);
    const [rated, setRated] = React.useState(3.5);
    const bg = useColorModeValue("white", "#1A202C");
    const bgOpacity = useColorModeValue("blackAlpha.500", "black");
    return (
        <Card className="w-[350px] h-50" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
            <CardHeader shadow={false} floated={false} className="h-[200px]" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>

                <Flex className='relative w-full flex justify-start pl-2 top-2' color="">
                    <Flex className='absolute rounded-[8px]  flex justify-center content-center' bg={bgOpacity}>
                        <Tag size={"sm"} key={"sm"} variant='solid' colorScheme={bgOpacity}>
                            20 ngày trước
                        </Tag>
                    </Flex>

                </Flex>

                <Flex className='relative w-full flex justify-start pl-2 top-[148px]'>
                    <Flex className='absolute flex justify-start content-center' bg={bgOpacity}>
                    <Tag size={"md"} key={"md"} variant='solid' className='bg-white' rounded={0}>
                            <div className="flex items-center absolute gap-2">

                            <div>
                                <Stack direction='row' className="pr-1"> <Badge colorScheme='yellow'>Chuyên gia</Badge></Stack>
                                <Typography  variant="small" color="white" className="text-[12px] bg-black font-semibold " nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                                    hoangvh238.dev
                                </Typography>
                            </div>
                        </div>
                        </Tag>
                    </Flex>
                    

                </Flex>

                <Flex className='relative w-full flex justify-end pr-2 top-2'>

                    <Flex className='absolute w-[11%] rounded-[8px] h-[123px] flex justify-center content-center' bg={bg}>
                        <Rating value={0} className='flex flex-col absolute w-[5%] h-[5%]' onChange={(value) => setRated(value)} nonce={undefined} onResize={undefined} onResizeCapture={undefined} />

                    </Flex>
                </Flex>
                <img
                    src="https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80://images.https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80.com/photo-1629367494173-c78a56567877?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=927&q=80"
                    alt="card-image"
                    className="h-full w-full object-cover"
                />


            </CardHeader>
            <CardBody nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                <div className="mb-2 flex items-center justify-start">
                    <Typography color="blue-gray" className="font-medium text-start font-semibold  " nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                        Tài liệu toán học và những mẹo giải toán hay nhất
                    </Typography>
                    <Typography color="blue-gray" className="font-medium" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>

                    </Typography>
                </div>
                <Typography
                    variant="small"
                    color="gray"
                    className="font-normal opacity-75 " nonce={undefined} onResize={undefined} onResizeCapture={undefined}
                >
                    <p className="line-clamp-3"> Tài liệu toán học và những mẹo giải toán hay nhất được tổng hợp 1 tỉ nguồn khác nhau cho bạn tha hồ lựa chọn, đủ thể loại các kiểu tính nhanh, chậm hay vâng vâng</p>

                </Typography>
            </CardBody>
            <CardFooter className="pt-0" nonce={undefined} onResize={undefined} onResizeCapture={undefined}>
                <Button
                onMouseMove={()=>setHoverCard(true)} onMouseLeave={()=>setHoverCard(false)}
                    ripple={false}
                    fullWidth={true}
                    className="bg-blue-gray-900/10 text-blue-gray-900 shadow-none hover:scale-105 hover:shadow-none focus:scale-105 focus:shadow-none active:scale-100" nonce={undefined} onResize={undefined} onResizeCapture={undefined}                >
                    {hoverCard ? <div className='w-full flex justify-center'> <LuView className='w-[15px] h-[15px]'/></div>:"100 Coint"}
                   
                </Button>

            </CardFooter>
        </Card>
    )
}

export default DocumentCard
