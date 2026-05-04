import { create } from "zustand";

declare global {
    interface Window {
        puter: {
            auth: {
                getUser: () => Promise<PuterUser>;
                isSignedIn: () => Promise<boolean>;
                signIn: () => Promise<void>;
                signOut: () => Promise<void>;
            };
            fs: {
                write: (
                    path: string,
                    data: string | File | Blob
                ) => Promise<File | undefined>;
                read: (path: string) => Promise<Blob>;
                upload: (file: File[] | Blob[]) => Promise<FSItem>;
                delete: (path: string) => Promise<void>;
                readdir: (path: string) => Promise<FSItem[] | undefined>;
            };
            ai: {
                chat: (
                    prompt: string | ChatMessage[],
                    imageURL?: string | PuterChatOptions,
                    testMode?: boolean,
                    options?: PuterChatOptions
                ) => Promise<Object>;
                img2txt: (
                    image: string | File | Blob,
                    testMode?: boolean
                ) => Promise<string>;
            };
            kv: {
                get: (key: string) => Promise<string | null>;
                set: (key: string, value: string) => Promise<boolean>;
                delete: (key: string) => Promise<boolean>;
                list: (pattern: string, returnValues?: boolean) => Promise<string[]>;
                flush: () => Promise<boolean>;
            };
        };
    }
}

interface PuterStore {
    isLoading: boolean;
    error: string | null;
    puterReady: boolean;

    auth: {
        user: PuterUser | null;
        isAuthenticated: boolean;
        signIn: () => Promise<void>;
        signOut: () => Promise<void>;
        refreshUser: () => Promise<void>;
        checkAuthStatus: () => Promise<boolean>;
        getUser: () => PuterUser | null;
    };

    fs: {
        write: (
            path: string,
            data: string | File | Blob
        ) => Promise<File | undefined>;

        read: (path: string) => Promise<Blob | undefined>;

        upload: (
            file: File[] | Blob[]
        ) => Promise<FSItem | undefined>;

        delete: (path: string) => Promise<void>;

        readDir: (
            path: string
        ) => Promise<FSItem[] | undefined>;
    };

    ai: {
        chat: (
            prompt: string | ChatMessage[],
            imageURL?: string | PuterChatOptions,
            testMode?: boolean,
            options?: PuterChatOptions
        ) => Promise<AIResponse | undefined>;

        feedback: (
            path: string,
            message: string
        ) => Promise<AIResponse | undefined>;

        img2txt: (
            image: string | File | Blob,
            testMode?: boolean
        ) => Promise<string | undefined>;
    };

    kv: {
        get: (
            key: string
        ) => Promise<string | null | undefined>;

        set: (
            key: string,
            value: string
        ) => Promise<boolean | undefined>;

        delete: (
            key: string
        ) => Promise<boolean | undefined>;

        list: (
            pattern: string,
            returnValues?: boolean
        ) => Promise<string[] | KVItem[] | undefined>;

        flush: () => Promise<boolean | undefined>;
    };

    init: () => Promise<void>;
    clearError: () => void;
}

const getPuter = (): typeof window.puter | null =>
    typeof window !== "undefined" && window.puter
        ? window.puter
        : null;

