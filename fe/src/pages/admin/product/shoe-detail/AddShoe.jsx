






import {
  Breadcrumb,
  Button,
  Col,
  Collapse,
  Modal,
  Row,
  Select,
  Space,
} from "antd";
import { Option } from "antd/es/mentions";
import React, { useEffect, useState } from "react";
import { FaHome, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AddProperties from "~/components/Admin/Product/AddProperties";
import AddShoeModal from "~/components/Admin/Product/AddShoeModal";
import TableProduct from "~/components/Admin/Product/TableProduct";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import "./AddShoe.css";

function AddProduct() {
  const navigate = useNavigate();

  const [sole, setSole] = useState([]);
  const [size, setSize] = useState([]);
  const [color, setColor] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedSole, setSelectedSole] = useState(null);
  const [searchColor, setSearchColor] = useState(null);
  const [searchSole, setSearchSole] = useState(null);
  const [searchSize, setSearchSize] = useState(null);
  const [product, setProduct] = useState([]);
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDetail, setProductDetail] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalType, setModalType] = useState("");
  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  useEffect(() => {
    const options = [];
    selectedColors.forEach((colorItem) => {
      selectedSizes.forEach((sizeItem) => {
        const option = {
          shoe: selectedProduct,
          color: colorItem,
          size: sizeItem,
          sole: selectedSole,
          price: 200000,
          quantity: 100,
          deleted: false,
        };
        options.push(option);
      });
    });
    setProductDetail(options);
    console.log("Product Detail Options:", options);
  }, [selectedColors, selectedSizes, selectedProduct, selectedSole]);

  const handleChangeProductDetail = (items, hasErrors, removedColorId, removedSizeId) => {
    console.log("--- đã nhảy sang add shoe ---");
    setProductDetail(items);
    setHasValidationErrors(hasErrors);

    // Cập nhật selectedColors và selectedSizes nếu màu sắc hoặc kích cỡ bị xóa
    if (removedColorId) {
      setSelectedColors((prev) => prev.filter((color) => color.id !== removedColorId));
    }
    if (removedSizeId) {
      setSelectedSizes((prev) => prev.filter((size) => size.id !== removedSizeId));
    }

    console.log("Updated Product Detail:", items);
  };

  const loadShoe = () => {
    request
      .get("/shoe", {
        params: { name: searchProduct, sizePage: 1_000_000 },
      })
      .then((response) => {
        setProduct(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadSize = () => {
    request
      .get("/size", {
        params: { name: searchSize, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        console.log("Size Data from API:", response.data);
        setSize(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const loadColor = () => {
    request
      .get("/color", {
        params: { name: searchColor, status: false, sizePage: 1_000_000 },
      })
      .then((response) => {
        console.log("Color Data from API:", response.data);
        setColor(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showModal = (type) => {
    setModalType(type);
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    loadShoe();
  }, [searchProduct]);

  useEffect(() => {
    loadSize();
  }, [searchSize]);

  useEffect(() => {
    loadColor();
  }, [searchColor]);

  const handleCreate = () => {
    if (!selectedProduct || selectedSizes.length === 0 || selectedColors.length === 0) {
      toast.error("Vui lòng chọn đầy đủ sản phẩm, kích cỡ và màu sắc!");
      return;
    }
    if (hasValidationErrors) {
      toast.error("Vui lòng sửa các lỗi trước khi thêm sản phẩm!");
      return;
    }

    const data = [];
    productDetail.forEach((item) => {
      const x = {
        shoe: item.shoe.id,
        color: item.color.id,
        size: item.size.id,
        quantity: item.quantity,
        price: item.price,
        weight: item.weight,
      };
      data.push(x);
    });

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm sản phẩm ?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        await request
          .post("/shoe-detail", data)
          .then((response) => {
            toast.success("Thêm thành công!");
            navigate("/admin/product");
          })
          .catch((e) => {
            console.log(e);
            toast.error("Có lỗi xảy ra khi thêm sản phẩm!");
          });
      },
    });
  };

  return (
    <BaseUI>
      <div className="">
        <h6 className="fw-semibold brand-title">Thêm sản phẩm chi tiết</h6>
        <div className="form-container">
          <div className="product-form">
            <Row gutter={24}>
              <Col xl={24}>
                <label className="mb-1">Tên sản phẩm</label>
                <div className="d-flex align-items-center">
                  <Select
                    className="me-2 w-100"
                    size="large"
                    showSearch
                    onChange={(value) => {
                      setSelectedProduct(
                        product.find((item) => item.id === value)
                      );
                    }}
                    placeholder="Nhập tên áo..."
                    optionFilterProp="children"
                    onSearch={setSearchProduct}
                    value={selectedProduct ? selectedProduct.id : null}
                  >
                    <Option value="">Chọn áo</Option>
                    {product.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                  <AddShoeModal onAddSuccess={() => loadShoe()} />
                </div>
              </Col>
              <Col xl={12} className="mt-3">
                <label className="mb-1">Kích cỡ</label>
                <div className="d-flex align-items-center">
                  <Select
                    className="me-2 w-100"
                    size="large"
                    showSearch
                    mode="multiple"
                    onChange={async (selectedValues) => {
                      setSelectedSizes(
                        await Promise.all(
                          selectedValues.map(async (item) => {
                            return await request.get(`/size/${item}`);
                          })
                        )
                      );
                    }}
                    placeholder="Nhập kích cỡ..."
                    optionFilterProp="children"
                    onSearch={setSearchSize}
                    value={selectedSizes.map((size) => size.id)}
                  >
                    {size.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type="primary"
                    onClick={() => showModal("size")}
                    shape="circle"
                    size="large"
                  >
                    <FaPlusCircle />
                  </Button>
                </div>
              </Col>
              <Col xl={12} className="mt-3">
                <label className="mb-1">Màu sắc</label>
                <div className="d-flex align-items-center">
                  <Select
                    className="me-2 w-100"
                    size="large"
                    showSearch
                    mode="multiple"
                    onChange={async (selectedValues) => {
                      setSelectedColors(
                        await Promise.all(
                          selectedValues.map(async (item) => {
                            return await request.get(`/color/${item}`);
                          })
                        )
                      );
                    }}
                    placeholder="Nhập màu sắc..."
                    optionFilterProp="children"
                    onSearch={setSearchColor}
                    value={selectedColors.map((color) => color.id)}
                  >
                    {color.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                  <Button
                    type="primary"
                    onClick={() => showModal("color")}
                    shape="circle"
                    size="large"
                  >
                    <FaPlusCircle />
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </div>

        <Modal
          title={`Thêm ${modalType === "size" ? "Kích cỡ" : "Màu sắc"}`}
          open={isModalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          footer={null}
        >
          <AddProperties
            placeholder={modalType === "size" ? "kích cỡ" : "màu sắc"}
            name={modalType}
            onSuccess={() => {
              if (modalType === "size") loadSize();
              if (modalType === "color") loadColor();
              handleModalOk();
            }}
          />
        </Modal>

        {selectedProduct === null ||
        selectedProduct === undefined ||
        selectedSizes.length === 0 ||
        selectedColors.length === 0 ? (
          ""
        ) : (
          <>
            <TableProduct
              props={productDetail}
              handleChange={handleChangeProductDetail}
            />
            <Button
              type="primary"
              className="bg-blue float-end mt-3"
              onClick={handleCreate}
              disabled={hasValidationErrors || !selectedProduct || selectedSizes.length === 0 || selectedColors.length === 0}
            >
              Thêm sản phẩm
            </Button>
          </>
        )}
      </div>
    </BaseUI>
  );
}

export default AddProduct;