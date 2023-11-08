import { InboxOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import {
  Button, Form,
  Input,
  InputNumber, message, Space, Upload
} from 'antd';
import axios from 'axios';
import { getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

type Document = {
    documentName: string;
    description: string;
    time: Date;
    cost: number
}

const { Dragger } = Upload;

type DocumentProps = {
    groupID: number;
};

const DocumentUpload: React.FC<DocumentProps> = ({ groupID }) => {
    const [fileList, setFileList] = useState<any[]>([]); // Sử dụng useState để lưu danh sách các file
    const router = useRouter();
    const formItemLayout = {
        labelCol: {
            xs: { span: 24 },
            sm: { span: 6 },
        },
        wrapperCol: {
            xs: { span: 24 },
            sm: { span: 14 },
        },
    };


    const handleUpload = async () => {

    };

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        fileList: fileList, // Gán danh sách file vào fileList
        beforeUpload: (file) => {
            const isPDF = file.type === 'application/pdf';
            const isWord = file.type.includes('word');

           
            return (isPDF || isWord) || Upload.LIST_IGNORE;
        },
        onChange(info) {
            setFileList(info.fileList); // Cập nhật danh sách file khi có sự thay đổi
            const { status } = info.file;
        
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };


    const onFinish = async (values: any) => {
        const doc: Document = {
            documentName: values.title,
            description: values.depcriptions,
            time: new Date(),
            cost: values.cost,
        }

        const formData = new FormData();
        fileList.forEach((file) => {

            const json = JSON.stringify(doc);
            const blob = new Blob([json], { type: 'application/json' });
            formData.append('documentData', blob, 'application/json');
            formData.append('file', file.originFileObj);
        });

        try {
            const response = await axios.post('http://localhost:8080/doc/document/' + groupID, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${getCookie("token")}`,
                },
            });
            message.success('Đăng tải tài liệu thành công.');
            message.success(`Admin sẽ duyệt bài của bạn trong thời gian ngắn nhất !`);
            router.push("/group/document")
            //   console.log(response.data);
        } catch (error) {
            message.error('File upload failed.');
            console.error(error);
        }
    };

    return (
        <div className='w-full h-full pt-3 bg-white rounded-[10px]'>
            <Form
                name="validate_other"
                {...formItemLayout}
                onFinish={onFinish}
                initialValues={{
                    "cost": 0
                }}
                style={{ maxWidth: 600 }}
            >

                <Form.Item
                    name="title"
                    label="Tên tài liệu :"
                    hasFeedback
                    rules={[{ required: true, message: 'Tên tài liệu không được bỏ trống', type: "string" }]}
                >
                    <Input placeholder="Nhập tên của tài liệu" />
                </Form.Item>

                <Form.Item
                    name="depcriptions"
                    label="Mô tả tài liệu"
                    hasFeedback
                    rules={[{ required: true, message: 'Mô tả tài liệu không được bỏ trống', type: "string" }]}
                >
                    <Input placeholder="Nhập mô tả của tài liệu" />
                </Form.Item>

                <Form.Item label="Nhập giá bán:">
                    <Form.Item name="cost" noStyle>
                        <InputNumber min={0} max={10000} />
                    </Form.Item>
                    <span className="ant-form-text" style={{ marginLeft: 8 }}>
                        Xu
                    </span>
                </Form.Item>
                <Form.Item label="Tài liệu đính kèm :"
                 hasFeedback 
                 rules={[{ required: true, message: 'Tài liệu đính kèm không được bỏ trống', type: "string" }]}>
                    <Dragger {...props} maxCount={1}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined rev={undefined} />
                        </p>
                        <p className="ant-upload-text">Kích hoặc thả file ở khu vực này để đăng tài liệu</p>
                        <p className="ant-upload-hint">
                            Chú ý : chỉ hỗ trợ đăng tài liệu định dạng PDF và WORD nên bạn hãy chú ý loại file khi đăng
                        </p>
                    </Dragger>
                </Form.Item>
                <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
                    <Space>
                        <Button type="dashed" htmlType="submit">
                            Submit
                        </Button>
                        <Button htmlType="reset">reset</Button>
                    </Space>
                </Form.Item>
            </Form>

        </div>
    );
};

export default DocumentUpload;
