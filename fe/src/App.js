import { BrowserRouter, Route, Routes } from "react-router-dom";
import { publicRouters } from "./route";
import { FloatButton } from "antd";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/admin/login/Login";
import CoreUI from "./layouts/admin/CoreUI";

function App() {
  const renderRoutes = (routes) => {
    return routes.map((route, index) => (
      <Route
        key={index}
        path={route.path}
        element={
          
            <route.element />
          
        }
      />
    ));
  };
  console.log(process.env.API_KEY);
  return (
    <BrowserRouter>
    <Routes>
        {renderRoutes(publicRouters)}
        <Route key={"login"} path="/admin/login" element={<Login />}></Route>
      </Routes>
    <FloatButton.BackTop/>
    <ToastContainer autoClose={3000}/>
  </BrowserRouter>
  );
}

export default App;
