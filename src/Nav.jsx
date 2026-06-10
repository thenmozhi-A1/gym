import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import styled from "styled-components";

const NavContainer = styled.nav`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background: rgba(10, 10, 10, 0.95);
  height: ${(props) => (props.$scrolled ? "65px" : "80px")};
  border-bottom: 2px solid ${(props) => (props.$scrolled ? "#ffc107" : "#222")};
  box-shadow: ${(props) => (props.$scrolled ? "0 0 20px rgba(255, 193, 7, 0.4)" : "none")};
  transition: all 0.3s ease;
  display: flex;
  align-items: center;

  @media (max-width: 991px) {
    height: 70px;
  }
`;

const NavInner = styled.div`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 0 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Brand = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  background: transparent;
  margin-right: 30px;
  transition: transform 0.3s ease;

  img {
    height: 40px;
    width: auto;
    object-fit: contain;
    margin-right: 10px;
  }

  &:hover {
    transform: scale(1.05);
  }

  @media (max-width: 991px) {
    margin: 0;
  }
`;

const BrandText = styled.span`
  font-family: 'Oswald', 'Impact', sans-serif;
  font-size: ${(props) => (props.$scrolled ? "1.5rem" : "1.8rem")};
  letter-spacing: -1px;
  color: #000;
  background: #ffc107;
  padding: 0 10px;
  transform: skewX(-10deg);
  display: inline-block;
  transition: font-size 0.3s ease;
`;

const Toggler = styled.button`
  display: none;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;

  @media (max-width: 991px) {
    display: block;
  }
`;

const NavCollapse = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 991px) {
    display: ${(props) => (props.$isOpen ? "block" : "none")};
    position: absolute;
    top: 70px;
    left: 0;
    width: 100%;
    background: #000;
    padding: 20px;
    border-bottom: 2px solid #ffc107;
    flex-direction: column;
    align-items: flex-start;
  }
`;

const NavList = styled.ul`
  display: flex;
  gap: 5px;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 991px) {
    flex-direction: column;
    width: 100%;
    gap: 0;
  }
`;

const NavItem = styled.li`
  position: relative;
`;

const NavButton = styled.button`
  background: transparent;
  border: none;
  font-family: 'Oswald', 'Impact', sans-serif;
  font-size: 1.1rem;
  text-transform: uppercase;
  color: #ffffff;
  padding: 15px 25px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  z-index: 1;
  text-decoration: none;
  display: block;
  width: 100%;
  text-align: left;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: #ffc107;
    z-index: -1;
    transition: all 0.4s cubic-bezier(0.7, 0, 0.3, 1);
    transform: skewX(-20deg);
  }

  &:hover {
    color: #000;
  }

  &:hover::before {
    left: 0;
  }

  @media (max-width: 991px) {
    border-bottom: 1px solid #222;
    padding: 20px;
  }
`;

const DropdownMenu = styled.ul`
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  position: absolute;
  top: 100%;
  left: 0;
  background: #111;
  border: 2px solid #ffc107;
  border-top: none;
  border-radius: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  min-width: 200px;
  z-index: 1000;

  @media (max-width: 991px) {
    position: static;
    border: none;
    box-shadow: none;
    padding-left: 20px;
    border-bottom: 1px solid #222;
  }
`;

const DropdownItem = styled(Link)`
  color: #fff;
  font-family: 'Oswald', 'Impact', sans-serif;
  text-transform: uppercase;
  padding: 12px 25px;
  border-bottom: 1px solid #222;
  transition: all 0.2s ease;
  text-decoration: none;
  display: block;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #ffc107;
    color: #000;
    transform: scale(1.05);
    padding-left: 35px;
  }
`;

const DropdownDivider = styled.hr`
  border-color: rgba(255, 255, 255, 0.25);
  margin: 0;
`;

const ActionWrapper = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 991px) {
    margin-top: 20px;
    width: 100%;
  }
`;

