import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const workouts = [
  {
    name: "Bench Press",
    description: "Great for chest strength and muscle growth.",
    image: "https://img.freepik.com/premium-photo/muscles-metal-bodybuilder-pushing-his-limits-with-powerful-bench-press_908344-51738.jpg"
  },
  {
    name: "Squats",
    description: "Builds lower body strength and core stability.",
    image: "https://www.shutterstock.com/image-vector/woman-doing-mini-band-air-600nw-2170517693.jpg"
  },
  {
    name: "Deadlifts",
    description: "Full-body workout improving strength and posture.",
    image: "https://s.yimg.com/ny/api/res/1.2/gLgP5YBOcp2IyCJN6eQYMA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTYxMA--/https://media.zenfs.com/en-US/homerun/inverse_media_399/7cfd34efdce69b5fd75823d5be20dd50"
  },
  {
    name: "Pull-Ups",
    description: "Excellent for upper body and grip strength.",
    image: "https://cdn.dribbble.com/userupload/22579491/file/original-a018dd428f28ba3e8db77c0c9f40b40a.gif"
  },
  {
    name: "Dumbbell Rows",
    description: "Works back muscles and improves posture.",
    image: "https://www.oldschoollabs.com/wp-content/uploads/2020/12/02921301-Dumbbell-Bent-over-Row_back_Back_720.gif"
  },
  {
    name: "Lunges",
    description: "Strengthens legs and improves balance.",
    image: "https://media.tenor.com/PF7Q7Qu1wJEAAAAM/lunges.gif"
  },
  {
    name: "Cardio",
    description: "Strengthens legs and improves balance.",
    image: "https://shop.bodybuilding.com/cdn/shop/articles/10-best-and-worst-exercise-machines-for-cardio-852555.jpg?v=1731882803"
  },
  {
    name: "Bulking",
    description: "Focus on muscle growth and high-calorie intake.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop"
  },
  {
    name: "Weight Loss",
    description: "High-intensity training to burn calories effectively.",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=2069&auto=format&fit=crop"
  },
  {
    name: "Yoga",
    description: "Strengthens legs and improves balance.",
    image: "https://img.freepik.com/premium-vector/international-yoga-day-vector-illustration_723055-1281.jpg"
  }
];

const Workouts = () => {
  const navigate = useNavigate();

  return (
    <StyledWrapper>
      <div className="workout-container ">
        {workouts.map((workout, index) => (
          <div key={index} className="card mb-4">
            <img src={workout.image} alt={workout.name} className="card-image" />
            <div className="card-details">
              <p className="text-title text-warning">{workout.name}</p>
              <p className="text-body">{workout.description}</p>
            </div>
            <button
              className="card-button"
              onClick={() => navigate(`/workout/${workout.name.toLowerCase().replace(/ /g, "-")}`)}
            >
              More Info
            </button>
          </div>
        ))}
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .workout-container {
    display: flex;
    flex-wrap: wrap;
    background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), 
                url("https://images.unsplash.com/photo-1571902943202-507ec2618e8f?q=80&w=2075&auto=format&fit=crop");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    gap: 20px;
    justify-content: center;
    padding: 60px 20px;
    margin-top: 56px; 
    min-height: 100vh;
}

  .card {
    width: 280px;
    min-height: 380px;
    border-radius: 24px;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(12px) saturate(180%);
    -webkit-backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid rgba(255, 255, 255, 0.4);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    padding: 20px;
    position: relative;
    transition: all 0.4s ease;
    overflow: hidden;
    text-align: center;
    margin-top: 20px;
  }

  .card-image {
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-radius: 10px;
    transition: transform 0.5s ease;
  }

  .card:hover .card-image {
    transform: scale(1.1);
  }

  .card-details {
    color: black;
    margin-top: 10px;
  }

  .card-button {
    width: 80%;
    border-radius: 50px;
    border: none;
    background-color: #ffc107;
    color: #000;
    font-weight: 800;
    font-size: 0.9rem;
    padding: 10px;
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%) translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
  }

  .card:hover .card-button {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  .text-body {
    color: #444 !important;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 20px;
    padding: 0 10px;
  }

  .text-title {
    font-size: 1.3em;
    font-weight: bold;
    color: #1a1a1a;
    margin-bottom: 10px;
  }

  .card:hover {
    transform: translateY(-10px);
    border-color: #ffc107;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
  }

  .card:hover .card-button {
    opacity: 1;
  }
`;

export default Workouts;
