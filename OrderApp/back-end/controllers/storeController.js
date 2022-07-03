const mongoose = require('mongoose')
const CuaHang = require("../models/storeModel")
const Menu = require("../models/menuModel")
const GioHang = require("../models/cartModel")
const DonHang = require("../models/oderModel")
const ChiTietGioHang = require("../models/detailModel")
const DanhSachYeuCau = require("../models/requestModel")
const Rate = require("../models/rateModel")
const { apigateway } = require("googleapis/build/src/apis/apigateway")
const fullTextSearch = require('fulltextsearch');
var fullTextSearchVi = fullTextSearch.vi;


const storeCtrl = {

    create_store: async(req, res) => {
        try{
            const {TenCH, DiaChi, Email, SDT} = req.body

            if(!TenCH|| !DiaChi || !SDT) 
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
        
            const Ma = await CuaHang.findOne({Email})
            const Ten = await CuaHang.findOne({TenCH})
            if(Ma && Ten)
            {
                return res.status(400).json({msg:"Cửa hàng này đã tồn tại"})
            }        
            //Tạo user mới
            const newShop = {
                TenCH, DiaChi, Email, SDT
            }  

            await CuaHang.create(newShop); //Lưu vào DB

            res.json({msg: "Thêm cửa hàng thành công"})
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },  

    update_store: async(req, res) => {
        try{
            const {TenCH, DiaChi, SDT, TrangThai} = req.body

            if(!TenCH || !DiaChi || !SDT)
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
            // Tìm kiếm và chỉnh sửa
            await CuaHang.findOneAndUpdate({_id: req.params.id}, {
                TenCH, DiaChi, SDT, TrangThai
            })

            res.json({msg: "Cập nhật thành công"})
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    create_food: async(req,res) => {
        try{
            const {id_CH, TenMonAn, Loai, MoTa, GiaBan, HinhAnh} = req.body

            if(!id_CH|| !TenMonAn || !GiaBan) 
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
                  
            const Ma = await Menu.findOne({id_CH})
            const Ten = await Menu.findOne({TenMonAn})
                        
            if(Ma && Ten)
            {
                return res.status(400).json({msg:"Bạn đã có món ăn này trong cửa hàng rồi"})
            }  

                const newFood = {
                    id_CH, TenMonAn, Loai, MoTa, GiaBan, HinhAnh
                }  
                await Menu.create(newFood); //Lưu vào DB  
            res.json({msg: "Thêm thành công"})
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    get_menu: async(req, res) => {
        try {
            const menu = await Menu.find({id_CH: req.params.id}) // Tìm thông tin theo mã cửa hàng
            res.json(menu)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    get_food: async(req, res) => {
        try {
    
            // const menu = await Menu.aggregate( [
            //     {
            //       $lookup:
            //         {
            //           from: "cuahangs",
            //           localField: "id_CH",
            //           foreignField: "_id",
            //           as: "store"
            //         }
            //    },
            //    { 
            //     "$match" : { 
            //         "Loai" : req.params.type
            //     }
            // }
            //  ] )
            const menu = await Menu.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "menus" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "menus.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "_id", 
                            "as" : "cuahangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$cuahangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "menus.Loai" : req.params.type, 
                            "cuahangs.TrangThai" : 1
                        }
                    }, 
                    { 
                        "$project" : { 
                            "_id" : "$menus._id",
                            "id_CH" : "$menus.id_CH", 
                            "TenCH": "$cuahangs.TenCH", 
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$menus.GiaBan", 
                            "HinhAnh" : "$menus.HinhAnh", 
                            "Loai" : "$menus.Loai", 
                            "MoTa" : "$menus.MoTa", 
                            "TrangThai" : "$menus.TrangThai", 
                            "SoLuongCon" : "$menus.SoLuongCon",                    
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(menu)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    update_menu: async(req, res) => {
        try{
            const {TenMonAn, MoTa, Loai, GiaBan, TrangThai, HinhAnh, SoLuongCon} = req.body

            if(!TenMonAn || !GiaBan || !Loai || !HinhAnh || !TrangThai || !SoLuongCon)
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
            await Menu.findByIdAndUpdate({_id: req.params.id}, {
                TenMonAn, MoTa, Loai, GiaBan, TrangThai, HinhAnh, SoLuongCon
            }) // Chỉnh sửa thông tin của menu

            res.json({msg: "Cập nhật thành công"})
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    get_Allmenu: async(req, res) => {
        try {
            const menu = await Menu.find({})
            res.json(menu)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    add_cart: async(req,res) => {
        try{
            const {id_Email, SoLuong, ThanhTien, id_MonAn} = req.body
            const check = await GioHang.findOne(
                { 
                    "id_Email" : id_Email, 
                    "id_MonAn" : id_MonAn
                }, 
                { 
                    "SoLuong":"$SoLuong", 
                    "_id" : 0
                }    
            );     
            // Nếu trong giỏ hàng đã tồn tại rồi thì thêm số lượng       
            if(check){
                const SoLuongThem = check.SoLuong + 1;
                await GioHang.findOneAndUpdate({id_MonAn: id_MonAn}, {SoLuong: SoLuongThem});
            }
            else{
                const newCart = {
                    id_Email, SoLuong, ThanhTien, id_MonAn
                }        
                await GioHang.create(newCart); //Lưu vào DB    
            }     
            res.json({msg: "Thành công"})
        } catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    get_Cart: async(req, res) => {
        try {
            const cart = await Menu.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "menus" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "menus._id", 
                            "from" : "giohangs", 
                            "foreignField" : "id_MonAn", 
                            "as" : "giohangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$giohangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "menus.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "_id", 
                            "as" : "cuahangs"
                        }
                    }, 
                        { 
                            "$unwind" : { 
                                "path" : "$cuahangs", 
                                "preserveNullAndEmptyArrays" : false
                            }
                        }, 
                    { 
                        "$match" : { 
                            "giohangs.id_Email" :  req.params.id
                        }
                    }, 
                    { 
                        "$project" : { 
                            "_id" : "$menus._id",
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$menus.GiaBan", 
                            "SoLuong" : "$giohangs.SoLuong", 
                            "SoLuongCon" : "$menus.SoLuongCon",
                            "TenCH" : "$cuahangs.TenCH", 
                            "DiaChi" : "$cuahangs.DiaChi", 
                            "SDT" : "$cuahangs.SDT", 
                            "id_CH" : "$cuahangs._id", 
                            "id_GH" : "$giohangs._id", 
          
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(cart)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    remove_Cart: async(req, res) => {
        try {
            await GioHang.deleteOne({_id: req.params.id})
            res.json({msg: "Thành công"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    count_Store: async(req, res) => {
        try {
            const total = await CuaHang.countDocuments() // tất cả cửa hàng
            const on = await CuaHang.countDocuments({"TrangThai" : 1}) // tất cả cửa hàng còn kinh doanh
            res.json({total, on})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    count_Stores: async(req, res) => {
        try {
            const total = await CuaHang.countDocuments({Email: req.params.Email }) // tất cả cửa hàng
            const on = await CuaHang.countDocuments({Email: req.params.Email, TrangThai : 1}) // tất cả cửa hàng còn kinh doanh
            res.json({total, on})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    count_Item: async(req, res) => {
        try {
            const item = await GioHang.countDocuments({id_Email: req.params.id }) //Theo id Email đăng nhập
            res.json({item})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    update_cart: async(req, res) => {
        try {
            const {SoLuong} = req.body
            await GioHang.findOneAndUpdate({_id: req.params.id }, {SoLuong}) 
            res.json({msg: "Cập nhật thành công"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    get_store: async(req, res) => {
        try {
            const store = await CuaHang.aggregate( [
                {
                  $lookup:
                    {
                      from: "menus",
                      localField: "_id",
                      foreignField: "id_CH",
                      as: "menu"
                    }
               },
               { 
                "$match" : { 
                    "_id": new mongoose.Types.ObjectId(req.params.id)
                }
                }
             ] )
            res.json(store)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    search_food: async(req, res) => {
        try{
            const {searchInput} = req.body
            const filterName = new RegExp(fullTextSearchVi(searchInput), "i"); // chuyển về ký tự tiếng việt
            const result = await Menu.aggregate(
                [
                    { 
                        "$match" : { '$text': { '$search': `${filterName}` } }
                    },
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "menus" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "menus.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "_id", 
                            "as" : "cuahangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$cuahangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "menus.GiaBan" : { 
                                "$gt" : 5000
                            }
                        }
                    }, // Giá bán lớn hơn 5000
                    { 
                        "$project" : { 
                            "_id" : "$menus._id", 
                            "TenMonAn" : "$menus.TenMonAn", 
                            "HinhAnh" : "$menus.HinhAnh", 
                            "GiaBan" : "$menus.GiaBan", 
                            "Loai" : "$menus.Loai", 
                            "MoTa" : "$menus.MoTa", 
                            "SoLuongCon" : "$menus.SoLuongCon", 
                            "TrangThai" : "$menus.TrangThai", 
                            "TenCH" : "$cuahangs.TenCH", 
                            "id_CH" : "$cuahangs._id"               
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(result)

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    add_order: async(req, res) => {
        try{    
            const {id_DH, Email, TongCong, DiaChi, id_CH, PhiShip, ThanhToan} = req.body
            if(!id_DH || !Email|| !TongCong || !DiaChi || !PhiShip || !ThanhToan) 
            {
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
            else{
                const newOder = {
                    id_DH, Email, TongCong, PhiShip, ThanhToan, DiaChi, id_Shipper: id_DH, id_CH
                }
                await DonHang.create(newOder);
                return res.json({msg: "Thêm thành công"})
                
            }

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    add_detail: async(req, res) => {
        try{    
            const {id_DH, id_MonAn, GiaBan, SoLuong} = req.body
            const newDetail = {
                    id_DH, id_MonAn, SoLuong, GiaBan
                }
                await ChiTietGioHang.create(newDetail)
                await GioHang.findOneAndDelete({id_MonAn: id_MonAn}) // Xóa item trong giỏ hàng khi xác nhận đơn hàng thành công
                const menu = await Menu.findById(id_MonAn)
                const SL = menu.SoLuongCon - SoLuong
                await Menu.findByIdAndUpdate({_id: id_MonAn }, {SoLuongCon: SL}) 
            // Nếu số lượng còn = 0 cập nhật lại trạng thái món ăn
                if(SL == 0)
                {
                    await Menu.findByIdAndUpdate({_id: id_MonAn }, {TrangThai: 0}) 
                }
                return res.json({msg: "Thêm thành công"})             

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    add_rating: async(req, res) => {
        try{    
            const {id_CH, MonAn, Sao, DanhGia, Email_DG} = req.body
            if(!id_CH, !MonAn, !Sao, !Email_DG){
                return res.status(400).json({msg: "Vui lòng nhập đầy đủ thông tin"})
            }
            const newRate = {
                id_CH, MonAn, Sao, DanhGia, Email_DG
                }
            await Rate.create(newRate)
            return res.json({msg: "Thêm thành công"})             

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    get_rating: async(req, res) => {
        try {            
            const rate = await Rate.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "danhgias" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "danhgias.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "cuahangs._id", 
                            "as" : "rate"
                        }
                    },                    
                    { 
                        "$match" : { 
                            "danhgias.id_CH" : new mongoose.Types.ObjectId(req.params.id)
                        }
                    }, 
                    { 
                        "$project" : { 
                            "TenMonAn" : "$danhgias.MonAn",
                            "Sao" : "$danhgias.Sao",
                            "DanhGia" : "$danhgias.DanhGia",
                            "Email_DG" : "$danhgias.Email_DG"  
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(rate)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    get_oder: async(req, res) => {
        try {
            const order = await DonHang.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "donhangs" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "donhangs.Email", 
                            "from" : "taikhoans", 
                            "foreignField" : "Email", 
                            "as" : "taikhoans"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$taikhoans", 
                            "preserveNullAndEmptyArrays" : false
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
                        "$lookup" : { 
                            "localField" : "donhangs.id_DH", 
                            "from" : "chitietdonhangs", 
                            "foreignField" : "id_DH", 
                            "as" : "chitietdonhangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$chitietdonhangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "chitietdonhangs.id_MonAn", 
                            "from" : "menus", 
                            "foreignField" : "_id", 
                            "as" : "menus"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$menus", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "menus.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "_id", 
                            "as" : "cuahangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$cuahangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$sort" : { 
                            "donhangs.NgayDat" : -1
                        }
                    }, 
                    { 
                        "$match" : { 
                            "$and" : [
                                { 
                                    "donhangs.Email" : req.params.id
                                }, 
                                { 
                                    "donhangs.TrangThai" : { 
                                        "$ne" : 1
                                    }
                                }, 
                                { 
                                    "donhangs.TrangThai" : { 
                                        "$ne" : 2
                                    }
                                },
                                { 
                                    "donhangs.TrangThai" : { 
                                        "$ne" : 3
                                    }
                                }
                            ]
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH",
                            "id_MonAn" : "$menus._id",
                            "id_CH" : "$cuahangs._id",
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$menus.GiaBan", 
                            "SoLuong" : "$chitietdonhangs.SoLuong", 
                            "TenCH" : "$cuahangs.TenCH", 
                            "DiaChi_CH" : "$cuahangs.DiaChi", 
                            "Email" : "$donhangs.Email", 
                            "NgayDat" : "$donhangs.NgayDat", 
                            "DiaChi" : "$donhangs.DiaChi",
                            "SDTDatHang" : "$thongtins.SDT",
                            "ThanhToan" : "$donhangs.ThanhToan",
                            "PhiShip" : "$donhangs.PhiShip",
                            "TongCong" : "$donhangs.TongCong",  
                            "TrangThai" : "$donhangs.TrangThai", 
                            "_id" : 0
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(order)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    
    process_oder: async(req, res) => {
        try {
        //    const date = await DonHang.find().sort({_id:-1}).limit(1)
                const date = await DonHang.aggregate(
                    [
                        { 
                            "$project" : { 
                                "_id" : 0, 
                                "donhangs" : "$$ROOT"
                            }
                        }, 
                        { 
                            "$lookup" : { 
                                "localField" : "donhangs.Email", 
                                "from" : "taikhoans", 
                                "foreignField" : "Email", 
                                "as" : "taikhoans"
                            }
                        }, 
                        { 
                            "$unwind" : { 
                                "path" : "$taikhoans", 
                                "preserveNullAndEmptyArrays" : false
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
                            "$lookup" : { 
                                "localField" : "donhangs.id_DH", 
                                "from" : "chitietdonhangs", 
                                "foreignField" : "id_DH", 
                                "as" : "chitietdonhangs"
                            }
                        }, 
                        { 
                            "$unwind" : { 
                                "path" : "$chitietdonhangs", 
                                "preserveNullAndEmptyArrays" : false
                            }
                        }, 
                        { 
                            "$lookup" : { 
                                "localField" : "chitietdonhangs.id_MonAn", 
                                "from" : "menus", 
                                "foreignField" : "_id", 
                                "as" : "menus"
                            }
                        }, 
                        { 
                            "$unwind" : { 
                                "path" : "$menus", 
                                "preserveNullAndEmptyArrays" : false
                            }
                        }, 
                        { 
                            "$lookup" : { 
                                "localField" : "menus.id_CH", 
                                "from" : "cuahangs", 
                                "foreignField" : "_id", 
                                "as" : "cuahangs"
                            }
                        }, 
                        { 
                            "$unwind" : { 
                                "path" : "$cuahangs", 
                                "preserveNullAndEmptyArrays" : false
                            }
                        }, 
                        { 
                            "$sort" : { 
                                "donhangs.NgayDat" : -1
                            }
                        }, 
                        { 
                            "$match" : { 
                                "$and" : [
                                    { 
                                        "donhangs.Email" : req.params.id
                                    }, 
                                        { 
                                            "donhangs.TrangThai" : { 
                                                "$ne" : 4
                                            }
                                        }, 
                                    { 
                                        "donhangs.TrangThai" : { 
                                            "$ne" : 0
                                        }
                                    }
                                ]
                            }
                        }, 
                        { 
                            "$project" : { 
                                "id_DH" : "$donhangs.id_DH",
                                "id_MonAn" : "$menus._id",
                                "TenMonAn" : "$menus.TenMonAn", 
                                "GiaBan" : "$menus.GiaBan", 
                                "HinhAnh" : "$menus.HinhAnh",
                                "SoLuong" : "$chitietdonhangs.SoLuong", 
                                "TenCH" : "$cuahangs.TenCH", 
                                "DiaChi_CH" : "$cuahangs.DiaChi", 
                                "Email" : "$donhangs.Email", 
                                "SDTDatHang" : "$thongtins.SDT",
                                "NgayDat" : "$donhangs.NgayDat", 
                                "DiaChi" : "$donhangs.DiaChi",
                                "TongCong" : "$donhangs.TongCong",  
                                "TrangThai" : "$donhangs.TrangThai", 
                                "_id" : 0
                            }
                        }
                    ], 
                    { 
                        "allowDiskUse" : true
                    }
                ).limit(5);
            res.json(date)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    cancel_oder: async(req, res) => {
        try{    
            await DonHang.findOneAndUpdate({id_DH: req.params.id}, {TrangThai: 0})
            return res.json({msg: "Thành công"})             

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    get_req: async(req, res) => {
        try {
            const order = await DonHang.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "donhangs" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "donhangs.Email", 
                            "from" : "taikhoans", 
                            "foreignField" : "Email", 
                            "as" : "taikhoans"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$taikhoans", 
                            "preserveNullAndEmptyArrays" : false
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
                        "$lookup" : { 
                            "localField" : "donhangs.id_DH", 
                            "from" : "chitietdonhangs", 
                            "foreignField" : "id_DH", 
                            "as" : "chitietdonhangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$chitietdonhangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "chitietdonhangs.id_MonAn", 
                            "from" : "menus", 
                            "foreignField" : "_id", 
                            "as" : "menus"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$menus", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "menus.id_CH", 
                            "from" : "cuahangs", 
                            "foreignField" : "_id", 
                            "as" : "cuahangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$cuahangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "cuahangs.Email" : req.params.id, 
                            "donhangs.TrangThai" : 1
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH", 
                            "id_CH" : "$cuahangs._id",
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$menus.GiaBan",
                            "SoLuong" : "$chitietdonhangs.SoLuong", 
                            "TenCH" : "$cuahangs.TenCH", 
                            "DiaChiNhanHang" : "$donhangs.DiaChi", 
                            "EmailDatHang" : "$donhangs.Email", 
                            "SDTDatHang" : "$thongtins.SDT", 
                            "NgayDat" : "$donhangs.NgayDat", 
                            "TongCong" : "$donhangs.TongCong", 
                            "TrangThai" : "$donhangs.TrangThai", 
                            "_id" : 0
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(order)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    send_reqOder: async(req, res) => {
        try{    
            const {id_Shipper, id_DH, TrangThai} = req.body
            const newReq = {
                 id_Shipper, id_DH, TrangThai
                }
                await DanhSachYeuCau.create(newReq)
                return res.json({msg: "Thêm thành công"})             
        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    confirm_Order: async(req, res) => {
        try{    
            await DonHang.findOneAndUpdate({id_DH: req.params.id}, {TrangThai: 4})
            return res.json({msg: "Thành công"})             

        }catch(err){
            return res.status(500).json({msg: err.message})
        }
    },

    order_store: async(req, res) => {
        try {
            const order = await DonHang.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "donhangs" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "donhangs.id_DH", 
                            "from" : "chitietdonhangs", 
                            "foreignField" : "id_DH", 
                            "as" : "chitietdonhangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$chitietdonhangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "chitietdonhangs.id_MonAn", 
                            "from" : "menus", 
                            "foreignField" : "_id", 
                            "as" : "menus"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$menus", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : { 
                            "$or" : [
                                { 
                                    "donhangs.TrangThai" : 3
                                }, 
                                { 
                                    "$and" : [
                                        { 
                                            "donhangs.TrangThai" : 4
                                        }, 
                                        { 
                                            "donhangs.id_CH" : new mongoose.Types.ObjectId(req.params.id)
                                        }
                                    ]
                                }
                            ]
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH", 
                            "NgayDat" : "$donhangs.NgayDat", 
                            "SoLuong" : "$chitietdonhangs.SoLuong", 
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$chitietdonhangs.GiaBan", 
                            "TongCong": "$donhangs.TongCong",
                            "DiaChi_NH": "$donhangs.DiaChi",
                            "_id" : 0
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(order)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    cannel_store: async(req, res) => {
        try {
            const order = await DonHang.aggregate(
                [
                    { 
                        "$project" : { 
                            "_id" : 0, 
                            "donhangs" : "$$ROOT"
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "donhangs.id_DH", 
                            "from" : "chitietdonhangs", 
                            "foreignField" : "id_DH", 
                            "as" : "chitietdonhangs"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$chitietdonhangs", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$lookup" : { 
                            "localField" : "chitietdonhangs.id_MonAn", 
                            "from" : "menus", 
                            "foreignField" : "_id", 
                            "as" : "menus"
                        }
                    }, 
                    { 
                        "$unwind" : { 
                            "path" : "$menus", 
                            "preserveNullAndEmptyArrays" : false
                        }
                    }, 
                    { 
                        "$match" : {  
                            "$and" : [
                                { 
                                    "donhangs.TrangThai" : 0
                                }, 
                                { 
                                    "donhangs.id_CH" : new mongoose.Types.ObjectId(req.params.id)
                                }
                            ]
                                
                            
                        }
                    }, 
                    { 
                        "$project" : { 
                            "id_DH" : "$donhangs.id_DH", 
                            "NgayDat" : "$donhangs.NgayDat", 
                            "SoLuong" : "$chitietdonhangs.SoLuong", 
                            "TenMonAn" : "$menus.TenMonAn", 
                            "GiaBan" : "$chitietdonhangs.GiaBan", 
                            "TongCong": "$donhangs.TongCong",
                            "DiaChi_NH": "$donhangs.DiaChi",
                            "_id" : 0
                        }
                    }
                ], 
                { 
                    "allowDiskUse" : true
                }
            );
            res.json(order)
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    } 
}

module.exports = storeCtrl