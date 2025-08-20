



import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";
import { toast } from "react-toastify";
import { Button, Form, Input, Modal, Select, Flex } from "antd";
import { FaPlusCircle } from "react-icons/fa";
import ImageGallery from "./ImageGallery";
import "./AddShoeModal.css";
import { ExclamationCircleFilled } from "@ant-design/icons";
import AddProperties from "~/components/Admin/Product/AddProperties";

function AddShoeModal({ onAddSuccess }) {
  const { confirm } = Modal;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchXuatXu, setSearchXuatXu] = useState(null);
  const [xuatXuList, setXuatXuList] = useState([]);
  const [searchBrand, setSearchBrand] = useState(null);
  const [brandList, setBrandList] = useState([]);
  const [searchCoAo, setSearchCoAo] = useState(null);
  const [coAoList, setCoAoList] = useState([]);
  const [searchTayAo, setSearchTayAo] = useState(null);
  const [tayAoList, setTayAoList] = useState([]);
  const [searchChatLieu, setSearchChatLieu] = useState(null);
  const [chatLieuList, setChatLieuList] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isPropertyModalOpen, setIsPropertyModalOpen] = useState(false);
  const [propertyType, setPropertyType] = useState("");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = (data) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn thêm sản phẩm áo mới?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        if (selectedImages.length === 0) {
          toast.error("Hình ảnh không được để trống!");
          return;
        }

        const formData = new FormData();
        formData.append("code", data.code);
        formData.append("name", data.name);
        formData.append("xuatXu", data.xuatXu);
        formData.append("thuongHieu", data.thuongHieu);
        formData.append("coAo", data.coAo);
        formData.append("tayAo", data.tayAo);
        formData.append("chatLieu", data.chatLieu);
        formData.append("description", data.description || "");

        selectedImages.forEach((url) => {
          formData.append("listImages", url);
        });

        request
          .post("/shoe", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
          .then((response) => {
            toast.success("Thêm thành công!");
            onAddSuccess();
            form.resetFields();
            setSelectedImages([]);
            setIsModalOpen(false);
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response?.data || "Có lỗi xảy ra!");
          });
      },
      onCancel() {
        console.log("Hủy thêm sản phẩm");
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const loadXuatXu = () => {
    request
      .get("/xuatxu", {
        params: { name: searchXuatXu, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        setXuatXuList(response.data);
      });
  };

  const loadBrand = () => {
    request
      .get("/brand", {
        params: { name: searchBrand, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        setBrandList(response.data);
      });
  };

  const loadCoAo = () => {
    request
      .get("/coao", {
        params: { name: searchCoAo, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        setCoAoList(response.data);
      });
  };

  const loadTayAo = () => {
    request
      .get("/tayao", {
        params: { name: searchTayAo, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        setTayAoList(response.data);
      });
  };

  const loadChatLieu = () => {
    request
      .get("/chatlieu", {
        params: { name: searchChatLieu, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        setChatLieuList(response.data);
      });
  };

  useEffect(() => {
    loadXuatXu();
  }, [searchXuatXu]);

  useEffect(() => {
    loadBrand();
  }, [searchBrand]);

  useEffect(() => {
    loadCoAo();
  }, [searchCoAo]);

  useEffect(() => {
    loadTayAo();
  }, [searchTayAo]);

  useEffect(() => {
    loadChatLieu();
  }, [searchChatLieu]);

  const handleImageSelect = (imageUrl, isRemoving = false) => {
    if (isRemoving) {
      setSelectedImages((prev) => prev.filter((url) => url !== imageUrl));
    } else {
      if (selectedImages.length >= 5) {
        toast.error("Tổng số ảnh không được vượt quá 5!");
        return;
      }
      setSelectedImages((prev) => [...prev, imageUrl]);
    }
  };

  const handleShowGallery = () => {
    setIsGalleryModalOpen(true);
  };

  const handleCloseGalleryModal = () => {
    setIsGalleryModalOpen(false);
  };

  const showPropertyModal = (type) => {
    setPropertyType(type);
    setIsPropertyModalOpen(true);
  };

  const handlePropertyModalOk = () => {
    setIsPropertyModalOpen(false);
  };

  const handlePropertyModalCancel = () => {
    setIsPropertyModalOpen(false);
  };

  return (
    <>
      <Button type="primary" onClick={showModal} shape="circle" size="large">
        <FaPlusCircle />
      </Button>
      <Modal
        title="Thêm áo"
        open={isModalOpen}
        onCancel={handleCancel}
        footer=""
        width={800}
      >
        <Form onFinish={handleOk} layout="vertical" form={form}>
          

          <Form.Item
            label="Tên áo"
            name="name"
            rules={[{ required: true, message: "Tên không được để trống!" }]}
          >
            <Input placeholder="Nhập tên áo..." />
          </Form.Item>

          <Form.Item
            label="Mô tả"
            name="description"
            rules={[{ required: false }]}
          >
            <Input.TextArea placeholder="Nhập mô tả sản phẩm..." rows={4} />
          </Form.Item>

          <div className="uniform-form-item">
            <Form.Item
              label="Xuất xứ"
              name="xuatXu"
              rules={[{ required: true, message: "Xuất xứ không được để trống!" }]}
              style={{ flex: 1 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchXuatXu}
                placeholder="Chọn xuất xứ..."
              >
                {xuatXuList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => showPropertyModal("xuatxu")}
              shape="circle"
              size="large"
            >
              <FaPlusCircle />
            </Button>
          </div>

          <div className="uniform-form-item">
            <Form.Item
              label="Thương hiệu"
              name="thuongHieu"
              rules={[{ required: true, message: "Thương hiệu không được để trống!" }]}
              style={{ flex: 1 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchBrand}
                placeholder="Chọn thương hiệu..."
              >
                {brandList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => showPropertyModal("brand")}
              shape="circle"
              size="large"
            >
              <FaPlusCircle />
            </Button>
          </div>

          <div className="uniform-form-item">
            <Form.Item
              label="Cổ áo"
              name="coAo"
              rules={[{ required: true, message: "Cổ áo không được để trống!" }]}
              style={{ flex: 1 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchCoAo}
                placeholder="Chọn cổ áo..."
              >
                {coAoList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => showPropertyModal("coao")}
              shape="circle"
              size="large"
            >
              <FaPlusCircle />
            </Button>
          </div>

          <div className="uniform-form-item">
            <Form.Item
              label="Tay áo"
              name="tayAo"
              rules={[{ required: true, message: "Tay áo không được để trống!" }]}
              style={{ flex: 1 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchTayAo}
                placeholder="Chọn tay áo..."
              >
                {tayAoList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => showPropertyModal("tayao")}
              shape="circle"
              size="large"
            >
              <FaPlusCircle />
            </Button>
          </div>

          <div className="uniform-form-item">
            <Form.Item
              label="Chất liệu"
              name="chatLieu"
              rules={[{ required: true, message: "Chất liệu không được để trống!" }]}
              style={{ flex: 1 }}
            >
              <Select
                showSearch
                optionFilterProp="children"
                style={{ width: "100%" }}
                onSearch={setSearchChatLieu}
                placeholder="Chọn chất liệu..."
              >
                {chatLieuList.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Button
              type="primary"
              onClick={() => showPropertyModal("chatlieu")}
              shape="circle"
              size="large"
            >
              <FaPlusCircle />
            </Button>
          </div>

          <Form.Item label="Hình ảnh" name="listImages">
            <Button type="default" onClick={handleShowGallery}>
              <FaPlusCircle /> Chọn ảnh
            </Button>
            {selectedImages.length > 0 && (
              <div className="mt-2">
                <p>Danh sách ảnh đã chọn</p>
                <div className="d-flex flex-wrap gap-2">
                  {selectedImages.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        border: "2px dashed #fa8c16",
                        padding: "5px",
                      }}
                    >
                      <img
                        src={url}
                        alt={`selected-${index}`}
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        onClick={() => handleImageSelect(url, true)}
                        style={{
                          position: "absolute",
                          top: "0",
                          right: "0",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          width: "20px",
                          height: "20px",
                          cursor: "pointer",
                        }}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Form.Item>

          <div className="d-flex justify-content-end">
            <Button type="primary" htmlType="submit">
              <i className="fas fa-plus-circle me-1"></i> Thêm
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="Danh sách ảnh"
        open={isGalleryModalOpen}
        onCancel={handleCloseGalleryModal}
        footer={[
          <Button
            key="close"
            type="primary"
            danger
            onClick={handleCloseGalleryModal}
          >
            OK
          </Button>,
        ]}
        width={800}
      >
        <div style={{ maxHeight: "400px", overflowY: "auto" }}>
          {selectedImages.length > 0 && (
            <div className="mt-2">
              <p>Danh sách ảnh đã chọn</p>
              <div className="d-flex flex-wrap gap-2">
                {selectedImages.map((url, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      border: "2px dashed #fa8c16",
                      padding: "5px",
                    }}
                  >
                    <img
                      src={url}
                      alt={`selected-${index}`}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      onClick={() => handleImageSelect(url, true)}
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          <ImageGallery
            onImageSelect={handleImageSelect}
            selectedImages={selectedImages}
          />
        </div>
      </Modal>

      <Modal
        title={`Thêm ${
          propertyType === "xuatxu"
            ? "Xuất xứ"
            : propertyType === "brand"
            ? "Thương hiệu"
            : propertyType === "coao"
            ? "Cổ áo"
            : propertyType === "tayao"
            ? "Tay áo"
            : "Chất liệu"
        }`}
        open={isPropertyModalOpen}
        onOk={handlePropertyModalOk}
        onCancel={handlePropertyModalCancel}
        footer={null}
      >
        <AddProperties
          placeholder={
            propertyType === "xuatXu"
              ? "xuất xứ"
              : propertyType === "thuongHieu"
              ? "thương hiệu"
              : propertyType === "coAo"
              ? "cổ áo"
              : propertyType === "tayAo"
              ? "tay áo"
              : "chất liệu"
          }
          name={propertyType}
          onSuccess={() => {
            if (propertyType === "xuatxu") loadXuatXu();
            if (propertyType === "brand") loadBrand();
            if (propertyType === "coao") loadCoAo();
            if (propertyType === "tayao") loadTayAo();
            if (propertyType === "chatlieu") loadChatLieu();
            handlePropertyModalOk();
          }}
        />
      </Modal>
    </>
  );
}

export default AddShoeModal;