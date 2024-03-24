const express = require("express")
const router = express.Router()
const noteCotroller = require("../controller/noteCotroller")
router.route('/').post(noteCotroller.createNote).get(noteCotroller.getAllNote)
router.route('/:id').get(noteCotroller.getNote).patch(noteCotroller.updateNote).delete(noteCotroller.deleteNote)
module.exports = router