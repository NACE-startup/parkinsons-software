import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getScoreColor } from "@/app/utils/stability-score";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export default function ScoreRing({
  score,
  size = 140,
  strokeWidth = 12,
  showLabel = true,
}: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const scoreColor = getScoreColor(score);

  // Animate score counting up
  useEffect(() => {
    const duration = 800;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(score, Math.round(increment * step));
      setDisplayScore(current);

      if (step >= steps) {
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--surface-2)"
          strokeWidth={strokeWidth}
        />

        {/* Animated progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={scoreColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{
            strokeDashoffset: circumference - (displayScore / 100) * circumference,
          }}
          transition={{
            duration: 0.8,
            ease: [0.32, 0.72, 0, 1],
          }}
        />
      </svg>

      {/* Score value in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-[34px] leading-[40px] font-semibold"
          style={{ color: scoreColor }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {displayScore}
        </motion.span>
        {showLabel && (
          <motion.span
            className="text-[12px] leading-[16px] text-[var(--text-2)] mt-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            of 100
          </motion.span>
        )}
      </div>
    </div>
  );
}
