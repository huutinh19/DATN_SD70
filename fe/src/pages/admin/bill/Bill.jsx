import React from "react";
import BaseUI from "~/layouts/admin/BaseUI";
import { useState, useEffect } from "react";
import * as request from "~/utils/httpRequest";
import { Badge, Button, DatePicker, Input, Table, Tabs, Tag, Tooltip } from "antd";
import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";
import { Link } from "react-router-dom";

const { RangePicker } = DatePicker;

const Bill = ({ onLoad }) => {
  const [listOrder, setListOrder] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const [status, setStatus] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);

  const loadOrders = () => {
    request
      .get(`bill`, {
        params: {
          page: currentPage,
          sizePage: pageSize,
          status: status,
          code: searchValue,
          fromDate: selectedDates?.fromDate,
          toDate: selectedDates?.toDate,
        },
      })
      .then((response) => {
        setListOrder(response.data);
        setTotalPages(response.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });

    request
      .get("/bill/statistic-bill-status")
      .then((response) => {
        setTabs(response);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDateChange = (dates) => {
    if (dates !== null) {
      setSelectedDates({
        fromDate: dates[0].format("YYYY-MM-DD"),
        toDate: dates[1].format("YYYY-MM-DD"),
      });
    } else {
      setSelectedDates(null);
    }
    console.log(selectedDates);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    loadOrders();
  }, [currentPage, pageSize, searchValue, status, onLoad, selectedDates]);

  const items = [
    {
      key: null,
      label: <Badge offset={[8, 0]} size="small">Tất cả</Badge>,
    },
    ...tabs.map((item) => ({
      key: item.status,
      label: (
        <Badge count={item.totalCount} offset={[8, 0]} size="small">
          {item.statusName}
        </Badge>
      ),
    })),
  ];

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      key: "customer",
      render: (x, record) => (x === null ? "Khách hàng lẻ" : x),
    },
    {
      title: "SDT",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (x) => (x === null ? "-" : x),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalMoney",
      key: "totalMoney",
      render: (x, record) => (
        <span className="fw-semibold text-danger">
          <FormatCurrency value={x === null ? 0 : x + record.moneyShip} />
        </span>
      ),
    },
    {
      title: "Loại đơn hàng",
      dataIndex: "type",
      key: "type",
      render: (type) => {
        const typeMap = {
          0: "Tại quầy",
          1: "Giao hàng",
          2: "Đơn mới",
        };
        const typeName = typeMap[type] || "Không xác định";

        return (
          <Tag
            style={{ width: "100px" }}
            className="text-center"
            color={type === 0 ? "#FFA500" : type === 1 ? "#FF4500" : "#800080"}
          >
            <i
              className={
                type === 0
                  ? "fas fa-store me-1"
                  : type === 1
                  ? "fas fa-shipping-fast me-1"
                  : "fas fa-file-invoice me-1"
              }
            ></i>
            {typeName}
          </Tag>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const statusMap = {
          0: "Chờ thanh toán",
          1: "Tạo đơn hàng",
          2: "Chờ xác nhận",
          3: "Đã thanh toán",
          4: "Chờ giao hàng",
          5: "Đang giao hàng",
          6: "Hoàn thành",
          7: "Hủy",
          8: "Hoàn 1 phần",
          9: "Đã xác nhận",
          10: "Đã giao hàng",
          500: "Chỉnh sửa đơn hàng",
        };
        const statusName = statusMap[status] || "Không xác định";

        return (
          <Tag
            style={{ width: "120px" }}
            className="text-center"
            color={
              status === 6
                ? "#2DC255" // Hoàn thành
                : status === 7
                ? "#FF4D4F" // Hủy
                : "#1890FF" // Các trạng thái khác
            }
          >
            {statusName}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createAt",
      key: "createAt",
      render: (x) => <FormatDate date={x} />,
    },
    // {
    //       title: "Thao tác",
    //       dataIndex: "id",
    //       key: "action",
    //       render: (x,record) => (
    //         <>
    //         <Link to={`/admin/bill/${x}`} className="btn btn-sm text-primary">
    //           <i className="fas fa-edit"></i>
    //         </Link>
    //         {record.status !== 1 && (
    //         <Tooltip title="In hóa đơn">
    //           <Link className="px-2" target="blank" to={`/export-pdf/${record.id}`}><i class="fa-regular fa-file-lines"></i></Link>
    //         </Tooltip>
    //       )}
    //         </>
    //       ),
    //     },
    {
      title: 'Hành động',
      dataIndex: 'id',
      key: '',
      render: (x, record) => (
        <>
          <Tooltip title="Xem chi tiết">
            <Link to={`/admin/bill/${x}`}><Button type="text" icon={<i class="fas fa-ellipsis"></i>} /></Link>
          </Tooltip>
          
        </>
      )
    },
    
  ];

  return (
    <BaseUI>
    <div className="brand-container">
      <div className="d-flex">
        <div className="flex-grow-1">
          <h6 className="fw-semibold brand-title">Danh sách hoá đơn</h6>
        </div>
        <div className="">
          <Input
            className="me-2"
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Tìm kiếm theo mã hóa đơn, tên khách hàng, số điện thoại..."
            style={{ width: "440px" }}
          />
          {/* <RangePicker onChange={(dates) => handleDateChange(dates)} /> */}
        </div>
      </div>
      <Tabs
        defaultActiveKey={1}
        items={items}
        tabBarGutter={74}
        onChange={(key) => {
          setStatus(key);
        }}
      />
      <Table
        dataSource={listOrder}
        columns={columns}
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
    </BaseUI>
  );
};

export default Bill;