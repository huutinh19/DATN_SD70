

import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setToken, setUserToken } from "~/helper/useCookies";
import { Modal } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");

  const validateEmail = (email) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
  };

  const login = async () => {
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:8080/login-v2/singin`,
        data: {
          email: email,
          password: password,
        },
      });
      if (res.status) {
        if (jwtDecode(res.data.token).role === "ROLE_USER") {
          toast.error("Bạn không có quyền truy cập tính năng này!");
        } else {
          toast.success("Đăng nhập thành công");
          setToken(res.data.token);
          setUserToken(res.data.token);
          sessionStorage.setItem("idAccount", jwtDecode(res.data.token).id);
          navigate("/admin/product");
        }
      }
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(forgotEmail)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    try {
      const res = await axios({
        method: "post",
        url: `http://localhost:8080/login-v2/reset-password`,
        data: {
          emailForgot: forgotEmail,
        },
      });
      toast.success("Mật khẩu mới đã được gửi đến email của bạn!");
      setIsForgotPasswordModalVisible(false);
      setForgotEmail("");
    } catch (error) {
      toast.error(error.response.data);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Arial', sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          padding: "30px",
          borderRadius: "8px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "400px",
        }}
      >
        <h5
          style={{
            textAlign: "center",
            marginBottom: "20px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          ĐĂNG NHẬP
        </h5>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
              color: "#555",
            }}
          >
            Tài khoản
          </label>
          <input
            type="text"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            placeholder="Nhập email"
          />
          {errors.email && (
            <span style={{ color: "#dc3545", fontSize: "14px" }}>
              {errors.email}
            </span>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
              color: "#555",
            }}
          >
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            placeholder="Nhập mật khẩu"
          />
          {errors.password && (
            <span style={{ color: "#dc3545", fontSize: "14px" }}>
              {errors.password}
            </span>
          )}
        </div>
        <div style={{ marginBottom: "15px" }}>
          <button
            type="submit"
            onClick={login}
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              border: "none",
              borderRadius: "4px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Đăng nhập
          </button>
        </div>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => setIsForgotPasswordModalVisible(true)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              fontSize: "14px",
              cursor: "pointer",
              padding: "0",
              textDecoration: "underline",
            }}
          >
            <i className="fas fa-key" style={{ marginRight: "5px" }}></i> Quên
            mật khẩu?
          </button>
        </div>
      </div>

      <Modal
        title="Quên mật khẩu"
        visible={isForgotPasswordModalVisible}
        onOk={handleForgotPassword}
        onCancel={() => setIsForgotPasswordModalVisible(false)}
        okText="Gửi"
        cancelText="Hủy"
        okButtonProps={{
          style: {
            backgroundColor: "#007bff",
            borderColor: "#007bff",
            borderRadius: "4px",
          },
        }}
        cancelButtonProps={{
          style: {
            borderRadius: "4px",
          },
        }}
      >
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "500",
              color: "#555",
            }}
          >
            Nhập email của bạn
          </label>
          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              border: "1px solid #ced4da",
              borderRadius: "4px",
              fontSize: "16px",
              outline: "none",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#007bff")}
            onBlur={(e) => (e.target.style.borderColor = "#ced4da")}
            placeholder="Email"
          />
        </div>
      </Modal>
    </div>
  );
};

export default Login;