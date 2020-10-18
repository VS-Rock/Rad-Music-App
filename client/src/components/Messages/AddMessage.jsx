import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import {
  Form, Button, Upload, Input, message, notification,
} from 'antd';
import ImgCrop from 'antd-img-crop';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';

export default function AddMessage({ user, showId, getMessage }) {
  const [text, setText] = useState('');
  const [userId, setUserId] = useState(null);
  const [form] = Form.useForm();
  const [photoList, setPhotoList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [counter, setCounter] = useState(0);
  const [urls, setUrls] = useState([]);

  const getUserId = () => {
    const url = `/api/messages/name/${user}`;
    axios.get(url)
      .then((result) => {
        setUserId(result.data);
      })
      .catch((err) => console.error(err));
  };

  const uploadPhotos = (photoString) => {
    axios.post('/api/messages/post/photos', {
      picture: photoString,
    })
      .catch((err) => console.error(err));
  };

  const buildRequestsWithPhotos = (list, message) => {
    const url = '/api/messages/post/photos';
    const reqArr = list.map((item) => {
      const type = axios.post(url, { picture: item });
      return type;
    });
    axios.all(reqArr)
      .then(axios.spread((...responses) => {
        const responsesArr = responses.map(rtn => rtn.data.data.url);
        const responsesStr = responsesArr.join(',');
        axios.post('/api/messages/post/message', {
          text: message,
          userId,
          showId,
          pictures: responsesStr,
        })
          .then(() => {
            // getMessage();
            form.resetFields();
            setFileList([]);
            setText('');
          });
      }))
      .catch(error => console.error(error));
  };
  const buildRequestsWithoutPhotos = (message) => {
    axios.post('/api/messages/post/message', {
      text: message,
      userId,
      showId,
    })
      .then(() => {
        getMessage();
        form.resetFields();
        setFileList([]);
        setText('');
      })
      .catch(error => console.error(error));
  };

  const onFinish = (values) => {
    const list = fileList.map((obj) => obj.thumbUrl);
    console.log(list, 'list');
    list.length > 0 ? buildRequestsWithPhotos(list, values.text) : buildRequestsWithoutPhotos(values.text);
  };

  const onChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const openNotificationWithIcon = (type, text) => {
    notification[type]({
      message: 'Upload Error',
      description: text,
      placement: 'bottomLeft',
    });
  };

  const before = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      openNotificationWithIcon('error', 'You can only upload JPG/PNG file!');
      setFileList([]);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      openNotificationWithIcon('error', 'Image must smaller than 2MB!');
      setFileList([]);
    }
    return isJpgOrPng && isLt2M;
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
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
      form={form}
    >
      <Form.Item name="text" label="Message">
        <Input.TextArea />
      </Form.Item>
      <Form.Item label="Upload a Pic">
        <Form.Item valuePropName="fileList">
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
