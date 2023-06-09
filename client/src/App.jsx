import React, { useEffect } from "react";
import MainLayout from "./layouts/main-layout";
import AllRecords from "./pages/AllRecords";
import ImportData from "./pages/ImportData";
import Dashboard from "./pages/Dashboard";
import AdminConsole from "./pages/AdminConsole";
import Diagnosis from "./pages/Diagnosis";
import Login from "./pages/Login";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { Pathname } from "./utils/get-location";
import socket from "./config/socket";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";

function App() {
  const user = useSelector((state) => state.user);

  const header = () => {
    switch (Pathname()) {
      case "/admin":
        return "Admin Console";
      case "/allrecords":
        return "All Records";
      case "/dashboard":
        return "Dashboard";
      case "/importdataset":
        return "Import new Dataset";
      case "/diagnosis":
        return "Diagnosis";

      default:
        return "";
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("test-result", ({ patient, result }) => {
        const msg = `You have received test result of patient ${patient}. Do you want to print it?`;
        const isConfirmed = window.confirm(msg);
        if (isConfirmed) {
          result.url.forEach((item) => {
            window.open(item, "_blank");
          });
        }
      });
    });
  }, []);

  useEffect(() => {
    if (user._id) {
      socket.emit("login", { _id: user._id });
    }
  }, [user]);

  return (
    <>
      <ToastContainer />
      <MainLayout header={header()}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/allrecords" element={<AllRecords />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<AdminConsole />} />
          <Route path="/diagnosis" element={<Diagnosis />} />
          <Route path="/importdataset" element={<ImportData />} />
          <Route path="/auth" element={<Login />} />
        </Routes>
      </MainLayout>
    </>
  );
}

export default App;
