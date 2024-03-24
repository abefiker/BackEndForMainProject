const { Note } = require('../src/mongodb')
exports.createNote = async (req, res) => {
    try {
        const note = await Note.create(req.body)
        res.status(201).json({
            status: 'success',
            data: note
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}
exports.getAllNote = async (req, res) => {
    try {
        const note = await Note.find(req.body)
        res.status(200).json({
            status: 'success',
            data: note
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}
exports.getNote = async (req, res) => {
    try {
        const note = await Note.findOne({ _id: req.params.id })
        res.status(200).json({
            status: 'success',
            data: note
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}
exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: 'success',
            data: note
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}
exports.deleteNote = async (req, res) => {
    try {
        await Note.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (error) {
        res.status(404).json({
            status: 'fail',
            message: error.message
        })
    }
}