import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { usePuterStore } from "~/lib/puter";

const WipeApp = () => {
    const {
        auth,
        isLoading,
        error,
        fs,
        kv,
    } = usePuterStore();

    const navigate = useNavigate();

    const [files, setFiles] = useState<FSItem[]>([]);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadFiles = async () => {
        try {
            const files = (await fs.readDir("./")) as FSItem[];

            setFiles(files || []);
        } catch (error) {
            console.error("Failed to load files:", error);
        }
    };

    useEffect(() => {
        if (!isLoading && !auth.isAuthenticated) {
            navigate("/auth?next=/wipe");
        }
    }, [auth.isAuthenticated, isLoading, navigate]);

    useEffect(() => {
        if (auth.isAuthenticated) {
            loadFiles();
        }
    }, [auth.isAuthenticated]);

    const handleDelete = async () => {
        try {
            setIsDeleting(true);

            await Promise.all(
                files.map((file) => fs.delete(file.path))
            );

            await kv.flush();

            setFiles([]);
        } catch (error) {
            console.error("Failed to wipe app data:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-zinc-300">
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-400">
                Error: {error}
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-100 p-8">
            <div className="max-w-3xl mx-auto flex flex-col gap-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-bold">
                        Wipe App Data
                    </h1>

                    <p className="text-zinc-400">
                        Authenticated as{" "}
                        <span className="text-zinc-200 font-medium">
                            {auth.user?.username}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">
                            Existing Files
                        </h2>

                        <span className="text-sm text-zinc-500">
                            {files.length} files
                        </span>
                    </div>

                    {files.length === 0 ? (
                        <div className="border border-zinc-800 bg-zinc-900/40 rounded-2xl p-6 text-zinc-500">
                            No files found.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {files.map((file) => (
                                <div
                                    key={file.id}
                                    className="
                                        flex items-center justify-between
                                        border border-zinc-800
                                        bg-zinc-900/40
                                        rounded-2xl
                                        px-5 py-4
                                    "
                                >
                                    <p className="truncate">
                                        {file.name}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div>
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting || files.length === 0}
                        className="
                            bg-red-500/15 hover:bg-red-500/25
                            border border-red-500/20
                            text-red-300
                            px-5 py-3
                            rounded-2xl
                            backdrop-blur-md
                            transition-all duration-200
                            cursor-pointer
                            font-semibold
                            disabled:opacity-50
                            disabled:pointer-events-none
                        "
                    >
                        {isDeleting
                            ? "Deleting..."
                            : "Wipe App Data"}
                    </button>
                </div>
            </div>
        </main>
    );
};

export default WipeApp;