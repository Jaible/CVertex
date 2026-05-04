export interface PdfConversionResult {
    imageUrl: string;
    file: File | null;
    error?: string;
}

let pdfjsLib: any;
let pdfJsPromise: Promise<any> | null = null;

const PDF_SCALE = 4;
const IMAGE_TYPE = "image/png";
const IMAGE_QUALITY = 1;

async function loadPdfJs() {
    if (pdfjsLib) return pdfjsLib;

    if (!pdfJsPromise) {
        // @ts-expect-error - pdfjs-dist/build/pdf.mjs is not a module
        pdfJsPromise = import("pdfjs-dist/build/pdf.mjs").then((lib) => {
            lib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

            pdfjsLib = lib;
            return lib;
        });
    }

    return pdfJsPromise;
}

function createCanvas(
    width: number,
    height: number
): {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;
} {
    const canvas = document.createElement("canvas");

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
        throw new Error("Failed to create canvas context");
    }

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    return { canvas, context };
}

function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) {
                    reject(new Error("Failed to generate image blob"));
                    return;
                }

                resolve(blob);
            },
            IMAGE_TYPE,
            IMAGE_QUALITY
        );
    });
}

function createImageFile(blob: Blob, originalFileName: string) {
    const name = originalFileName.replace(/\.pdf$/i, "");

    return new File([blob], `${name}.png`, {
        type: IMAGE_TYPE,
    });
}

export async function convertPdfToImage(
    file: File
): Promise<PdfConversionResult> {
    try {
        const pdfjs = await loadPdfJs();

        const pdfData = await file.arrayBuffer();

        const pdf = await pdfjs.getDocument({
            data: pdfData,
        }).promise;

        const page = await pdf.getPage(1);

        const viewport = page.getViewport({
            scale: PDF_SCALE,
        });

        const { canvas, context } = createCanvas(
            viewport.width,
            viewport.height
        );

        await page.render({
            canvasContext: context,
            viewport,
        }).promise;

        const blob = await canvasToBlob(canvas);

        const imageFile = createImageFile(blob, file.name);

        return {
            imageUrl: URL.createObjectURL(blob),
            file: imageFile,
        };
    } catch (error) {
        console.error("PDF conversion error:", error);

        return {
            imageUrl: "",
            file: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to convert PDF",
        };
    }
}