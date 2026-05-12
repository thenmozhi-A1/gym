import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { Clock, Award, Users } from "lucide-react";

const plans = [
  {
    id: 1,
    title: "Standard Plan",
    price: 5000,
    duration: "Per Month",
    badge: "Budget Friendly",
    rating: 4.5,
    userCount: "5k+ Members",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Access during Peak Hours",
      "Basic Workout Routines",
      "Standard Gym Equipment",
      "Locker Room Access",
      "Free Hydration Station",
      "Online Support Community",
    ],
    bonus: "7-Day Money Back Guarantee",
    accent: "#00d2ff",
  },
  {
    id: 2,
    title: "Pro Membership",
    price: 9000,
    duration: "Per 6 Months",
    badge: "Most Popular",
    rating: 4.8,
    userCount: "2.5k+ Members",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Full Access (6 AM - Midnight)",
      "4 PT Sessions per Month",
      "Standard Nutritional Guide",
      "Locker & Shower Facilities",
      "Access to Yoga & HIIT Classes",
      "Monthly Body Scan Analysis",
    ],
    bonus: "10% Discount on Supplements",
    accent: "#ff9900",
  },
  {
    id: 3,
    title: "Elite Yearly",
    price: 12000,
    duration: "Per Year",
    badge: "Best Value",
    rating: 5,
    userCount: "800+ Members",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1469&auto=format&fit=crop",
    features: [
      "24/7 Access to All Gyms",
      "Unlimited Personal Training",
      "Customized Macro Plans",
      "Spa & Recovery Zone",
      "Free Supplement Monthly Kit",
      "Biometric Health Tracking",
    ],
    bonus: "Includes Free Gym Apparel",
    accent: "#ff3e3e",
  },
  {
    id: 4,
    title: "VIP Yearly",
    price: 18000,
    duration: "Per Year",
    badge: "Ultimate Experience",
    rating: 5,
    userCount: "300+ Members",
    image: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1470&auto=format&fit=crop",
    features: [
      "Everything in Elite Plan",
      "Personal Nutritionist",
      "Home Workout Equipment Hire",
      "Monthly Massage Therapy",
      "Guest Pass for Friends",
      "Private Locker with Name",
    ],
    bonus: "VIP Event Invitations",
    accent: "#ffc107",
  },
  {
    id: 5,
    title: "Custom Plan",
    price: "Custom",
    duration: "Flexible",
    badge: "For Teams/Groups",
    rating: 4.9,
    userCount: "50+ Corporate Teams",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=1375&auto=format&fit=crop",
    features: [
      "Tailored Group Sessions",
      "Corporate Wellness Programs",
      "Custom Training Modules",
      "Flexible Timing Slots",
      "Team Progress Reports",
      "Special Event Hosting",
    ],
    bonus: "Dedicated Account Manager",
    accent: "#9c27b0",
  },
];

