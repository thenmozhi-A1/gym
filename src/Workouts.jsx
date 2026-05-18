import React from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Flame, Target, Zap } from "lucide-react";

const workouts = [
  {
    name: "Bench Press",
    description: "Great for chest strength and muscle growth.",
    image: "https://img.freepik.com/premium-photo/muscles-metal-bodybuilder-pushing-his-limits-with-powerful-bench-press_908344-51738.jpg",
    difficulty: "Advanced",
    muscles: "Chest · Triceps · Shoulders",
    calories: "320 kcal/hr",
    tag: "STRENGTH"
  },
  {
    name: "Squats",
    description: "Builds lower body strength and core stability.",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Beginner",
    muscles: "Quads · Glutes · Core",
    calories: "280 kcal/hr",
    tag: "POWER"
  },
  {
    name: "Deadlifts",
    description: "Full-body workout improving strength and posture.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Advanced",
    muscles: "Back · Glutes · Hamstrings",
    calories: "400 kcal/hr",
    tag: "STRENGTH"
  },
  {
    name: "Pull-Ups",
    description: "Excellent for upper body and grip strength.",
    image: "https://images.unsplash.com/photo-1598971639058-fab3c3109a00?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Intermediate",
    muscles: "Back · Biceps · Core",
    calories: "250 kcal/hr",
    tag: "ENDURANCE"
  },
  {
    name: "Dumbbell Rows",
    description: "Works back muscles and improves posture.",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Beginner",
    muscles: "Lats · Rhomboids · Biceps",
    calories: "220 kcal/hr",
    tag: "STRENGTH"
  },
  {
    name: "Lunges",
    description: "Strengthens legs and improves balance.",
    image: "https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Beginner",
    muscles: "Quads · Glutes · Calves",
    calories: "200 kcal/hr",
    tag: "POWER"
  },
  {
    name: "Cardio",
    description: "Burn fat and boost cardiovascular endurance.",
    image: "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=1000&auto=format&fit=crop",
    difficulty: "All Levels",
    muscles: "Full Body · Heart · Lungs",
    calories: "500 kcal/hr",
    tag: "ENDURANCE"
  },
  {
    name: "Bulking",
    description: "Focus on muscle growth and high-calorie intake.",
    image: "https://images.unsplash.com/photo-1533681904393-9ab6eee7e408?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Intermediate",
    muscles: "Full Body · Compound",
    calories: "450 kcal/hr",
    tag: "MASS"
  },
  {
    name: "Weight Loss",
    description: "High-intensity training to burn calories effectively.",
    image: "https://images.unsplash.com/photo-1593079831268-3381b0db4a77?q=80&w=1000&auto=format&fit=crop",
    difficulty: "Intermediate",
    muscles: "Full Body · Core · Cardio",
    calories: "600 kcal/hr",
    tag: "FAT BURN"
  },
  {
    name: "Yoga",
    description: "Improves flexibility, focus, and inner strength.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=1000&auto=format&fit=crop",
    difficulty: "All Levels",
    muscles: "Flexibility · Balance · Mind",
    calories: "160 kcal/hr",
    tag: "RECOVERY"
  }
];

const getDifficultyColor = (d) => {
  if (d === "Beginner") return "#4ade80";
  if (d === "Intermediate") return "#ffc107";
  if (d === "Advanced") return "#f87171";
  return "#a78bfa";
};

const Workouts = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <PageHeader>
        <span className="sub">B&Y FITNESS TRAINING PROGRAMS</span>
        <h1>CHOOSE YOUR <span>WEAPON</span></h1>
        <p>Every exercise, engineered for results.</p>
      </PageHeader>
      <CardGrid>
        {workouts.map((workout, index) => (
          <WorkoutCard key={index} onClick={() => navigate(`/workout/${workout.name.toLowerCase().replace(/ /g, "-")}`)}>
            <div className="card-img" style={{ backgroundImage: `url(${workout.image})` }} />
            <div className="card-overlay" />

            <div className="top-row">
              <span className="tag-badge">{workout.tag}</span>
              <span className="calorie-badge">
                <Flame size={12} /> {workout.calories}
              </span>
            </div>

            <div className="card-body">
              <div className="difficulty-row">
                <span className="difficulty-dot" style={{ background: getDifficultyColor(workout.difficulty) }} />
                <span className="difficulty-text" style={{ color: getDifficultyColor(workout.difficulty) }}>
                  {workout.difficulty}
                </span>
              </div>
              <h2 className="card-title">{workout.name}</h2>
              <p className="card-desc">{workout.description}</p>

              <div className="muscles-row">
                <Target size={12} />
                <span>{workout.muscles}</span>
              </div>

              <button className="cta-btn">
                Start Training <ArrowRight size={16} />
              </button>
            </div>
          </WorkoutCard>
        ))}
      </CardGrid>
    </PageWrapper>
  );
};

