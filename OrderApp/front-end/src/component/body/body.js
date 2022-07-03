import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import {fetchFood, dispatchGetFood} from '../../redux/actions/foodAction';


export default function Body() {
    const auth = useSelector(state => state.auth);
    const token = useSelector(state => state.token);
    
    const {isLogged, role} = auth;

    const [callback] = useState(false);
    const dispatch = useDispatch();


// Lấy tất cả menu qua bên redux
    useEffect(() => {
        if(isLogged == true){
            return fetchFood(token).then(res =>{
                dispatch(dispatchGetFood(res));
            })
        }
    },[token, isLogged, dispatch, callback])
    
  return (
    <>
        <section className="py-5 overflow-hidden bg-primary" id="home">
                <div className="container">
                    <div className="row flex-center">
                    <div className="col-md-5 col-lg-6 order-0 order-md-1 mt-8 mt-md-0"><a className="img-landing-banner" href="#!"><img className="img-fluid" src="assets/img/gallery/hero-header.png" alt="hero-header" /></a></div>
                    <div className="col-md-7 col-lg-6 py-8 text-md-start text-center">
                        <h1 className="display-1 fs-md-5 fs-lg-6 fs-xl-8 text-light">Bạn đã đói bụng chưa ?</h1>
                        <h1 className="text-800 mb-10 fs-4">Hãy để OrderFood giúp bạn lựa chọn một bữa ăn để có tinh thần làm việc tiếp nhé</h1>
                     
                    </div>
                    </div>
                </div>    
            </section>

            <section className="py-8 overflow-hidden">
                <div className="container">
                    <div className="row flex-center mb-6">
                        <h6 className="fw-bold fs-3 fs-lg-5 lh-sm">Danh mục món ăn</h6>       
                    <div className="col-lg-7">
                    </div>          
                </div>
                    <div className="row flex-center">
                    <div className="col-12">
                        <div className="carousel slide" id="carouselSearchByFood" data-bs-touch="false" data-bs-interval="false">
                        <div className="carousel-inner">
                            <div className="carousel-item active" data-bs-interval={10000}>
                            <div className="row h-69 align-items-center">
                                    <div className="col-sm-6 col-md-4 col-xl mb-5 h-100">
                                        <Link to = {`/product/Cơm`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/C%C6%A1m_T%E1%BA%A5m%2C_Da_Nang%2C_Vietnam.jpg/1280px-C%C6%A1m_T%E1%BA%A5m%2C_Da_Nang%2C_Vietnam.jpg" alt="..." />
                                            <div className="card-body ps-0">
                                            <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Cơm</h5>
                                            </div>
                                        </div>
                                        </Link>  
                                    </div>  
                                    
                                <div className="col-sm-6 col-md-4 col-xl mb-5 h-69">
                                     <Link to = {`/product/Trà sữa`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://cdn.dayphache.edu.vn/wp-content/uploads/2020/02/mon-tra-sua-tran-chau.jpg" alt="..." />
                                            <div className="card-body ps-0">
                                            <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Trà sữa</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-sm-6 col-md-4 col-xl mb-5 h-100">
                                    <Link to = {`/product/Bún Mỳ`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://cdn.daynauan.info.vn/wp-content/uploads/2018/06/mi-cay-han-quoc.jpg" alt="..." />
                                            <div className="card-body ps-0">
                                            <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Bún/Mỳ</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-sm-6 col-md-4 col-xl mb-5 h-10">
                                    <Link to = {`/product/Phở`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://bepcuatoi.com/wp-content/uploads/2020/08/mon-pho-bo-thom-ngon.png" alt="..." />
                                            <div className="card-body ps-0">
                                            <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Phở</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-sm-6 col-md-4 col-xl mb-5 h-100">
                                    <Link to = {`/product/Bánh mì`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://vnn-imgs-f.vgcloud.vn/2021/10/05/16/loat-banh-mi-dat-khach-nhat-sai-gon-co-noi-khach-chi-tram-ngan-de-dat-ship-bang-taxi-1.jpg" alt="..." />
                                            <div className="card-body ps-0">
                                                <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Bánh mì</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                                <div className="col-sm-6 col-md-4 col-xl mb-5 h-100">
                                    <Link to = {`/product/Ăn vặt`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://cdn.tgdd.vn/2021/03/CookProduct/che-xoiaf-tran-chau-thumbnail-1200x676.jpg" alt="..." />
                                            <div className="card-body ps-0">
                                                <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Ăn vặt</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>

                                <div className="col-sm-6 col-md-4 col-xl mb-5 h-100">
                                    <Link to = {`/product/Khác`}>
                                        <div className="card card-span h-100 rounded-circle"><img className="img-fluid rounded-circle h-100" src="https://dulichkhampha24.com/wp-content/uploads/2020/09/pizza-ha-noi.jpg" alt="..." />
                                            <div className="card-body ps-0">
                                                <h5 className="text-center fw-bold text-1000 text-truncate mb-2">Khác...</h5>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>{/* end of .container*/}
            </section>

            <section className="py-0">
                <div className="bg-holder" style={{backgroundImage: 'url(assets/img/gallery/cta-two-bg.png)', backgroundPosition: 'center', backgroundSize: 'cover'}}>
                </div>
                {/*/.bg-holder*/}
                <div className="container">
                    <div className="row flex-center">
                    <div className="col-xxl-9 py-7 text-center">
                        <h1 className="fw-bold mb-4 text-white fs-6">Bạn đã sẵn sàng để  <br/> thưởng thức bữa ăn của mình chưa ? </h1><Link className="btn btn-danger" to = {`/cart/${role._id}`}> XỬ LÝ ĐƠN HÀNG<i className="fas fa-chevron-right ms-2" /></Link>
                    </div>
                    </div>
                </div>
            </section>  
    </>
  );
}