import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Create from "./pages/Create";
import UpdatePost from "./pages/UpdatePost";
import News from "./pages/News";
import ForgetPassword from "./pages/ForgetPassword";
import ChangePassword from "./pages/ChangePassword";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />}></Route>
        <Route path="/home" element={<Home />}></Route>
        <Route path="/signin" element={<Signin />}></Route>
        <Route path="/signup" element={<Signup />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create" element={<Create />}></Route>
        <Route path="/news" element={<News />}></Route>
        <Route path="/forgetpassword" element={<ForgetPassword />}></Route>
        <Route path="/changepassword" element={<ChangePassword />}></Route>
        <Route path="/updatepost/:postid" element={<UpdatePost />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
