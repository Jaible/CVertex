import ScoreGauge from "../ScoreGauge";
import { cn } from "~/lib/utils";

const getScoreStyles = (score: number) => {
    if (score > 69) {
        return {
            badge:
                "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300",
            text: "text-emerald-300",
            label: "Strong",
        };
    }

    if (score > 49) {
        return {
            badge:
                "bg-yellow-500/15 border border-yellow-500/20 text-yellow-300",
            text: "text-yellow-300",
            label: "Good Start",
        };
    }

    return {
        badge:
            "bg-red-500/15 border border-red-500/20 text-red-300",
        text: "text-red-300",
        label: "Needs Work",
    };
};

const ScoreBadge = ({ score }: { score: number }) => {
    const styles = getScoreStyles(score);

    return (
        <div
            className={cn(
                "px-3 py-1 rounded-full backdrop-blur-md",
                styles.badge
            )}
        >
            <p className="text-xs font-semibold tracking-wide">
                {styles.label}
            </p>
        </div>
    );
};

const Category = ({
                      title,
                      score,
                  }: {
    title: string;
    score: number;
}) => {
    const styles = getScoreStyles(score);

    return (
        <div className="resume-summary">
            <div className="category bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-2xl">
                <div className="flex flex-row gap-2 items-center max-sm:flex-col max-sm:items-start">
                    <p className="text-2xl text-zinc-100">
                        {title}
                    </p>

                    <ScoreBadge score={score} />
                </div>

                <p className="text-2xl text-zinc-300 shrink-0">
                    <span className={styles.text}>
                        {score}
                    </span>
                    /100
                </p>
            </div>
        </div>
    );
};

const categories = [
    {
        title: "Tone & Style",
        scoreKey: "toneAndStyle",
    },
    {
        title: "Content",
        scoreKey: "content",
    },
    {
        title: "Structure",
        scoreKey: "structure",
    },
    {
        title: "Skills",
        scoreKey: "skills",
    },
] as const;

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-2xl w-full overflow-hidden">
            <div className="flex flex-row max-sm:flex-col items-center p-6 gap-8 border-b border-zinc-800">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-zinc-100">
                        Your Resume Score
                    </h2>

                    <p className="text-sm text-zinc-400 max-w-lg">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            {categories.map((category) => (
                <Category
                    key={category.title}
                    title={category.title}
                    score={feedback[category.scoreKey].score}
                />
            ))}
        </div>
    );
};

export default Summary;