const Subscription = () => {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    }
  }, [hash]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const handlePayment = (amount) => {
    if (!window.Razorpay) {
      alert("Razorpay SDK not loaded. Please check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_SoL1lxm6LzPqie",
      amount: amount * 100,
      currency: "INR",
      name: "GymDash",
      description: "Gym Membership Payment",
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
      },
      prefill: {
        name: "Dinesh",
        email: "dinesh@gmail.com",
        contact: "1234567890",
      },
      theme: {
        color: "#ffcc00",
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <Container>
      <HeaderSection>
        <h2>CHOOSE YOUR TRANSFORMATION</h2>
        <p>Unlock your potential with our premium membership plans.</p>
      </HeaderSection>

      <StyledWrapper>
        {/* Monthly Plans Section */}
        <div id="monthly-plans" className="plan-category w-100 mt-5">
          <CategoryHeader>
            <Clock size={32} />
            <div>
              <h3>Monthly Memberships</h3>
              <p>Flexible month-to-month plans for those who value freedom and variety.</p>
            </div>
          </CategoryHeader>
          <div className="plans-grid">
            {plans.filter(p => p.duration.includes("Month")).map(plan => (
              <PlanCard key={plan.id} accent={plan.accent}>
                <div className="card-container">
                  {plan.badge && <div className="badge">{plan.badge}</div>}
                  <div className="card">
                    <div className="front-content">
                      <div className="top-accent" style={{ background: plan.accent }}></div>
                      <img src={plan.image} alt={plan.title} />
                      <div className="title-overlay">
                        {plan.title}
                        <div className="card-stats">
                          <span style={{ color: 'white' }}  >⭐ {plan.rating}</span>
                          <span style={{ color: 'white' }} >👥 {plan.userCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="content">
                      <p className="heading">{plan.title}</p>
                      <p className="price-label">₹{plan.price} <small>{plan.duration}</small></p>
                      <ul className="feature-list">
                        {plan.features.map((feature, index) => (
                          <li key={index}><CheckIcon /> {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="payment-section">
                  <button onClick={() => handlePayment(plan.price)}>Join Now</button>
                </div>
              </PlanCard>
            ))}
          </div>
        </div>

        {/* Yearly Plans Section */}
        <div id="yearly-plans" className="plan-category w-100 mt-5 pt-5 border-top border-secondary border-opacity-25">
          <CategoryHeader>
            <Award size={32} />
            <div>
              <h3>Annual Elite Programs</h3>
              <p>Commit to a year of transformation and unlock our most exclusive premium benefits.</p>
            </div>
          </CategoryHeader>
          <div className="plans-grid">
            {plans.filter(p => p.duration.includes("Year")).map(plan => (
              <PlanCard key={plan.id} accent={plan.accent}>
                <div className="card-container">
                  {plan.badge && <div className="badge">{plan.badge}</div>}
                  <div className="card">
                    <div className="front-content">
                      <div className="top-accent" style={{ background: plan.accent }}></div>
                      <img src={plan.image} alt={plan.title} />
                      <div className="title-overlay">
                        {plan.title}
                        <div className="card-stats">
                          <span>⭐ {plan.rating}</span>
                          <span>👥 {plan.userCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="content">
                      <p className="heading">{plan.title}</p>
                      <p className="price-label">₹{plan.price} <small>{plan.duration}</small></p>
                      <ul className="feature-list">
                        {plan.features.map((feature, index) => (
                          <li key={index}><CheckIcon /> {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="payment-section">
                  <button onClick={() => handlePayment(plan.price)}>Join Now</button>
                </div>
              </PlanCard>
            ))}
          </div>
        </div>

        {/* Custom Plans Section */}
        <div id="custom-plans" className="plan-category w-100 mt-5 pt-5 border-top border-secondary border-opacity-25">
          <CategoryHeader>
            <Users size={32} />
            <div>
              <h3>Tailored Group & Corporate Plans</h3>
              <p>Specialized fitness solutions for teams, organizations, and private groups.</p>
            </div>
          </CategoryHeader>
          <div className="plans-grid">
            {plans.filter(p => p.title.includes("Custom")).map(plan => (
              <PlanCard key={plan.id} accent={plan.accent}>
                <div className="card-container">
                  {plan.badge && <div className="badge">{plan.badge}</div>}
                  <div className="card">
                    <div className="front-content">
                      <div className="top-accent" style={{ background: plan.accent }}></div>
                      <img src={plan.image} alt={plan.title} />
                      <div className="title-overlay">
                        {plan.title}
                        <div className="card-stats">
                          <span>⭐ {plan.rating}</span>
                          <span>👥 {plan.userCount}</span>
                        </div>
                      </div>
                    </div>
                    <div className="content">
                      <p className="heading">{plan.title}</p>
                      <p className="price-label">₹{plan.price} <small>{plan.duration}</small></p>
                      <ul className="feature-list">
                        {plan.features.map((feature, index) => (
                          <li key={index}><CheckIcon /> {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="payment-section">
                  <button onClick={() => window.location.href = "mailto:custom@gymdash.com"}>Enquire Now</button>
                </div>
              </PlanCard>
            ))}
          </div>
        </div>
      </StyledWrapper>

      <DetailedSections>
        {plans.map((plan) => (
          <div className="detail-row" key={plan.id} id={`detail-${plan.id}`}>
            <div className="detail-image">
              <img src={plan.image} alt={plan.title} />
              <div className="image-overlay" style={{ background: plan.accent + "33" }}></div>
            </div>
            <div className="detail-text">
              <span className="detail-tag" style={{ color: plan.accent }}>{plan.badge}</span>
              <h3>{plan.title} Deep Dive</h3>
              <p className="description">
                {plan.id === 1 && "Our Elite membership is designed for high-performance athletes and those who refuse to settle for anything but the best. With 24/7 access and personalized coaching, your goals are always within reach."}
                {plan.id === 2 && "The Pro membership is our most popular choice, offering a balanced mix of independence and professional guidance. It's perfect for regular gym-goers who want to take their training to the next level."}
                {plan.id === 3 && "The Standard plan provides all the essentials you need to start your fitness journey. High-quality equipment, a supportive community, and flexible access during peak hours."}
              </p>
              <div className="highlight-grid">
                <div className="highlight">
                  <h5>Who is this for?</h5>
                  <p>
                    {plan.id === 1 && "Serious athletes, competitors, and luxury-seekers."}
                    {plan.id === 2 && "Consistent trainers and fitness enthusiasts."}
                    {plan.id === 3 && "Beginners and those with a flexible schedule."}
                  </p>
                </div>
                <div className="highlight">
                  <h5>Key Advantage</h5>
                  <p>
                    {plan.id === 1 && "Complete 1-on-1 personalized transformation."}
                    {plan.id === 2 && "Access to all group classes and professional guidance."}
                    {plan.id === 3 && "Most affordable entry into a premium gym environment."}
                  </p>
                </div>
              </div>
              <button className="cta-btn" onClick={() => handlePayment(plan.price)}>Join {plan.title}</button>
            </div>
          </div>
        ))}
      </DetailedSections>

      <ComparisonSection id="compare">
        <h3>Compare Our Plans</h3>
        <TableWrapper>
          <table>
            <thead>
              <tr>
                <th>Features</th>
                <th>Standard</th>
                <th>Pro</th>
                <th>Elite Yearly</th>
                <th>VIP Yearly</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Gym Access</td>
                <td>Peak Hours</td>
                <td>6 AM - Midnight</td>
                <td>24/7 VIP</td>
                <td>24/7 VIP + Guest</td>
              </tr>
              <tr>
                <td>Personal Trainer</td>
                <td>❌</td>
                <td>4 Sessions/Mo</td>
                <td>Unlimited</td>
                <td>Daily Coaching</td>
              </tr>
              <tr>
                <td>Nutrition Plan</td>
                <td>Generic</td>
                <td>Guided</td>
                <td>DNA-Based</td>
                <td>Personal Nutritionist</td>
              </tr>
              <tr>
                <td>Spa & Massage</td>
                <td>❌</td>
                <td>❌</td>
                <td>Spa Access</td>
                <td>Monthly Massage</td>
              </tr>
              <tr>
                <td>Locker Service</td>
                <td>Standard</td>
                <td>Premium</td>
                <td>Private Suite</td>
                <td>Named Private Locker</td>
              </tr>
            </tbody>
          </table>
        </TableWrapper>
      </ComparisonSection>

      <FaqSection id="faq">
        <h3>Membership FAQ</h3>
        <FaqGrid>
          <div className="faq-item">
            <h4>Can I upgrade my plan later?</h4>
            <p>Yes! You can upgrade to a higher tier at any time. We will prorate your remaining balance.</p>
          </div>
          <div className="faq-item">
            <h4>Is there a joining fee?</h4>
            <p>Absolutely not. We believe in transparent pricing with no hidden costs.</p>
          </div>
          <div className="faq-item">
            <h4>Can I freeze my membership?</h4>
            <p>Elite and Pro members can freeze their membership for up to 30 days per year for free.</p>
          </div>
          <div className="faq-item">
            <h4>Do you offer student discounts?</h4>
            <p>Yes, show your valid student ID at the front desk to get an additional 15% off any plan.</p>
          </div>
        </FaqGrid>
      </FaqSection>

      <CustomSection id="custom-plans">
        <div className="custom-box">
          <h3>Need a Custom Plan?</h3>
          <p>Looking for something tailored specifically for your organization or a group of athletes? Our experts will craft a plan that fits your exact needs.</p>
          <button onClick={() => window.location.href = "mailto:custom@gymdash.com"}>Contact for Custom Pricing</button>
        </div>
      </CustomSection>
    </Container>
  );
};

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ marginRight: "8px", color: "#ffcc00" }}
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-image: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("https://i.etsystatic.com/29035216/r/il/7e7e20/3640388699/il_1080xN.3640388699_sg0x.jpg");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: white;
  padding: 80px 20px;
`;

const HeaderSection = styled.div`
  text-align: center;
  margin-bottom: 40px;

  h2 {
    font-size: 3rem;
    font-weight: 900;
    letter-spacing: 2px;
    margin-bottom: 10px;
    background: linear-gradient(to right, #fff, #ffcc00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.1rem;
    color: #ccc;
    max-width: 600px;
    margin: 0 auto;
  }
`;

const StyledWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 80px;
  max-width: 1200px;
  width: 100%;

  .plans-grid {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 40px;
    width: 100%;
  }
`;

const CategoryHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 40px;
  text-align: left;
  border-left: 5px solid #ffcc00;
  padding-left: 25px;

  svg {
    color: #ffcc00;
    flex-shrink: 0;
  }

  h3 {
    font-size: 2.2rem;
    font-weight: 800;
    margin-bottom: 5px;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  p {
    color: #aaa;
    font-size: 1.1rem;
    margin: 0;
  }
`;

const PlanCard = styled.div`
  background: #1a1a1a;
  padding: 15px;
  border-radius: 20px;
  text-align: center;
  transition: transform 0.3s ease;
  flex: 1;
  min-width: 300px;
  max-width: 350px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    transform: translateY(-10px);
    border-color: ${(props) => props.accent || "#ffcc00"};
  }

  .card-container {
    width: 100%;
    height: 380px;
    position: relative;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 20px;
    position: relative;
  }

  .badge {
    position: absolute;
    top: 20px;
    right: -35px;
    background: ${(props) => props.accent || "#ffcc00"};
    color: #000;
    padding: 5px 40px;
    transform: rotate(45deg);
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    z-index: 10;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    letter-spacing: 1px;
  }

  .card {
    width: 100%;
    height: 100%;
    position: relative;
  }

  .top-accent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 6px;
    z-index: 2;
  }

  .front-content {
    width: 100%;
    height: 100%;
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      filter: brightness(0.8);
    }

    .title-overlay {
      position: absolute;
      bottom: 20px;
      left: 0;
      width: 100%;
      font-size: 1.5rem;
      font-weight: 800;
      color: #fff;
      text-transform: uppercase;
      letter-spacing: 1px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
    }

    .card-stats {
      display: flex;
      gap: 15px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0;
      background: rgba(0, 0, 0, 0.5);
      padding: 4px 12px;
      border-radius: 20px;
      backdrop-filter: blur(5px);
    }
  }

  .content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 30px 20px;
    background: rgba(15, 15, 15, 0.95);
    backdrop-filter: blur(10px);
    color: #e8e8e8;
    transform: translateY(100%);
    transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
    z-index: 3;
  }

  .card:hover .content {
    transform: translateY(0);
  }

  .card:hover .front-content {
    transform: scale(1.1);
  }

  .heading {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 5px;
    color: ${(props) => props.accent || "#ffcc00"};
    text-transform: uppercase;
  }

  .price-label {
    font-size: 1.2rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #fff;
    
    small {
      font-size: 0.8rem;
      color: #aaa;
      font-weight: 400;
    }
  }

  .feature-list {
    list-style: none;
    padding: 0;
    text-align: left;
    width: 100%;
    
    li {
      margin-bottom: 15px;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      color: #ddd;
    }
  }

  .bonus-tag {
    margin-top: auto;
    background: rgba(255, 204, 0, 0.1);
    border: 1px dashed #ffcc00;
    padding: 10px;
    border-radius: 10px;
    font-size: 0.85rem;
    color: #ffcc00;
    width: 100%;
    
    strong {
      color: #fff;
    }
  }

  .payment-section {
    padding: 10px 0;
    
    button {
      background: #ffcc00;
      color: #000;
      border: none;
      padding: 15px 30px;
      border-radius: 50px;
      cursor: pointer;
      font-size: 1.1rem;
      font-weight: 700;
      width: 100%;
      transition: all 0.3s ease;
      box-shadow: 0 5px 15px rgba(255, 204, 0, 0.3);

      &:hover {
        background: #fff;
        transform: scale(1.05);
        box-shadow: 0 8px 20px rgba(255, 204, 0, 0.5);
      }
      
      &:active {
        transform: scale(0.98);
      }
    }
  }
`;

const DetailedSections = styled.div`
  margin-top: 100px;
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 80px;

  .detail-row {
    display: flex;
    align-items: center;
    gap: 60px;
    background: rgba(255, 255, 255, 0.03);
    padding: 40px;
    border-radius: 30px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    transition: all 0.3s ease;

    &:nth-child(even) {
      flex-direction: row-reverse;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 204, 0, 0.2);
    }
  }

  .detail-image {
    flex: 1;
    position: relative;
    height: 400px;
    border-radius: 20px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }

  .detail-text {
    flex: 1.2;
    text-align: left;

    .detail-tag {
      font-weight: 800;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 2px;
      margin-bottom: 10px;
      display: block;
    }

    h3 {
      font-size: 2.5rem;
      font-weight: 900;
      margin-bottom: 20px;
      color: #fff;
    }

    .description {
      font-size: 1.1rem;
      color: #ccc;
      line-height: 1.8;
      margin-bottom: 30px;
    }

    .highlight-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 40px;

      h5 {
        color: #ffcc00;
        font-weight: 700;
        margin-bottom: 10px;
      }

      p {
        color: #aaa;
        font-size: 0.95rem;
      }
    }

    .cta-btn {
      background: transparent;
      border: 2px solid #ffcc00;
      color: #ffcc00;
      padding: 12px 30px;
      border-radius: 50px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #ffcc00;
        color: #000;
      }
    }
  }

  @media (max-width: 992px) {
    .detail-row {
      flex-direction: column !important;
      padding: 20px;
    }
    
    .detail-image {
      width: 100%;
      height: 300px;
    }
  }
`;

const ComparisonSection = styled.div`
  margin-top: 100px;
  width: 100%;
  max-width: 1000px;
  text-align: center;

  h3 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    font-weight: 800;
  }
`;

const TableWrapper = styled.div`
  background: rgba(26, 26, 26, 0.8);
  padding: 30px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    color: #eee;

    th, td {
      padding: 20px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      text-align: left;
    }

    th {
      font-size: 1.2rem;
      color: #ffcc00;
      text-transform: uppercase;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background: rgba(255, 204, 0, 0.05);
    }
  }
`;

const FaqSection = styled.div`
  margin-top: 100px;
  width: 100%;
  max-width: 1000px;
  text-align: center;
  padding-bottom: 50px;

  h3 {
    font-size: 2.5rem;
    margin-bottom: 40px;
    font-weight: 800;
  }
`;

const FaqGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
  text-align: left;

  .faq-item {
    background: rgba(255, 255, 255, 0.05);
    padding: 25px;
    border-radius: 15px;
    border-left: 4px solid #ffcc00;

    h4 {
      color: #ffcc00;
      margin-bottom: 10px;
      font-size: 1.1rem;
    }

    p {
      color: #ccc;
      line-height: 1.6;
    }
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CustomSection = styled.div`
  margin-top: 80px;
  width: 100%;
  max-width: 1000px;
  padding-bottom: 100px;

  .custom-box {
    background: linear-gradient(135deg, rgba(255, 204, 0, 0.1) 0%, rgba(255, 204, 0, 0.05) 100%);
    border: 1px solid rgba(255, 204, 0, 0.3);
    padding: 60px;
    border-radius: 30px;
    text-align: center;
    backdrop-filter: blur(10px);

    h3 {
      font-size: 2.2rem;
      margin-bottom: 20px;
      color: #ffcc00;
      font-weight: 800;
    }

    p {
      font-size: 1.1rem;
      color: #ccc;
      max-width: 700px;
      margin: 0 auto 30px;
      line-height: 1.6;
    }

    button {
      background: transparent;
      color: #ffcc00;
      border: 2px solid #ffcc00;
      padding: 15px 40px;
      border-radius: 50px;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: #ffcc00;
        color: #000;
        box-shadow: 0 0 30px rgba(255, 204, 0, 0.3);
      }
    }
  }
`;

export default Subscription;
