



import { Button, Form, Input, Modal, Space } from "antd";
import React, { useState } from "react";
import * as request from "~/utils/httpRequest";
import GHNInfo from "~/components/GhnInfo";
import { toast } from "react-toastify";

function CustomerInfo({ onCustomerAdded }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataAddress, setDataAddress] = useState(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleAddCustomer = (data) => {
    const formData = new FormData();
    formData.append("address.name", data.name);
    formData.append("address.phoneNumber", data.phoneNumber);
    formData.append("address.specificAddress", data.specificAddress);
    formData.append("address.ward", dataAddress?.ward || "");
    formData.append("address.district", dataAddress?.district || "");
    formData.append("address.province", dataAddress?.province || "");
    formData.append("address.defaultAddress", true);

    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm khách hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        setLoading(true);
        request
          .post("/customer", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            setLoading(false);
            toast.success("Thêm thành công!");
            setIsModalOpen(false);
            form.resetFields();
            setDataAddress(null);
            if (onCustomerAdded) {
              onCustomerAdded(response.data);
            }
          })
          .catch((e) => {
            setLoading(false);
            toast.error(e.response?.data || "Đã xảy ra lỗi!");
          });
      },
    });
  };

  return (
    <>
      <Button
        type="primary"
        className="bg-primary text-white"
        icon={<i className="fas fa-plus-circle"></i>}
        onClick={() => setIsModalOpen(true)}
      >
        Thêm nhanh khách hàng
      </Button>
      <Modal
        title="Thêm nhanh khách hàng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={600} // Giảm kích thước modal cho gọn gàng hơn
        footer={null}
      >
        <Form onFinish={handleAddCustomer} layout="vertical" form={form}>
         

          {/* Nhóm 1: Thông tin cá nhân */}
          <div style={{ marginBottom: "24px" }}>
            <h4>Thông tin cá nhân</h4>
            <Form.Item
              label="Tên khách hàng"
              name="name"
              rules={[
                { required: true, message: "Tên không được để trống!" },
                {
                  pattern: /^[^\d!@#$%^&*()_+={}\\:;"'<>,.?/`~|-]+$/,
                  message: "Tên phải là chữ",
                },
              ]}
            >
              <Input placeholder="Nhập tên khách hàng..." />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: "Email không được để trống!" },
                {
                  pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Email không đúng định dạng!",
                },
              ]}
            >
              <Input placeholder="Nhập email..." />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phoneNumber"
              rules={[
                { required: true, message: "Số điện thoại không được để trống!" },
                { pattern: /^0[0-9]{9}$/, message: "SDT không đúng định dạng!" },
              ]}
            >
              <Input placeholder="Nhập số điện thoại..." />
            </Form.Item>
          </div>

          {/* Nhóm 2: Thông tin địa chỉ */}
          <div style={{ marginBottom: "24px" }}>
            <h4>Thông tin địa chỉ</h4>
            <Form.Item
              label="Địa chỉ cụ thể"
              name="specificAddress"
              rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
            >
              <Input placeholder="Nhập địa chỉ cụ thể..." />
            </Form.Item>
            {/* Giữ nguyên GHNInfo để lấy dữ liệu địa chỉ */}
            <GHNInfo dataAddress={setDataAddress} />
          </div>

          {/* Nút hành động */}
          <Form.Item>
            <Space style={{ float: "right" }}>
              <Button onClick={() => setIsModalOpen(false)}>Hủy</Button>
              <Button
                type="primary"
                htmlType="submit"
                className="bg-blue"
                loading={loading}
              >
                <i className="fas fa-plus me-2"></i> Thêm khách hàng
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default CustomerInfo;