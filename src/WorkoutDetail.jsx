import React, { useEffect } from "react";
import styled from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Timer, Target, Dumbbell, Zap } from "lucide-react";

const workoutData = {
  "bench-press": {
    name: "Bench Press",
    target: "Chest, Shoulders, Triceps",
    difficulty: "Intermediate",
    time: "45-60 mins",
    image: "https://img.freepik.com/premium-photo/muscles-metal-bodybuilder-pushing-his-limits-with-powerful-bench-press_908344-51738.jpg",
    description: "The bench press is a classic compound exercise that targets the pectoral muscles, anterior deltoids, and triceps. It is the gold standard for building upper body pushing strength.",
    instructions: [
      "Lie flat on your back on a bench.",
      "Grip the bar with hands slightly wider than shoulder-width apart.",
      "Lower the bar slowly to your mid-chest.",
      "Push the bar back up until your arms are fully extended.",
      "Keep your feet flat on the floor for stability."
    ],
    proTips: "Maintain a slight arch in your lower back and keep your shoulder blades retracted for maximum stability and power."
  },
  "squats": {
    name: "Barbell Squats",
    target: "Quads, Glutes, Hamstrings, Core",
    difficulty: "All Levels",
    time: "30-45 mins",
    image: "https://www.shutterstock.com/image-vector/woman-doing-mini-band-air-600nw-2170517693.jpg",
    description: "Squats are often called the king of all exercises. They build massive lower body strength, improve mobility, and boost overall athletic performance.",
    instructions: [
      "Stand with feet shoulder-width apart.",
      "Rest the barbell on your upper traps.",
      "Lower your hips back and down as if sitting in a chair.",
      "Keep your chest up and core tight.",
      "Drive through your heels to return to the starting position."
    ],
    proTips: "Ensure your knees don't cave inward and keep your weight distributed evenly across your feet."
  },
  "deadlifts": {
    name: "Deadlifts",
    target: "Posterior Chain, Back, Legs, Grip",
    difficulty: "Advanced",
    time: "45-60 mins",
    image: "https://s.yimg.com/ny/api/res/1.2/gLgP5YBOcp2IyCJN6eQYMA--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTYxMA--/https://media.zenfs.com/en-US/homerun/inverse_media_399/7cfd34efdce69b5fd75823d5be20dd50",
    description: "Deadlifts are a fundamental movement for building raw strength and a powerful posterior chain. It works almost every muscle in the body from the floor up.",
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot.",
      "Grip the bar just outside your legs.",
      "Hinge at the hips and keep your back flat.",
      "Drive through your legs to pull the bar up.",
      "Lock out at the top and lower with control."
    ],
    proTips: "Keep the bar as close to your shins as possible throughout the movement to maintain a safe and efficient bar path."
  },
  "cardio": {
    name: "HIIT Cardio",
    target: "Heart Health, Fat Burning, Endurance",
    difficulty: "All Levels",
    time: "20-30 mins",
    image: "https://shop.bodybuilding.com/cdn/shop/articles/10-best-and-worst-exercise-machines-for-cardio-852555.jpg?v=1731882803",
    description: "High-Intensity Interval Training (HIIT) is the most efficient way to burn calories and improve cardiovascular fitness in a short amount of time.",
    instructions: [
      "Warm up for 5 minutes at a moderate pace.",
      "Perform 30 seconds of maximum effort (sprint, jump ropes, etc.).",
      "Follow with 30-60 seconds of active recovery (slow walk).",
      "Repeat the cycle 10-15 times.",
      "Cool down for 5 minutes."
    ],
    proTips: "Focus on intensity during the work intervals; you should be breathing heavily and unable to hold a conversation."
  },
  "pull-ups": {
    name: "Pull-Ups",
    target: "Lats, Biceps, Upper Back",
    difficulty: "Intermediate",
    time: "20-30 mins",
    image: "https://cdn.dribbble.com/userupload/22579491/file/original-a018dd428f28ba3e8db77c0c9f40b40a.gif",
    description: "Pull-ups are the ultimate test of upper body strength. They develop a wide, V-tapered back and significant pulling power.",
    instructions: [
      "Grip the overhead bar with hands slightly wider than shoulders.",
      "Hang with arms fully extended (dead hang).",
      "Pull yourself up until your chin is over the bar.",
      "Lower yourself back down with control.",
      "Avoid using momentum or swinging your legs."
    ],
    proTips: "Focus on pulling your elbows down to your ribs rather than just pulling your chin up to the bar."
  },
  "dumbbell-rows": {
    name: "Dumbbell Rows",
    target: "Middle Back, Rhomboids, Lats",
    difficulty: "Beginner",
    time: "30-45 mins",
    image: "https://www.oldschoollabs.com/wp-content/uploads/2020/12/02921301-Dumbbell-Bent-over-Row_back_Back_720.gif",
    description: "Single-arm dumbbell rows allow for a deep stretch and a peak contraction of the back muscles, helping to fix muscle imbalances.",
    instructions: [
      "Place one knee and hand on a bench for support.",
      "Hold a dumbbell in the opposite hand with arm extended.",
      "Pull the weight up towards your hip.",
      "Squeeze your shoulder blade at the top.",
      "Lower the weight back down slowly."
    ],
    proTips: "Keep your torso parallel to the floor and avoid twisting your body as you pull the weight."
  },
  "lunges": {
    name: "Walking Lunges",
    target: "Quads, Glutes, Hamstrings",
    difficulty: "Beginner",
    time: "20-30 mins",
    image: "https://media.tenor.com/PF7Q7Qu1wJEAAAAM/lunges.gif",
    description: "Lunges are a dynamic movement that improves unilateral leg strength and balance. They are excellent for sculpting the glutes and thighs.",
    instructions: [
      "Stand tall with feet hip-width apart.",
      "Step forward with one leg and lower your hips.",
      "Both knees should bend at approximately 90 degrees.",
      "Keep your front knee aligned with your ankle.",
      "Push off the back foot to step forward into the next lunge."
    ],
    proTips: "Keep your chest upright and core engaged to maintain balance throughout the walking motion."
  },
  "bulking": {
    name: "Hypertrophy Program",
    target: "Whole Body Mass Gain",
    difficulty: "Intermediate",
    time: "60-90 mins",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop",
    description: "Our Bulking program focuses on heavy compound lifts and high-volume isolation work to maximize muscle fiber recruitment and growth.",
    instructions: [
      "Focus on 8-12 repetitions per set for hypertrophy.",
      "Incorporate progressive overload by increasing weight weekly.",
      "Prioritize compound movements (Squat, Bench, Deadlift).",
      "Ensure a caloric surplus in your nutrition plan.",
      "Allow for 48 hours of recovery between the same muscle groups."
    ],
    proTips: "Consistency is key. Track every lift and ensure you are eating enough protein to support repair and growth."
  },
  "weight-loss": {
    name: "Fat Loss Circuit",
    target: "Full Body, Cardiovascular System",
    difficulty: "All Levels",
    time: "45-60 mins",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop",
    description: "This circuit-based training is designed to keep your heart rate elevated while challenging your muscles, leading to maximum caloric burn.",
    instructions: [
      "Move from one exercise to the next with minimal rest (15-30 sec).",
      "Combine strength movements with short bursts of cardio.",
      "Aim for 15-20 repetitions to keep intensity high.",
      "Complete 3-4 full rounds of the circuit.",
      "Stay hydrated throughout the session."
    ],
    proTips: "The goal is metabolic demand. Keep moving even if you have to lower the weight to finish the set."
  },
  "yoga": {
    name: "Flexibility Yoga",
    target: "Mobility, Balance, Mindset",
    difficulty: "Beginner",
    time: "30-60 mins",
    image: "https://img.freepik.com/premium-vector/international-yoga-day-vector-illustration_723055-1281.jpg",
    description: "Yoga combines physical postures, breathing techniques, and meditation to improve flexibility, reduce stress, and enhance mind-body connection.",
    instructions: [
      "Start with a gentle child's pose to ground yourself.",
      "Move through a series of sun salutations to warm up.",
      "Hold standing poses like Warrior II for 5 breaths.",
      "Focus on deep, rhythmic breathing throughout the practice.",
      "End with Savasana for total relaxation."
    ],
    proTips: "Listen to your body and never force a stretch. Use blocks or straps if needed to maintain proper alignment."
  }
};

