// Xác minh Admin

const TaiKhoan = require('../models/userModel')

const authAdmin = async (req, res, next) => {
    try {
        const role = await TaiKhoan.findOne({Email: req.user.id})

        if(role.VaiTro !== 0) 
            return res.status(500).json({msg: "Chức năng này chỉ quản trị viên được phép truy cập."})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin