import React, { Fragment } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Images from "../static"; // Adjust path to your static images
import Fade from "react-reveal/Fade";

const About = () => {
  return (
    <Fragment>
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-black text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <Fade top>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Về Chúng Tôi
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Chào mừng bạn đến với cửa hàng của sự đam mê và chất lượng. Chúng
                tôi mang đến những sản phẩm tốt nhất cho bạn!
              </p>
            </Fade>
          </div>
        </div>

        {/* Our Story */}
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <Fade left>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-4">Câu Chuyện Của Chúng Tôi</h2>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Thành lập từ niềm đam mê với thời trang và chất lượng, chúng tôi
                  tự hào mang đến những sản phẩm được tuyển chọn kỹ lưỡng từ các
                  thương hiệu hàng đầu. Mỗi chiếc áo, mỗi sản phẩm đều kể một câu
                  chuyện về sự tinh tế và phong cách.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed mt-4">
                  Với sứ mệnh mang lại trải nghiệm mua sắm tuyệt vời, chúng tôi
                  không ngừng cải tiến và lắng nghe khách hàng để đáp ứng mọi nhu
                  cầu của bạn.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-xl">
                <LazyLoadImage
                  src={Images.a1} // Replace with your image
                  alt="Our Story"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>
          </Fade>
        </div>

        {/* Our Mission */}
        <div className="bg-white py-12">
          <div className="max-w-screen-xl mx-auto px-4">
            <Fade right>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <LazyLoadImage
                    src={Images.a2} // Replace with your image
                    alt="Our Mission"
                    className="w-full h-80 object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-3xl font-semibold mb-4">Sứ Mệnh Của Chúng Tôi</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, thân
                    thiện với môi trường và phong cách độc đáo. Mỗi sản phẩm đều
                    được kiểm tra kỹ lưỡng để đảm bảo sự hài lòng của khách hàng.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed mt-4">
                    Bên cạnh đó, chúng tôi luôn đặt khách hàng làm trung tâm, cung
                    cấp dịch vụ hỗ trợ nhanh chóng và chính sách đổi trả linh hoạt.
                  </p>
                </div>
              </div>
            </Fade>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <Fade bottom>
            {/* <h2 className="text-3xl font-semibold text-center mb-8">Đội Ngũ Của Chúng Tôi</h2> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {[
                // { name: "Nguyễn Văn A", role: "Nhà Sáng Lập", img: Images.team1 },
                // { name: "Trần Thị B", role: "Quản Lý Sản Phẩm", img: Images.team2 },
                // { name: "Lê Văn C", role: "Chuyên Viên Marketing", img: Images.team3 },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4 shadow-lg">
                    <LazyLoadImage
                    //   src={member.img} // Replace with actual team images
                    //   alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* <h3 className="text-xl font-medium">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p> */}
                </div>
              ))}
            </div>
          </Fade>
        </div>
      </div>
    </Fragment>
  );
};

export default About;