export const usePuterStore = create<PuterStore>((set, get) => {
    const setError = (err: unknown) => {
        const message =
            err instanceof Error
                ? err.message
                : "Unknown error";

        set({
            error: message,
            isLoading: false,
        });
    };

    const requirePuter = () => {
        const puter = getPuter();

        if (!puter) {
            throw new Error("Puter.js not available");
        }

        return puter;
    };

    const withState = async <T>(
        fn: () => Promise<T>
    ): Promise<T | undefined> => {
        try {
            set({
                isLoading: true,
                error: null,
            });

            const result = await fn();

            set({
                isLoading: false,
            });

            return result;
        } catch (err) {
            setError(err);
        }
    };

    const createAuthState = (
        overrides?: Partial<PuterStore["auth"]>
    ): PuterStore["auth"] => ({
        user: null,
        isAuthenticated: false,
        signIn,
        signOut,
        refreshUser,
        checkAuthStatus,
        getUser: () => get().auth.user,
        ...overrides,
    });

    const waitForPuter = async (
        timeout = 10000
    ) => {
        const start = Date.now();

        while (!getPuter()) {
            if (Date.now() - start > timeout) {
                throw new Error(
                    "Puter.js failed to load within 10 seconds"
                );
            }

            await new Promise((resolve) =>
                setTimeout(resolve, 100)
            );
        }

        return getPuter();
    };

    const checkAuthStatus = async (): Promise<boolean> => {
        const result = await withState(async () => {
            const puter = requirePuter();

            const isSignedIn =
                await puter.auth.isSignedIn();

            if (!isSignedIn) {
                set({
                    auth: createAuthState(),
                });

                return false;
            }

            const user =
                await puter.auth.getUser();

            set({
                auth: createAuthState({
                    user,
                    isAuthenticated: true,
                    getUser: () => user,
                }),
            });

            return true;
        });

        return Boolean(result);
    };

    const signIn = async (): Promise<void> => {
        await withState(async () => {
            const puter = requirePuter();

            await puter.auth.signIn();

            await checkAuthStatus();
        });
    };

    const signOut = async (): Promise<void> => {
        await withState(async () => {
            const puter = requirePuter();

            await puter.auth.signOut();

            set({
                auth: createAuthState(),
            });
        });
    };

    const refreshUser = async (): Promise<void> => {
        await withState(async () => {
            const puter = requirePuter();

            const user =
                await puter.auth.getUser();

            set({
                auth: createAuthState({
                    user,
                    isAuthenticated: true,
                    getUser: () => user,
                }),
            });
        });
    };

    const init = async (): Promise<void> => {
        try {
            await waitForPuter();

            set({
                puterReady: true,
            });

            await checkAuthStatus();
        } catch (err) {
            setError(err);
        }
    };

    const write = async (
        path: string,
        data: string | File | Blob
    ) =>
        withState(() =>
            requirePuter().fs.write(path, data)
        );

    const readDir = async (path: string) =>
        withState(() =>
            requirePuter().fs.readdir(path)
        );

    const readFile = async (path: string) =>
        withState(() =>
            requirePuter().fs.read(path)
        );

    const upload = async (
        files: File[] | Blob[]
    ) =>
        withState(() =>
            requirePuter().fs.upload(files)
        );

    const deleteFile = async (path: string) =>
        withState(() =>
            requirePuter().fs.delete(path)
        );

    const chat = async (
        prompt: string | ChatMessage[],
        imageURL?: string | PuterChatOptions,
        testMode?: boolean,
        options?: PuterChatOptions
    ) =>
        withState(() =>
            requirePuter().ai.chat(
                prompt,
                imageURL,
                testMode,
                options
            )
        ) as Promise<AIResponse | undefined>;

    const feedback = async (
        path: string,
        message: string
    ) =>
        withState(() =>
            requirePuter().ai.chat(
                [
                    {
                        role: "user",
                        content: [
                            {
                                type: "file",
                                puter_path: path,
                            },
                            {
                                type: "text",
                                text: message,
                            },
                        ],
                    },
                ],
                {
                    model: "claude-sonnet-4",
                }
            )
        ) as Promise<AIResponse | undefined>;

    const img2txt = async (
        image: string | File | Blob,
        testMode?: boolean
    ) =>
        withState(() =>
            requirePuter().ai.img2txt(
                image,
                testMode
            )
        );

    const getKV = async (key: string) =>
        withState(() =>
            requirePuter().kv.get(key)
        );

    const setKV = async (
        key: string,
        value: string
    ) =>
        withState(() =>
            requirePuter().kv.set(key, value)
        );

    const deleteKV = async (key: string) =>
        withState(() =>
            requirePuter().kv.delete(key)
        );

    const listKV = async (
        pattern: string,
        returnValues?: boolean
    ) =>
        withState(() =>
            requirePuter().kv.list(
                pattern,
                returnValues ?? false
            )
        );

    const flushKV = async () =>
        withState(() =>
            requirePuter().kv.flush()
        );

    return {
        isLoading: false,
        error: null,
        puterReady: false,

        auth: createAuthState(),

        fs: {
            write,
            read: readFile,
            readDir,
            upload,
            delete: deleteFile,
        },

        ai: {
            chat,
            feedback,
            img2txt,
        },

        kv: {
            get: getKV,
            set: setKV,
            delete: deleteKV,
            list: listKV,
            flush: flushKV,
        },

        init,

        clearError: () =>
            set({
                error: null,
            }),
    };
});