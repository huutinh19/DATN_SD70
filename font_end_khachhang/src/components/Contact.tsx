import React, { Fragment, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Images from "../static"; // Adjust path to your static images
import Fade from "react-reveal/Fade";
import axios from "axios";
import API from "../api"; // Adjust path to your API config
import { toast } from "react-toastify"; // Optional: For notifications, install if needed

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // try {
    //   // Replace with your API endpoint for form submission
    //   const res = await axios.post(API.submitContactForm(), formData);
    //   if (res.status) {
    //     toast.success("Tin nhắn của bạn đã được gửi!");
    //     setFormData({ name: "", email: "", message: "" });
    //   }
    // } catch (error) {
    //   toast.error("Có lỗi xảy ra, vui lòng thử lại!");
    //   console.error(error);
    // } finally {
    //   setLoading(false);
    // }
  };

  return (
    <Fragment>
      <div className="bg-gray-100 min-h-screen">
        {/* Hero Section */}
        <div className="relative bg-black text-white py-16">
          <div className="max-w-screen-xl mx-auto px-4 text-center">
            <Fade top>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Liên Hệ Với Chúng Tôi
              </h1>
              <p className="text-lg md:text-xl max-w-2xl mx-auto">
                Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ để được tư vấn hoặc
                gửi thắc mắc!
              </p>
            </Fade>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-screen-xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Information */}
            <Fade left>
              <div>
                <h2 className="text-3xl font-semibold mb-6">Thông Tin Liên Hệ</h2>
                <div className="space-y-4">
                  <p className="text-lg">
                    <strong>Địa chỉ:</strong> Phú Kiều, Kiều Mai, Hà Nội
                  </p>
                  <p className="text-lg">
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:support@ttsport.com"
                      className="text-blue-600 hover:underline"
                    >
                      support@ttsport.com
                    </a>
                  </p>
                  <p className="text-lg">
                    <strong>Số điện thoại:</strong>{" "}
                    <a
                      href="tel:+84 385507617"
                      className="text-blue-600 hover:underline"
                    >
                      (+84) 385507617
                    </a>
                  </p>
                </div>

                {/* Google Map */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4">Bản Đồ</h3>
                  <div className="w-full h-96 rounded-lg overflow-hidden shadow-xl">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.506216678694!2d105.84113231540295!3d21.01165688599876!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDAwJzQyLjAiTiAxMDXCsDUwJzI4LjUiRQ!5e0!3m2!1sen!2s!4v1634567890123!5m2!1sen!2s"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      title="Store Location"
                    ></iframe>
                  </div>
                </div>
              </div>
            </Fade>

            {/* Contact Form */}
            {/* <Fade right>
              <div className="bg-white p-8 rounded-lg shadow-xl">
                <h2 className="text-3xl font-semibold mb-6">Gửi Tin Nhắn</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full p-3 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="mt-1 w-full p-3 border border-gray-200 rounded-full bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Nhập email"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tin nhắn
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className="mt-1 w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      placeholder="Nhập tin nhắn của bạn"
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-3 px-4 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? "Đang gửi..." : "Gửi Tin Nhắn"}
                  </button>
                </form>
              </div>
            </Fade> */}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Contact;