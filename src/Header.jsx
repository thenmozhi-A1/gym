import React, { useState } from "react";
import { FaBell, FaChevronDown, FaMoon, FaSun, FaBars, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { Dropdown, Form, Button, InputGroup, Badge, Image } from "react-bootstrap";
// import 'bootstrap/dist/css/bootstrap.min.css';


const Header = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="d-flex align-items-center justify-content-between border-bottom px-3 py-2 bg-light sticky-top">
      <Button variant="outline-secondary" className="d-md-none" onClick={toggleSidebar}>
        <FaBars />
      </Button>

      <div className="d-none d-md-flex align-items-center gap-2">
        <div className="bg-primary text-white rounded px-2 py-1 fw-bold">FP</div>
        <span className="fw-bold text-primary fs-5">GYM BRO</span>
      </div>

      <Form className="d-none d-md-flex mx-auto w-50">
        <InputGroup>
          <InputGroup.Text>
            <i className="bi bi-search" />
          </InputGroup.Text>
          <Form.Control type="search" placeholder="Search..." />
        </InputGroup>
      </Form>

      <div className="d-flex align-items-center gap-3">
        <Button variant="link" className="text-dark" onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="position-relative text-dark">
            <FaBell />
            <Badge pill bg="danger" className="position-absolute top-0 end-0 translate-middle">
              3
            </Badge>
          </Dropdown.Toggle>
          <Dropdown.Menu style={{ minWidth: "300px" }}>
            <Dropdown.Header>Notifications</Dropdown.Header>
            <Dropdown.Divider />
            <div className="px-2">
              <div className="d-flex align-items-start mb-2">
                <Image src="/placeholder.svg" roundedCircle width="32" height="32" className="me-2" />
                <div>
                  <div className="fw-semibold">John Doe renewed their membership</div>
                  <small className="text-muted">2 minutes ago</small>
                </div>
              </div>
              <div className="d-flex align-items-start mb-2">
                <Image src="/placeholder.svg" roundedCircle width="32" height="32" className="me-2" />
                <div>
                  <div className="fw-semibold">Sarah Miller requested a schedule change</div>
                  <small className="text-muted">1 hour ago</small>
                </div>
              </div>
              <div className="d-flex align-items-start">
                <Image src="/placeholder.svg" roundedCircle width="32" height="32" className="me-2" />
                <div>
                  <div className="fw-semibold">Robert Taylor finished their first training</div>
                  <small className="text-muted">3 hours ago</small>
                </div>
              </div>
            </div>
            <Dropdown.Divider />
            <div className="text-center py-1">
              <Button variant="light" size="sm">View all notifications</Button>
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown align="end">
          <Dropdown.Toggle variant="link" className="d-flex align-items-center text-dark">
            <Image src="/placeholder.svg" roundedCircle width="32" height="32" className="me-2" />
            <div className="d-none d-md-block text-start me-1">
              <div className="fw-semibold">Admin User</div>
              <small className="text-muted">Gym Manager</small>
            </div>
            <FaChevronDown />
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Header>My Account</Dropdown.Header>
            <Dropdown.Divider />
            <Dropdown.Item><FaUser className="me-2" /> Profile</Dropdown.Item>
            <Dropdown.Item><FaCog className="me-2" /> Settings</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item><FaSignOutAlt className="me-2" /> Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </header>
  );
};

export default Header;
