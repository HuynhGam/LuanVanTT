const TaiKhoan = require('../models/userModel')

const authSeller = async (req, res, next) => {
    try {
        const role = await TaiKhoan.findOne({Email: req.user.id})

        if(role.VaiTro !== 2) 
            return res.status(500).json({msg: "Chức năng này chỉ người bán được phép truy cập."})
        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authSeller