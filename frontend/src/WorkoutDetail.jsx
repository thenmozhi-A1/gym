import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Timer, Target, Dumbbell, Zap, Activity, Info, CheckCircle2, Play } from "lucide-react";

const workoutData = {
  "bench-press": {
    name: "Barbell Bench Press",
    target: "Pectorals, Deltoids, Triceps",
    difficulty: "Advanced",
    time: "45-60 mins",
    modelUrl: "https://sketchfab.com/models/fef75a019e7948e5ac8de6faf534890b/embed?autostart=1&preload=1&transparent=1&ui_infos=0&ui_watermark=0&ui_controls=1&ui_theme=dark",
    description: "The ultimate upper body compound movement. Build massive pressing power, thick dense chest muscles, and bulletproof shoulders with proper form and progressive overload.",
    instructions: [
      "Set your foundation: Lie back, plant feet firmly, and retract shoulder blades.",
      "Grip the barbell slightly wider than shoulder-width.",
      "Unrack and stabilize the weight directly over your shoulders.",
      "Lower the bar with control to your mid-chest (sternum).",
      "Explode upwards, driving your back into the bench and feet into the floor."
    ],
    proTips: "Create full-body tension. Squeeze the bar as hard as possible and imagine trying to bend it in half to engage your lats.",
    benefits: ["Hypertrophy Catalyst", "Core Stabilization", "Hormonal Response"]
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [type]);

  return (
    <PageContainer>
      <BackgroundGlow />
      <ContentWrapper>
        <TopNav>
          <BackButton onClick={() => navigate("/workouts")}>
            <ArrowLeft size={20} />
            <span>Back to Workouts</span>
          </BackButton>
        </TopNav>

        <HeroSection>
          <div className="hero-grid">
            <ModelContainer>
              {workout.modelUrl ? (
                <div className="iframe-wrapper">
                  <iframe 
                    title={workout.name} 
                    src={workout.modelUrl} 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; xr-spatial-tracking" 
                    xr-spatial-tracking="true" 
                    allowFullScreen>
                  </iframe>
                  <div className="model-overlay-hint">
                    <Play size={14} className="play-icon" /> <span>Interactive 3D Model - Drag to Rotate</span>
                  </div>
                </div>
              ) : (
                <div className="image-wrapper">
                  <img src={workout.image} alt={workout.name} />
                </div>
              )}
            </ModelContainer>

            <TextContainer>
              <Badge>
                <Zap size={14} /> ELITE TRAINING
              </Badge>
              <Title>{workout.name}</Title>
              <Description>{workout.description}</Description>

              <StatsGrid>
                <StatCard>
                  <div className="icon-wrapper target-icon">
                    <Target size={22} />
                  </div>
                  <div className="stat-info">
                    <small>Target Muscles</small>
                    <p>{workout.target}</p>
                  </div>
                </StatCard>
                <StatCard>
                  <div className="icon-wrapper diff-icon">
                    <Activity size={22} />
                  </div>
                  <div className="stat-info">
                    <small>Difficulty</small>
                    <p>{workout.difficulty}</p>
                  </div>
                </StatCard>
                <StatCard>
                  <div className="icon-wrapper time-icon">
                    <Timer size={22} />
                  </div>
                  <div className="stat-info">
                    <small>Duration</small>
                    <p>{workout.time}</p>
                  </div>
                </StatCard>
              </StatsGrid>
              
              {workout.benefits && (
                <BenefitsList>
                  {workout.benefits.map((benefit, i) => (
                    <BenefitItem key={i}>
                      <CheckCircle2 size={18} className="check-icon" />
                      {benefit}
                    </BenefitItem>
                  ))}
                </BenefitsList>
              )}
            </TextContainer>
          </div>
        </HeroSection>

        <DetailsGrid>
          <MainContent>
            <SectionCard>
              <SectionHeader>
                <div className="header-icon">
                  <Dumbbell size={24} />
                </div>
                <h3>Execution Protocol</h3>
              </SectionHeader>
              <InstructionsList>
                {workout.instructions.map((step, i) => (
                  <InstructionStep key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="step-number">{i + 1}</div>
                    <div className="step-text">{step}</div>
                  </InstructionStep>
                ))}
              </InstructionsList>
            </SectionCard>

            <ProTipCard>
              <div className="tip-header">
                <Info size={24} />
                <h4>Coach's Insight</h4>
              </div>
              <p>{workout.proTips}</p>
              <div className="glow-effect"></div>
            </ProTipCard>
          </MainContent>

          <Sidebar>
            <ActionCard>
              <div className="pulse-ring"></div>
              <h3>Ready to Dominate?</h3>
              <p>Track your sets, reps, and PRs in your personal dashboard.</p>
              <PrimaryButton onClick={() => navigate("/dashboard")}>
                Launch Dashboard
              </PrimaryButton>
              <Divider />
              <Disclaimer>
                ⚠️ Always prioritize form over weight. Consult a trainer if unsure.
              </Disclaimer>
            </ActionCard>
          </Sidebar>
        </DetailsGrid>
      </ContentWrapper>
    </PageContainer>
  );
};

