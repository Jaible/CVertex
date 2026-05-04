import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { formatSize } from "../lib/utils";

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0] ?? null;

            setFile(selectedFile);
            onFileSelect(selectedFile);
        },
        [onFileSelect]
    );

    const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        setFile(null);
        onFileSelect(null);
    };

    const {
        getRootProps,
        getInputProps,
        fileRejections,
        isDragActive,
    } = useDropzone({
        onDrop,
        multiple: false,
        maxSize: MAX_FILE_SIZE,
        accept: {
            "application/pdf": [".pdf"],
        },
    });

    const fileError = fileRejections[0]?.errors[0];

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div
                    className={`space-y-4 cursor-pointer transition-opacity ${
                        isDragActive ? "opacity-80" : "opacity-100"
                    }`}
                >
                    {file ? (
                        <div
                            className="uploader-selected-file"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img
                                src="/images/pdf.png"
                                alt="pdf"
                                className="size-10"
                            />

                            <div className="flex-1 min-w-0">
                                <p className="text-lg text-zinc-200 font-medium truncate">
                                    {file.name}
                                </p>

                                <p className="text-sm text-zinc-500">
                                    {formatSize(file.size)}
                                </p>
                            </div>

                            <button
                                type="button"
                                className="p-2 cursor-pointer shrink-0"
                                onClick={removeFile}
                            >
                                <img
                                    src="/icons/cross.svg"
                                    alt="remove"
                                    className="size-4"
                                />
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img
                                    src="/icons/info.svg"
                                    alt="upload"
                                    className="size-20"
                                />
                            </div>

                            <p className="text-lg text-zinc-400">
                                <span className="font-semibold">
                                    Click to upload
                                </span>{" "}
                                or drag and drop
                            </p>

                            <p className="text-lg text-zinc-400">
                                PDF (max {formatSize(MAX_FILE_SIZE)})
                            </p>
                        </div>
                    )}

                    {fileError && (
                        <p className="text-sm text-red-400 text-center">
                            {fileError.message}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;