// ── STYLED COMPONENTS ──

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageWrapper = styled.div`
  background: #050505;
  min-height: 100vh;
  padding-bottom: 80px;
  font-family: 'Inter', sans-serif;
`;

const PageHeader = styled.div`
  text-align: center;
  padding: 120px 20px 60px;
  background: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.8)),
              url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  color: #fff;

  .sub {
    display: inline-block;
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 4px;
    color: #ffc107;
    margin-bottom: 20px;
  }

  h1 {
    font-size: 5rem;
    font-weight: 950;
    letter-spacing: -3px;
    line-height: 1;
    margin-bottom: 20px;
    span { color: #ffc107; font-style: italic; }
  }

  p {
    font-size: 1.2rem;
    color: rgba(255,255,255,0.5);
    font-weight: 600;
  }

  @media (max-width: 768px) {
    padding: 100px 20px 50px;
    h1 { font-size: 3rem; letter-spacing: -1px; }
    .sub { font-size: 0.65rem; }
    p { font-size: 1rem; }
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
  padding: 60px 40px;
  max-width: 1400px;
  margin: 0 auto;

  @media (max-width: 768px) { padding: 30px 15px; gap: 20px; }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const WorkoutCard = styled.div`
  position: relative;
  height: 480px;
  border-radius: 28px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid rgba(255, 193, 7, 0.2);
  transition: transform 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;

  &:hover {
    transform: translateY(-12px) scale(1.01);
    box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255, 193, 7, 0.6);
    border-color: #ffc107;

    .card-img { transform: scale(1.08); }
    .card-overlay { background: linear-gradient(to top, rgba(0,0,0,0.97) 40%, rgba(0,0,0,0.3) 100%); }
    .card-desc { opacity: 1; max-height: 60px; }
    .muscles-row { opacity: 1; transform: translateY(0); }
    .cta-btn { opacity: 1; transform: translateY(0); }
  }

  .card-img {
    position: absolute;
    inset: 0;
    background-size: cover;
    background-position: center;
    transition: transform 0.7s ease;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.88) 30%, rgba(0,0,0,0.1) 100%);
    transition: background 0.4s ease;
  }

  /* ── TOP ROW BADGES ── */
  .top-row {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
  }

  .tag-badge {
    background: #ffc107;
    color: #000;
    font-size: 0.65rem;
    font-weight: 900;
    padding: 5px 14px;
    border-radius: 50px;
    letter-spacing: 1.5px;
  }

  .calorie-badge {
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(8px);
    color: #fff;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 5px 12px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    gap: 5px;
    svg { color: #ffc107; }
  }

  /* ── BOTTOM CONTENT ── */
  .card-body {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30px 28px;
    z-index: 10;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .difficulty-row {
    display: flex;
    align-items: center;
    gap: 8px;
    .difficulty-dot { width: 8px; height: 8px; border-radius: 50%; }
    .difficulty-text { font-size: 0.7rem; font-weight: 900; letter-spacing: 1px; }
  }

  .card-title {
    font-size: 2rem;
    font-weight: 950;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
    margin: 0;
  }

  .card-desc {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.7);
    font-weight: 500;
    line-height: 1.5;
    margin: 0;
    opacity: 0;
    max-height: 0;
    overflow: hidden;
    transition: all 0.4s ease;
  }

  .muscles-row {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.72rem;
    color: rgba(255,255,255,0.5);
    font-weight: 700;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s ease 0.05s;
    svg { color: #ffc107; flex-shrink: 0; }
  }

  .cta-btn {
    display: flex;
    align-items: center;
    gap: 10px;
    width: fit-content;
    background: #ffc107;
    color: #000;
    border: none;
    padding: 12px 22px;
    border-radius: 50px;
    font-weight: 900;
    font-size: 0.85rem;
    cursor: pointer;
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.4s ease 0.1s;
    margin-top: 5px;

    &:hover { background: #fff; }
  }

  @media (max-width: 768px) {
    height: 400px;
    .card-desc { opacity: 1; max-height: 60px; }
    .muscles-row { opacity: 1; transform: translateY(0); }
    .cta-btn { opacity: 1; transform: translateY(0); }
  }
`;

export default Workouts;
