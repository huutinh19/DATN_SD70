import { Breadcrumb, Col, Form, Input, InputNumber, Row } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import BaseUI from "~/layouts/admin/BaseUI";
import Loading from "~/components/Loading/Loading";
import { FaHome } from "react-icons/fa";
import * as request from "~/utils/httpRequest";

function VoucherDetail1() {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [voucher, setVoucher] = useState({});

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadVoucher(form, id);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form, id]);

  const loadVoucher = (form, id) => {
    request
      .get(`/voucher/${id}`)
      .then((response) => {
        setVoucher(response);
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
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  if (loading) {
    return (
      <BaseUI>
        <Loading />
      </BaseUI>
    );
  }

  return (
    <BaseUI>
      <Breadcrumb
        className="mb-3"
        items={[
          { href: "/", title: <FaHome /> },
          { href: "/admin/voucher", title: "Danh sách Voucher" },
          { title: `${voucher.code}` },
        ]}
      />
      <h6>Thông tin phiếu giảm giá</h6>
      <div className="container">
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
                  parser={(value) =>
                    value !== null && value !== undefined
                      ? value.replace(/\$\s?|(,*)/g, "")
                      : ""
                  }
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
                  parser={(value) =>
                    value !== null && value !== undefined
                      ? value.replace(/\$\s?|(,*)/g, "")
                      : ""
                  }
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
      </div>
    </BaseUI>
  );
}

export default VoucherDetail1;