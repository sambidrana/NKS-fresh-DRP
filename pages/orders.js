import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    axios.get("/api/orders").then((res) => {
      setOrders(res.data);
    });
  }, []);
  return (
    <Layout>
      <h1>Orders</h1>
      <table className="basic">
        <thead>
          <tr>
            <th>Date</th>
            <th>Paid</th>
            <th>Recipient</th>
            <th>Product</th>
          </tr>
        </thead>
        <tbody>
          {orders.length > 0 &&
            orders.map((order) => (
              <tr>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td className={order.paid ? 'text-green-600' : "text-red-600"}>{order.paid ? "YES" : "NO"}</td>
                <td>
                  {order.name}
                  <br />
                  {order.phone}
                  <br />
                  {order.email}
                  <br />
                  {order.city},&nbsp;
                  {order.territory}&nbsp;
                  {order.postalCode}
                  <br />
                </td>
                <td>
                  {order.line_items.map((line) => (
                    <>
                      {line.price_data.product_data.name} x {line.quantity}
                      {/* {JSON.stringify(line)} */}
                    </>
                  ))}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </Layout>
  );
}
