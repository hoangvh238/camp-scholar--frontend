import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useColorModeValue
} from "@chakra-ui/react";



import {
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
  Typography
} from "../../common/common";

import { Bill, Exchange } from "@/atoms/userAtom";
import { RootState } from "@/redux/store";
import { Table, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from "react";
import { BsPaypal } from "react-icons/bs";
import { GiReceiveMoney } from "react-icons/gi";
import { useSelector } from "react-redux";
import { getAllBill, getAllExchange } from "../../../../apis/bill";
import { exchangeMoney } from "../../../../apis/paypal";
import { getCoint } from "../../../../apis/profile";
import PaypalBtn from "./PaypalButton";

type DocumentReviewModal = {
  open: boolean;
  handleClose: () => void;
};

interface DataType {
  time: Date;
  coins: number,
  type: string,
  status: number
}

const PaymentModal: React.FC<DocumentReviewModal> = ({
  open,
  handleClose,
}) => {
  const CoinToDollarRatio = 20;

  const [accept, setAccept] = useState(false);
  const bg = useColorModeValue("gray.100", "#1A202C");
  const textColor = useColorModeValue("gray.500", "gray.400");

  const user = useSelector((state: RootState) => state.userInfor.currentUser)

  const [dollarValue, setDollarValue] = useState(1);
  const [coinValue, setCoinValue] = useState(dollarValue * CoinToDollarRatio);
  const [activeTab, setActiveTab] = React.useState("manager");
  const [hoverTabBtn, setHoverTabBtn] = React.useState("");
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [coins, setCoins] = useState(0);

  const getCurrenCoins = async () => {
    try {
      const rest = await getCoint();
      setCoins(rest.data.data)
    }
    catch (error) {
      console.log(error);

    }

  }
  const exchange = async () =>{
    try
    {
       await exchangeMoney(coinValue,dollarValue);
       message.success("Quy đổi thành công !");
       message.info("Vui lòng chờ ADMIN duyệt");
    }
    catch(error)
    {
      message.error("Quy đổi thất bại");
      console.log(error);
      
    }
  }

  const getStatusBoard = async () => {
    try {
      const resBuy = await getAllBill(user.userId);
      const resEx = await getAllExchange();
      const buyStatus: Bill[] = resBuy.data.data;
      const exchangeStatus: Exchange[] = resEx.data;

      let dataSource: DataType[] = [];
      buyStatus.forEach(element => {
        const data: DataType = {
          time: element.time,
          coins: element.amountToken,
          type: "Nạp",
          status: 1
        }
        dataSource.push(data);
      });
      exchangeStatus.forEach(element => {
        const data: DataType = {
          time: element.time,
          coins: element.amountCoins,
          type: "Rút",
          status: element.status
        }
        dataSource.push(data);
      });

      setDataSource(dataSource);
    }
    catch (error) {
      console.log(error);

    }

  }


  const columns: ColumnsType<DataType> = [
    {
      title: 'Thời gian',
      sorter: (a, b) => {
        const timeA = a.time ? new Date(a.time) : new Date(); // Parse a.time as a Date
        const timeB = b.time ? new Date(b.time) : new Date(); // Parse b.time as a Date
        return timeA.getTime() - timeB.getTime();
      },
      dataIndex: 'time',
      render: (time) => {
        if (time) {
          const date = new Date(time);
          const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
          const hours = date.getHours().toString().padStart(2, '0'); // Format hours with leading zero
          const minutes = date.getMinutes().toString().padStart(2, '0'); // Format minutes with leading zero
          return   <div>
          {formattedDate}
          <br />
          <span className="font-bold">{`${hours}:${minutes}`}</span>
        </div>;
        }
        return ''; // Handle the case where time is not valid
      },
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      render: (type) => {
        return (
          <span style={{ color: type === "Nạp" ? "green" : "orange" , fontWeight:'bold'}}>
            {type}
          </span>
        );
      },
    },
    
    {
      title: 'Xu',
      dataIndex: 'coins',
      render: (coins, record) => {
        const sign = record.type === "Nạp" ? "+" : "-";
        return (
          <span style={{ color: record.type === "Nạp" ? "green" : "orange", fontWeight: 'bold' }}>
            {`${sign}${coins} Xu`}
          </span>
        );
      },
      sorter: {
        compare: (a, b) => a.coins - b.coins,
        multiple: 3,
      },
    },
    
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      sorter: (a, b) => {
        // Define a mapping of status values to numeric values for sorting
        const statusMapping: { [key: string]: number } = {
          '-1': -1,  // 'banned' maps to -1
          '0': 0,    // 'waiting' maps to 0
          '1': 1     // 'success' maps to 1
        };
        
    
        // Get the numeric values of status for comparison
        const statusA = statusMapping[a.status.toString()] || 0;
        const statusB = statusMapping[b.status.toString()] || 0;
    
        return statusA - statusB;
      },
      render: (status) => {
        let color;
        let displayMessage;
    
        if (status === 1) {
          color = 'green';
          displayMessage = 'Thành công';
        } else if (status === -1) {
          color = 'red'; // You can use a different color for 'banned' status
          displayMessage = 'Banned';
        } else {
          color = 'blue';
          displayMessage = 'Đang chờ';
        }
    
        return <span style={{ color, fontWeight: 'bold' }}>{displayMessage}</span>;
      },
    }
    

  ];


  const handleDollarChange = (value: number) => {
    if (Number.isNaN(value)) value = 1;
    setDollarValue(value);
  };

  const handleCoinChange = (value: number) => {
    if (Number.isNaN(value)) value = 20;
    setCoinValue(value);

  };


  const handleCofirm = () => {
    setAccept(true);
  }

  useEffect(() => {
    if (activeTab == "manager") getCurrenCoins();
    if (activeTab == "flow") getStatusBoard();
  }, [activeTab, open])


  const renderUserInfo = () => {
    return <Card className="w-full max-w-[23rem] min-w-[23rem] border-t-2" >
      <CardHeader floated={false} className="h-40 hover:scale-105" >
        <Flex flexDirection={"column"} height={"full"} width={"full"}>
          <Typography variant="lead" color="blue-gray" className="mb-2 text-center" >
            Số dư khả dụng
          </Typography>
          <Typography variant="h1" color={coins > 0 ? "blue-gray" : "red"} className="mb-2 text-center" >
            {coins} Xu
          </Typography>
        </Flex>

      </CardHeader>
      <CardBody className="text-center" >
        <Flex justifyContent={"space-between"}>
          <Tab
            className="w-[48%]"
            key={1}
            value={hoverTabBtn}
            onClick={() => setActiveTab("buy")}
            onMouseLeave={() => setHoverTabBtn("")}
            onMouseMove={() => setHoverTabBtn("buy")}
     >
            <Button style={{ whiteSpace: 'nowrap' }} color="green" variant="gradient" className="w-[100%] rounded-[10px] px-[55px] py-7 ">Nạp xu</Button>
          </Tab>
          <Tab
            className="w-[48%] h-full"
            key={1}
            value={hoverTabBtn}
            onClick={() => setActiveTab("exchange")}
            onMouseLeave={() => setHoverTabBtn("")}
            onMouseMove={() => setHoverTabBtn("exchange")}
            >
            <Button style={{ whiteSpace: 'nowrap' }} color="deep-orange" variant="gradient" className="w-[100%] rounded-[10px] px-[45px] py-7 " >Rút tiền</Button>
          </Tab>

        </Flex>
      </CardBody>
    </Card>

  }
  const renderBuyCoins = () => {
    return (<Card className="w-full max-w-[24rem]" >
      <CardHeader
        color="blue"
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center px-4 py-8 text-center" >
        <div className="mb-8 h-20 p-6 text-white">
          <BsPaypal className="h-20 w-20" />
        </div>
        <Typography variant="h5" color="white">
          Thanh toán bằng PayPal
        </Typography>
      </CardHeader>
      <CardBody >
        <form className="mt-1 flex flex-col gap-4">

          <div className="my-3">

            <div className="my-4 flex items-center gap-4">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"                            >
                  Số Xu <span className="text-[12px] text-red-200  ">*tối thiểu 20 xu</span>
                </Typography>
                <NumberInput
                  defaultValue={coinValue}
                  value={coinValue + " Xu"}
                  min={20}
                  max={10000}
                  onChange={(valueString) => handleCoinChange(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"                            >
                  Thành tiền <span className="text-[12px] text-red-200  ">*tối thiểu 1$</span>
                </Typography>
                <NumberInput
                  min={1}
                  max={10000}
                  value={dollarValue + " $"}
                  defaultValue={dollarValue}
                  onChange={(valueString) => handleDollarChange(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            </div>

          </div>
          {accept ? <div> <PaypalBtn userId={user.userId} dolar={dollarValue}></PaypalBtn></div> :
            <>
              <Button color="light-blue" className="rounded-[10px]" variant="gradient" onClick={handleCofirm} >
                Thanh toán
              </Button>
            </>}
          <Typography
         
            variant="small"
            color="gray"
            className="mt-2 flex items-center justify-center gap-2 font-medium opacity-60"
          >
            <LockClosedIcon className="-mt-0.5 h-4 w-4" /> Thanh toán an toàn và tiện lợi
          </Typography>
        </form>
      </CardBody>
    </Card>)
  }

  const renderExchange = () => {
    return (<Card className="w-full max-w-[24rem]" >
      <CardHeader
        color="deep-orange"
        floated={false}
        shadow={false}
        className="m-0 grid place-items-center px-4 py-8 text-center"                   >
        <div className="mb-8 h-20 p-6 text-white">
          <GiReceiveMoney className="h-20 w-20" />
        </div>
        <Typography variant="h5" color="white" >
          Quy đổi thành tiền
        </Typography>
      </CardHeader>
      <CardBody >
        <form className="mt-1 flex flex-col gap-4">


          <div className="my-3">

            <div className="my-4 flex items-center gap-4">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"                           >
                  Số Xu <span className="text-[12px] text-red-200  ">*tối thiểu 30 xu</span>
                </Typography>
                <NumberInput
                  defaultValue={coinValue}
                  value={coinValue + " Xu"}
                  min={30}
                  max={10000}
                  onChange={(valueString) => handleCoinChange(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="mb-2 font-medium"                        >
                  Thành tiền <span className="text-[12px] text-red-200  ">*tối thiểu 1$</span>
                </Typography>
                <NumberInput
                  min={1}
                  max={10000}
                  value={dollarValue + " $"}
                  defaultValue={dollarValue}
                  onChange={(valueString) => handleDollarChange(parseFloat(valueString))}
                >
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </div>
            </div>

          </div>
          <Button onClick={()=>{exchange()}} color="deep-orange" className="rounded-[10px]" variant="gradient">
            Quy đổi
          </Button>
        </form>
      </CardBody>
    </Card>)
  }

  const paginationConfig = {
    pageSize: 4, // Số mục trên mỗi trang
    showTotal: (total: any, range: any[]) => `${range[0]}-${range[1]} của ${total} giao dịch`, // Hiển thị thông tin tổng số mục
  };

  const renderManagerUser = () => {
    return (   <Table pagination={paginationConfig} className="w-full" columns={columns} dataSource={dataSource} />)
  }


  const data = [
    {
      label: "Quản Lý xu",
      value: "manager",
      desc: renderUserInfo(),
    },
    {
      label: "Nạp xu",
      value: "buy",
      desc: renderBuyCoins(),
    },
    {
      label: "Đổi tiền",
      value: "exchange",
      desc: renderExchange(),
    },
    {
      label: "Giao dịch",
      value: "flow",
      desc: renderManagerUser(),
    },
  ];


  useEffect(() => {
    console.log(dollarValue);
    setCoinValue(dollarValue * CoinToDollarRatio);
  }, [dollarValue])
  useEffect(() => {
    setDollarValue(coinValue / CoinToDollarRatio);
  }, [coinValue])

  useEffect(() => {
    setAccept(false);
  }, [dollarValue])


  return (
    <>

      <Modal isOpen={open} onClose={handleClose} size="lg">
        <ModalOverlay />
        <ModalContent>

          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            <ModalCloseButton />
          </ModalHeader>
          <ModalBody display="flex" flexDirection="column">
            <div className='container flex items-center  max-w-xl mx-auto relative'>
              <Tabs value={activeTab}>
                <TabsHeader
                  className="rounded-none border-b border-blue-gray-50 bg-transparent p-0 w-full absolute top-10 left-0"
                  indicatorProps={{
                    className: "bg-transparent border-b-2 border-gray-900 shadow-none rounded-none",
                  }}
             >
                  {data.map(({ label, value }) => (
                    <Tab
                      key={value}
                      value={value}
                      onClick={() => setActiveTab(value)}
                      className={activeTab === value ? "text-gray-900 font-bold" : ""}
                  >
                      {label}
                    </Tab>
                  ))}
                </TabsHeader>
                <TabsBody
                  className="w-full h-full flex content-center justify-center mt-20"
            >
                  {data.map(({ value, desc }) => (
                    <TabPanel className="w-full" key={value} value={value}>
                      {desc}
                    </TabPanel>
                  ))}
                </TabsBody>
              </Tabs>

            </div>
          </ModalBody>
        </ModalContent>
      </Modal >
    </>
  );
};
export default PaymentModal;



