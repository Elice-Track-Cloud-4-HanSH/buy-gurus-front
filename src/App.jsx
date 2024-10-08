import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyPage from "./pages/MyPage";
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
        <Route path="/userMe" element={<MyPage />} />
        <Route path="/order" element={<Outlet />} >
          <Route index element={<Order/>}/>
          <Route path=":orderId" element={<OrderDetail />} />
        </Route>
        <Route path="/test" element={<AccordionTest />}/>
      </Routes>
    </>
  );


export default App;
