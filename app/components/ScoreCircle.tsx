import React, { useId, useMemo } from "react";

interface ScoreCircleProps {
    score?: number;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ score = 75 }) => {
    const gradientId = useId();

    const { normalizedRadius, circumference, strokeDashoffset } = useMemo(() => {
        const radius = 40;
        const stroke = 8;

        const normalizedRadius = radius - stroke / 2;
        const circumference = 2 * Math.PI * normalizedRadius;
        const progress = Math.min(Math.max(score, 0), 100) / 100;

        return {
            normalizedRadius,
            circumference,
            strokeDashoffset: circumference * (1 - progress),
        };
    }, [score]);

    return (
        <div className="relative size-[100px]">
            <svg
                viewBox="0 0 100 100"
                className="-rotate-90 w-full h-full"
            >
                <defs>
                    <linearGradient
                        id={gradientId}
                        x1="1"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop offset="0%" stopColor="#FF7AA2" />
                        <stop offset="50%" stopColor="#C084FC" />
                        <stop offset="100%" stopColor="#8FB8FF" />
                    </linearGradient>
                </defs>

                {/* Background */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke="rgb(39 39 42)"
                    strokeWidth="8"
                    fill="transparent"
                />

                {/* Progress */}
                <circle
                    cx="50"
                    cy="50"
                    r={normalizedRadius}
                    stroke={`url(#${gradientId})`}
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 drop-shadow-[0_0_8px_rgba(192,132,252,0.35)]"
                />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                    {score}/100
                </span>
            </div>
        </div>
    );
};

export default ScoreCircle;