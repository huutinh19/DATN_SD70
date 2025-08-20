


import { Button, Col, Form, Input, Modal, Radio, Row } from 'antd';
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { ExclamationCircleFilled } from '@ant-design/icons';
import AddressStaffDetail from '~/components/Admin/Account/Staff/AddressStaffDetail';
import Loading from '~/components/Loading/Loading';
import { getTokenEmpoloyee } from '~/helper/useCookies';
import * as request from '~/utils/httpRequest';
import BaseUI from "~/layouts/admin/BaseUI";
import axios from "axios";

function UserProfile() {
  const [profile, setProfile] = useState();
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const decodedToken = jwtDecode(getTokenEmpoloyee());
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isChangePasswordModalVisible, setIsChangePasswordModalVisible] = useState(false);

  const handleImageSelect = (event) => {
    try {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      setAvatar(file);
    } catch (e) {
      setPreviewUrl(null);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await request.get(`/staff/${decodedToken.id}`).then(response => {
      setProfile(response);
      form.setFieldsValue({
        username: response.username,
        cccd: response.cccd,
        name: response.name,
        birthday: response.birthday,
        gender: response.gender,
        email: response.email,
        phoneNumber: response.phoneNumber
      });
      setLoading(false);
    }).catch(e => {
      console.log(e);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChangePassword = async (values) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn đổi mật khẩu?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const response = await axios({
            method: "post",
            url: `http://localhost:8080/login-v2/change-password`,
            data: {
              email: profile.email,
              password: values.currentPassword,
              newPassword: values.newPassword
            },
          });
          toast.success(response.data);
          setIsChangePasswordModalVisible(false);
          passwordForm.resetFields();
        } catch (error) {
          toast.error(error.response.data);
        }
      },
      onCancel: () => {
        console.log("Hủy đổi mật khẩu");
      },
    });
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <BaseUI userAvatar={previewUrl || profile.avatar}>
      <h6>Thông tin cá nhân</h6>
      <Row gutter={10}>
        <Col xl={10}>
          <Form layout="vertical" form={form}>
            {previewUrl !== null ? (
              <div className="text-center">
                <img src={previewUrl} alt="Preview" style={{ width: "162px", height: "162px" }} className="mt-2 border border-warning shadow-lg bg-body-tertiary rounded-circle object-fit-contain" />
                <Button className="position-absolute border-0" onClick={() => { setPreviewUrl(null); setAvatar(null); }}><FaTrash className="text-danger" /></Button>
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center">
                <div className="position-relative rounded-circle border border-warning mt-2 d-flex align-items-center justify-content-center" style={{ width: "162px", height: "162px" }}>
                  <Input type="file" accept="image/*" onChange={handleImageSelect} className="position-absolute opacity-0 py-5" />
                  <div className="text-center text-secondary">
                    <img src={profile.avatar} alt="Preview" style={{ width: "162px", height: "162px" }} className="border border-primary shadow-lg bg-body-tertiary rounded-circle object-fit-contain" />
                  </div>
                </div>
              </div>
            )}
            <Row gutter={10}>
              <Col xl={12}>
                <Form.Item label={"Username"} name={"username"}>
                  <Input placeholder="Nhập username..." disabled />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Tên nhân viên"} name={"name"}>
                  <Input placeholder="Nhập tên nhân viên..." disabled />
                </Form.Item>
              </Col>
              <Col xl={24}>
                <Form.Item label={"Mã định danh (Số CMT/CCCD)"} name={"cccd"}>
                  <Input placeholder="Nhập mã định danh..." disabled />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Email"} name={"email"}>
                  <Input placeholder="Nhập email ..." disabled />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Số điện thoại"} name={"phoneNumber"}>
                  <Input placeholder="Nhập số điện thoại ..." disabled />
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Giới tính"} name={"gender"}>
                  <Radio.Group disabled>
                    <Radio value={"Nam"}>Nam</Radio>
                    <Radio value={"Nữ"}>Nữ</Radio>
                  </Radio.Group>
                </Form.Item>
              </Col>
              <Col xl={12}>
                <Form.Item label={"Ngày sinh"} name={"birthday"}>
                  <Input type="date" disabled />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item className="float-end">
              <Button 
                type="default" 
                onClick={() => setIsChangePasswordModalVisible(true)}
              >
                <i className="fas fa-key me-2"></i> Đổi mật khẩu
              </Button>
            </Form.Item>
          </Form>
        </Col>
        {/* <Col xl={14}>
          <AddressStaffDetail idStaff={decodedToken.id} />
        </Col> */}
      </Row>

      <Modal
        title="Đổi mật khẩu"
        visible={isChangePasswordModalVisible}
        onCancel={() => {
          setIsChangePasswordModalVisible(false);
          passwordForm.resetFields();
        }}
        footer={null}
      >
        <Form
          form={passwordForm}
          layout="vertical"
          onFinish={handleChangePassword}
        >
          <Form.Item
            label="Mật khẩu hiện tại"
            name="currentPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu hiện tại" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="newPassword"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu mới!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>
          <Form.Item
            label="Xác nhận mật khẩu mới"
            name="confirmNewPassword"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-blue">
              Đổi mật khẩu
            </Button>
            <Button
              type="default"
              onClick={() => {
                setIsChangePasswordModalVisible(false);
                passwordForm.resetFields();
              }}
              className="ms-2"
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </BaseUI>
  );
}

export default UserProfile;