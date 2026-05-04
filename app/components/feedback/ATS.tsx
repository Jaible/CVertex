import { cn } from "~/lib/utils";

interface ATSProps {
    score: number;
    suggestions: {
        type: "good" | "improve";
        tip: string;
    }[];
}

const ATS = ({ score, suggestions }: ATSProps) => {
    const isStrong = score > 69;
    const isGood = score > 49;

    const containerStyles = isStrong
        ? "bg-gradient-to-b from-emerald-500/15 to-zinc-900 border-emerald-500/20"
        : isGood
            ? "bg-gradient-to-b from-yellow-500/15 to-zinc-900 border-yellow-500/20"
            : "bg-gradient-to-b from-red-500/15 to-zinc-900 border-red-500/20";

    const scoreIcon = isStrong
        ? "/icons/ats-good.svg"
        : isGood
            ? "/icons/ats-warning.svg"
            : "/icons/ats-bad.svg";

    return (
        <div
            className={cn(
                "w-full rounded-2xl border p-8 shadow-md backdrop-blur-2xl transition-all duration-300",
                "flex flex-col gap-4",
                containerStyles
            )}
        >
            <div className="flex items-center gap-4">
                <img
                    src={scoreIcon}
                    alt="ATS score"
                    className="size-10 shrink-0"
                />

                <p className="text-2xl font-semibold text-zinc-100">
                    ATS Score - {score}/100
                </p>
            </div>

            <div className="flex flex-col gap-3">
                <p className="text-xl font-medium text-zinc-100">
                    How well does your resume pass through Applicant Tracking Systems?
                </p>

                <p className="text-lg text-zinc-400">
                    Your resume was scanned like an employer would. Here's how it
                    performed:
                </p>

                <div className="flex flex-col gap-2">
                    {suggestions.map((suggestion, index) => (
                        <div
                            key={`${suggestion.tip}-${index}`}
                            className="flex items-center gap-2"
                        >
                            <img
                                src={
                                    suggestion.type === "good"
                                        ? "/icons/check.svg"
                                        : "/icons/warning.svg"
                                }
                                alt=""
                                aria-hidden="true"
                                className="size-4 shrink-0"
                            />

                            <p className="text-lg text-zinc-400">
                                {suggestion.tip}
                            </p>
                        </div>
                    ))}
                </div>

                <p className="text-lg text-zinc-400">
                    Want a better score? Improve your resume by applying the
                    suggestions listed below.
                </p>
            </div>
        </div>
    );
};

export default ATS;