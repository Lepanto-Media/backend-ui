import React, { Suspense } from "react";
import LoadingScreen from "../global/screens/LoadingScreen";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import SideBar from "../global/Navigation/SideBar";
import TopBar from "../global/Navigation/TopBar";
import { checkUser } from "./Login/checkUser";

function Layout() {
  const navigate = useNavigate();
  return (
    <>
      <div className="app">
        <SideBar />
        <main className="content">
          <TopBar />
          <Suspense fallback={<LoadingScreen />}>
            {checkUser() ? <Outlet /> : <Navigate to="/login" />}
          </Suspense>
        </main>
      </div>
    </>
  );
}

export default Layout;
