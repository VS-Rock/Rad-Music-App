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

  const parse = async (photoArr, message) => {
    //loop and call upload phots to get an array of urls
    try {
      const newUrlsArr = await photoArr.map(photo => uploadPhotos(photo));
      console.log('newUrlsArr', newUrlsArr);
      // console.log('newUrlsArr', newUrlsArr.data);
    } catch (err) {
      console.error(err);
    }
  };
  // join the array and save to db
  // split and loop in message
  const uploadPhotos = (photoString) => {
    axios.post('/api/messages/post/photos', {
      picture: photoString,
    })
      // .then((res) => {
      //   const { url } = res.data.data;
      //   console.log('url', url);
      //   axios.post('/api/messages/post/message', {
      //     text: message,
      //     userId,
      //     showId,
      //     pictures: url,
      //   })
      //     .then((rtn) => {
      //       console.log('message create response', rtn);
      //       // message reload will catch in the setimeout or infinate useEffect
      //       getMessage();
      //       form.resetFields();
      //       setFileList([]);
      //       setText('');
      //     });
      // })
      .catch((err) => console.error(err));
  };
  const onFinish = (values) => {
    const list = fileList.map((obj) => obj.thumbUrl);
    // const str = list.join(',');
    // setPhotoList(str);
    // setText(values.text);
    parse(list, values.text);
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
