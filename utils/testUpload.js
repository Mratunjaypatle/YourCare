// backend/utils/testUpload.js
//
// Run this script to verify Cloudinary is working BEFORE
// testing through the frontend.
//
// Command:  node utils/testUpload.js
//
// What it does:
// 1. Connects to Cloudinary using your .env credentials
// 2. Uploads a tiny test image
// 3. Prints the URL that was saved
// 4. Deletes the test image
// This confirms your credentials are correct and the
// gym-management/members folder path will work.

const dotenv     = require('dotenv')
const path       = require('path')
const cloudinary = require('cloudinary').v2

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') })

const test = async () => {
  console.log('\n🔧 Testing Cloudinary Connection...')
  console.log('─────────────────────────────────────')
  console.log('Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME || '❌ NOT SET')
  console.log('API Key:   ', process.env.CLOUDINARY_API_KEY    ? '✅ set' : '❌ NOT SET')
  console.log('API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ set' : '❌ NOT SET')
  console.log('─────────────────────────────────────\n')

  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error('❌ CLOUDINARY_CLOUD_NAME is missing from your .env file!')
    console.error('   Open backend/.env and add:')
    console.error('   CLOUDINARY_CLOUD_NAME=djcjziy06')
    console.error('   CLOUDINARY_API_KEY=your_key')
    console.error('   CLOUDINARY_API_SECRET=your_secret')
    process.exit(1)
  }

  // Configure
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

  try {
    // Step 1: Ping to check credentials
    console.log('1️⃣  Pinging Cloudinary...')
    await cloudinary.api.ping()
    console.log('   ✅ Connection successful!\n')

    // Step 2: Upload a tiny 1x1 pixel test image (base64)
    console.log('2️⃣  Uploading test image to gym-management/members folder...')
    const testPixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJgAAAA'

    const uploadResult = await cloudinary.uploader.upload(testPixel, {
      folder: 'gym-management/members',
      public_id: 'test-connection',
    })

    console.log('   ✅ Image uploaded successfully!')
    console.log('   📁 Folder: gym-management/members')
    console.log('   🔗 URL:', uploadResult.secure_url)
    console.log('   🆔 Public ID:', uploadResult.public_id)

    // Step 3: Delete the test image
    console.log('\n3️⃣  Cleaning up test image...')
    await cloudinary.uploader.destroy(uploadResult.public_id)
    console.log('   ✅ Test image deleted\n')

    console.log('═══════════════════════════════════════')
    console.log('🎉 CLOUDINARY IS WORKING CORRECTLY!')
    console.log('═══════════════════════════════════════')
    console.log('')
    console.log('📂 After your first real photo upload, you will see:')
    console.log('   Cloudinary → Media Library → Folders → gym-management → members')
    console.log('')
    console.log('✅ You can now start the server and upload member photos!')

  } catch (err) {
    console.error('❌ Cloudinary test FAILED:', err.message)
    console.error('')

    if (err.message.includes('Invalid API Key') || err.message.includes('401')) {
      console.error('🔑 Your API Key or API Secret is wrong.')
      console.error('   Go to: Cloudinary → Settings → API Keys')
      console.error('   Copy the exact values and paste into backend/.env')
    } else if (err.message.includes('cloud_name')) {
      console.error('☁️  Your Cloud Name is wrong.')
      console.error('   From your screenshot, it should be: djcjziy06')
    } else {
      console.error('💡 Check your internet connection and .env values')
    }

    process.exit(1)
  }
}

test()