import ScoreGauge from "../ScoreGauge";

const ScoreBadge = ({ score }: { score: number }) => {
    const badgeColor =
        score > 69
            ? "bg-emerald-500/15 border border-emerald-500/20 text-emerald-300"
            : score > 49
                ? "bg-yellow-500/15 border border-yellow-500/20 text-yellow-300"
                : "bg-red-500/15 border border-red-500/20 text-red-300";

    const badgeText =
        score > 69
            ? "Strong"
            : score > 49
                ? "Good Start"
                : "Needs Work";

    return (
        <div
            className={`px-3 py-1 rounded-full backdrop-blur-md ${badgeColor}`}
        >
            <p className="text-xs font-semibold tracking-wide">
                {badgeText}
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
    const textColor =
        score > 69
            ? "text-emerald-300"
            : score > 49
                ? "text-yellow-300"
                : "text-red-300";

    return (
        <div className="resume-summary">
            <div className="category bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl rounded-2xl">
                <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-2xl text-zinc-100">
                        {title}
                    </p>

                    <ScoreBadge score={score} />
                </div>

                <p className="text-2xl text-zinc-300">
                    <span className={textColor}>
                        {score}
                    </span>
                    /100
                </p>
            </div>
        </div>
    );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="bg-zinc-950/80 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-2xl w-full overflow-hidden">
            <div className="flex flex-row max-sm:flex-col items-center p-6 gap-8 border-b border-zinc-800">
                <ScoreGauge score={feedback.overallScore} />

                <div className="flex flex-col gap-2">
                    <h2 className="text-2xl font-bold text-zinc-100">
                        Your Resume Score
                    </h2>

                    <p className="text-sm text-zinc-400">
                        This score is calculated based on the variables listed below.
                    </p>
                </div>
            </div>

            <Category
                title="Tone & Style"
                score={feedback.toneAndStyle.score}
            />

            <Category
                title="Content"
                score={feedback.content.score}
            />

            <Category
                title="Structure"
                score={feedback.structure.score}
            />

            <Category
                title="Skills"
                score={feedback.skills.score}
            />
        </div>
    );
};

export default Summary;