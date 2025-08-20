

import { Button, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import * as request from "~/utils/httpRequest";
import OrderItem from "./OrderItem";
import Loading from "~/components/Loading/Loading";
import { toast } from "react-toastify";
import { FaShoppingCart, FaTimesCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import { getTokenEmpoloyee } from "~/helper/useCookies";
function NewOrder() {
  const [listOrder, setListOrder] = useState([]);
  const [loading, setLoading] = useState(true);
  const [waitCreate, setWaitCreate] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadOrders();
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  const loadOrders = async () => {
    try {
      const response = await request.get(`/bill/new-bill`, {
        params: { status: 1 ,
           idStaff: jwtDecode(getTokenEmpoloyee()).id,
        },
      });
      const ordersWithTotalQuantity = await Promise.all(
        response.map(async (order) => {
          const detailResponse = await request.get(`/bill-detail`, {
            params: { bill: order.id, page: 1, sizePage: 1_000_000 },
          });
          const totalQuantity = detailResponse.data.reduce(
            (sum, item) => sum + item.quantity,
            0
          );
          return { ...order, totalQuantity };
        })
      );
      setListOrder(ordersWithTotalQuantity);
    } catch (e) {
      console.log(e);
    }
  };

  const handleCreate = () => {
    setWaitCreate(true);
    setTimeout(async () => {
      await request
        .post("/bill", {})
        .then((response) => {
          if (response.status === 200) {
            toast.success("Tạo mới thành công");
            loadOrders();
          }
        })
        .catch((e) => {
          toast.error(e.response.data);
        });
      setWaitCreate(false);
    }, 500);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Button
      type="primary"
  onClick={handleCreate}
  className="btn btn-primary text-white " // fs-3 để tăng kích thước
  loading={waitCreate}
>
  <i className="fas fa-plus"></i>
</Button>


      <Tabs>
        {listOrder.map((order, index) => (
          <Tabs.TabPane
            key={order.code}
            tab={
              <div className="d-flex align-items-center">
                <span className="fw-bold text-primary">{order.code}</span>
                <div className="position-relative ms-2">
                  <FaShoppingCart className="text-warning fs-5" />
                  {order.totalQuantity > 0 && (
                    <span
                      className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                      style={{ fontSize: "12px", padding: "3px 6px" }}
                    >
                      {order.totalQuantity}
                    </span>
                  )}
                </div>
              </div>
            }
          >
            <OrderItem props={order} index={index + 1} onSuccess={loadOrders} />
          </Tabs.TabPane>
        ))}
      </Tabs>
    </>
  );
}

export default NewOrder;
