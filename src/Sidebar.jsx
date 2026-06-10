import React from "react";
import {
  FaTachometerAlt,
  FaUsers,
  FaDumbbell,
  FaCreditCard,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
  FaChevronLeft,
} from "react-icons/fa";
import styled from "styled-components";

const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 260px;
  background: #fff;
  border-right: 1px solid #e2e8f0;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.05);
  padding: 16px;
  z-index: 1040;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isOpen ? "translateX(0)" : "translateX(-100%)")};

  @media (min-width: 768px) {
    transform: translateX(0);
  }
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const LogoBadge = styled.div`
  background-color: #3b82f6;
  color: white;
  font-weight: bold;
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.9rem;
`;

const LogoText = styled.span`
  font-weight: bold;
  color: #3b82f6;
  font-size: 1.1rem;
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  display: none;
  background: transparent;
  border: none;
  color: #475569;
  cursor: pointer;
  font-size: 1rem;

  @media (max-width: 767px) {
    display: block;
  }
`;

const Divider = styled.hr`
  border: 0;
  border-top: 1px solid #e2e8f0;
  margin: 0 0 16px 0;
`;

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex-grow: 1;
`;

const NavLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  font-size: 0.9rem;
  text-decoration: none;
  transition: background 0.2s ease;
  color: ${(props) => (props.$active ? "#3b82f6" : "#374151")};
  font-weight: ${(props) => (props.$active ? "600" : "400")};
  background: ${(props) => (props.$active ? "#eff6ff" : "transparent")};

  &:hover {
    background: #f1f5f9;
    color: #1e293b;
  }
`;

const UpgradeBox = styled.div`
  background: #f8fafc;
  border-radius: 10px;
  padding: 16px;
`;

const UpgradeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
`;

const UpgradeIcon = styled.div`
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const UpgradeTitle = styled.p`
  margin: 0;
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
`;

const UpgradeSubtitle = styled.p`
  margin: 0;
  font-size: 0.8rem;
  color: #64748b;
`;

const UpgradeButton = styled.button`
  width: 100%;
  background: #3b82f6;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: #2563eb;
  }
`;

const menuItems = [
  { name: "Dashboard", icon: <FaTachometerAlt />, path: "/" },
  { name: "Members", icon: <FaUsers />, path: "/members" },
  { name: "Trainers", icon: <FaDumbbell />, path: "/trainers" },
  { name: "Payments", icon: <FaCreditCard />, path: "/payments" },
  { name: "Schedules", icon: <FaCalendarAlt />, path: "/schedules" },
  { name: "Reports", icon: <FaChartBar />, path: "/reports" },
  { name: "Settings", icon: <FaCog />, path: "/settings" },
];

const Sidebar = ({ isOpen, toggleSidebar, currentPage }) => {
  return (
    <SidebarContainer $isOpen={isOpen}>
      <SidebarHeader>
        <LogoGroup>
          <LogoBadge>FP</LogoBadge>
          <LogoText>GYM BRO</LogoText>
        </LogoGroup>
        <CloseButton onClick={toggleSidebar}>
          <FaChevronLeft size={18} />
        </CloseButton>
      </SidebarHeader>

      <Divider />

      <Nav>
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            href={item.path}
            $active={item.path === currentPage}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </Nav>

      <Divider />

      <UpgradeBox>
        <UpgradeRow>
          <UpgradeIcon>
            <FaDumbbell />
          </UpgradeIcon>
          <div>
            <UpgradeTitle>Upgrade to Pro</UpgradeTitle>
            <UpgradeSubtitle>Get more features</UpgradeSubtitle>
          </div>
        </UpgradeRow>
        <UpgradeButton>Upgrade Plan</UpgradeButton>
      </UpgradeBox>
    </SidebarContainer>
  );
};

export default Sidebar;
