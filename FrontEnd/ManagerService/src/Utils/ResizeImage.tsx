// utils/calculateImageSize.ts
// 🔒 Checkpoint file
export const ResizeImageToFitFrame = (
    imageUrl: string,
    frameWidth: number,
    frameHeight: number
): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = imageUrl;

        img.onload = () => {
            const imageWidth = img.width;
            const imageHeight = img.height;

            const scaleW = frameWidth / imageWidth;
            const scaleH = frameHeight / imageHeight;
            const scale = Math.min(scaleW, scaleH);

            const newWidth = Math.round(imageWidth * scale);
            const newHeight = Math.round(imageHeight * scale);
            console.log("Height: ", newHeight);
            console.log("Weight: ", newWidth);

            resolve({ width: newWidth, height: newHeight });
        };
    });
};
