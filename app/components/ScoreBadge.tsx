import React from "react";

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    let badgeColor = '';
    let badgeText = '';

    if (score > 70) {
        badgeColor =
            "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300";
        badgeText = "Strong";
    } else if (score > 49) {
        badgeColor =
            "bg-yellow-500/15 border border-yellow-500/20 text-yellow-300";
        badgeText = "Good Start";
    } else {
        badgeColor =
            "bg-red-500/15 border border-red-500/20 text-red-300";
        badgeText = "Needs Work";
    }

    return (
        <div
            className={`px-3 py-1 rounded-full backdrop-blur-md ${badgeColor}`}
        >
            <p className="text-sm font-semibold tracking-wide">
                {badgeText}
            </p>
        </div>
    )
}