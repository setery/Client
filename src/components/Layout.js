import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";
import { useGlobalContext } from "../context/GlobalContext";
import Dashboard from "./Dashboard";

const Layout = () => {
  const { fetchingUser } = useGlobalContext();

  return fetchingUser ? (
    <div className="loading">
        <h1>loading</h1>
    </div>
  ) : (
    <BrowserRouter>
      <Header />

      <Routes>
        <Route exact path="/" element={<AuthBox />} />
        <Route exact path="/register" element={<AuthBox register />} />
        <Route exact path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </BrowserRouter>
  );
};

export default Layout;
