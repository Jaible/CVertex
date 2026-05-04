import React from "react";
import { cn } from "~/lib/utils";

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    const isStrong = score > 70;
    const isGood = score > 49;

    const badgeText = isStrong
        ? "Strong"
        : isGood
            ? "Good Start"
            : "Needs Work";

    const badgeColor = isStrong
        ? "bg-emerald-500/15 border-emerald-500/20 text-emerald-300"
        : isGood
            ? "bg-yellow-500/15 border-yellow-500/20 text-yellow-300"
            : "bg-red-500/15 border-red-500/20 text-red-300";

    return (
        <div
            className={cn(
                "px-3 py-1 rounded-full border backdrop-blur-md",
                badgeColor
            )}
        >
            <p className="text-sm font-semibold tracking-wide">
                {badgeText}
            </p>
        </div>
    );
};

export default ScoreBadge;