// --- STYLED COMPONENTS --- //

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  background-color: #0f172a;
  min-height: 100vh;
  padding-top: 90px;
  color: #f8fafc;
  position: relative;
  overflow: hidden;
`;

const BackgroundGlow = styled.div`
  position: absolute;
  top: -10%;
  left: -10%;
  width: 50vw;
  height: 50vw;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(15, 23, 42, 0) 70%);
  border-radius: 50%;
  z-index: 0;
  pointer-events: none;

  &::after {
    content: '';
    position: absolute;
    bottom: -50%;
    right: -50%;
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(15, 23, 42, 0) 70%);
    border-radius: 50%;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 24px;
  position: relative;
  z-index: 1;
`;

const TopNav = styled.div`
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 10px 20px;
  border-radius: 30px;
  backdrop-filter: blur(10px);

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(-5px);
    border-color: rgba(56, 189, 248, 0.5);
    color: #38bdf8;
  }
`;

const HeroSection = styled.div`
  margin-bottom: 50px;
  animation: ${fadeIn} 0.6s ease-out forwards;

  .hero-grid {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    gap: 40px;
    background: rgba(30, 41, 59, 0.4);
    backdrop-filter: blur(20px);
    border-radius: 32px;
    border: 1px solid rgba(255, 255, 255, 0.08);
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    
    @media (max-width: 1024px) {
      grid-template-columns: 1fr;
    }
  }
