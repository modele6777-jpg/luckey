/**
 * Client-side lightweight image compression using HTML5 Canvas.
 * Resizes any image to a maximum dimension (default 320px) and outputs a compact DataURL
 * suitable for localStorage, Firestore, and instant PWA rendering without external storage dependencies.
 */
export async function compressImageToDataUrl(file: File | Blob, maxDim = 320, quality = 0.85): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('파일을 읽는 중 오류가 발생했습니다.'));
    reader.onload = (e) => {
      const result = e.target?.result;
      if (!result || typeof result !== 'string') {
        reject(new Error('이미지 데이터를 변환할 수 없습니다.'));
        return;
      }

      const img = new Image();
      img.onerror = () => reject(new Error('이미지를 로드할 수 없습니다.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(width, 1);
        canvas.height = Math.max(height, 1);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        // Draw image smoothly onto canvas
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to lightweight JPEG data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.src = result;
    };
    reader.readAsDataURL(file);
  });
}
