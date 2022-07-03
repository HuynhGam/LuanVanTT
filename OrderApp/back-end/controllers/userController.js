const TaiKhoan = require("../models/accModel")
const ThongTin = require("../models/userModel")  
const CuaHang = require("../models/storeModel")
const Shipper = require("../models/shipperModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const sendReset = require('./sendReset')
const sendActive = require('./sendActive')

const {CLIENT_URL} = process.env
  
const userCtrl = {

    register: async(req, res) => {
        try{
            const {Email, MatKhau, checked} = req.body

            if(!Email || !MatKhau)
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
            if(!validateEmail(Email))
            {
                return res.status(400).json({msg: "Email bạn nhập không hợp lệ"})
            }
           
            const user = await TaiKhoan.findOne({Email})
            if(user)
            {
                return res.status(400).json({msg:"Email này đã được đăng ký"})
            }        
            if(MatKhau.length <6)
            {
                return res.status(400).json({msg:"Mật khẩu phải ít nhất 6 ký tự"})
            }

        // Hàm băm password
            const passwordHash = await bcrypt.hash(MatKhau, 12)
            if(checked == false)
            {
                const newUser = {
                       Email, MatKhau: passwordHash
                    }
                const activation_token = createActivationToken(newUser) //Tạo token để xác nhận qua mail

            // Gửi mail xác nhận
                const url = `${CLIENT_URL}/activate/${activation_token}`
                sendMail(Email, url, "Xác nhận địa chỉ email")
                res.json({msg: "Hãy kiểm tra email của bạn để hoàn tất"})
            }
            else
            {
                const newUser = {
                    Email, MatKhau: passwordHash, VaiTro: 2
                 }
             const activation_token = createActivationToken(newUser) //Tạo token để xác nhận qua mail
            // Gửi mail xác nhận
             const url = `${CLIENT_URL}/activate/${activation_token}`
             sendMail(Email, url, "Xác nhận địa chỉ email")
             res.json({msg: "Hãy kiểm tra email của bạn để hoàn tất"})
            }

        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },     

    activateEmail: async (req, res) => {
        try{
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)
            const {Email, MatKhau, VaiTro} = user

            const check = await TaiKhoan.findOne({Email})
            if(check) 
            {
                return res.status(400).json({msg:"Email này đã được đăng ký"})
            }
            else
            {
                if(user.VaiTro == 2) // seller
                {
                const newAcc = new TaiKhoan({
                    Email, MatKhau, VaiTro
                })
                await newAcc.save()
                }
                else{
                    const newAcc = new TaiKhoan({
                        Email, MatKhau, VaiTro
                    })
                    await newAcc.save()
                    const newUser = new ThongTin({Email}) // lưu email vào collection ThongTin nếu là user
                    await newUser.save()
                }
                res.json({msg: "Xác minh tài khoản thành công"})
            }

        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    login: async (req, res) => {
        try{
            const {Email, MatKhau} = req.body 
            if(!Email || !MatKhau)
            {
                return res.status(400).json({msg:"Bạn chưa nhập email hoặc mật khẩu"})
            }
            const user = await TaiKhoan.findOne({Email})
            if(!user){
                return res.status(400).json({msg:"Email này không tồn tại"})
            }  
            // Giải mã hàm băm mật khẩu
            const isMatch = await bcrypt.compare(MatKhau, user.MatKhau)
            if(!isMatch)
            {
                return res.status(400).json({msg:"Mật khẩu không chính xác"})
            }
            if(user.TrangThai !=1 ){
                return res.status(400).json({msg:"Tài khoản của bạn hiện tại đã bị khóa. Vui lòng liên hệ oderfood11@gmail.com để được mở khóa lại"})
            }
            const refresh_token = createRefreshToken({id: user.Email})
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 7*24*60*60*1000 // 7 days
            })
            res.status(200).json({
                status: "Đăng nhập thành công",
                data: {
                    VaiTro: user.VaiTro
                }
            })         
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        } 
    },

    getAccessToken: (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if(!rf_token) return res.status(400).json({msg: "Please login now!!!"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
                if(err) return res.status(400).json({msg: "Please login now!"})

                const access_token = createAccessToken({id: user.id})
                res.json({access_token})
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    forgotPassword: async (req, res) => {
        try {
            const {Email} = req.body
            if(!Email)
            {
                return res.status(400).json({msg: "Vui lòng nhập email của bạn"})
            }
            if(!validateEmail(Email))
            {
                return res.status(400).json({msg: "Email bạn nhập không hợp lệ"})
            }
            
            const user = await TaiKhoan.findOne({Email})
            if(!user) return res.status(400).json({msg: "Email này không tồn tại."})

            const access_token = createAccessToken({id: user._id})
            const url = `${CLIENT_URL}/reset/${access_token}`

            sendReset(Email, url, "Cập nhật lại mật khẩu của bạn")
            res.json({msg: "Hãy kiểm tra email của bạn để hoàn tất"})
            

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    resetPassword: async (req, res) => {
    try {   
          const {MatKhau} = req.body
          if(!MatKhau)
            {
                return res.status(400).json({msg: "Vui lòng nhập mật khẩu của bạn"})
            }
          if(MatKhau.length <6)
            {
                return res.status(400).json({msg:"Mật khẩu phải ít nhất 6 ký tự"})
            }
          const passwordHash = await bcrypt.hash(MatKhau, 12)

          await TaiKhoan.findOneAndUpdate({_id: req.user.id}, {
              MatKhau: passwordHash
          })
          res.json({msg: "Cập nhật mật khẩu thành công "})
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
    }, 

    changePassword: async (req, res) => {
        try {
            const {MatKhauCu, MatKhauMoi} = req.body
        // Kiểm tra điều kiện từ bên client 
            if(!MatKhauCu || !MatKhauMoi)
            {
                return res.status(400).json({msg: "Bạn hãy nhập đủ thông tin dưới đây"})
            }
            if(MatKhauCu === MatKhauMoi){
                return res.status(400).json({msg: "Bạn không thể đổi mật khẩu bạn đang sử dụng"})
            }
            if(MatKhauMoi.length <6){
                return res.status(400).json({msg:"Mật khẩu phải ít nhất 6 ký tự"})
            }
        //Khởi tạo user để lấy mật khẩu của user
            const user = await TaiKhoan.findOne({_id: req.params.id})
            if(user){
                const check_pass = await bcrypt.compare(MatKhauCu, user.MatKhau) // Giải mã băm mật khẩu cũ
                if(check_pass)
                 {
                    const newHash = await bcrypt.hash(MatKhauMoi, 12) // Băm mật khẩu mới
                    await TaiKhoan.findOneAndUpdate({_id: req.params.id}, {MatKhau: newHash}) //Update
                    res.json({msg: "Đã thay đổi mật khẩu!"})
                 }
                 else{
                    return res.status(400).json({msg: "Mật khẩu cũ của bạn không chính xác"})
                 }
            }
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }, 

    getUser: async (req, res) => {
        try {
             const role = await TaiKhoan.findOne({Email: req.user.id}).select('-MatKhau')
             const user = await ThongTin.findOne({Email: req.user.id}).select('-Email')

            res.json({role, user})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getUsersAllInfor: async (req, res) => {
        try {
            const users = await TaiKhoan.aggregate(
                [
                    { 
                        "$project" : { 
                            "taikhoans" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "taikhoans.Email", 
                            "from" : "thongtins", 
                            "foreignField" : "Email", 
                            "as" : "thongtins"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$thongtins", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "taikhoans.VaiTro" : 1
                        }
                    }, 
                    { 
                        "$project" : { 
                            "Email" : "$taikhoans.Email", 
                            "TrangThai" : "$taikhoans.TrangThai", 
                            "Ten" : "$thongtins.Ten", 
                            "_id" : "$taikhoans._id"
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            const sellers = await TaiKhoan.find({ "VaiTro" : 2}).select("-MatKhau")     

            res.json({users, sellers})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getStoresAllInfor: async (req, res) => {
        try {
            const stores =  await CuaHang.find({Email: req.params.id})
            res.json(stores)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getStores: async (req, res) => {
        try {
            const stores =  await CuaHang.find({Email: req.user.id})
            res.json(stores)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateUserInfor:  async(req, res) => {
        try {
            const {Ten, SDT} = req.body
            if(!Ten || !SDT){
                return res.status(400).json({msg: "Vui lòng nhập địa chỉ của bạn"})
            }
            await ThongTin.findByIdAndUpdate(req.params.id, {Ten, SDT});
            res.json({msg: "Cập nhật thành công"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    updateInfor: async (req, res) => {
        try {
            const {Email, TrangThai} = req.body
            if(!Email || !TrangThai)
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            } 
            
            await TaiKhoan.findByIdAndUpdate({_id: req.params.id}, {Email, TrangThai})
            res.json({msg: "Cập nhật thành công"})      
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    countAccount: async (req, res) => {
        try {
           const count = await TaiKhoan.countDocuments({"VaiTro" : { "$ne" : 0}}) // VaiTro != 0
           const user = await TaiKhoan.countDocuments({"VaiTro" : 1}) // VaiTro = 1
           const seller = await TaiKhoan.countDocuments({"VaiTro" : 2}) // VaiTro = 2
           res.json({count, user, seller})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    addShipper: async(req, res) => {
        try{
            const {HoTen, Email, SDT, GioiTinh, DiaChiHienTai, NgaySinh} = req.body

            if(!HoTen|| !Email || !SDT || !GioiTinh || !DiaChiHienTai || !NgaySinh) 
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
        
            const email = await Shipper.findOne({Email})
            const Ten = await Shipper.findOne({HoTen})
            if(email && Ten)
            {
                return res.status(400).json({msg:"Người này đã tồn tại"})
            }
            else{        
                //Tạo user mới
                const newShipper = {
                    HoTen, Email, SDT, GioiTinh, DiaChiHienTai, NgaySinh  
                }  

                await Shipper.create(newShipper); //Lưu vào DB

                const newEmail = {
                    Email, MatKhau: "$2b$12$yZC1NlyiWY1DnapJWnP56uGCfdyBQXtAZ.oEAvnhViTa425T5wr46", VaiTro: 3 // Mật khẩu mặc định là: 123456
                }  

                await TaiKhoan.create(newEmail); //Lưu vào DB
                sendActive(Email)

                res.json({msg: "Thêm thành công"})
            }
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    getShipperInfor: async (req, res) => {
        try {
            const shippers = await TaiKhoan.aggregate(
                [
                    { 
                        "$project" : { 
                            "taikhoans" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "taikhoans.Email", 
                            "from" : "shippers", 
                            "foreignField" : "Email", 
                            "as" : "shippers"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$shippers", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "taikhoans.VaiTro" : 3
                        }
                    }, 
                    { 
                        "$project" : { 
                            "HoTen" : "$shippers.HoTen", 
                            "Email" : "$taikhoans.Email", 
                            "GioiTinh" : "$shippers.GioiTinh", 
                            "SDT" : "$shippers.SDT", 
                            "TrangThai" : "$taikhoans.TrangThai", 
                            "DiaChi" : "$shippers.DiaChiHienTai", 
                            "_id" : "$shippers._id"
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );

            res.json(shippers)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    resetPasswordShipper: async(req, res) => {
        await TaiKhoan.findOneAndUpdate({Email: req.params.id}, {
            MatKhau: "$2b$12$yZC1NlyiWY1DnapJWnP56uGCfdyBQXtAZ.oEAvnhViTa425T5wr46" // 123456
        })
        res.json({msg: "Cập nhật mật khẩu thành công "})
    },

    updateShipperInfor: async (req, res) => {
        try {
            const {HoTen, Email, SDT, TrangThai} = req.body
            if(!HoTen || !Email || !SDT || !TrangThai)
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            } 
            await Shipper.findByIdAndUpdate({_id: req.params.id}, {HoTen, Email, SDT})
            await TaiKhoan.findOneAndUpdate({Email: Email}, {Email, TrangThai})
            res.json({msg: "Cập nhật thành công"})      
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', {path: 'http://localhost:5000/user/refresh_token'})
            return res.json({msg: "Đã đăng xuất."})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
}

// Kiểm tra tính hợp lệ của email
function validateEmail(Email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(Email);
}

// Kiểm tra tính hợp lệ của số điện thoại chỉ là số và có 10 ký tự
function validateNumberPhone(sdt) {
    const re = /^\d{10}$/;
    return re.test(sdt);
}

// Khởi tạo token dựa trên user và giới hạn tối đa thời gian là 5'
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'})
} // Khởi tạo token với thời gian tối đa là 7 ngày

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
} // Khởi tạo token refresh và giới hạn tối đa thời gian là 7 ngày
module.exports = userCtrl