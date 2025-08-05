const express = require('express');
const auth = require('../middleware/auth');
const {
  createFile,
  getFile,
  updateFile,
  deleteFile
} = require('../controllers/fileController');

const router = express.Router();

router.post('/', auth, createFile);
router.get('/:id', auth, getFile);
router.put('/:id', auth, updateFile);
router.delete('/:id', auth, deleteFile);

module.exports = router; 