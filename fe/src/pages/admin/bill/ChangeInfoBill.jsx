




import { Button, Col, Form, Input, InputNumber, Modal, Row } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import GHNInfo from "~/components/GhnInfo";
import * as request from "~/utils/httpRequest";
import FormatCurrency from "~/utils/FormatCurrency";

function ChangeInfoBill({ bill, onSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [address, setAddress] = useState({});
  const [moneyShip, setMoneyShip] = useState(bill.moneyShip || 0);
  const [totalWeight, setTotalWeight] = useState(0);
  const [form] = Form.useForm();
  const [isAddressChanged, setIsAddressChanged] = useState(false); // Biến kiểm soát thay đổi địa chỉ

  const showModal = () => {
    const addressParts = bill?.address?.split("##") || [];
    setAddress({
      province: addressParts[3] || null,
      district: addressParts[2] || null,
      ward: addressParts[1] || null,
    });
    setMoneyShip(bill?.moneyShip || 0); // Khởi tạo với giá trị từ bill
    form.setFieldsValue({
      customerName: bill?.customerName || "",
      phoneNumber: bill?.phoneNumber || "",
      email: bill?.email || "",
      specificAddress: addressParts[0] || "",
      moneyShip: bill?.moneyShip || 0,
    });
    setIsModalOpen(true);
    setIsAddressChanged(false); // Reset trạng thái thay đổi địa chỉ
  };

  const getAvailableServices = async (fromDistrict, toDistrict) => {
    try {
      const response = await request.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/available-services",
        {
          shop_id: 2483458,
          from_district: fromDistrict,
          to_district: toDistrict,
        },
        {
          headers: {
            Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
            "Content-Type": "application/json",
          },
        }
      );
      const availableServices = response.data.data;
      if (availableServices && availableServices.length > 0) {
        return availableServices[0].service_id;
      } else {
        throw new Error("Không tìm thấy gói dịch vụ khả dụng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy gói dịch vụ:", error);
      return null;
    }
  };

  const calculateFee = async () => {
    if (!address.district || !address.ward) {
      setMoneyShip(0);
      form.setFieldsValue({ moneyShip: 0 });
      return;
    }

    const fromDistrict = 1542;
    const toDistrict = parseInt(address.district);

    const serviceId = await getAvailableServices(fromDistrict, toDistrict);

    if (!serviceId) {
      toast.error("Không thể lấy thông tin gói dịch vụ!");
      setMoneyShip(0);
      form.setFieldsValue({ moneyShip: 0 });
      return;
    }

    try {
      const response = await request.post(
        "https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee",
        {
          service_id: serviceId,
          service_type_id: 3,
          to_district_id: toDistrict,
          to_ward_code: address.ward,
          height: 11,
          length: 28,
          weight: totalWeight || 300,
          width: 16,
        },
        {
          headers: {
            Token: "650687b2-f5c1-11ef-9bc9-aecca9e2a07c",
            "Content-Type": "application/json",
            ShopId: 2483458,
          },
        }
      );
      const calculatedFee = response.data.data.total;
      setMoneyShip(calculatedFee);
      form.setFieldsValue({ moneyShip: calculatedFee });
    } catch (e) {
      console.error("Lỗi khi tính phí vận chuyển:", e);
      toast.error("Không thể tính phí vận chuyển!");
      setMoneyShip(0);
      form.setFieldsValue({ moneyShip: 0 });
    }
  };

  const calculateWeight = async () => {
    try {
      const response = await request.get(`/bill-detail`, {
        params: { bill: bill.id, page: 1, sizePage: 1_000_000 },
      });
      const total = response.data.reduce((sum, item) => sum + item.weight * item.quantity, 0);
      setTotalWeight(total);
    } catch (e) {
      console.log("Error calculating weight:", e);
      setTotalWeight(300); // Fallback weight
    }
  };

  const handleChangeInfo = (data) => {
    const newData = {
      customerName: data.customerName,
      phoneNumber: data.phoneNumber,
      email: data.email,
      address: `${data.specificAddress}##${address.ward}##${address.district}##${address.province}`,
      moneyShip: data.moneyShip || 0,
    };

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thay đổi thông tin đơn hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await request.put(`/bill/change-info-customer/${bill.id}`, newData);
          toast.success("Cập nhật thành công!");
          onSuccess(newData);
          setIsModalOpen(false);
        } catch (e) {
          toast.error(e.response?.data || "Đã có lỗi xảy ra!");
          console.log("Error updating bill:", e);
        }
      },
    });
  };

  useEffect(() => {
    calculateWeight();
  }, [bill]);

  useEffect(() => {
    if (isAddressChanged && address.district && address.ward) {
      calculateFee();
    }
  }, [address, totalWeight, isAddressChanged]);

  return (
    <>
{/*  
      <Button 
        type="primary" htmlType="submit"
        onClick={showModal}
 
      >
        Thay đổi thông tin
      </Button>
      <Modal
        title="Thay đổi thông tin"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={700}
      > */}
      {(bill?.status !== 9 && bill?.status <= 3) && (
  <Button type="primary" onClick={showModal}>
    Thay đổi thông tin
  </Button>
)}

<Modal
  title="Thay đổi thông tin"
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={null}
  width={700}
>

        <Form form={form} layout="vertical" onFinish={handleChangeInfo}>
          <Row gutter={10}>
            <Col xl={12}>
              <Form.Item
                label="Tên người nhận"
                name="customerName"
                rules={[{ required: true, message: "Tên người nhận không được để trống!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col xl={12}>
              <Form.Item
                label="Số điện thoại"
                name="phoneNumber"
                rules={[{ required: true, message: "SĐT người nhận không được để trống!" }]}
              >
                <Input />
              </Form.Item>
            </Col>
            
            <GHNInfo
              distr={address.district}
              dataAddress={(data) => {
                setAddress({ province: data.province, district: data.district, ward: data.ward });
                setIsAddressChanged(true); // Đánh dấu địa chỉ đã thay đổi
              }}
              prov={address.province}
              war={address.ward}
            />
            <Col xl={24}>
              <Form.Item
                label="Địa chỉ cụ thể"
                name="specificAddress"
                rules={[{ required: true, message: "Địa chỉ cụ thể không được để trống!" }]}
              >
                <TextArea />
              </Form.Item>
            </Col>
            <Col xl={24}>
              <Form.Item
                label="Phí vận chuyển"
                name="moneyShip"
                rules={[{ required: true, message: "Phí vận chuyển không được để trống!" }]}
              >
                <InputNumber
                  className="w-100"
                  min={0}
                  formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  addonAfter="VNĐ"
                  onChange={(value) => setMoneyShip(value || 0)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="end">
            <Button onClick={() => setIsModalOpen(false)} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Thay đổi thông tin
            </Button>
          </Row>
        </Form>
        <small>
          <i>
            <span className="text-danger">*Lưu ý: </span>Thay đổi địa chỉ nhận hàng có thể ảnh hưởng đến phí vận chuyển
          </i>
        </small>
      </Modal>
    </>
  );
}

export default ChangeInfoBill;