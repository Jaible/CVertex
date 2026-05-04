import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { usePuterStore } from "~/lib/puter";

import Summary from "../components/feedback/Summary";
import ATS from "../components/feedback/ATS";
import Details from "../components/feedback/Details";

export const meta = () => [
    { title: "CVertex | Review" },
    { name: "description", content: "Detailed Overview" },
];

const Resume = () => {
    const { auth, isLoading, kv, fs } = usePuterStore();

    const { id } = useParams();
    const navigate = useNavigate();

    const [imageUrl, setImageUrl] = useState("");
    const [resumeUrl, setResumeUrl] = useState("");
    const [feedback, setFeedback] = useState<Feedback | null>(null);

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate(`/auth?next=/resume/${id}`);
        }
    }, [auth.isAuthenticated, id, isLoading, navigate]);

    useEffect(() => {
        if (!id) return;

        let imageObjectUrl = "";
        let resumeObjectUrl = "";

        const loadResume = async () => {
            try {
                const resume = await kv.get(`resume:${id}`);

                if (!resume) {
                    navigate("/");
                    return;
                }

                const data = JSON.parse(resume) as Resume;

                const [resumeBlob, imageBlob] = await Promise.all([
                    fs.read(data.resumePath),
                    fs.read(data.imagePath),
                ]);

                if (!resumeBlob || !imageBlob) return;

                resumeObjectUrl = URL.createObjectURL(
                    new Blob([resumeBlob], {
                        type: "application/pdf",
                    })
                );

                imageObjectUrl = URL.createObjectURL(imageBlob);

                setResumeUrl(resumeObjectUrl);
                setImageUrl(imageObjectUrl);
                setFeedback(data.feedback);
            } catch (error) {
                console.error("Failed to load resume:", error);
            }
        };

        loadResume();

        return () => {
            if (imageObjectUrl) {
                URL.revokeObjectURL(imageObjectUrl);
            }

            if (resumeObjectUrl) {
                URL.revokeObjectURL(resumeObjectUrl);
            }
        };
    }, [fs, id, kv, navigate]);

    return (
        <main className="pt-0!">
            <nav className="resume-nav">
                <Link to="/" className="back-button">
                    <img
                        src="/icons/back.svg"
                        alt="back"
                        className="w-2.5 h-2.5"
                    />

                    <span className="text-sm font-semibold text-zinc-200">
                        Back to Homepage
                    </span>
                </Link>
            </nav>

            <div className="flex flex-row w-full max-lg:flex-col-reverse">
                <section
                    className="
                        feedback-section bg-[url('/images/bg-small.svg')]
                        bg-cover h-screen sticky top-0
                        items-center justify-center
                    "
                >
                    {imageUrl && resumeUrl && (
                        <div
                            className="
                                animate-in fade-in duration-700
                                gradient-border max-sm:m-0
                                h-[90%] max-w-xl:w-full w-fit
                            "
                        >
                            <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <img
                                    src={imageUrl}
                                    alt="resume preview"
                                    className="
                                        w-full h-full object-contain rounded-2xl
                                    "
                                />
                            </a>
                        </div>
                    )}
                </section>

                <section className="feedback-section">
                    <h2 className="text-4xl font-bold text-white">
                        Resume Review
                    </h2>

                    {feedback ? (
                        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
                            <Summary feedback={feedback} />

                            <ATS
                                score={feedback.ATS.score || 0}
                                suggestions={feedback.ATS.tips || []}
                            />

                            <Details feedback={feedback} />
                        </div>
                    ) : (
                        <div className="flex items-center justify-center py-10">
                            <img
                                src="/images/resume-scan-2.gif"
                                alt="loading"
                                className="w-[220px]"
                            />
                        </div>
                    )}
                </section>
            </div>
        </main>
    );
};

export default Resume;