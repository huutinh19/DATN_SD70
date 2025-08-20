



import axios from "axios";
import React, { useState } from "react";
import API from "../../api";
import { setToken, setUserToken } from "../../helper/useCookie";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import path from "../../constants/path";
import Fade from "react-reveal/Fade";
import {
  regexPhoneNumber,
  validateEmail,
  validatePassword,
} from "../../utils/format";
import Images from "../../static";

interface CustomError {
  message: string;
  response?: { data?: string; status?: number };
}

interface FormErrors {
  email?: string;
  password?: string;
  phone?: string;
  newPassword?: string;
  newPassword2?: string;
  name?: string;
}

// Component Đăng nhập
const LoginForm = ({
  setCheckRegister,
}: {
  setCheckRegister: (value: number) => void;
}) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

const login = async () => {
  setErrors({});
  if (!validateEmail(email)) {
    setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
    return;
  }

  try {
    const res = await axios.post(API.login(), { email, password });
    if (res.status === 200) {
      const decodedToken = jwtDecode<{ id: string; role: string }>(res.data.token);
      if (decodedToken.role !== "ROLE_USER") {
        toast.error("Bạn không có quyền truy cập tính năng này!");
        return;
      }
      toast.success("Đăng nhập thành công");
      setToken(res.data.token);
      setUserToken(res.data.token);
      sessionStorage.setItem("idAccount", decodedToken.id);
      navigate(path.home);
      window.location.reload();
    }
  } catch (error) {
    const customError = error as CustomError;
    toast.error(
      customError.response?.data || "Đăng nhập thất bại. Vui lòng thử lại."
    );
  }
};

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-sm space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Email*</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Nhập email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mật khẩu*
        </label>
        <div className="relative">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <img
              src={showPassword ? Images.iconEye : Images.iconCloseEye}
              className="w-4 h-4"
            />
          </span>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>
      <div className="flex justify-between items-center">
        <button
          onClick={login}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
        >
          Đăng nhập
        </button>
        <button
          type="button"
          onClick={() => setCheckRegister(3)}
          className="text-sm text-blue-500 hover:underline"
        >
          Quên mật khẩu?
        </button>
      </div>
    </form>
  );
};

// Component Đăng ký
const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState(""); // Thêm state cho Name
  const [phoneNumber, setPhoneNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPassword2, setNewPassword2] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const register = async () => {
    setErrors({});
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      return;
    }
    if (!name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Tên không được để trống" }));
      return;
    }
    if (!regexPhoneNumber.test(phoneNumber)) {
      setErrors((prev) => ({
        ...prev,
        phone: "Số điện thoại không hợp lệ",
      }));
      return;
    }
    if (!validatePassword(newPassword)) {
      setErrors((prev) => ({
        ...prev,
        newPassword: "Mật khẩu phải có ít nhất 8 ký tự",
      }));
      return;
    }
    if (newPassword !== newPassword2) {
      setErrors((prev) => ({
        ...prev,
        newPassword2: "Mật khẩu không khớp",
      }));
      return;
    }

    try {
      const res = await axios.post(API.register(), {
        email,
        name, // Thêm name vào payload
        password: newPassword,
        role: "ROLE_USER",
        phoneNumber,
      });
      if (res.status === 200) {
        toast.success("Đăng ký thành công");
        setEmail("");
        setName(""); // Reset name
        setPhoneNumber("");
        setNewPassword("");
        setNewPassword2("");
      }
    } catch (error) {
      const customError = error as CustomError;
      toast.error(customError.response?.data || "Đăng ký thất bại");
    }
  };


  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-sm space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Họ và Tên*</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nhập họ và tên"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Email*</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Nhập email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Số điện thoại*
        </label>
        <input
          value={phoneNumber} // Sửa phone thành phoneNumber
          onChange={(e) => setPhoneNumber(e.target.value)} // Sửa setPhone thành setPhoneNumber
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Nhập số điện thoại"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Mật khẩu*
        </label>
        <div className="relative">
          <input
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
            type={showPassword ? "text" : "password"}
            placeholder="Nhập mật khẩu"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
          >
            <img
              src={showPassword ? Images.iconEye : Images.iconCloseEye}
              className="w-4 h-4"
            />
          </span>
        </div>
        {errors.newPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Nhập lại mật khẩu*
        </label>
        <input
          value={newPassword2}
          onChange={(e) => setNewPassword2(e.target.value)}
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập lại mật khẩu"
        />
        {errors.newPassword2 && (
          <p className="mt-1 text-xs text-red-500">{errors.newPassword2}</p>
        )}
      </div>
      <button
        onClick={register}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Đăng ký
      </button>
    </form>
  );
};
// Component Quên mật khẩu
const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  const forgotPassword = async () => {
    setErrors({});
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Email không hợp lệ" }));
      return;
    }

    try {
      const res = await axios.post(API.forgot(), { emailForgot: email });
      if (res.status === 200) {
        toast.success("Mật khẩu đã được gửi qua email của bạn");
        setEmail("");
      }
    } catch (error) {
      const customError = error as CustomError;
      toast.error(
        customError.response?.data || "Yêu cầu thất bại. Vui lòng thử lại."
      );
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-full max-w-sm space-y-4"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700">Email*</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-500"
          type="email"
          placeholder="Nhập email"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>
      <button
        onClick={forgotPassword}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
      >
        Gửi yêu cầu
      </button>
    </form>
  );
};

// Component Registration Info
const RegistrationInfo = ({
  checkRegister,
  setCheckRegister,
}: {
  checkRegister: number;
  setCheckRegister: (value: number) => void;
}) => (
  <div className="p-6 text-center">
    <h2 className="text-xl font-semibold mb-4">
      {checkRegister === 2 ? "Khách hàng đã có tài khoản" : "Khách hàng mới"}
    </h2>
    <p className="text-sm text-gray-600 mb-4">
    Đăng ký tài khoản với T&T Sport để dễ dàng thanh toán, lưu trữ thông tin giao hàng, theo dõi đơn hàng và nhiều tính năng tiện ích khác.
    </p>
    <button
      onClick={() => setCheckRegister(checkRegister === 2 ? 1 : 2)}
      className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700"
    >
      {checkRegister === 2 ? "Đăng nhập ngay" : "Đăng ký ngay"}
    </button>
  </div>
);

// Main Component
const LoginScreen = () => {
  const [checkRegister, setCheckRegister] = useState<number>(1);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Fade top distance="10%" duration={1000}>
        <div className="bg-white rounded-lg shadow-lg flex w-full max-w-4xl">
          <div className="w-1/2 p-6">
            <h2 className="text-xl font-semibold mb-4 text-center">
              {checkRegister === 1
                ? "Đăng nhập"
                : checkRegister === 2
                ? "Đăng ký"
                : "Đặt lại mật khẩu"}
            </h2>
            {checkRegister === 1 ? (
              <LoginForm setCheckRegister={setCheckRegister} />
            ) : checkRegister === 2 ? (
              <RegisterForm />
            ) : (
              <ForgotPasswordForm />
            )}
          </div>
          <div className="w-1/2 bg-gray-50">
            <RegistrationInfo
              checkRegister={checkRegister}
              setCheckRegister={setCheckRegister}
            />
          </div>
        </div>
      </Fade>
    </div>
  );
};

export default LoginScreen;