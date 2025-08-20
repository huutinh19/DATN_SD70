


import { Button, Col, Input, Row, Table } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import FormatDate from "~/utils/FormatDate";
import * as request from "~/utils/httpRequest";
import CustomerInfo from "./CustomerInfo";

function Customer({ onSelectCustomer }) {
  const [customerList, setCustomerList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [customerStatus, setCustomerStatus] = useState(null);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    loadCustomerList();
  }, [searchValue, pageSize, customerStatus, currentPage]);

  const loadCustomerList = () => {
    request
      .get("/customer", {
        params: {
          name: searchValue,
          page: currentPage,
          sizePage: pageSize,
          status: false,
        },
      })
      .then((response) => {
        setCustomerList(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleCustomerAdded = () => {
    // Tải lại danh sách khách hàng từ API
    loadCustomerList();
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      className: "text-center",
      render: (_, __, index) => (currentPage - 1) * pageSize + index + 1,
    },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "SĐT", dataIndex: "phoneNumber", key: "phoneNumber" },
    {
      title: "Ngày sinh",
      dataIndex: "birthday",
      key: "birthday",
      render: (date) => <FormatDate date={date} />,
    },
    {
      title: "Ngày tham gia",
      dataIndex: "createAt",
      key: "createAt",
      render: (date) => <FormatDate date={date} />,
    },
    {
      title: "Thao tác",
      dataIndex: "id",
      key: "action",
      render: (id) =>
        onSelectCustomer ? (
          <Button type="primary" onClick={() => onSelectCustomer(id)}>
            Chọn
          </Button>
        ) : (
          <Link to={`/admin/customer/${id}`} className="btn btn-sm text-primary">
            <i className="fas fa-edit"></i>
          </Link>
        ),
    },
  ];

  return (
    <div>
      <h6>Danh sách khách hàng</h6>
      <Row gutter={10}>
        <Col span={10}>
          <label className="mb-1">Nhập tên, email, số điện thoại</label>
          <Input
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Tìm kiếm khách hàng theo tên,..."
          />
        </Col>
        
      </Row>
      <Col span={4}>
          <div className="mb-1"></div>
          <CustomerInfo onCustomerAdded={handleCustomerAdded} />
        </Col>
      

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
      />
    </div>
  );
}

export default Customer;