import { Request, Response, NextFunction } from 'express';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';

// Configure express-fileupload
export const fileUploadMiddleware = fileUpload({
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
  abortOnLimit: true,
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: path.join(process.cwd(), 'tmp'),
});

// Valid image extensions
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Generate a unique filename
export function generateUniqueFilename(originalFilename: string): string {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 12);
  const fileExt = path.extname(originalFilename).toLowerCase();
  return `${timestamp}-${randomStr}${fileExt}`;
}

// Upload image handler for products
export async function uploadProductImage(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    const file = req.files.mainImage as fileUpload.UploadedFile;
    if (!file) return next();

    const fileExt = path.extname(file.name).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      return res.status(400).json({ 
        message: 'Invalid file type', 
        error: 'Only image files are allowed (jpg, jpeg, png, gif, webp, svg)'
      });
    }

    const filename = generateUniqueFilename(file.name);
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);
    
    await file.mv(uploadPath);
    
    // Add the image URL to the request body
    req.body.mainImage = `/uploads/products/${filename}`;
    next();
  } catch (error) {
    console.error('Error uploading product image:', error);
    return res.status(500).json({ message: 'Error uploading image', error });
  }
}

// Upload image handler for brands
export async function uploadBrandLogo(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    const file = req.files.logo as fileUpload.UploadedFile;
    if (!file) return next();

    const fileExt = path.extname(file.name).toLowerCase();
    if (!validExtensions.includes(fileExt)) {
      return res.status(400).json({ 
        message: 'Invalid file type', 
        error: 'Only image files are allowed (jpg, jpeg, png, gif, webp, svg)'
      });
    }

    const filename = generateUniqueFilename(file.name);
    const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'brands', filename);
    
    await file.mv(uploadPath);
    
    // Add the logo URL to the request body
    req.body.logo = `/uploads/brands/${filename}`;
    next();
  } catch (error) {
    console.error('Error uploading brand logo:', error);
    return res.status(500).json({ message: 'Error uploading logo', error });
  }
}

// Upload multiple gallery images for products
export async function uploadProductGalleryImages(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    const galleryFiles = req.files.galleryImages;
    if (!galleryFiles) return next();

    // Handle single file (convert to array for consistent processing)
    const galleryFilesArray = Array.isArray(galleryFiles) ? galleryFiles : [galleryFiles];
    
    const galleryUrls: string[] = [];
    
    for (const file of galleryFilesArray) {
      const fileExt = path.extname(file.name).toLowerCase();
      if (!validExtensions.includes(fileExt)) {
        return res.status(400).json({ 
          message: 'Invalid file type in gallery', 
          error: 'Only image files are allowed (jpg, jpeg, png, gif, webp, svg)'
        });
      }

      const filename = generateUniqueFilename(file.name);
      const uploadPath = path.join(process.cwd(), 'public', 'uploads', 'products', filename);
      
      await file.mv(uploadPath);
      galleryUrls.push(`/uploads/products/${filename}`);
    }
    
    // If gallery images already exist in the request body (from form)
    let existingGallery: string[] = [];
    if (req.body.galleryImages) {
      try {
        existingGallery = JSON.parse(req.body.galleryImages);
        if (!Array.isArray(existingGallery)) {
          existingGallery = [req.body.galleryImages];
        }
      } catch (e) {
        // If not valid JSON, treat as string or array
        existingGallery = Array.isArray(req.body.galleryImages) 
          ? req.body.galleryImages 
          : [req.body.galleryImages];
      }
    }
    
    // Combine existing gallery with new uploads
    req.body.galleryImages = JSON.stringify([...existingGallery, ...galleryUrls]);
    next();
  } catch (error) {
    console.error('Error uploading gallery images:', error);
    return res.status(500).json({ message: 'Error uploading gallery images', error });
  }
}

// Utility to serve static files
export function serveUploadedFiles(app: any) {
  app.use('/uploads', (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.join(process.cwd(), 'public', req.url);
    if (fs.existsSync(filePath)) {
      return res.sendFile(filePath);
    }
    next();
  });
}