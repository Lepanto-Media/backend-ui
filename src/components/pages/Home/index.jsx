import React, { useEffect, useState } from "react";
import HomeCards from "./HomeCards";
import Chart from "./chart";
import { AUTH_TOKEN, BASE_URL } from "../../global/constants";
import axios from "axios";
import dayjs from "dayjs";

function Home() {
  const token = localStorage.getItem(AUTH_TOKEN);
  const [data, setData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [to, setTo] = useState(dayjs(new Date()));
  const [from, setFrom] = useState(dayjs(new Date()));
  useEffect(() => {
    document.title = "Lepanto, LLC - Admin Dashboard";
    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${BASE_URL}/order`,
      // params: { to:dayjs(to).format('DD-MM-YYYY'), from:dayjs(from).format('DD-MM-YYYY') },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .request(config)
      .then((response) => {
        let orders = response?.data?.data?.order;
        setData(orders.map((ord) => ord.total_amount));
        setLabels(
          orders.map((ord) => dayjs(ord.created_at).format("DD-MM-YYYY"))
        );
      })
      .catch((err) => console.log(err));
  }, [to, from]);

  return (
    <>
      <div className="container">
        <div className="row">
          <HomeCards />
        </div>
      </div>
      <div>
        <Chart
          data={data}
          labels={labels}
          setFrom={setFrom}
          from={from}
          to={to}
          setTo={setTo}
        />
      </div>
    </>
  );
}

export default Home;
