// backend/config/cloudinary.js
//
// HOW IT WORKS:
// 1. Multer receives the file from the HTTP request
// 2. multer-storage-cloudinary sends it directly to Cloudinary
// 3. Cloudinary saves it in the folder you specify below
// 4. Cloudinary returns a URL which we save in MongoDB
//
// INSTALL FIRST:
//   cd backend
//   npm install cloudinary multer multer-storage-cloudinary

const cloudinary            = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const multer                = require('multer')

// ── Step 1: Connect to YOUR Cloudinary account ────────────────
// These values come from your .env file
// YOUR cloud_name is: djcjziy06  (visible in your screenshot)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // djcjziy06
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// ── Step 2: Define WHERE photos go in Cloudinary ─────────────
// folder: 'gym-management/members'
// This means Cloudinary will create:
//   Home/
//   └── gym-management/        ← auto-created on first upload
//       └── members/           ← auto-created on first upload
//           └── your-photo.jpg
//
// You will SEE this folder appear in your Media Library
// after the FIRST photo is uploaded — it doesn't exist yet
// because no photos have been uploaded yet!

const memberPhotoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    // ✅ This folder will appear in Cloudinary after first upload
    folder: 'gym-management/members',

    // Only allow these image types
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],

    // Auto-resize to 400x400 square profile photo
    // gravity: 'face' = smart face detection centering
    transformation: [
      {
        width:        400,
        height:       400,
        crop:         'fill',
        gravity:      'face',
        quality:      'auto',
        fetch_format: 'auto',
      },
    ],
  },
})

// ── Step 3: Only accept valid image files ─────────────────────
const imageFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  if (allowed.includes(file.mimetype)) {
    cb(null, true)   // ✅ accept
  } else {
    cb(new Error('Only JPG, PNG and WebP images are allowed'), false)
  }
}

// ── Step 4: Create Multer upload middleware ───────────────────
// Max file size: 3MB for profile photos
const uploadMemberPhoto = multer({
  storage:    memberPhotoStorage,
  fileFilter: imageFilter,
  limits:     { fileSize: 3 * 1024 * 1024 }, // 3MB
})

// ── Step 5: Helper to DELETE old photo from Cloudinary ────────
// Called when member updates their photo or member is deleted
const deleteFromCloudinary = async (imageUrl) => {
  if (!imageUrl) return

  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/djcjziy06/image/upload/v123/gym-management/members/abc123.jpg
    //                                                                    ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    //                                                                    This part is the public_id
    const splitUrl  = imageUrl.split('/upload/')
    if (splitUrl.length < 2) return

    // Remove version number (v1234567/) and file extension
    const withoutVersion = splitUrl[1].replace(/v\d+\//, '')
    const publicId       = withoutVersion.replace(/\.[^.]+$/, '')  // remove .jpg/.png etc

    await cloudinary.uploader.destroy(publicId)
    console.log('🗑️  Deleted from Cloudinary:', publicId)
  } catch (err) {
    // Don't crash the main operation if cleanup fails
    console.error('⚠️  Cloudinary delete warning (non-fatal):', err.message)
  }
}

// ── Step 6: Test connection function ─────────────────────────
// Call this when server starts to verify credentials are correct
const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping()
    console.log('✅ Cloudinary connected! Cloud:', process.env.CLOUDINARY_CLOUD_NAME)
    return true
  } catch (err) {
    console.error('❌ Cloudinary connection failed:', err.message)
    console.error('   Check your .env: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET')
    return false
  }
}

module.exports = {
  cloudinary,
  uploadMemberPhoto,
  deleteFromCloudinary,
  testCloudinaryConnection,
}