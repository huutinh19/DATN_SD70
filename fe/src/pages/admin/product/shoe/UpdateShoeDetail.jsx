import {
  Button,
  Col,
  Form,
  InputNumber,
  Modal,
  QRCode,
  Row,
  Select,
  Space,
  Tooltip,
} from "antd";
import { Option } from "antd/es/mentions";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import swal from "sweetalert";
import AddProperties from "~/components/Admin/Product/AddProperties";
import * as format from "~/utils/format";
import * as request from "~/utils/httpRequest";

function UpdateShoeDetail({ props, onSuccess }) {
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [listImages, setListImages] = useState();

  const [sole, setSole] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);

  const [searchSize, setSearchSize] = useState(null);
  const [searchColor, setSearchColor] = useState(null);
  const [searchSole, setSearchSole] = useState(null);

  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    form.setFieldsValue({
      size: props.size,
      color: props.color,
      sole: props.sole,
      quantity: props.quantity,
      price: props.price,
      weight: props.weight,
    });
  };

  const handleOk = (data) => {
    console.log(data);
    data.shoe = props.id;
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: `Xác nhận cập nhật chi tiết sản phẩm?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        await request
          .put(`/shoe-detail/${props.id}`, data)
          .then((response) => {
            toast.success("Cập nhật thành công!");
            setIsModalOpen(false);
            onSuccess();
          })
          .catch((e) => {
            toast.error(e.response.data);
          });
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const loadSize = () => {
    request
      .get("/size", { params: { name: searchSize, sizePage: 1_000_000 } })
      .then((response) => {
        setSize(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadColor = () => {
    request
      .get("/color", { params: { name: searchColor, sizePage: 1_000_000 } })
      .then((response) => {
        setColor(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const loadSole = () => {
    request
      .get("/sole", { params: { name: searchSole, sizePage: 1_000_000 } })
      .then((response) => {
        setSole(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    loadSize();
  }, [searchSize]);
  useEffect(() => {
    loadColor();
  }, [searchColor]);
  useEffect(() => {
    loadSole();
  }, [searchSole]);

  const handleSelectImg = (img) => {
    console.log(img);
  };

  // Custom validator for non-negative price
  const validateNonNegativePrice = (_, value) => {
    if (value < 0) {
      return Promise.reject("Đơn giá không được là số âm!");
    }
    return Promise.resolve();
  };

  // Custom validator for non-negative quantity
  const validateNonNegativeQuantity = (_, value) => {
    if (value < 0) {
      return Promise.reject("Số lượng không được là số âm!");
    }
    return Promise.resolve();
  };

  return (
    <>
      <Tooltip placement="top" title="Chỉnh sửa">
        <Button type="text" onClick={showModal}>
          <i className="fas fa-edit text-primary"></i>
        </Button>
      </Tooltip>
      <Modal
        title={props.name}
        open={isModalOpen}
        onCancel={handleCancel}
        footer={
          <>
            <Button
              type="primary"
              htmlType="submit"
              form="formUpdate"
              className="bg-primary"
            >
              Cập nhật
            </Button>
          </>
        }
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleOk} id="formUpdate">
          <Row gutter={24}>
            <Col xl={8}>
              <Form.Item
                label={"Kích cỡ"}
                name={"size"}
                rules={[
                  { required: true, message: "Kích cỡ không được để trống!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Nhập kích cỡ..."
                  optionFilterProp="children"
                  onSearch={setSearchSize}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Space className="my-2 ms-2">
                        {/* <AddProperties
                          placeholder={"kích cỡ"}
                          name={"size"}
                          onSuccess={() => loadSize()}
                        /> */}
                      </Space>
                    </>
                  )}
                >
                  <Option value="">Chọn kích cỡ</Option>
                  {size.map((item) => (
                    <Option key={item.id} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                label={"Màu sắc"}
                name={"color"}
                rules={[
                  { required: true, message: "Màu sắc không được để trống!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Nhập màu sắc..."
                  optionFilterProp="children"
                  onSearch={setSearchColor}
                  dropdownRender={(menu) => (
                    <>
                      {menu}
                      <Space className="my-2 ms-2">
                        {/* <AddProperties
                          placeholder={"màu sắc"}
                          name={"color"}
                          onSuccess={() => loadColor()}
                        /> */}
                      </Space>
                    </>
                  )}
                >
                  <Option value="">Chọn màu sắc</Option>
                  {color.map((item) => (
                    <Option key={item.id} value={item.name}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                label={"Đơn giá"}
                name={"price"}
                rules={[
                  { required: true, message: "Đơn giá không được để trống!" },
                  { validator: validateNonNegativePrice },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  className="w-100"
                  formatter={(value) =>
                    ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) =>
                    value !== null && value !== undefined
                      ? value.replace(/\$\s?|(,*)/g, "")
                      : ""
                  }
                  controls={false}
            
                  placeholder="Nhập giá trị đơn tối thiểu..."
                />
              </Form.Item>
            </Col>
            <Col xl={8}>
              <Form.Item
                label={"Số lượng"}
                name={"quantity"}
                rules={[
                  { required: true, message: "Số lượng không được để trống!" },
                  { validator: validateNonNegativeQuantity },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <InputNumber
                  className="w-100"
                  controls={false}
                  placeholder="Nhập số lượng..."
                />
              </Form.Item>
            </Col>
            <Col xl={20} className="d-flex justify-content-center">
              <QRCode value={props.code} size={300} />
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
}

export default UpdateShoeDetail;