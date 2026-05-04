import { cn } from "~/lib/utils";

const ATS = ({
                 score,
                 suggestions,
             }: {
    score: number;
    suggestions: { type: "good" | "improve"; tip: string }[];
}) => {
    return (
        <div
            className={cn(
                "rounded-2xl w-full p-8 flex flex-col gap-4 border backdrop-blur-2xl shadow-md transition-all duration-300",
                score > 69
                    ? "bg-gradient-to-b from-emerald-500/15 to-zinc-900 border-emerald-500/20"
                    : score > 49
                        ? "bg-gradient-to-b from-yellow-500/15 to-zinc-900 border-yellow-500/20"
                        : "bg-gradient-to-b from-red-500/15 to-zinc-900 border-red-500/20"
            )}
        >
            <div className="flex flex-row gap-4 items-center">
                <img
                    src={
                        score > 69
                            ? "/icons/ats-good.svg"
                            : score > 49
                                ? "/icons/ats-warning.svg"
                                : "/icons/ats-bad.svg"
                    }
                    alt="ATS"
                    className="w-10 h-10"
                />

                <p className="text-2xl font-semibold text-zinc-100">
                    ATS Score - {score}/100
                </p>
            </div>

            <div className="flex flex-col gap-2">
                <p className="font-medium text-xl text-zinc-100">
                    How well does your resume pass through Applicant Tracking Systems?
                </p>

                <p className="text-lg text-zinc-400">
                    Your resume was scanned like an employer would. Here's how it
                    performed:
                </p>

                {suggestions.map((suggestion, index) => (
                    <div
                        className="flex flex-row gap-2 items-center"
                        key={index}
                    >
                        <img
                            src={
                                suggestion.type === "good"
                                    ? "/icons/check.svg"
                                    : "/icons/warning.svg"
                            }
                            alt="ATS"
                            className="w-4 h-4"
                        />

                        <p className="text-lg text-zinc-400">
                            {suggestion.tip}
                        </p>
                    </div>
                ))}

                <p className="text-lg text-zinc-400">
                    Want a better score? Improve your resume by applying the suggestions
                    listed below.
                </p>
            </div>
        </div>
    );
};

export default ATS;