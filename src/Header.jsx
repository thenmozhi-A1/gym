import React, { useState } from "react";
import { FaBell, FaChevronDown, FaMoon, FaSun, FaBars, FaUser, FaCog, FaSignOutAlt, FaSearch } from "react-icons/fa";
import styled from "styled-components";

const HeaderContainer = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #e2e8f0;
  padding: 10px 20px;
  background-color: #f8fafc;
  position: sticky;
  top: 0;
  z-index: 1020;

  .dark & {
    background-color: #1e293b;
    border-bottom-color: #334155;
    color: #fff;
  }
`;

const MobileToggle = styled.button`
  display: none;
  background: transparent;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;

  @media (max-width: 768px) {
    display: block;
  }

  .dark & {
    border-color: #475569;
    color: #cbd5e1;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoBadge = styled.div`
  background-color: #3b82f6;
  color: white;
  border-radius: 4px;
  padding: 4px 8px;
  font-weight: bold;
`;

const LogoText = styled.span`
  font-weight: bold;
  color: #3b82f6;
  font-size: 1.25rem;
`;

const SearchForm = styled.form`
  display: flex;
  margin: 0 auto;
  width: 50%;

  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInputGroup = styled.div`
  display: flex;
  width: 100%;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  background: #fff;

  .dark & {
    border-color: #334155;
    background: #0f172a;
  }
`;

const SearchIconWrapper = styled.div`
  padding: 8px 12px;
  color: #64748b;
  background: #f1f5f9;
  border-right: 1px solid #cbd5e1;

  .dark & {
    background: #1e293b;
    border-color: #334155;
    color: #94a3b8;
  }
`;

const SearchInput = styled.input`
  flex-grow: 1;
  border: none;
  padding: 8px 12px;
  outline: none;
  background: transparent;

  .dark & {
    color: #fff;
  }
`;

const ActionsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const IconButton = styled.button`
  background: transparent;
  border: none;
  color: #475569;
  font-size: 1.2rem;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;

  .dark & {
    color: #cbd5e1;
  }
`;

const Badge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #ef4444;
  color: white;
  font-size: 0.7rem;
  padding: 2px 5px;
  border-radius: 10px;
  font-weight: bold;
`;

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownMenu = styled.div`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background: #fff;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  min-width: ${(props) => props.$minWidth || "200px"};
  z-index: 1050;

  .dark & {
    background: #1e293b;
    border-color: #334155;
    color: #f8fafc;
  }
`;

const DropdownHeader = styled.div`
  padding: 10px 15px;
  font-weight: bold;
  color: #64748b;
  font-size: 0.85rem;

  .dark & {
    color: #94a3b8;
  }
`;

const DropdownDivider = styled.hr`
  margin: 0;
  border: 0;
  border-top: 1px solid #e2e8f0;

  .dark & {
    border-color: #334155;
  }
`;

const NotificationItem = styled.div`
  display: flex;
  align-items: flex-start;
  padding: 10px 15px;
  gap: 10px;

  img {
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }

  .text-content {
    font-size: 0.85rem;
  }

  .title {
    font-weight: 600;
  }

  .time {
    color: #64748b;
    font-size: 0.75rem;

    .dark & {
      color: #94a3b8;
    }
  }
`;

const UserMenuToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: #475569;

  .dark & {
    color: #cbd5e1;
  }

  img {
    border-radius: 50%;
    width: 32px;
    height: 32px;
  }

  .user-info {
    text-align: left;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      display: none;
    }
  }

  .name {
    font-weight: 600;
    font-size: 0.9rem;
  }

  .role {
    font-size: 0.75rem;
    color: #64748b;

    .dark & {
      color: #94a3b8;
    }
  }
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: #f1f5f9;

    .dark & {
      background-color: #334155;
    }
  }
`;

const Header = ({ toggleSidebar }) => {
  const [theme, setTheme] = useState("light");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <HeaderContainer>
      <MobileToggle onClick={toggleSidebar}>
        <FaBars />
      </MobileToggle>

      <LogoContainer>
        <LogoBadge>FP</LogoBadge>
        <LogoText>GYM BRO</LogoText>
      </LogoContainer>

      <SearchForm>
        <SearchInputGroup>
          <SearchIconWrapper>
            <FaSearch />
          </SearchIconWrapper>
          <SearchInput type="search" placeholder="Search..." />
        </SearchInputGroup>
      </SearchForm>

      <ActionsContainer>
        <IconButton onClick={toggleTheme}>
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </IconButton>

        <DropdownContainer>
          <IconButton onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}>
            <FaBell />
            <Badge>3</Badge>
          </IconButton>
          <DropdownMenu $isOpen={notifOpen} $minWidth="300px">
            <DropdownHeader>Notifications</DropdownHeader>
            <DropdownDivider />
            <div>
              <NotificationItem>
                <img src="/placeholder.svg" alt="User" />
                <div className="text-content">
                  <div className="title">John Doe renewed their membership</div>
                  <div className="time">2 minutes ago</div>
                </div>
              </NotificationItem>
              <NotificationItem>
                <img src="/placeholder.svg" alt="User" />
                <div className="text-content">
                  <div className="title">Sarah Miller requested a schedule change</div>
                  <div className="time">1 hour ago</div>
                </div>
              </NotificationItem>
              <NotificationItem>
                <img src="/placeholder.svg" alt="User" />
                <div className="text-content">
                  <div className="title">Robert Taylor finished their first training</div>
                  <div className="time">3 hours ago</div>
                </div>
              </NotificationItem>
            </div>
            <DropdownDivider />
            <div style={{ textAlign: "center", padding: "10px" }}>
              <span style={{ fontSize: "0.85rem", color: "#3b82f6", cursor: "pointer" }}>View all notifications</span>
            </div>
          </DropdownMenu>
        </DropdownContainer>

        <DropdownContainer>
          <UserMenuToggle onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}>
            <img src="/placeholder.svg" alt="Admin" />
            <div className="user-info">
              <span className="name">Admin User</span>
              <span className="role">Gym Manager</span>
            </div>
            <FaChevronDown />
          </UserMenuToggle>
          <DropdownMenu $isOpen={userOpen}>
            <DropdownHeader>My Account</DropdownHeader>
            <DropdownDivider />
            <DropdownItem><FaUser /> Profile</DropdownItem>
            <DropdownItem><FaCog /> Settings</DropdownItem>
            <DropdownDivider />
            <DropdownItem><FaSignOutAlt /> Logout</DropdownItem>
          </DropdownMenu>
        </DropdownContainer>
      </ActionsContainer>
    </HeaderContainer>
  );
};

export default Header;