const BtnTech = styled.button`
  background: transparent;
  border: 2px solid #ffc107;
  color: #ffc107;
  font-family: 'Oswald', 'Impact', sans-serif;
  text-transform: uppercase;
  padding: 10px 30px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  z-index: 1;
  cursor: pointer;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 0;
    background: #ffc107;
    z-index: -1;
    transition: all 0.3s ease;
  }

  &:hover {
    color: #000;
  }

  &:hover::after {
    height: 100%;
  }

  @media (max-width: 991px) {
    width: 100%;
  }
`;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [workoutsOpen, setWorkoutsOpen] = useState(false);
  const [nutritionOpen, setNutritionOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const handleNavClick = () => {
    // Add a small delay to prevent ghost clicks on underlying elements in mobile view
    setTimeout(() => {
      setIsOpen(false);
      setWorkoutsOpen(false);
      setNutritionOpen(false);
    }, 150);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userRole");
    window.location.href = "/";
  };

  return (
    <NavContainer $scrolled={scrolled}>
      <NavInner>
        <Brand to="/" onClick={handleNavClick}>
          <img src="/logo.png" alt="B&Y Fitness Logo" />
          <BrandText $scrolled={scrolled}>B&Y FITNESS</BrandText>
        </Brand>

        <Toggler onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={32} color="#ffc107" /> : <Menu size={32} color="#ffc107" />}
        </Toggler>

        <NavCollapse $isOpen={isOpen}>
          <NavList>
            <NavItem>
              <NavButton onClick={() => { navigate("/"); handleNavClick(); }}>Home</NavButton>
            </NavItem>
            <NavItem>
              <NavButton onClick={() => { navigate("/about"); handleNavClick(); }}>About</NavButton>
            </NavItem>
            <NavItem 
              onMouseEnter={() => setWorkoutsOpen(true)} 
              onMouseLeave={() => setWorkoutsOpen(false)}
            >
              <NavButton onClick={() => setWorkoutsOpen(!workoutsOpen)}>Workouts</NavButton>
              <DropdownMenu $isOpen={workoutsOpen}>
                <li><DropdownItem to="/workouts" onClick={handleNavClick}>Overview</DropdownItem></li>
                <li><DropdownDivider /></li>
                <li><DropdownItem to="/workout/bench-press" onClick={handleNavClick}>Bench Press</DropdownItem></li>
                <li><DropdownItem to="/workout/squats" onClick={handleNavClick}>Squats</DropdownItem></li>
                <li><DropdownItem to="/workout/deadlifts" onClick={handleNavClick}>Deadlifts</DropdownItem></li>
                <li><DropdownItem to="/workout/pull-ups" onClick={handleNavClick}>Pull-Ups</DropdownItem></li>
                <li><DropdownItem to="/workout/dumbbell-rows" onClick={handleNavClick}>Dumbbell Rows</DropdownItem></li>
                <li><DropdownItem to="/workout/lunges" onClick={handleNavClick}>Lunges</DropdownItem></li>
                <li><DropdownItem to="/workout/cardio" onClick={handleNavClick}>Cardio</DropdownItem></li>
                <li><DropdownItem to="/workout/bulking" onClick={handleNavClick}>Bulking</DropdownItem></li>
                <li><DropdownItem to="/workout/weight-loss" onClick={handleNavClick}>Weight Loss</DropdownItem></li>
                <li><DropdownItem to="/workout/yoga" onClick={handleNavClick}>Yoga</DropdownItem></li>
              </DropdownMenu>
            </NavItem>
            <NavItem 
              onMouseEnter={() => setNutritionOpen(true)} 
              onMouseLeave={() => setNutritionOpen(false)}
            >
              <NavButton onClick={() => setNutritionOpen(!nutritionOpen)}>Nutrition</NavButton>
              <DropdownMenu $isOpen={nutritionOpen}>
                <li><DropdownItem to="/nutrition" onClick={handleNavClick}>Plans</DropdownItem></li>
                <li><DropdownItem to="/nutrition#supplements" onClick={handleNavClick}>Supplements</DropdownItem></li>
              </DropdownMenu>
            </NavItem>
            <NavItem>
              <NavButton onClick={() => { navigate("/subscription"); handleNavClick(); }}>Pricing</NavButton>
            </NavItem>
          </NavList>

          <ActionWrapper>
            {!isLoggedIn ? (
              <BtnTech onClick={() => { navigate("/login"); handleNavClick(); }}>
                Enter Arena
              </BtnTech>
            ) : (
              <BtnTech onClick={handleLogout}>
                Logout
              </BtnTech>
            )}
          </ActionWrapper>
        </NavCollapse>
      </NavInner>
    </NavContainer>
  );
};

export default Navbar;
