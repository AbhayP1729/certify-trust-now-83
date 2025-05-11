
/**
 * Utility functions for processing images, extracting from zip files,
 * and merging QR codes onto certificates
 */

/**
 * Extract files from a zip archive
 */
export async function extractZipFiles(zipFile: File): Promise<{ filename: string; blob: Blob }[]> {
  const JSZip = await import('jszip').then(module => module.default);
  const zip = new JSZip();
  
  try {
    const zipData = await zip.loadAsync(zipFile);
    const files: { filename: string; blob: Blob }[] = [];
    
    const filePromises = Object.keys(zipData.files)
      .filter(fileName => {
        // Don't process directories, only files
        if (zipData.files[fileName].dir) return false;
        
        // Check if it's an image file (case insensitive)
        const lowerCaseName = fileName.toLowerCase();
        return lowerCaseName.endsWith('.jpg') || 
               lowerCaseName.endsWith('.jpeg') ||
               lowerCaseName.endsWith('.png');
      })
      .map(async (fileName) => {
        const fileData = await zipData.files[fileName].async('blob');
        // Extract just the filename without directories
        const baseName = fileName.split('/').pop() || fileName;
        files.push({ filename: baseName, blob: fileData });
        
        // Debug log to verify extracted files
        console.log(`Extracted file: ${baseName}`);
      });
    
    await Promise.all(filePromises);
    console.log(`Total files extracted: ${files.length}`);
    return files;
  } catch (error) {
    console.error('Error extracting zip file:', error);
    throw new Error('Failed to extract the zip file. Please make sure it contains valid image files.');
  }
}

/**
 * Extract numerical ID from filenames like CE_01, QR_01
 */
export function extractFileId(filename: string): number {
  const match = filename.match(/(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  return -1;
}

/**
 * Load an image from a blob
 */
export function loadImageFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

/**
 * Merge QR code onto certificate
 */
export async function mergeQrCodeOnCertificate(
  certificateBlob: Blob,
  qrCodeBlob: Blob,
  qrSizePercent = 15, // QR code size as percentage of certificate width
  positionX = 'left', // Changed from 'right' to 'left'
  positionY = 'top', // 'top', 'middle', 'bottom'
  marginPercent = 2 // Margin from the edges as percentage of certificate width
): Promise<Blob> {
  try {
    // Load images
    const certificateImg = await loadImageFromBlob(certificateBlob);
    const qrCodeImg = await loadImageFromBlob(qrCodeBlob);
    
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }
    
    // Set canvas size to match certificate
    canvas.width = certificateImg.width;
    canvas.height = certificateImg.height;
    
    // Draw certificate to canvas
    ctx.drawImage(certificateImg, 0, 0);
    
    // Calculate QR code size
    const qrSize = Math.round((certificateImg.width * qrSizePercent) / 100);
    const margin = Math.round((certificateImg.width * marginPercent) / 100);
    
    // Calculate position
    let x = margin; // Default to left position (changed from right)
    let y = margin;
    
    if (positionX === 'center') {
      x = (certificateImg.width - qrSize) / 2;
    } else if (positionX === 'right') {
      x = certificateImg.width - qrSize - margin;
    }
    
    if (positionY === 'middle') {
      y = (certificateImg.height - qrSize) / 2;
    } else if (positionY === 'bottom') {
      y = certificateImg.height - qrSize - margin;
    }
    
    // Draw QR code
    ctx.drawImage(qrCodeImg, x, y, qrSize, qrSize);
    
    // Get the merged image as a blob
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          throw new Error('Failed to create blob from canvas');
        }
      }, 'image/jpeg', 0.95);
    });
  } catch (error) {
    console.error('Error merging QR code onto certificate:', error);
    throw error;
  }
}

/**
 * Create a ZIP file containing all merged certificates
 */
export async function createMergedZip(mergedFiles: { name: string; blob: Blob }[]): Promise<Blob> {
  const JSZip = await import('jszip').then(module => module.default);
  const zip = new JSZip();
  
  mergedFiles.forEach((file) => {
    zip.file(`${file.name}.jpg`, file.blob);
  });
  
  return zip.generateAsync({ type: 'blob' });
}
