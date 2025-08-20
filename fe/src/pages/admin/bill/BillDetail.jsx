import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Timeline, TimelineEvent } from "@mailtop/horizontal-timeline";
import { FaEdit, FaRegFileAlt, FaTruck, FaCheckCircle } from "react-icons/fa";
import { FaTruckFast } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import {
  MdOutlineCancelPresentation,
  MdOutlineChangeCircle,
  MdOutlineConfirmationNumber,
  MdPayment,
} from "react-icons/md";
import BaseUI from "~/layouts/admin/BaseUI";
import FormatDate from "~/utils/FormatDate";
import FormatCurrency from "~/utils/FormatCurrency";
import "./timeline.css";
import InfoBill from "./InfoBill";
import PaymentMethod from "./PaymentMethod";
import BillHistory from "./BillHistory";
import {
  Button,
  Carousel,
  Col,
  Divider,
  Form,
  InputNumber,
  Modal,
  Row,
  Table,
  Tooltip,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import Title from "antd/es/typography/Title";
import { toast } from "react-toastify";
import ShowProductModal from "../bill/ShowProductModal1";
import Loading from "~/components/Loading/Loading";
import GivebackAll from "./giveback/GivebackAll";
import * as request from "~/utils/httpRequest";

const BillDetail = () => {
  const [bill, setBill] = useState({});
  const [billHistory, setBillHistory] = useState([]);
  const [listBillDetail, setListBillDetail] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(3);
  const { id } = useParams();
  const [form] = Form.useForm();
  const [formGiveback] = Form.useForm();
  const [paymentForm] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [totalPayment, setTotalPayment] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState(null);

  // Load data functions
  const loadBill = async () => {
    try {
      const response = await request.get(`/bill/${id}`);
      setBill(response);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadBillDetail = async () => {
    try {
      const response = await request.get(`/bill-detail`, {
        params: {
          bill: id,
          page: currentPage,
          sizePage: pageSize,
        },
      });
      setListBillDetail(response.data);
      setTotalPages(response.totalPages);
    } catch (e) {
      console.log(e);
    }
  };

  const loadBillHistory = () => {
    request
      .get(`/bill-history/${id}`)
      .then((response) => setBillHistory(response))
      .catch((error) => console.error(error));
  };

  const loadPaymentMethod = async () => {
    try {
      const response = await request.get(`/payment-method/${bill.id}`);
      const calculateTotalPayment = response
        .filter((item) => item.type === true)
        .reduce((total, item) => total + item.totalMoney, 0);
      setTotalPayment(calculateTotalPayment);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadBill();
    loadBillDetail();
    loadBillHistory();
    loadPaymentMethod();
  }, [id, bill.totalMoney, bill.moneyShip]);

  useEffect(() => {
    loadBillDetail();
  }, [currentPage, pageSize]);

  // Voucher change
  const handleVoucherChange = async (voucher) => {
    try {
      const response = await request.put(`/bill/${id}/update-voucher`, {
        voucherId: voucher ? voucher.id : null,
      });
      setBill(response);
      loadBillHistory();
      toast.success("Đã áp dụng mã giảm giá mới!");
    } catch (error) {
      console.error(error);
      toast.error("Không thể áp dụng mã giảm giá!");
    }
  };

  // Delete bill detail
  const handleDeleteBillDetail = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận xóa khỏi giỏ hàng?",
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => {
        request
          .remove(`/bill-detail/${id}`)
          .then(() => {
            toast.success("Xóa thành công!");
            loadBillDetail();
            loadBill();
            loadBillHistory();
          })
          .catch((e) => {
            console.log(e);
            toast.error(e.response.data);
          });
      },
    });
  };

  // Change quantity
  const handleChangeQuantity = (record, quantity) => {
    request
      .get(`/bill-detail/update-quantity/${record.id}`, {
        params: {
          newQuantity: quantity,
          price:
            record.discountValue !== null ? record.discountValue : record.price,
        },
      })
      .then(() => {
        loadBillDetail();
        loadBill();
        loadBillHistory();
        toast.success("Cập nhật thành công!");
      })
      .catch((e) => {
        console.log(e);
        toast.error(e.response.data);
      });
  };

  // Give back
  const handleGiveBack = (id) => {
    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: (
        <Form
          layout="vertical"
          form={formGiveback}
          onFinish={async (data) => {
            data.billDetail = id;
            await request
              .post(`/bill/give-back`, data)
              .then(() => {
                loadBillDetail();
                loadBill();
                loadBillHistory();
                toast.success("Trả hàng thành công!");
              })
              .catch((e) => {
                console.log(e);
                toast.error(e.response.data);
              });
          }}
        >
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[
              { required: true, message: "Số lượng không được để trống!" },
            ]}
          >
            <InputNumber
              placeholder="Nhập số lượng muốn trả hàng..."
              className="w-100"
              min={1}
            />
          </Form.Item>
          <Form.Item
            label="Lý do trả hàng"
            name="note"
            rules={[
              {
                required: true,
                message: "Lý do trả hàng không được để trống!",
              },
            ]}
          >
            <TextArea placeholder="Nhập lý do trả hàng..." />
          </Form.Item>
        </Form>
      ),
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: () => formGiveback.submit(),
    });
  };

  // Status change
  const handleStatusChange = (isCancel, isRefund = false) => {
    let nextStatus;
    let noteLabel;

    if (isCancel) {
      nextStatus = 7; // DA_HUY
      noteLabel = isRefund
        ? "Lý do hoàn tiền hủy đơn hàng"
        : "Lý do hủy đơn hàng";
    } else {
      switch (bill.status) {
        case 2: // CHO_XAC_NHAN
          nextStatus = 9; // DA_XAC_NHAN
          noteLabel = "Ghi chú xác nhận đơn hàng";
          break;
        case 9: // DA_XAC_NHAN
          nextStatus = 4; // CHO_GIAO_HANG
          noteLabel = "Ghi chú chờ giao hàng";
          break;
        case 4: // CHO_GIAO_HANG
          nextStatus = 5; // DANG_GIAO_HANG
          noteLabel = "Ghi chú giao hàng";
          break;
        case 5: // DANG_GIAO_HANG
          nextStatus = 10; // DA_GIAO_HANG
          noteLabel = "Ghi chú xác nhận đã giao hàng";
          break;
        case 10: // DA_GIAO_HANG
          nextStatus = 6; // HOAN_THANH
          noteLabel = "Ghi chú hoàn thành đơn hàng";
          break;
        default:
          return;
      }
    }

    // Nếu là hoàn tiền và hủy đơn, không hiển thị modal lý do
    if (isRefund) {
      // Gọi hàm xử lý hoàn tiền và hủy đơn ngay lập tức
      handleSubmit({ note: "Hoàn tiền và hủy đơn hàng" }, true, true);
    } else {
      // Hiển thị modal cho các trường hợp khác
      Modal.confirm({
        title: noteLabel,
        content: (
          <Form
            form={form}
            onFinish={(data) => handleSubmit(data, isCancel, isRefund)}
          >
            <Form.Item
              name="note"
              rules={[
                { required: true, message: "Ghi chú không được để trống!" },
              ]}
            >
              <TextArea placeholder="Nhập ghi chú..." />
            </Form.Item>
          </Form>
        ),
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk: () => form.submit(),
      });
    }
  };

  const handleSubmit = (data, isCancel, isRefund = false) => {
    setUpdateLoading(true);
    request
      .get(`/bill/change-status/${bill.id}`, {
        params: {
          note: data.note,
          isCancel: isCancel,
          isVnpay: false, // Luôn sử dụng PaymentMethod, không dùng VNPAY
        },
      })
      .then(() => {
        loadBill();
        loadBillDetail();
        loadBillHistory();
        loadPaymentMethod();
        toast.success(
          isRefund
            ? "Đã hoàn tiền và hủy đơn hàng!"
            : "Đã cập nhật trạng thái đơn hàng!"
        );
      })
      .catch((e) => {
        console.error(e);
        toast.error(e.response.data);
      })
      .finally(() => {
        setUpdateLoading(false);
        form.resetFields();
      });
  };

  // Handle payment submission
  const handlePaymentSubmit = (data) => {
    if (paymentMethod === 1) {
      data.totalMoney = bill.totalMoney + bill.moneyShip - totalPayment;
    }
    data.type = true; // Payment, not refund
    data.method = paymentMethod;
    data.bill = bill.id;
    request
      .post(`/payment-method`, data)
      .then(() => {
        loadPaymentMethod();
        loadBill();
        loadBillHistory();
        setIsPaymentModalOpen(false);
        paymentForm.resetFields();
        toast.success("Thanh toán thành công!");
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data);
      });
  };

  // Check if the bill is fully paid
  const isPaid =
    billHistory.some((history) => history.status === 3) ||
    totalPayment >= (bill.totalMoney || 0) + (bill.moneyShip || 0);

  // Log for debugging
  useEffect(() => {
    console.log("isPaid:", isPaid);
    console.log("totalPayment:", totalPayment);
    console.log(
      "bill.totalMoney + bill.moneyShip:",
      (bill.totalMoney || 0) + (bill.moneyShip || 0)
    );
    console.log("bill.status:", bill.status);
  }, [isPaid, totalPayment, bill]);

  // Table columns
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
    },
    {
      title: <i>Ảnh</i>,
      dataIndex: "images",
      key: "images",
      render: (images, record) => (
        <div style={{ position: "relative", width: "100px", height: "100px" }}>
          {record.discountValue !== null && (
            <div
              style={{
                position: "absolute",
                top: "5px",
                left: "5px",
                background: "red",
                color: "white",
                padding: "2px 5px",
                fontSize: "12px",
                fontWeight: "bold",
                borderRadius: "3px",
                zIndex: 2,
              }}
            >
              SALE {record.discountPercent}%
            </div>
          )}
          <Carousel
            autoplay
            autoplaySpeed={3000}
            dots={false}
            arrows={false}
            style={{ width: "100px" }}
          >
            {images.split(",").map((image, index) => (
              <img
                key={index}
                src={image}
                alt="product"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "contain",
                }}
              />
            ))}
          </Carousel>
        </div>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <div className="d-flex flex-column gap-2 p-2">
          {/* Tên sản phẩm */}
          <div className="fw-bold fs-5 text-dark">{name}</div>

          {/* Mã sản phẩm */}
          <div className="text-secondary fs-6">
            <strong className="me-1">Mã:</strong>
            <span className="text-dark">{record.shoeCode}</span>
          </div>

          {/* Thông tin chi tiết */}
          <div className="text-secondary fs-6 d-flex flex-wrap gap-3">
            <div>
              <strong>Xuất xứ:</strong> {record.xuatXu || "N/A"}
            </div>
            <div>
              <strong>Thương hiệu:</strong> {record.thuongHieu || "N/A"}
            </div>
            <div>
              <strong>Cổ áo:</strong> {record.coAo || "N/A"}
            </div>
            <div>
              <strong>Tay áo:</strong> {record.tayAo || "N/A"}
            </div>
            <div>
              <strong>Chất liệu:</strong> {record.chatLieu || "N/A"}
            </div>
          </div>

          {/* Đơn giá */}
          <div className="mt-2 fs-5">
            <strong>Đơn giá:</strong>{" "}
            {record.discountPercent !== null ? (
              <>
                <span className="text-danger fw-bold">
                  <FormatCurrency value={record.discountValue} />
                </span>{" "}
                <span className="text-decoration-line-through text-secondary fs-6">
                  <FormatCurrency value={record.shoePrice} />
                </span>
              </>
            ) : (
              <span className="text-danger fw-bold">
                <FormatCurrency value={record.price} />
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity, record) => (
        <>
          {(bill.status === 2 || (bill.status !== 9 && bill?.status <= 3)) &&
          !isPaid ? (
            <Form key={record.id}>
              <Form.Item
                initialValue={quantity}
                name="quantity"
                className="m-0 p-0"
              >
                <InputNumber
                  className="text-center"
                  min={1}
                  style={{ width: "64px" }}
                  onPressEnter={(e) =>
                    handleChangeQuantity(record, e.target.value)
                  }
                />
              </Form.Item>
            </Form>
          ) : (
            quantity
          )}
        </>
      ),
    },
    {
      title: "Tổng tiền",
      dataIndex: "quantity",
      key: "total",
      render: (quantity, record) => (
        <div className="text-center text-danger fw-semibold">
          <FormatCurrency
            value={
              record.discountValue !== null
                ? record.discountValue * record.quantity
                : record.price * record.quantity
            }
          />
        </div>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "action",
      render: (id, record) => (
        <>
          {(bill.status === 2 || bill.status === 9 || bill.status === 4) &&
          !isPaid ? (
            <>
              {listBillDetail.length > 1 && (
                <Tooltip placement="top" title="Xóa">
                  <Button
                    onClick={() => handleDeleteBillDetail(id)}
                    type="text"
                    className="text-danger me-1"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </Tooltip>
              )}
            </>
          ) : bill.status === 6 && record.status === false ? (
            <>
              {bill.status === 7 || bill.status === 8 ? null : (
                <Tooltip placement="top" title="Trả hàng">
                  <Button
                    onClick={() => handleGiveBack(id)}
                    type="primary"
                    danger
                    icon={<i className="fa-solid fa-rotate-left"></i>}
                  />
                </Tooltip>
              )}
            </>
          ) : null}
        </>
      ),
    },
  ];

  if (loading) {
    return <Loading />;
  }

  return (
    <BaseUI>
      <div className="brand-container">
        <h6 className="fw-semibold brand-title">Lịch sử hóa đơn</h6>
        <div>
          <Timeline minEvents={8} placeholder maxEvents={billHistory.length}>
            {billHistory.map((item, index) => (
              <TimelineEvent
                key={index}
                icon={
                  item.status === 0
                    ? FaRegFileAlt
                    : item.status === 1
                    ? FaRegFileAlt
                    : item.status === 2
                    ? MdOutlineConfirmationNumber
                    : item.status === 3
                    ? MdPayment
                    : item.status === 4
                    ? FaTruck
                    : item.status === 5
                    ? FaTruckFast
                    : item.status === 6
                    ? GiConfirmed
                    : item.status === 7
                    ? MdOutlineCancelPresentation
                    : item.status === 8
                    ? MdOutlineChangeCircle
                    : item.status === 9
                    ? GiConfirmed
                    : item.status === 10
                    ? FaCheckCircle
                    : item.status === 500
                    ? FaEdit
                    : ""
                }
                color={
                  item.status === 0
                    ? "#808080"
                    : item.status === 1
                    ? "#007bff"
                    : item.status === 2
                    ? "#007bff"
                    : item.status === 3
                    ? "#007bff"
                    : item.status === 4
                    ? "#007bff"
                    : item.status === 5
                    ? "#007bff"
                    : item.status === 6
                    ? "#007bff"
                    : item.status === 7
                    ? "#007bff"
                    : item.status === 8
                    ? "#007bff"
                    : item.status === 9
                    ? "#007bff"
                    : item.status === 10
                    ? "#007bff"
                    : item.status === 500
                    ? "#FFBC05"
                    : "#2DC255"
                }
                title={
                  <h5 className="mt-2">
                    {item.status === 0
                      ? "Chờ thanh toán"
                      : item.status === 1
                      ? "Tạo đơn hàng"
                      : item.status === 2
                      ? "Chờ xác nhận"
                      : item.status === 3
                      ? "Đã thanh toán"
                      : item.status === 4
                      ? "Chờ giao hàng"
                      : item.status === 5
                      ? "Đang giao hàng"
                      : item.status === 6
                      ? "Hoàn thành"
                      : item.status === 7
                      ? "Hủy"
                      : item.status === 8
                      ? "Hoàn 1 phần"
                      : item.status === 9
                      ? "Đã xác nhận"
                      : item.status === 10
                      ? "Đã giao hàng"
                      : item.status === 500
                      ? "Chỉnh sửa đơn hàng"
                      : ""}
                  </h5>
                }
                subtitle={
                  <>
                    <FormatDate date={item.createAt} />
                  </>
                }
              />
            ))}
          </Timeline>
        </div>
        <div className="d-flex">
          <div className="flex-grow-1">
            {bill.status !== 6 && bill.status !== 7 && bill.status !== 8 ? (
              <>
                {!isPaid && (bill.status === 2 || bill.status === 9 || bill.status === 4) && (
                  <Button
                    type="default"
                    className="me-1"
                    style={{
                      backgroundColor: "red",
                      borderColor: "red",
                      color: "white",
                    }}
                    onClick={() => handleStatusChange(true, false)}
                    disabled={updateLoading}
                  >
                    Hủy
                  </Button>
                )}
                {isPaid && bill.status === 2 && (
                  <Button
                    type="default"
                    className="me-1"
                    style={{
                      backgroundColor: "orange",
                      borderColor: "orange",
                      color: "white",
                    }}
                    onClick={() => {
                      setIsPaymentModalOpen(true); // Mở modal PaymentMethod để hoàn tiền
                      paymentForm.setFieldsValue({ isRefund: true }); // Đặt isRefund = true
                    }}
                    disabled={updateLoading}
                  >
                    Xác nhận hoàn tiền hủy đơn
                  </Button>
                )}
                {bill.status === 2 && (
                  <Button
                    type="primary"
                    onClick={() => handleStatusChange(false)}
                    disabled={updateLoading}
                  >
                    Xác nhận
                  </Button>
                )}
                {bill.status === 9 && (
                  <Button
                    type="primary"
                    onClick={() => handleStatusChange(false)}
                    disabled={updateLoading}
                  >
                    Chờ giao hàng
                  </Button>
                )}
                {bill.status === 4 && (
                  <Button
                    type="primary"
                    onClick={() => handleStatusChange(false)}
                    disabled={updateLoading}
                  >
                    Giao hàng
                  </Button>
                )}

                {bill.status === 5 && !isPaid && (
                  <Button
                    type="primary"
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={updateLoading}
                  >
                    Xác nhận thanh toán
                  </Button>
                )}
                {bill.status === 5 && isPaid && (
                  <Button
                    type="primary"
                    onClick={() => handleStatusChange(false)}
                    disabled={updateLoading}
                  >
                    Xác nhận giao hàng
                  </Button>
                )}
                {bill.status === 10 && isPaid && (
                  <Button
                    type="primary"
                    onClick={() => handleStatusChange(false)}
                    disabled={updateLoading}
                  >
                    Hoàn thành
                  </Button>
                )}
              </>
            ) : null}
          </div>
          <div>
            {bill.status !== 1 && bill.status !== 2 && (
              <Tooltip title="">
                {/* Placeholder for additional actions if needed */}
              </Tooltip>
            )}
            <BillHistory props={billHistory} />
          </div>
        </div>
        <Divider />
        <PaymentMethod
          bill={bill}
          onSuccess={() => {
            loadBill();
            loadBillHistory();
            loadPaymentMethod();
          }}
          onOpenPaymentModal={() => setIsPaymentModalOpen(true)}
          isModalOpen={isPaymentModalOpen}
          setIsModalOpen={setIsPaymentModalOpen}
          paymentForm={paymentForm}
          onPaymentSubmit={handlePaymentSubmit}
          setPaymentMethod={setPaymentMethod}
          onRefund={() => handleStatusChange(true, true)} // Truyền hàm xử lý hoàn tiền
        />
        <InfoBill
          props={bill}
          onSuccess={() => {
            loadBill();
            loadBillHistory();
          }}
          onVoucherChange={handleVoucherChange}
          allowAddressChange={
            (bill.status === 2 || bill.status === 9 || bill.status === 4) &&
            !isPaid
          }
        />
        <div className="d-flex align-items-center mt-5 align-middle">
          <Title
            level={5}
            className="text-danger text-uppercase p-0 m-0 flex-grow-1 p-2"
          >
            Danh sách sản phẩm
          </Title>
          {(bill.status === 2 || (bill.status !== 9 && bill?.status <= 3)) &&
          !isPaid ? (
            <ShowProductModal
              idBill={bill.id}
              billStatus={bill.status}
              onClose={() => {
                setLoading(true);
                loadBillDetail();
                loadBill();
                loadBillHistory();
              }}
            />
          ) : bill.status === 6 ? (
            <>
              {bill.status === 7 || bill.status === 8 ? null : (
                <GivebackAll
                  bill={bill}
                  onSuccess={() => {
                    loadBillDetail();
                    loadBill();
                    loadBillHistory();
                  }}
                />
              )}
            </>
          ) : null}
        </div>
        <Table
          dataSource={listBillDetail}
          columns={columns}
          showHeader={true}
          rowClassName={(record) =>
            record.status === true ? "bg-danger-subtle" : ""
          }
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

export default BillDetail;
