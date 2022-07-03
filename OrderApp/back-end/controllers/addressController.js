const Address = require("../models/addressModel")

// Thêm địa chỉ
const addCtrl = {
    addAddress: async(req, res) => {
        try {
            const {id_KH, SoNha, DiaChi} = req.body
            if(!DiaChi){
                return res.status(400).json({msg: "Vui lòng nhập địa chỉ của bạn"})
            }

            const newAddress = {
                id_KH, SoNha, DiaChi
            }

            await Address.create(newAddress); //Lưu vào DB
            res.json({msg: "Thêm thành công"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
// Cập nhật địa chỉ
    updateAddress: async(req, res) => {
        try {
            const {SoNha, DiaChi} = req.body
            if(!DiaChi){
                return res.status(400).json({msg: "Vui lòng nhập địa chỉ của bạn"})
            }
            await Address.findByIdAndUpdate(req.params.id, {SoNha, DiaChi});
            res.json({msg: "Cập nhật thành công"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
// Láy địa chỉ có sẵn 
    getAddress: async(req, res) => {
        try {
            const address = await Address.find({id_KH: req.params.id}).select('-id_KH') // Tìm địa chỉ theo id KH
            res.json(address)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
// Xóa địa chỉ có sẵn 
    removeAddress: async(req, res) => {
        try {
            const address = await Address.findByIdAndDelete(req.params.id)
            res.json({msg: "Thành công"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

module.exports = addCtrl
