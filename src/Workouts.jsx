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
    description: "Strengthens legs and improves balance.",
    image: "https://d2v5dzhdg4zhx3.cloudfront.net/web-assets/images/storypages/short/aimuscularavatargenerator/aimuscularavatargenerator/aimuscularavatargenerator/wepb/003.webp"
  },
  {
    name: "Weight Loss",
    description: "Strengthens legs and improves balance.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDwsWvdS9F-TkDgcXWjlui5PweA9IpL68ing&s"
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
              <p className="text-title">{workout.name}</p>
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
    background: #f0f0f0;
    gap: 20px;
    justify-content: center;
    padding: 20px;
    margin-top: 00px; 
}

  .card {
    width: 250px; /* Increased size for better spacing */
    min-height: 350px; /* Allows dynamic height */
    border-radius: 15px;
    background: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    padding: 15px;
    position: relative;
    border: 2px solid #c3c6ce;
    transition: 0.5s ease-out;
    overflow: hidden;
    text-align: center;
     margin-top: 20px;

  }

  .card-image {
    width: 100%;
    height: 190px;
    object-fit: cover;
    border-radius: 10px;
  }

  .card-details {
    color: black;
    margin-top: 10px;
  }

  .card-button {
    width: 80%;
    border-radius: 10px;
    border: none;
    background-color: #008bf8;
    color: #fff;
    font-size: 1rem;
    padding: 8px;
    position: absolute;
    left: 50%;
    bottom: 15px;
    transform: translateX(-50%);
    opacity: 0;
    transition: 0.3s ease-out;
  }

  .text-body {
    color: rgb(134, 134, 134);
    font-size: 0.9rem;
  }

  .text-title {
    font-size: 1.3em;
    font-weight: bold;
  }

  .card:hover {
    border-color: #008bf8;
    box-shadow: 0 4px 18px rgba(0, 0, 0, 0.25);
  }

  .card:hover .card-button {
    opacity: 1;
  }
`;

export default Workouts;
