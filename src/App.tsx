import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AuthPages from "./pages/Auth";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPages />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;