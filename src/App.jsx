import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Order from "./pages/Order/Order";
import OrderDetail from "./pages/Order/OrderDetail";
import AccordionTest from "./pages/AccordionTest";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} exact/>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/order" element={<Order/>} />
        <Route path="/order/:orderId" element={<OrderDetail />} />
        <Route path="/test" element={<AccordionTest />}/>
      </Routes>
    </>
  );
}

export default App;