`;

const ModelContainer = styled.div`
  position: relative;
  width: 100%;
  min-height: 450px;
  background: radial-gradient(circle at center, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 1) 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .iframe-wrapper {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;

    iframe {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .model-overlay-hint {
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(8px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 16px;
      border-radius: 20px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      color: #94a3b8;
      pointer-events: none;
      
      .play-icon {
        color: #38bdf8;
      }
    }
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
`;

const TextContainer = styled.div`
  padding: 50px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 30px 20px;
  }
`;

const Badge = styled.span`
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.2), rgba(139, 92, 246, 0.2));
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 1.5px;
  margin-bottom: 20px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: max-content;
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.1);
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 15px;
  background: linear-gradient(to right, #fff, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 1.1;
  letter-spacing: -1px;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Description = styled.p`
  font-size: 1.15rem;
  color: #cbd5e1;
  line-height: 1.7;
  margin-bottom: 35px;
  font-weight: 400;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  background: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 16px;
  transition: transform 0.3s ease, background 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: rgba(30, 41, 59, 0.8);
  }
  
  .icon-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 12px;
    
    &.target-icon { background: rgba(239, 68, 68, 0.1); color: #ef4444; }
    &.diff-icon { background: rgba(245, 158, 11, 0.1); color: #f59e0b; }
    &.time-icon { background: rgba(16, 185, 129, 0.1); color: #10b981; }
  }
  
  .stat-info {
    small {
      color: #94a3b8;
      display: block;
      text-transform: uppercase;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    
    p {
      margin: 0;
      font-weight: 600;
      font-size: 1rem;
      color: #f8fafc;
    }
  }
`;

const BenefitsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 10px;
  padding-top: 25px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const BenefitItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 8px 16px;
  border-radius: 30px;
  font-size: 0.9rem;
  color: #e2e8f0;

  .check-icon {
    color: #38bdf8;
  }
`;

const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 40px;
  padding-bottom: 100px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;

const SectionCard = styled.div`
  background: rgba(30, 41, 59, 0.4);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.3);
  animation: ${fadeIn} 0.8s ease-out forwards;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;

  .header-icon {
    background: linear-gradient(135deg, #38bdf8, #2563eb);
    padding: 12px;
    border-radius: 14px;
    color: white;
    box-shadow: 0 10px 20px -5px rgba(56, 189, 248, 0.4);
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    color: #fff;
    margin: 0;
  }
`;

const InstructionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const InstructionStep = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 20px;
  background: rgba(15, 23, 42, 0.4);
  padding: 20px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.03);
  transition: transform 0.2s, background 0.2s;

  &:hover {
    transform: translateX(10px);
    background: rgba(30, 41, 59, 0.6);
    border-color: rgba(56, 189, 248, 0.2);
  }

  .step-number {
    flex-shrink: 0;
    width: 36px;
    height: 36px;
    background: rgba(56, 189, 248, 0.15);
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.3);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 800;
    font-size: 1.1rem;
  }

  .step-text {
    font-size: 1.1rem;
    color: #cbd5e1;
    line-height: 1.6;
    padding-top: 4px;
  }
`;

const ProTipCard = styled.div`
  background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%);
  padding: 35px;
  border-radius: 24px;
  border: 1px solid rgba(56, 189, 248, 0.2);
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px -10px rgba(30, 58, 138, 0.4);
  animation: ${fadeIn} 1s ease-out forwards;

  .glow-effect {
    position: absolute;
    top: -50%;
    right: -20%;
    width: 300px;
    height: 300px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(255, 255, 255, 0) 70%);
    pointer-events: none;
  }

  .tip-header {
    display: flex;
    align-items: center;
    gap: 12px;
    color: #38bdf8;
    margin-bottom: 15px;
    
    h4 {
      margin: 0;
      font-size: 1.3rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  p {
    margin: 0;
    font-size: 1.15rem;
    line-height: 1.7;
    color: #e2e8f0;
    position: relative;
    z-index: 1;
  }
`;

const Sidebar = styled.div`
  animation: ${fadeIn} 1.2s ease-out forwards;
`;

const ActionCard = styled.div`
  position: sticky;
  top: 120px;
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(20px);
  padding: 40px;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 20px 50px -10px rgba(0, 0, 0, 0.4);
  text-align: center;
  position: relative;
  overflow: hidden;

  .pulse-ring {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #38bdf8, #8b5cf6);
  }

  h3 {
    font-size: 1.8rem;
    font-weight: 800;
    margin-bottom: 15px;
    color: #fff;
  }

  p {
    color: #94a3b8;
    margin-bottom: 30px;
    line-height: 1.6;
    font-size: 1.05rem;
  }
`;

const PrimaryButton = styled.button`
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #38bdf8 0%, #2563eb 100%);
  color: #fff;
  font-weight: 800;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px -5px rgba(56, 189, 248, 0.4);

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 25px -5px rgba(56, 189, 248, 0.5);
    filter: brightness(1.1);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const Divider = styled.div`
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 30px 0;
`;

const Disclaimer = styled.div`
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
`;

export default WorkoutDetail;
