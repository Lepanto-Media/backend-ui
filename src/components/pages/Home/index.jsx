import React, { useEffect } from "react";

function Home() {
  useEffect(() => {
    document.title = "Lepanto, LLC - Admin Dashboard";
  }, []);
  return <div>Home</div>;
}

export default Home;
