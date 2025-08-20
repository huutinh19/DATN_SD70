



import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic as AntdStatistic, Typography, DatePicker } from "antd";
import ChartBillStatus from "./ChartBillStatus";
import TopSell from "./TopSell";
import NearExpiredProducts from "./NearExpiredProducts";
import DailySales from "./DailySales";
import * as request from "~/utils/httpRequest";
import FormatCurrency from "~/utils/FormatCurrency";
import BaseUI from "~/layouts/admin/BaseUI";
import moment from "moment";

const { Title } = Typography;
const { RangePicker } = DatePicker;

function Statistic() {
  const [totalBillMonth, setTotalBillMonth] = useState(0);
  const [totalBillAmountMonth, setTotalBillAmountMonth] = useState(0);
  const [totalBillDay, setTotalBillDay] = useState(0);
  const [totalBillAmountDay, setTotalBillAmountDay] = useState(0);
  const [totalProductMonth, setTotalProductMonth] = useState(0);
  const [customRange, setCustomRange] = useState([]);

  const loadData = () => {
    // Load daily stats
    request.get("/statistical/day").then((response) => {
      const data = response.data[0] || {};
      setTotalBillDay(data.totalBillToday || 0);
      setTotalBillAmountDay(data.totalBillAmountToday || 0);
    });

    // Load stats based on custom range or default to month
    let endpoint = "";
    let params = {};

    if (customRange.length === 2) {
      endpoint = "/statistical/custom";
      params = {
        fromDate: customRange[0].startOf("day").valueOf(),
        toDate: customRange[1].endOf("day").valueOf(),
      };
    } else {
      endpoint = "/statistical/month";
    }

    if (endpoint) {
      request.get(endpoint, { params }).then((response) => {
        const data = response.data[0] || {};
        setTotalBillMonth(data.totalBill || data.totalBillToday || 0);
        setTotalBillAmountMonth(data.totalBillAmount || data.totalBillAmountToday || 0);
        setTotalProductMonth(data.totalProduct || 0);
      });
    }
  };

  useEffect(() => {
    loadData();
  }, [customRange]);

  const handleRangeChange = (dates) => {
    setCustomRange(dates || []);
  };

  return (
    <BaseUI>
      <Title level={2}>Thống Kê Tổng Quan</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col>
          <RangePicker
            onChange={handleRangeChange}
            format="DD/MM/YYYY"
            style={{ width: 300 }}
            placeholder={['Từ ngày', 'Đến ngày']}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: "#1890ff" }}>
            <AntdStatistic
              title={
                <span style={{ color: "#fff" }}>
                  {customRange.length === 2 ? "Doanh Thu Tùy Chỉnh" : "Doanh Thu Tháng"}
                </span>
              }
              value={totalBillAmountMonth}
              formatter={(value) => <FormatCurrency value={value} />}
              valueStyle={{ color: "#fff", fontSize: "24px" }}
              suffix={<span style={{ color: "#fff" }}> ({totalBillMonth} đơn)</span>}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: "#52c41a" }}>
            <AntdStatistic
              title={<span style={{ color: "#fff" }}>Doanh Thu Hôm Nay</span>}
              value={totalBillAmountDay}
              formatter={(value) => <FormatCurrency value={value} />}
              valueStyle={{ color: "#fff", fontSize: "24px" }}
              suffix={<span style={{ color: "#fff" }}> ({totalBillDay} đơn)</span>}
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} style={{ backgroundColor: "#fa8c16" }}>
            <AntdStatistic
              title={
                <span style={{ color: "#fff" }}>
                  {customRange.length === 2
                    ? "Sản Phẩm Bán Được (Tùy Chỉnh)"
                    : "Sản Phẩm Bán Được (Tháng)"}
                </span>
              }
              value={totalProductMonth || 0}
              valueStyle={{ color: "#fff", fontSize: "24px" }}
              suffix={<span style={{ color: "#fff" }}> sản phẩm</span>}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col xs={24} md={12}>
          <Card title="Trạng Thái Đơn Hàng" bordered={false}>
            <ChartBillStatus />
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Sản Phẩm Bán Chạy" bordered={false}>
            <TopSell />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Sản Phẩm Sắp Hết Hàng" bordered={false}>
            <NearExpiredProducts />
          </Card>
        </Col>
      </Row>

      {/* <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Doanh Thu" bordered={false}>
            <DailySales />
          </Card>
        </Col>
      </Row> */}
    </BaseUI>
  );
}

export default Statistic;