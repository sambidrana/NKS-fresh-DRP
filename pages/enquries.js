import Layout from "@/components/Layout";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Enquries() {
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    axios.get("/api/enquries").then((res) => {
      if (Array.isArray(res.data)) {
        setEnquiries(res.data);
      } else {
        console.error("Received data is not an array:", res.data);
      }
    });
  }, []);
  return (
    <>
      <Layout>
        <h1>Enquries</h1>
        <table className="basic">
          <thead>
            <tr>
              <th>From</th>
              <th>Email</th>
              <th>Contact No</th>
              <th>Enquiry</th>
            </tr>
          </thead>
          <tbody>
            {enquiries.map((enquiry) => (
              <tr key={enquiry._id}>
                <td>{enquiry.name}</td>
                <td>{enquiry.email}</td>
                <td>{enquiry.phone}</td>
                <td>{enquiry.enquiry}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Layout>
    </>
  );
}
