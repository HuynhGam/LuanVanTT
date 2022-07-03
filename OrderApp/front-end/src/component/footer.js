import React from 'react';

export default function Footer() {
  return (
    <>
        {/* <section> begin ============================*/}
        <section className="py-0 pt-7 bg-1000">
                <div className="container">
                    <div className="row">
                    <div className="col-6 col-md-4 col-lg-3 col-xxl-2 mb-3">
                        <h5 className="lh-lg fw-bold text-white">THÔNG TIN</h5>
                        <ul className="list-unstyled mb-md-4 mb-lg-0">
                        <li className="lh-lg"><a className="text-200 text-decoration-none" href="#!">Về OrderFood</a></li>
                        <li className="lh-lg"><a className="text-200 text-decoration-none" href="#!">Blog</a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 col-xxl-2 col-lg-3 mb-3">
                        <h5 className="lh-lg fw-bold text-white">HỖ TRỢ</h5>
                        <ul className="list-unstyled mb-md-4 mb-lg-0">
                        <li className="lh-lg"><a className="text-200 text-decoration-none" href="#!">Hỗ trợ khách hàng</a></li>
                        <li className="lh-lg"><a className="text-200 text-decoration-none" href="#!">Trở thành tài xế OrderFood </a></li>
                        </ul>
                    </div>
                    <div className="col-6 col-md-4 col-lg-3 col-xxl-2 mb-3">
                        <h5 className="lh-lg fw-bold text-white">ĐIỀU KHOẢN</h5>
                        <ul className="list-unstyled mb-md-4 mb-lg-0">
                        <li className="lh-lg"><a className="text-200 text-decoration-none" href="#!">Điều khoản của OrderFood</a></li>
                        <li className="lh-lg"><a className="text-200 text-decoration-none" href="#!">Câu hỏi thường gặp</a></li>
                        </ul>
                    </div>
                    <div className="col-12 col-md-8 col-lg-6 col-xxl-6 mb-5">
                        <h3 className="text-500 my-4">Nếu bạn có bất kì vấn đề hay thắc mắc nào, xin hãy liên lạc với chúng tôi qua địa chỉ email để có thể giải đáp sớm nhất có thể nhé ^^</h3>
                    </div>
                    </div>
                    <hr className="border border-800" />
                    <div className="row flex-center pb-3">
                    <div className="col-md-6 order-0">
                        <p className="text-200 text-center text-md-start">oderfood11@gmail.com</p>
                    </div>
                    <div className="col-md-6 order-1">
                        
                    </div>
                    </div>
                </div>{/* end of .container*/}
            </section>
        {/* <section> close ============================*/}
    </>
  );
}
