import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Home from "./pages/Home.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/SignUp.tsx";
import ManageProduct from "./pages/ManageProduct.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard">
          <Route path="products" element={<ManageProduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
