// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import HomeNavbar from './components/Home_comp/HomeNavbar/HomeNavbar'; // Import HomeNavbar
import Home from './Pages/Home/Home';
import Menu from './Pages/Menu/Menu';
import Contact from './Pages/Contact/Contact';
import OrderStatus from './Pages/OrderStatus/OrderStatus';
import Admin from './Pages/Admin/Admin';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import MenuItem from './components/MenuItem/MenuItem';
import OrderForm from './components/OrderForm/OrderForm';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <HomeNavbar /> {/* Use HomeNavbar only on Home page */}
                <div className="content">
                  <Home />
                </div>
              </>
            }
          />
          <Route
            path="/menu"
            element={
              <>
                <Navbar /> {/* Use original Navbar for other pages */}
                <div className="content">
                  <Menu/>
                </div>
              </>
            }
          />
          <Route
            path="/contact"
            element={
              <>
                <Navbar />
                <div className="content">
                  <Contact />
                </div>
              </>
            }
          />
          <Route
            path="/order-status"
            element={
              <>
                <Navbar />
                <div className="content">
                  <OrderStatus />
                </div>
              </>
            }
          />
          <Route
            path="/admin"
            element={
              <>
                <Navbar />
                <div className="content">
                  <Admin />
                </div>
              </>
            }
          />
          <Route
            path="/login"
            element={
              <>
                <Navbar />
                <div className="content">
                  <Login />
                </div>
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Navbar />
                <div className="content">
                  <Register />
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;