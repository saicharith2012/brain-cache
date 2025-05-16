import "./App.css";
import Dashboard from "./pages/Dashboard";
import Signin from "./pages/Signin";
// import Dashboard from "./pages/Dashboard";
// import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