const WorkoutDetail = () => {
  const { type } = useParams();
  const navigate = useNavigate();
  const workout = workoutData[type] || workoutData["bench-press"];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  return (
    <PageContainer>
      <BackButton onClick={() => navigate("/workouts")}>
        <ArrowLeft size={20} /> Back to Workouts
      </BackButton>

      <HeroSection>
        <div className="hero-grid">
          <div className="image-wrapper">
            <img src={workout.image} alt={workout.name} />
          </div>
          <div className="text-wrapper">
            <Badge>WORKOUT GUIDE</Badge>
            <h1>{workout.name}</h1>
            <p className="desc">{workout.description}</p>
            
            <div className="stat-grid">
              <div className="stat-item">
                <Target className="icon" size={24} />
                <div>
                  <small>Target Areas</small>
                  <p>{workout.target}</p>
                </div>
              </div>
              <div className="stat-item">
                <Zap className="icon" size={24} />
                <div>
                  <small>Difficulty</small>
                  <p>{workout.difficulty}</p>
                </div>
              </div>
              <div className="stat-item">
                <Timer className="icon" size={24} />
                <div>
                  <small>Duration</small>
                  <p>{workout.time}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </HeroSection>

      <ContentSection>
        <div className="main-content">
          <div className="instruction-card">
            <h3><Dumbbell size={24} style={{ marginRight: '10px' }} /> Proper Technique</h3>
            <ol className="step-list">
              {workout.instructions.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="pro-tip-box">
            <h4>💡 Professional Coaching Tip</h4>
            <p>{workout.proTips}</p>
          </div>
        </div>

        <Sidebar>
          <div className="sticky-box">
            <h3>Start Your Training</h3>
            <p>Ready to master this exercise? Log your progress in the dashboard.</p>
            <button onClick={() => navigate("/dashboard")} className="cta-btn">Open Dashboard</button>
            <div className="divider"></div>
            <p className="small text-muted">Consult with a trainer before attempting heavy weights.</p>
          </div>
        </Sidebar>
      </ContentSection>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  background: linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), 
              url("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop");
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
  padding-top: 100px;
  color: #fff;
`;

const BackButton = styled.button`
  background: transparent;
  border: none;
  color: #fff;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  cursor: pointer;
  transition: color 0.3s;
  padding: 0 20px 20px;

  &:hover {
    color: #008bf8;
  }
`;

const HeroSection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 50px;
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(10px);
    border-radius: 30px;
    overflow: hidden;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
    border: 1px solid rgba(255, 255, 255, 0.1);
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
  }

  .image-wrapper {
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      min-height: 400px;
    }
  }

  .text-wrapper {
    padding: 60px;
    
    h1 {
      font-size: 3rem;
      font-weight: 800;
      margin-bottom: 20px;
      color: #fff;
    }

    .desc {
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.7;
      margin-bottom: 40px;
    }
  }

  .stat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 30px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 15px;
      
      .icon {
        color: #008bf8;
        background: rgba(0, 139, 248, 0.1);
        padding: 10px;
        border-radius: 12px;
        box-sizing: content-box;
      }
      
      small {
        color: rgba(255, 255, 255, 0.5);
        display: block;
        text-transform: uppercase;
        font-weight: 700;
        font-size: 0.7rem;
        letter-spacing: 1px;
      }
      
      p {
        margin: 0;
        font-weight: 700;
        font-size: 0.95rem;
      }
    }
  }
`;

const Badge = styled.span`
  background: #008bf8;
  color: #fff;
  padding: 6px 15px;
  border-radius: 6px;
  font-weight: 800;
  font-size: 0.75rem;
  letter-spacing: 1px;
  margin-bottom: 15px;
  display: inline-block;
`;

const ContentSection = styled.div`
  max-width: 1200px;
  margin: 50px auto;
  padding: 0 20px 100px;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }

  .instruction-card {
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(10px);
    padding: 50px;
    border-radius: 25px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    margin-bottom: 30px;
    border: 1px solid rgba(255, 255, 255, 0.1);

    h3 {
      font-size: 1.8rem;
      font-weight: 800;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
    }
  }

  .step-list {
    list-style: none;
    counter-reset: my-counter;
    padding: 0;
    
    li {
      counter-increment: my-counter;
      position: relative;
      padding-left: 60px;
      margin-bottom: 30px;
      font-size: 1.1rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.6;

      &::before {
        content: counter(my-counter);
        position: absolute;
        left: 0;
        top: -5px;
        width: 40px;
        height: 40px;
        background: #008bf8;
        color: #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
      }
    }
  }

  .pro-tip-box {
    background: #1a1a1a;
    color: #fff;
    padding: 40px;
    border-radius: 25px;
    
    h4 {
      color: #ffcc00;
      margin-bottom: 15px;
    }
    
    p {
      margin: 0;
      font-size: 1.05rem;
      line-height: 1.6;
      opacity: 0.9;
    }
  }
`;

const Sidebar = styled.div`
  .sticky-box {
    position: sticky;
    top: 120px;
    background: rgba(26, 26, 26, 0.85);
    backdrop-filter: blur(10px);
    padding: 40px;
    border-radius: 25px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    border: 1px solid rgba(255, 255, 255, 0.1);
    text-align: center;

    h3 {
      font-size: 1.5rem;
      font-weight: 800;
      margin-bottom: 20px;
    }

    p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 30px;
    }

    .cta-btn {
      width: 100%;
      padding: 15px;
      border: none;
      border-radius: 12px;
      background: #008bf8;
      color: #fff;
      font-weight: 800;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        background: #0076d1;
        transform: translateY(-2px);
      }
    }

    .divider {
      height: 1px;
      background: #eee;
      margin: 30px 0;
    }
  }
`;

export default WorkoutDetail;
