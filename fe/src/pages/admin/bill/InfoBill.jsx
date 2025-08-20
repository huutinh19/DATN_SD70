





import { Col, Divider, Row, Button, Card } from "antd";
import Title from "antd/es/typography/Title";
import Paragraph from "antd/es/typography/Paragraph";
import React, { useState, useEffect } from "react";
import DetailAddress from "~/components/DetailAddress";
import FormatCurrency from "~/utils/FormatCurrency";
import ChangeInfoBill from "./ChangeInfoBill";
import { Tag } from "antd";
import "./InfoBill.css"; // Custom CSS for additional styling

function InfoBill({ props, onSuccess, allowAddressChange }) {
  const [moneyShip, setMoneyShip] = useState(props.moneyShip || 0);

  const handleInfoChangeSuccess = (updatedBill) => {
    setMoneyShip(updatedBill.moneyShip || 0);
    onSuccess(updatedBill);
  };

  useEffect(() => {
    setMoneyShip(props.moneyShip || 0);
  }, [props.moneyShip]);

  const getStatusTag = (status) => {
    const statusMap = {
      0: { text: "Chờ thanh toán", color: "orange" },
      1: { text: "Tạo đơn hàng", color: "blue" },
      2: { text: "Chờ xác nhận", color: "gold" },
      3: { text: "Đã thanh toán", color: "cyan" },
      4: { text: "Chờ giao hàng", color: "purple" },
      5: { text: "Đang giao hàng", color: "geekblue" },
      6: { text: "Hoàn thành", color: "green" },
      7: { text: "Hủy", color: "red" },
      8: { text: "Trả hàng", color: "volcano" },
      9: { text: "Đã xác nhận", color: "volcano" },
    };
    const { text, color } = statusMap[status] || { text: "Không xác định", color: "cyan" };
    return <Tag color={color}>{text}</Tag>;
  };

  return (
    <div className="info-bill-container">
      {/* Order Information Section */}
      <Card
        title={
          <Title level={4} className="section-title">
            Thông tin đơn hàng
          </Title>
        }
        className="info-card"
      >
        <Row gutter={[16, 16]} className="info-row">
          <Col xs={24} md={12}>
            <div className="info-item">
              <span className="info-label">Trạng thái:</span>
              <span className="info-value">{getStatusTag(props.status)}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Mã đơn hàng:</span>
              <span className="info-value">{props?.code || "Không có"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Loại đơn hàng:</span>
              <span className="info-value">{props.type === 0 ? "Tại quầy" : "Giao hàng"}</span>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="info-item">
              <span className="info-label">Tiền hàng:</span>
              <span className="info-value highlight">
                <FormatCurrency value={props.totalMoney + props.moneyReduce} />
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Phí vận chuyển:</span>
              <span className="info-value">
                {props.type === 1 ? <FormatCurrency value={moneyShip} /> : "Không có"}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Giảm giá</span>
              <span className="info-value">
                <FormatCurrency value={props.moneyReduce} />
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Tổng tiền phải thanh toán:</span>
              <span className="info-value highlight total">
                <FormatCurrency value={props.totalMoney + moneyShip} />
              </span>
            </div>
          </Col>
          {props.voucher && (
            <Col xs={24}>
              <div className="voucher-info">
                <Paragraph>
                  <strong>Mã giảm giá:</strong> ({props.voucher.code}) {props.voucher.name} - giảm{" "}
                  <span className="text-danger">{props.voucher.percentReduce}%</span> cho đơn tối thiểu{" "}
                  <FormatCurrency value={props.voucher.minBillValue} />, giảm tối đa{" "}
                  <FormatCurrency value={props.voucher.maxBillValue} />. Đã giảm{" "}
                  <span className="text-success">
                    <FormatCurrency value={props.moneyReduce} />
                  </span>.
                </Paragraph>
              </div>
            </Col>
          )}
        </Row>
      </Card>

      <Divider className="section-divider" />

      {/* Customer Information Section */}
      <Card
        title={
          <div className="customer-header">
            <Title level={4} className="section-title">
              Thông tin khách hàng
            </Title>
            {allowAddressChange && (
              <ChangeInfoBill
                bill={props}
                onSuccess={handleInfoChangeSuccess}
                trigger={<Button type="primary">Chỉnh sửa</Button>}
                allowAddressChange={allowAddressChange}
              />
            )}
          </div>
        }
        className="info-card"
      >
        <Row gutter={[16, 16]} className="info-row">
          <Col xs={24} md={12}>
            <div className="info-item">
              <span className="info-label">Tên khách hàng:</span>
              <span className="info-value">{props.customerName || "Khách hàng lẻ"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Số điện thoại:</span>
              <span className="info-value">
                {props.phoneNumber || props.customer?.phoneNumber || "Không có"}
              </span>
            </div>
          </Col>
          <Col xs={24} md={12}>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">{props.email || props.customer?.email || "Không có"}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Địa chỉ:</span>
              <span className="info-value address">
                {props?.address ? (
                  (() => {
                    const addressParts = props.address.split("##");
                    if (addressParts.length === 4) {
                      return (
                        <>
                          {addressParts[0]},
                          <DetailAddress
                            war={addressParts[1]}
                            distr={addressParts[2]}
                            prov={addressParts[3]}
                          />
                        </>
                      );
                    }
                    return "Địa chỉ không hợp lệ";
                  })()
                ) : (
                  "Tại cửa hàng"
                )}
              </span>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
}

export default InfoBill;