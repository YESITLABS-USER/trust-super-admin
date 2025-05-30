import { BrowserRouter, Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import UserManagement from "./pages/UserManagement"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user-management" element={<UserManagement />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
