const { Router } = require('express');
const { cloudinary } = require('../utils/cloudinary');

const Pictures = Router();

Pictures.get('/', async (req, res) => {
  const { resources } = await cloudinary
    .search
    .expression('folder: radma')
    .sort_by('public_id', 'desc')
    .max_results(30)
    .execute();
  const publicIds = resources.map((file) => file.public_id);
  console.log(resources);
  res.send(publicIds);
});

Pictures.post('/', async (req, res) => {
  try {
    const fileStr = req.body.data;
    const uploadedRes = await cloudinary.uploader
      .upload(fileStr, {
        upload_preset: 'radma',
      });
    // console.log('PICTURE UPLOAD OBJECT', uploadedRes);
    res.json({ msg: 'UPLOADED' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'ERROR IN UPLOADING TO CLOUDINARY' });
  }
});

module.exports = {
  Pictures,
};
