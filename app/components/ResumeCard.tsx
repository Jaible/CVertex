import { Link } from "react-router";
import { useEffect, useState } from "react";

import ScoreCircle from "~/components/ScoreCircle";
import { usePuterStore } from "~/lib/puter";

const ResumeCard = ({
                        resume: { id, companyName, jobTitle, feedback, imagePath },
                    }: {
    resume: Resume;
}) => {
    const { fs } = usePuterStore();

    const [resumeUrl, setResumeUrl] = useState("");

    useEffect(() => {
        let objectUrl: string | null = null;

        const loadResume = async () => {
            try {
                const blob = await fs.read(imagePath);

                if (!blob) return;

                objectUrl = URL.createObjectURL(blob);

                setResumeUrl(objectUrl);
            } catch (error) {
                console.error("Failed to load resume preview:", error);
            }
        };

        loadResume();

        return () => {
            if (objectUrl) {
                URL.revokeObjectURL(objectUrl);
            }
        };
    }, [fs, imagePath]);

    return (
        <Link
            to={`/resume/${id}`}
            className="resume-card animate-in fade-in duration-1000"
        >
            <div className="resume-card-header">
                <div className="flex flex-col gap-2 min-w-0">
                    {companyName ? (
                        <h2 className="font-bold break-words text-zinc-100">
                            {companyName}
                        </h2>
                    ) : (
                        <h2 className="font-bold text-zinc-100">Resume</h2>
                    )}

                    {jobTitle && (
                        <h3 className="text-lg break-words text-zinc-400">
                            {jobTitle}
                        </h3>
                    )}
                </div>

                <div className="shrink-0">
                    <ScoreCircle score={feedback.overallScore} />
                </div>
            </div>

            {resumeUrl && (
                <div className="gradient-border animate-in fade-in duration-1000">
                    <img
                        src={resumeUrl}
                        alt={`${companyName || "Resume"} preview`}
                        className="w-full h-[350px] max-sm:h-[200px] object-cover object-top"
                    />
                </div>
            )}
        </Link>
    );
};

export default ResumeCard;