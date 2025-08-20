import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Select, Tooltip } from "antd";
import { toast } from "react-toastify";
import * as request from "~/utils/httpRequest";
import ImageGallery from "./ImageGallery";
import { FaPlusCircle } from "react-icons/fa";

function UpdateShoe({ props, onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
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

  const showModal = () => {
    setIsModalOpen(true);
    loadExistingImages();
  };

  const loadExistingImages = async () => {
    try {
      const response = await request.get(`/shoe/${props.id}/images`);
      setSelectedImages(response || []);
    } catch (e) {
      console.error("Lỗi khi tải ảnh:", e);
      toast.error("Không thể tải ảnh hiện tại!");
    }
  };

  const handleOk = (data) => {
    if (selectedImages.length === 0) {
      toast.error("Hình ảnh không được để trống!");
      return;
    }

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận cập nhật thông tin sản phẩm?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
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

        try {
          await request.put(`/shoe/${props.id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          toast.success("Cập nhật thành công!");
          setIsModalOpen(false);
          setIsGalleryModalOpen(false);
          onSuccess();
          form.resetFields();
          setSelectedImages([]);
        } catch (e) {
          console.error("Update error:", e);
          toast.error(e.response?.data || "Có lỗi xảy ra khi cập nhật!");
        }
      },
    });
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setSelectedImages([]);
  };

  const loadXuatXu = () => {
    request
      .get("/xuatxu", { params: { name: searchXuatXu } })
      .then((response) => setXuatXuList(response.data))
      .catch((e) => console.error(e));
  };

  const loadBrand = () => {
    request
      .get("/brand", { params: { name: searchBrand } })
      .then((response) => setBrandList(response.data))
      .catch((e) => console.error(e));
  };

  const loadCoAo = () => {
    request
      .get("/coao", { params: { name: searchCoAo } })
      .then((response) => setCoAoList(response.data))
      .catch((e) => console.error(e));
  };

  const loadTayAo = () => {
    request
      .get("/tayao", { params: { name: searchTayAo } })
      .then((response) => setTayAoList(response.data))
      .catch((e) => console.error(e));
  };

  const loadChatLieu = () => {
    request
      .get("/chatlieu", { params: { name: searchChatLieu } })
      .then((response) => setChatLieuList(response.data))
      .catch((e) => console.error(e));
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

  return (
    <>
      <Tooltip placement="bottom" title="Chỉnh sửa sản phẩm">
        <Button type="primary" className="bg-primary" onClick={showModal}>
          <i className="fas fa-edit me-1"></i>
        </Button>
      </Tooltip>
      <Modal
        title="Cập nhật thông tin sản phẩm"
        open={isModalOpen}
        onCancel={handleCancel}
        footer=""
        width={800}
      >
        <Form
          form={form}
          onFinish={handleOk}
          layout="vertical"
          initialValues={{
            code: props.code,
            name: props.name,
            xuatXu: props.xuatXu?.id,
            thuongHieu: props.thuongHieu?.id,
            coAo: props.coAo?.id,
            tayAo: props.tayAo?.id,
            chatLieu: props.chatLieu?.id,
            description: props.description,
          }}
        >
          {/* <Form.Item
            label="Mã sản phẩm"
            name="code"
            rules={[{ required: true, message: "Mã sản phẩm không được để trống!" }]}
          >
            <Input placeholder="Nhập mã sản phẩm..." />
          </Form.Item> */}

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
            <Input.TextArea
              placeholder="Nhập mô tả sản phẩm..."
              rows={4}
            />
          </Form.Item>

          <Form.Item
            label="Xuất xứ"
            name="xuatXu"
            rules={[{ required: true, message: "Xuất xứ không được để trống!" }]}
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

          <Form.Item
            label="Thương hiệu"
            name="thuongHieu"
            rules={[{ required: true, message: "Thương hiệu không được để trống!" }]}
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

          <Form.Item
            label="Cổ áo"
            name="coAo"
            rules={[{ required: true, message: "Cổ áo không được để trống!" }]}
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

          <Form.Item
            label="Tay áo"
            name="tayAo"
            rules={[{ required: true, message: "Tay áo không được để trống!" }]}
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

          <Form.Item
            label="Chất liệu"
            name="chatLieu"
            rules={[{ required: true, message: "Chất liệu không được để trống!" }]}
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
            <Button type="primary" htmlType="submit" className="bg-primary">
              <i className="fas fa-edit me-1"></i> Cập nhật
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
    </>
  );
}

export default UpdateShoe;