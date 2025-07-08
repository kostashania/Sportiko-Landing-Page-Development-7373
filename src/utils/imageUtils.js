// Image utility functions for resizing and optimization
export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      // Calculate scaling factor
      const scaleX = maxWidth / width;
      const scaleY = maxHeight / height;
      const scale = Math.min(scaleX, scaleY, 1); // Don't upscale
      
      // Set new dimensions
      const newWidth = width * scale;
      const newHeight = height * scale;
      
      // Set canvas dimensions
      canvas.width = newWidth;
      canvas.height = newHeight;
      
      // Draw resized image
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      
      // Convert to blob
      canvas.toBlob(
        (blob) => {
          // Create new file with same name but potentially different size
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now(),
          });
          resolve(resizedFile);
        },
        file.type,
        quality
      );
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const validateImageFile = (file) => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  const maxSize = 10 * 1024 * 1024; // 10MB
  
  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Μη υποστηριζόμενος τύπος αρχείου. Υποστηρίζονται: JPG, PNG, GIF, WebP, SVG' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, error: 'Το αρχείο είναι πολύ μεγάλο. Μέγιστο μέγεθος: 10MB' };
  }
  
  return { valid: true };
};