import { Button, Col, Input, Select, Row, Table, Modal, Switch, Tooltip } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { toast } from "react-toastify";

function Staff() {
  const [staffList, setStaffList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [staffStatus, setStaffStatus] = useState(null);
  const [pageSize, setPageSize] = useState(5);
  const { confirm } = Modal;

  useEffect(() => {
    loadData(currentPage, pageSize, searchValue, staffStatus);
  }, [searchValue, pageSize, staffStatus, currentPage]);

  const loadData = (currentPage, pageSize, searchValue, status) => {
    request
      .get("/staff", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: status,
        },
      })
      .then((response) => {
        console.log("Staff data response:", response); // Debug response
        setStaffList(response.data.map((item, index) => ({ ...item, key: item.id, index: (currentPage - 1) * pageSize + index + 1 })));
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.error("Error loading staff data:", e);
        toast.error("Lỗi khi tải dữ liệu nhân viên!");
      });
  };

  const showDeleteConfirm = (item) => {
    confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc muốn cập nhật trạng thái của nhân viên ${item.name} thành ${
        item.status ? "Đang hoạt động" : "Không hoạt động"
      }?`,
      okText: "Xác nhận",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        request
          .remove(`/staff/${item.id}`)
          .then((response) => {
            console.log("Status update response:", response); // Debug response
            if (response.status === 200) {
              toast.success("Cập nhật trạng thái thành công!");
              loadData(currentPage, pageSize, searchValue, staffStatus); // Refresh data
            }
          })
          .catch((e) => {
            console.error("Error updating staff status:", e);
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
          <Link to={`/admin/staff/${x}`} className="btn btn-sm text-primary">
            <i className="fas fa-edit"></i>
          </Link>
        </Tooltip>
      ),
    },
  ];

  return (
    <BaseUI>
      <div className="brand-container">
        <h6 className="fw-semibold brand-title">Danh sách nhân viên</h6>
        <div className="card p-3 mb-3">
          <h6 className="fw-semibold">Bộ lọc</h6>
          <Row gutter={10}>
            <Col span={16}>
              <label className="mb-1">Nhập tên, email, số điện thoại</label>
              <Input
                onChange={(event) => setSearchValue(event.target.value)}
                placeholder="Tìm kiếm nhân viên theo tên, email, sdt ..."
              />
            </Col>
            <Col span={8}>
              <div className="mb-1">Trạng thái</div>
              <Select
                defaultValue={null}
                style={{ width: "100%" }}
                onChange={(value) => setStaffStatus(value)}
              >
                <Select.Option value={null}>Tất cả</Select.Option>
                <Select.Option value={false}>Đang làm</Select.Option>
                <Select.Option value={true}>Đã nghỉ</Select.Option>
              </Select>
            </Col>
          </Row>
        </div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h6 className="fw-semibold">Bảng nhân viên</h6>
          <Link to={"/admin/staff/add"}>
            <Button type="primary" className="bg-primary">
              <i className="fas fa-plus-circle me-1"></i>Thêm nhân viên
            </Button>
          </Link>
        </div>
        <Table
          dataSource={staffList}
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

export default Staff;