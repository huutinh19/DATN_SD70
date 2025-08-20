



import {
  Breadcrumb,
  Button,
  Col,
  Divider,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Table,
  message,
  Tooltip,
  Form,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import * as request from "~/utils/httpRequest";
import FormatDate from "~/utils/FormatDate";
import { FaHome } from "react-icons/fa";
import { toast } from "react-toastify";
import FormatCurrency from "~/utils/FormatCurrency";
import VoucherSatus from "./VoucherSatus";
import "./Voucher.css";

function Voucher() {
  const { confirm } = Modal;
  const [voucherList, setVoucherList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [statusValue, setStatusValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [reloadInterval, setReloadInterval] = useState(null);
  const [selectedOption, setSelectedOption] = useState("voucher");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [form] = Form.useForm();

  const indexOfLastItem = currentPage * pageSize;
  const indexOfFirstItem = indexOfLastItem - pageSize;

  const handleOptionChange = (value) => {
    setSelectedOption(value);
  };

  useEffect(() => {
    loadVoucher();
    const intervalId = setInterval(() => {
      loadVoucher();
      console.log("test");
    }, 60000);
    setReloadInterval(intervalId);
    return () => clearInterval(intervalId);
  }, [searchValue, pageSize, currentPage, statusValue]);

  const loadVoucher = async () => {
    try {
      const response = await request.get("/voucher", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: statusValue,
        },
      });
      setVoucherList(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
  };

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận",
      content: "Bạn có chắc muốn kết thúc phiếu giảm giá này không?",
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .put(`/voucher/update/end-date/${item.id}`)
          .then((response) => {
            if (response.status === 200) {
              loadVoucher();
              toast.success("Kết thúc thành công!");
            }
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  };

  const showDetailModal = async (id) => {
    try {
      const response = await request.get(`/voucher/${id}`);
      setSelectedVoucher(response);
      form.setFieldsValue({
        code: response.code,
        name: response.name,
        quantity: response.quantity,
        minBillValue: response.minBillValue,
        maxBillValue: response.maxBillValue,
        percentReduce: response.percentReduce,
        startDate: new Date(response.startDate + "Z").toISOString().slice(0, 16),
        endDate: new Date(response.endDate + "Z").toISOString().slice(0, 16),
      });
      setIsModalVisible(true);
    } catch (e) {
      console.log(e);
      toast.error("Không thể tải thông tin voucher!");
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setSelectedVoucher(null);
    form.resetFields();
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber < 1) pageNumber = 1;
    setCurrentPage(pageNumber);
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (text, record, index) => indexOfFirstItem + index + 1,
    },
    {
      title: "Mã phiếu giảm giá",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Tên phiếu giảm giá",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Đơn hàng tối thiểu",
      dataIndex: "minBillValue",
      key: "minBillValue",
      render: (x) => <FormatCurrency value={x} />,
    },
    {
      title: "Giá trị giảm tối đa",
      dataIndex: "maxBillValue",
      key: "maxBillValue",
      render: (x) => <FormatCurrency value={x} />,
    },
    {
      title: "Giảm",
      dataIndex: "percentReduce",
      key: "percentReduce",
      render: (x) => `${x}%`,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Ngày bắt đầu",
      dataIndex: "startDate",
      key: "startDate",
      render: (x) => {
        const d = new Date(x);
        const formatted = d.toLocaleDateString("vi-VN");
        return (
          <span className="badge text-white p-2" style={{ backgroundColor: "#28a745" }}>
            {formatted}
          </span>
        );
      },
    },
    {
  title: "Ngày kết thúc",
  dataIndex: "endDate",
  key: "endDate",
  render: (x) => {
    const d = new Date(x);
    const formatted = d.toLocaleDateString("vi-VN");
    return (
      <span className="badge text-white p-2" style={{ backgroundColor: "#dc3545" }}>
        {formatted}
      </span>
    );
  },
},

    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (x) => <VoucherSatus status={x} />,
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "action",
      render: (x, item) => (
        <Space>
          <Tooltip placement="top" title="Xem chi tiết">
            <Button
              type="text"
              icon={<i className="fas fa-eye text-info"></i>}
              onClick={() => showDetailModal(x)}
            />
          </Tooltip>
          <Tooltip placement="top" title="Chỉnh sửa">
            <Link
              to={`/admin/voucher/${x}`}
              className={`btn btn-sm text-primary ${item.status === 2 ? "disabled" : ""}`}
              style={{ pointerEvents: item.status === 2 ? "none" : "auto", opacity: item.status === 2 ? 0.5 : 1 }}
            >
              <i className="fas fa-edit"></i>
            </Link>
          </Tooltip>
          <Tooltip placement="top" title="Kết thúc">
            <Button
              type="text"
              icon={<i className="fa-solid fa-calendar-xmark text-danger"></i>}
              onClick={() => showDeleteConfirm(item)}
            />
          </Tooltip>
        </Space>
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
        <h6 className="fw-semibold brand-title">Danh sách phiếu giảm giá</h6>
        <div className="card p-3 mb-3">
          <h6 className="fw-semibold">Bộ lọc</h6>
          <Row gutter={12}>
            <Col span={16}>
              <label className="mb-1">Nhập mã, tên phiếu giảm giá </label>
              <Input
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm phiếu giảm giá theo tên, mã ..."
              />
            </Col>
            <Col span={8}>
              <div className="mb-1">Trạng thái</div>
              <Select
                defaultValue=""
                style={{ width: "100%" }}
                onChange={(value) => {
                  setStatusValue(value);
                  setCurrentPage(1);
                }}
              >
                <Select.Option value="">Tất cả</Select.Option>
                <Select.Option value={0}>Sắp diễn ra</Select.Option>
                <Select.Option value={1}>Đang diễn ra</Select.Option>
                <Select.Option value={2}>Đã kết thúc</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div className="card p-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-semibold">Bảng phiếu giảm giá</h6>
            <Link to={"/admin/voucher/add"}>
              <Button type="primary" className="bg-warning" style={{ textAlign: "center" }}>
                <i className="fas fa-plus-circle me-1"></i>Thêm phiếu giảm giá
              </Button>
            </Link>
          </div>
          <Table
            dataSource={voucherList}
            columns={columns}
            className="mt-3"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: totalPages * pageSize,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </div>
      </div>

      {/* Modal for Voucher Details */}
      <Modal
        title="Thông tin phiếu giảm giá"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            Đóng
          </Button>,
        ]}
        width={600}
      >
        <Form layout="vertical" form={form}>
          <Row gutter={10}>
            <Col span={12}>
              <Form.Item label="Mã Voucher" name="code">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Tên phiếu giảm giá" name="name">
                <Input readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Số lượng" name="quantity">
                <Input type="number" readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Phần trăm giảm" name="percentReduce">
                <Input type="number" suffix="%" readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giá trị đơn tối thiểu" name="minBillValue">
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => (value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : "")}
                  controls={false}
                  readOnly
                  suffix="VNĐ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Giá trị giảm tối đa" name="maxBillValue">
                <InputNumber
                  style={{ width: "100%" }}
                  formatter={(value) => ` ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => (value !== null && value !== undefined ? value.replace(/\$\s?|(,*)/g, "") : "")}
                  controls={false}
                  readOnly
                  suffix="VNĐ"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày bắt đầu" name="startDate">
                <Input type="datetime-local" readOnly />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Ngày kết thúc" name="endDate">
                <Input type="datetime-local" readOnly />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </BaseUI>
  );
}

export default Voucher;