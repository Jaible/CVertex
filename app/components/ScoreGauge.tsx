import React, { useId } from "react";

interface ScoreGaugeProps {
    score?: number;
}

const PATH_LENGTH = 126;

const ScoreGauge: React.FC<ScoreGaugeProps> = ({ score = 75 }) => {
    const gradientId = useId();

    const normalizedScore = Math.min(Math.max(score, 0), 100);
    const percentage = normalizedScore / 100;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#8B5CF6" />
                            <stop offset="50%" stopColor="#EC4899" />
                            <stop offset="100%" stopColor="#3B82F6" />
                        </linearGradient>
                    </defs>

                    {/* Background */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#27272A"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    {/* Progress */}
                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={PATH_LENGTH}
                        strokeDashoffset={PATH_LENGTH * (1 - percentage)}
                        className="transition-all duration-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.45)]"
                    />
                </svg>

                <div className="absolute inset-0 flex items-center justify-center pt-6">
                    <p className="text-xl font-semibold text-zinc-100">
                        {normalizedScore}/100
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;