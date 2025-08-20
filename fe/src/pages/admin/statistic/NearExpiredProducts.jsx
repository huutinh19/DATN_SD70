import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import * as request from "~/utils/httpRequest";
import FormatCurrency from "~/utils/FormatCurrency";

function NearExpiredProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    request
      .get("/statistical/near-expired-products")
      .then((response) => setProducts(response.data))
      .catch((e) => console.log(e));
  }, []);

  const columns = [
    { title: "STT", dataIndex: "id", key: "id", render: (text, record, index) => index + 1 },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Màu sắc", dataIndex: "color", key: "color" },
    { title: "Kích cỡ", dataIndex: "size", key: "size" },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <Tag color={quantity <= 5 ? "red" : "orange"}>{quantity}</Tag>
      ),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      render: (price) => <FormatCurrency value={price} />,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      pagination={{ pageSize: 5 }}
      rowKey="id"
    />
  );
}

export default NearExpiredProducts;