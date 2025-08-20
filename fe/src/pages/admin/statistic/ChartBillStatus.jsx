


import React, { useEffect, useState } from "react";
import { CChart } from "@coreui/react-chartjs";
import { Typography, DatePicker, Row, Col, Button } from "antd";
import httpRequest from "~/utils/httpRequest";
import moment from "moment";

const { Title } = Typography;
const { RangePicker } = DatePicker;

function ChartBillStatus() {
  const [data, setData] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const statusMapping = {
    TAO_HOA_DON: "Tạo hóa đơn",
    CHO_XAC_NHAN: "Chờ xác nhận",
    CHO_VAN_CHUYEN: "Chờ vận chuyển",
    VAN_CHUYEN: "Vận chuyển",
    DA_THANH_TOAN: "Đã thanh toán",
    KHONG_TRA_HANG: "Không trả hàng",
    TRA_HANG: "Trả hàng",
    DA_HUY: "Đã hủy",
  };

  const chartPieLabels = data.map((item) => item.statusName);
  const chartPieData = data.map((item) => item.totalCount);
  const chartPieColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CB3F",
    "#FF5733",
  ];

  const fetchData = (fromDate, toDate) => {
    const params = {};
    if (fromDate && toDate) {
      params.fromDate = fromDate.startOf("day").format("YYYY-MM-DD[T]HH:mm:ss");
      params.toDate = toDate.endOf("day").format("YYYY-MM-DD[T]HH:mm:ss");
    }

    httpRequest
      .get("/bill/statistic-bill-status-by-date", { params })
      .then((response) => {
        setData(response.data);
      })
      .catch((e) => console.log("Error:", e));
  };

  useEffect(() => {
    fetchData(null, null);
  }, []);

  const handleFilter = () => {
    const [start, end] = dateRange;
    if (start && end) {
      fetchData(start, end);
    } else {
      fetchData(null, null);
    }
  };

  const handleReset = () => {
    setDateRange([null, null]);
    fetchData(null, null);
  };

  return (
    <>
      <Title level={5}>TRẠNG THÁI ĐƠN HÀNG</Title>
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col>
          <RangePicker
            value={dateRange}
            onChange={(dates) => setDateRange(dates)}
            format="DD/MM/YYYY"
            placeholder={["Từ ngày", "Đến ngày"]}
          />
        </Col>
        <Col>
          <Button type="primary" onClick={handleFilter}>
            Lọc
          </Button>
        </Col>
        <Col>
          <Button onClick={handleReset}>Xóa bộ lọc</Button>
        </Col>
      </Row>
      <CChart
        type="pie"
        data={{
          labels: chartPieLabels,
          datasets: [
            {
              backgroundColor: chartPieColors,
              data: chartPieData,
            },
          ],
        }}
        options={{
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#333",
                font: { size: 14 },
              },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label: (context) => {
                  const allData = context.chart.data.datasets[0].data;
                  const total = allData.reduce((a, b) => a + b, 0);
                  const value = context.raw;
                  const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                  return `${context.label}: ${value} đơn (${percentage}%)`;
                },
              },
            },
          },
        }}
      />
    </>
  );
}

export default ChartBillStatus;
