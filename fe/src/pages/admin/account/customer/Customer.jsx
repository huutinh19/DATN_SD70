
import { Button, Col, Input, Select, Row, Table, Modal, Switch, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

function Customer() {
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [customerStatus, setCustomerStatus] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const { confirm } = Modal;

  useEffect(() => {
    loadData(currentPage, pageSize, searchValue, customerStatus);
  }, [searchValue, pageSize, customerStatus, currentPage]);

  const loadData = (currentPage, pageSize, searchValue, status) => {
    request
      .get("/customer", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: status,
        },
      })
      .then((response) => {
        console.log("Customer data response:", response); // Debug response
        setCustomerList(response.data.map((item, index) => ({ ...item, key: item.id, index: (currentPage - 1) * pageSize + index + 1 })));
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.error("Error loading customer data:", e);
        toast.error("Lỗi khi tải dữ liệu khách hàng!");
      });
  };

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc muốn cập nhật trạng thái của khách hàng ${item.name} thành ${
        item.status ? "Đang hoạt động" : "Không hoạt động"
      }?`,
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/customer/${item.id}`)
          .then((response) => {
            console.log("Status update response:", response); // Debug response
            if (response.status === 200) {
              toast.success("Cập nhật trạng thái thành công!");
              loadData(currentPage, pageSize, searchValue, customerStatus); // Refresh data
            }
          })
          .catch((e) => {
            console.error("Error updating customer status:", e);
            toast.error(e.response?.data?.message || "Lỗi khi cập nhật trạng thái!");
          });
      },
      onCancel() {
        console.log("Cancel status update");
      },
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      className: "text-center",
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createAt",
      key: "createAt",
      render: (x) => <FormatDate date={x} />,
    },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => (date ? new Date(date).toLocaleDateString("vi-VN") : ""),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (x) => (x ? x : "Chưa xác định"),
    },
    {
  title: "Trạng thái",
  dataIndex: "status",
  key: "status",
  render: (x, item) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <Switch
        className={x ? "bg-danger" : "bg-warning"}
        checkedChildren={<i className="fa-solid fa-check"></i>}
        unCheckedChildren={<i className="fa-solid fa-xmark"></i>}
        checked={!x}
        onChange={() => showDeleteConfirm(item)}
      />
      <span style={{ fontWeight: 500 }}>
        {x ? "Ngừng hoạt động" : "Đang hoạt động"}
      </span>
    </div>
  ),
},

    {
      title: "Thao tác",
      dataIndex: "id",
      key: "action",
      render: (x) => (
        <Tooltip placement="top" title="Chỉnh sửa">
          <Link to={`/admin/customer/${x}`} className="btn btn-sm text-primary">
            <i className="fas fa-edit"></i>
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <BaseUI>
      <div className="brand-container">
        <h6 className="fw-semibold brand-title">Danh sách khách hàng</h6>
        <div className="card p-3 mb-3">
          <h6 className="fw-semibold">Bộ lọc</h6>
          <Row gutter={10}>
            <Col span={16}>
              <label className="mb-1">Nhập tên, email, số điện thoại</label>
              <Input
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm khách hàng theo tên,..."
              />
            </Col>
            <Col span={8}>
              <div className="mb-1">Trạng thái</div>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setCustomerStatus(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                <Select.Option value={false}>Đang hoạt động</Select.Option>
                <Select.Option value={true}>Không hoạt động</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold">Bảng khách hàng</h6>
          <Link to={"/admin/customer/add"}>
            <Button type="primary" className="bg-primary">
              <i className="fas fa-plus-circle me-1"></i>Thêm khách hàng
            </Button>
          </Link>
        </div>
        <Table
          dataSource={customerList}
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
          rowKey="id"
        />
      </div>
    </BaseUI>
  );
}

export default Customer;