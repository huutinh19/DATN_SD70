



import { Button, Col, Form, Input, Modal, Row, Select, Table, Carousel } from 'antd';
import { Option } from 'antd/es/mentions';
import React, { useEffect, useState } from 'react';
import FormatCurrency from '~/utils/FormatCurrency';
import * as request from '~/utils/httpRequest';
import { toast } from 'react-toastify';

function ShowProductModal({ idBill, onClose }) {
  const [formFilter] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const [listSize, setListSize] = useState([]);
  const [listColor, setListColor] = useState([]);
  const [listXuatXu, setListXuatXu] = useState([]);
  const [listThuongHieu, setListThuongHieu] = useState([]);
  const [listCoAo, setListCoAo] = useState([]);
  const [listTayAo, setListTayAo] = useState([]);
  const [listChatLieu, setListChatLieu] = useState([]);
  const [searchSize, setSearchSize] = useState('');
  const [dataFilter, setDataFilter] = useState({});
  const [latestDiscounts, setLatestDiscounts] = useState({});

  useEffect(() => {
    if (isModalOpen) {
      loadData(dataFilter);
      loadLatestDiscounts();
    }
  }, [isModalOpen, dataFilter, currentPage, pageSize]);

  const loadData = async (filter) => {
    try {
      const response = await request.get('/shoe-detail/getAllBillDetail', {
        params: {
          name: filter.name,
          size: filter.size,
          color: filter.color,
          xuatXu: filter.xuatXu,
          thuongHieu: filter.thuongHieu,
          coAo: filter.coAo,
          tayAo: filter.tayAo,
          chatLieu: filter.chatLieu,
          page: currentPage,
          sizePage: pageSize,
        },
      });
      setProductList(response.data);
      setTotalPages(response.totalPages);
      console.log('API Response:', response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const loadLatestDiscounts = async () => {
    try {
      const discounts = {};
      for (const product of productList) {
        const response = await request.get('/bill-detail-taiquay/latest-discount-percent', {
          params: {
            shoeDetailCode: product.code,
            billId: idBill,
          },
        });
        discounts[product.code] = response.data;
      }
      setLatestDiscounts(discounts);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      Promise.all([
        request.get('/size', { params: { name: searchSize } }),
        request.get('/color', { params: { name: searchSize } }),
        request.get('/xuatxu', { params: { name: searchSize } }),
        request.get('/brand', { params: { name: searchSize } }),
        request.get('/coao', { params: { name: searchSize } }),
        request.get('/tayao', { params: { name: searchSize } }),
        request.get('/chatlieu', { params: { name: searchSize } }),
      ])
        .then(([sizeResponse, colorResponse, xuatXuResponse, brandResponse, coAoResponse, tayAoResponse, chatLieuResponse]) => {
          setListSize(sizeResponse.data.data || sizeResponse.data);
          setListColor(colorResponse.data.data || colorResponse.data);
          setListXuatXu(xuatXuResponse.data.data || xuatXuResponse.data);
          setListThuongHieu(brandResponse.data.data || brandResponse.data);
          setListCoAo(coAoResponse.data.data || coAoResponse.data);
          setListTayAo(tayAoResponse.data.data || tayAoResponse.data);
          setListChatLieu(chatLieuResponse.data.data || chatLieuResponse.data);
        })
        .catch(e => console.log(e));
    }
  }, [isModalOpen, searchSize]);

  const handleChoose = (shoeDetail) => {
    if (shoeDetail.quantity === 0) {
      toast.error("Sản phẩm này đã hết hàng!");
      return;
    }

    const isLatestDiscount = latestDiscounts[shoeDetail.code] === shoeDetail.discountPercent || !latestDiscounts[shoeDetail.code];
    if (!isLatestDiscount) {
      toast.error(`Sản phẩm này có chương trình khuyến mãi mới hơn (${latestDiscounts[shoeDetail.code]}%). Vui lòng chọn sản phẩm với khuyến mãi mới!`);
      return;
    }

    const data = {
      shoeDetail: shoeDetail?.code,
      bill: idBill,
      price: shoeDetail?.price,
      quantity: 1,
    };

    Modal.confirm({
      title: "Xác nhận",
      maskClosable: true,
      content: "Xác nhận thêm sản phẩm?",
      okText: "Ok",
      cancelText: "Cancel",
      onOk: () => {
        request
          .post("/bill-detail-taiquay", data)
          .then((response) => {
            toast.success("Thêm thành công!");
            loadData(dataFilter);
            loadLatestDiscounts();
          })
          .catch((e) => {
            toast.error(e.response.data);
          });
      },
    });
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => index + 1,
    },
    { title: "Mã", dataIndex: "code", key: "code" },
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
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Màu sắc", dataIndex: "color", key: "color" },
    { title: "Kích cỡ", dataIndex: "size", key: "size" },
    { title: "Xuất xứ", dataIndex: "xuatXu", key: "xuatXu"},
    { title: "Thương hiệu", dataIndex: "thuongHieu", key: "thuongHieu"},
    { title: "Cổ áo", dataIndex: "coAo", key: "coAo"},
    { title: "Tay áo", dataIndex: "tayAo", key: "tayAo"},
    { title: "Chất liệu", dataIndex: "chatLieu", key: "chatLieu"},
    { title: "Số lượng", dataIndex: "quantity", key: "quantity" },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      render: (_, record) => (
        <>
          {record.discountValue !== null ? (
            <>
              <span className="text-danger">
                <FormatCurrency value={record.discountValue} />
              </span>
              <br />
              <span className="text-decoration-line-through text-secondary">
                <FormatCurrency value={record.price} />
              </span>
            </>
          ) : (
            <span className="text-danger">
              <FormatCurrency value={record.price} />
            </span>
          )}
        </>
      ),
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "action",
      render: (_, record) => {
        const isLatestDiscount = latestDiscounts[record.code] === record.discountPercent || !latestDiscounts[record.code];
        return (
          <Button
            type="primary"
            className="bg-primary text-dark"
            onClick={() => handleChoose(record)}
            disabled={!isLatestDiscount}
            title={!isLatestDiscount ? `Sản phẩm này có khuyến mãi mới hơn (${latestDiscounts[record.code]}%)` : ""}
          >
            Chọn
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <Button
        type="primary"
        onClick={() => setIsModalOpen(true)}
        className="bg-primary text-dark"
      >
        Thêm sản phẩm
      </Button>
      <Modal
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          onClose();
        }}
        footer=""
        width={1200} // Increased width to accommodate more filters
      >
        <Form
          layout="vertical"
          onFinish={(data) => setDataFilter(data)}
          form={formFilter}
        >
          <Row gutter={10}>
            <Col span={8}>
              <Form.Item label="Tên sản phẩm" name="name">
                <Input placeholder="Tìm kiếm sản phẩm theo tên..." />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Kích cỡ" name="size">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn kích cỡ</Option>
                  {listSize.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Màu sắc" name="color">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn màu sắc</Option>
                  {listColor.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Xuất xứ" name="xuatXu">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn xuất xứ</Option>
                  {listXuatXu.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Thương hiệu" name="thuongHieu">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn thương hiệu</Option>
                  {listThuongHieu.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Cổ áo" name="coAo">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn cổ áo</Option>
                  {listCoAo.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Tay áo" name="tayAo">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn tay áo</Option>
                  {listTayAo.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label="Chất liệu" name="chatLieu">
                <Select
                  showSearch
                  optionFilterProp="children"
                  style={{ width: "100%" }}
                  onSearch={setSearchSize}
                  defaultValue=""
                >
                  <Option value="">Chọn chất liệu</Option>
                  {listChatLieu.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <div className="text-center">
            <Button
              className="me-1 bg-danger"
              onClick={() => formFilter.resetFields()}
              type="primary"
              icon={<i className="fa-solid fa-rotate-left"></i>}
            >
              Làm mới
            </Button>
            <Button
              htmlType="submit"
              className="bg-primary text-dark"
              type="primary"
              icon={<i className="fas fa-search"></i>}
            >
              Tìm kiếm
            </Button>
          </div>
        </Form>
        <Table
          dataSource={productList.filter(product => product.quantity > 0)}
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
      </Modal>
    </>
  );
}

export default ShowProductModal;