import React, { useEffect } from "react";
import HomeCards from "./HomeCards";

function Home() {
  useEffect(() => {
    document.title = "Lepanto, LLC - Admin Dashboard";
  }, []);
  return (
    <>
      <HomeCards />
    </>
  );
}

export default Home;
