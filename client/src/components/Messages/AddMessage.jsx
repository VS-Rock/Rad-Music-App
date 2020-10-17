import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Form, Button, Upload, Input,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';


export default function AddMessage({ user, showId }) {
  const [text, setText] = useState({});
  const [userId, setUserId] = useState(null);
  const [fileList, setFileList] = useState([]);
  
  const getUserId = () => {
    const url = `/api/messages/name/${user}`;
    axios.get(url)
      .then((result) => {
        setUserId(result.data);
      })
      .catch((err) => console.error(err));
  };

  const normFile = e => {
    if (Array.isArray(e)) {
      return e;
    }
    console.log('Upload event:', e, "&&&&&&&&", e.fileList);
    return e && e.fileList;
  };
  const onFinish = values => {
    console.log('Received values of form: 32', values);
    setText(values.text);
    console.log('Received text of form: 33', text);
    console.log('Received fileList of form: 34', fileList);
    console.log(`${process.env.REDIRECT}/api/messages/post`);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };
  const before = () => {
    console.log(before);
    return true;
  }

  const onPreview = async file => {
    console.log('OnPreview, 42');
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  useEffect(() => {
    getUserId();
  }, []);

  return (
    <Form
      name="messagePost"
      onFinish={onFinish}
    >
      <Form.Item name="text" label="Introduction">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Dragger">
        <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
          <ImgCrop rotate>
            <Upload
              action={`${process.env.REDIRECT}api/messages/post`}
              listType="picture-card"
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              beforeUpload={before}
            >
              {fileList.length < 2 && '+ Upload'}
            </Upload>
          </ImgCrop>
        </Form.Item>
      </Form.Item>
      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}
