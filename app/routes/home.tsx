import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import type { Route } from "./+types/home";

import Navbar from "~/components/Navbar";
import ResumeCard from "~/components/ResumeCard";
import { usePuterStore } from "~/lib/puter";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "CVertex" },
    {
      name: "description",
      content: "Your best assistant website!",
    },
  ];
}

export default function Home() {
  const { auth, kv, puterReady } = usePuterStore();

  const navigate = useNavigate();

  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (!puterReady) return;

    if (!auth.isAuthenticated) {
      navigate("/auth?next=/", { replace: true });
    }
  }, [auth.isAuthenticated, navigate, puterReady]);

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    let mounted = true;

    const loadResumes = async () => {
      try {
        setLoadingResumes(true);

        const data = (await kv.list(
            "resume:*",
            true
        )) as KVItem[];

        if (!mounted) return;

        const parsedResumes =
            data?.map((resume) =>
                JSON.parse(resume.value)
            ) || [];

        setResumes(parsedResumes);
      } catch (error) {
        console.error("Failed to load resumes:", error);
      } finally {
        if (mounted) {
          setLoadingResumes(false);
        }
      }
    };

    loadResumes();

    return () => {
      mounted = false;
    };
  }, [auth.isAuthenticated]);

  return (
      <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
        <Navbar />

        <section className="main-section">
          <div className="page-heading py-16">
            <h1>
              Track applications. Improve resumes.
            </h1>

            {!loadingResumes && resumes.length === 0 ? (
                <h2>
                  No resumes found. Upload your first resume
                  to get feedback.
                </h2>
            ) : (
                <h2>
                  Analyze every resume with intelligent insights.
                </h2>
            )}
          </div>

          {loadingResumes ? (
              <div className="flex flex-col items-center justify-center">
                <img
                    src="/images/resume-scan-2.gif"
                    alt="Loading resumes"
                    className="w-[200px]"
                />
              </div>
          ) : resumes.length > 0 ? (
              <div className="resumes-section">
                {resumes.map((resume) => (
                    <ResumeCard
                        key={resume.id}
                        resume={resume}
                    />
                ))}
              </div>
          ) : null}
        </section>
      </main>
  );
}