import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import AuthBox from "./AuthBox";

const Layout = () =>{
    return (
        <BrowserRouter>
            <Header/>

            <Routes>
                <Route exact path="/" element={<AuthBox/>}/>
                <Route exact path="/register" element={<AuthBox register/>}/>
            </Routes>
        </BrowserRouter>
    );
};

export default Layout