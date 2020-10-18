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

  const normFile = (e) => { // not used
    if (Array.isArray(e)) {
      return e;
    }
    console.log('Upload event:', e, '&&&&&&&&', e.fileList);
    return e && e.fileList;
  };
  const uploadPhotos = (photoString) => {
    axios.post('/api/messages/post/photos', {
      picture: photoString,
    })
      .catch((err) => console.error(err));
  };

  const buildRequests = (list, message) => {
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
          .then((rtn) => {
            console.log('message create response', rtn);
            // message reload will catch in the setimeout or infinate useEffect
            getMessage();
            form.resetFields();
            setFileList([]);
            setText('');
          });
      }));
  };

  const onFinish = (values) => {
    const list = fileList.map((obj) => obj.thumbUrl);
    // const str = list.join(',');
    // setPhotoList(str);
    // setText();
    buildRequests(list, values.text);
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
