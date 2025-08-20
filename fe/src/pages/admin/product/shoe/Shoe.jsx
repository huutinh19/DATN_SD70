


import { Button, Col, Input, Carousel, Row, Select, Switch, Table, Tooltip, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";

function Shoe() {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [listXuatXu, setListXuatXu] = useState([]);
  const [listBrand, setListBrand] = useState([]);
  const [listCoAo, setListCoAo] = useState([]);
  const [listTayAo, setListTayAo] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [selectedXuatXu, setSelectedXuatXu] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCoAo, setSelectedCoAo] = useState(null);
  const [selectedTayAo, setSelectedTayAo] = useState(null);
  const [selectedChatLieu, setSelectedChatLieu] = useState(null);
  const [searchValue, setSearchValue] = useState("");
  const [statusProduct, setStatusProduct] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const { confirm } = Modal;

  useEffect(() => {
    request.get("/xuatxu", { params: { status: false } }).then((response) => {
      setListXuatXu(response.data);
    }).catch((error) => { console.log(error); });
    request.get("/brand", { params: { status: false } }).then((response) => {
      setListBrand(response.data);
    }).catch((error) => { console.log(error); });
    request.get("/coao", { params: { status: false } }).then((response) => {
      setListCoAo(response.data);
    }).catch((error) => { console.log(error); });
    request.get("/tayao", { params: { status: false } }).then((response) => {
      setListTayAo(response.data);
    }).catch((error) => { console.log(error); });
    request.get("/chatlieu", { params: { status: false } }).then((response) => {
      setListChatLieu(response.data);
    }).catch((error) => { console.log(error); });
  }, []);

  useEffect(() => {
    loadData(currentPage, pageSize, searchValue, selectedXuatXu, selectedBrand, selectedCoAo, selectedTayAo, selectedChatLieu, statusProduct);
  }, [currentPage, pageSize, searchValue, selectedXuatXu, selectedBrand, selectedCoAo, selectedTayAo, selectedChatLieu, statusProduct]);

  const loadData = (currentPage, pageSize, searchValue, xuatXu, thuongHieu, coAo, tayAo, chatLieu, status) => {
    request
      .get("/shoe", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          xuatXu: xuatXu,
          thuongHieu: thuongHieu,
          coAo: coAo,
          tayAo: tayAo,
          chatLieu: chatLieu,
          status: status,
        },
      })
      .then((response) => {
        setProductList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: "Bạn có chắc muốn sửa trạng thái hoạt động?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/shoe/${item.id}`)
          .then((response) => {
            if (response.status === 200) {
              loadData(currentPage, pageSize, searchValue, selectedXuatXu, selectedBrand, selectedCoAo, selectedTayAo, selectedChatLieu, statusProduct);
              toast.success("Thành công!");
            }
          })
          .catch((e) => {
            console.log(e);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const columns = [
    { title: "STT", dataIndex: "index", key: "index", className: "text-center" },
    { title: "Mã", dataIndex: "code", key: "code", className: "text-center" },
    {
      title: "Ảnh",
      dataIndex: "images",
      key: "images",
      className: "text-center",
      render: (images) => (
        <Carousel autoplay autoplaySpeed={3000} dots={false} arrows={false} style={{ width: "100px" }}>
          {images.split(",").map((image, index) => (
            <img
              key={index}
              src={image}
              alt="images"
              style={{ width: "100px", height: "100px" }}
              className="object-fit-contain"
            />
          ))}
        </Carousel>
      ),
    },
    { title: "Tên", dataIndex: "name", key: "name", className: "text-center" },
    { title: "Xuất xứ", dataIndex: "xuatXu", key: "xuatXu", className: "text-center" },
    { title: "Thương hiệu", dataIndex: "thuongHieu", key: "thuongHieu", className: "text-center" },
    { title: "Cổ áo", dataIndex: "coAo", key: "coAo", className: "text-center" },
    { title: "Tay áo", dataIndex: "tayAo", key: "tayAo", className: "text-center" },
    { title: "Chất liệu", dataIndex: "chatLieu", key: "chatLieu", className: "text-center" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      className: "text-center",
      render: (x) => (x == null ? 0 : x),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      className: "text-center",
      render: (x, item) => (
        <Switch
          className={x ? "bg-danger" : "bg-warning"}
          checkedChildren={<i className="fa-solid fa-check"></i>}
          unCheckedChildren={<i className="fa-solid fa-xmark"></i>}
          checked={!x}
          onChange={() => showDeleteConfirm(item)}
        />
      ),
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "action",
      className: "text-center",
      render: (x) => (
        <Tooltip placement="top" title="Chỉnh sửa">
          <Link to={`/admin/product/${x}`}>
            <button type="button" className="btn btn-sm text-primary">
              <i className="fas fa-edit"></i>
            </button>
          </Link>
        </Tooltip>
      ),
    },
  ];

  const customStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

    .brand-container {
      padding: 24px;
      background: #f8f9fe;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }

    .brand-title {
      color: #2c3e50;
      font-weight: 600;
      font-size: 24px;
      margin-bottom: 24px;
      letter-spacing: 0.5px;
    }
  `;

  const styleSheet = document.createElement("style");
  styleSheet.textContent = customStyles;
  document.head.appendChild(styleSheet);

  return (
    <BaseUI>
      <div className="brand-container">
        <h6 className="fw-semibold brand-title">Danh sách sản phẩm</h6>
        <div className="card p-3 mb-3">
          <h6 className="fw-semibold">Bộ lọc</h6>
          <Row gutter={10}>
            <Col span={12}>
              <label className="mb-1">Tên sản phẩm</label>
              <Input
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm sản phẩm theo tên..."
              />
            </Col>
            <Col span={4}>
              <label className="mb-1">Xuất xứ</label>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setSelectedXuatXu(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                {listXuatXu.map((xuatXu) => (
                  <Select.Option key={xuatXu.id} value={xuatXu.id}>
                    {xuatXu.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <label className="mb-1">Thương hiệu</label>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setSelectedBrand(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                {listBrand.map((brand) => (
                  <Select.Option key={brand.id} value={brand.id}>
                    {brand.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <label className="mb-1">Cổ áo</label>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setSelectedCoAo(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                {listCoAo.map((coAo) => (
                  <Select.Option key={coAo.id} value={coAo.id}>
                    {coAo.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <label className="mb-1">Tay áo</label>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setSelectedTayAo(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                {listTayAo.map((tayAo) => (
                  <Select.Option key={tayAo.id} value={tayAo.id}>
                    {tayAo.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <label className="mb-1">Chất liệu</label>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setSelectedChatLieu(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                {listChatLieu.map((chatLieu) => (
                  <Select.Option key={chatLieu.id} value={chatLieu.id}>
                    {chatLieu.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col span={4}>
              <label className="mb-1">Trạng thái</label>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setStatusProduct(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                <Select.Option value={false}>Đang bán</Select.Option>
                <Select.Option value={true}>Ngừng bán</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-semibold">Bảng sản phẩm</h6>
            <Link to={"/admin/product/add"}>
              <Button type="primary" className="bg-primary w-100">
                <i className="fas fa-plus-circle me-1"></i>Thêm sản phẩm
              </Button>
            </Link>
          </div>
          <Table
            dataSource={productList}
            columns={columns}
            className="mt-3"
            pagination={{
              showSizeChanger: true,
              current: currentPage,
              pageSize: pageSize,
              pageSizeOptions: [3, 5, 10, 20],
              showQuickJumper: true,
              total: totalPages * pageSize,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </div>
      </div>
    </BaseUI>
  );
}

export default Shoe;