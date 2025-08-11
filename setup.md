# 🚀 Quick Setup Guide

## Prerequisites
- Node.js (version 14 or higher)
- npm or yarn
- ClipDrop API key (free at [clipdrop.co/apis](https://clipdrop.co/apis))

## Step-by-Step Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure API Key
Create a `.env` file in the `backend` directory:
```env
CLIPDROP_API_KEY=your_clipdrop_api_key_here
PORT=3000
NODE_ENV=development
```

**To get your ClipDrop API key:**
1. Go to [clipdrop.co/apis](https://clipdrop.co/apis)
2. Sign up for a free account
3. Copy your API key
4. Paste it in the `.env` file

### 3. Start the Server
```bash
npm start
```

### 4. Open the Application
Navigate to `http://localhost:3000` in your browser

## 🎨 Features Available

- **Text-to-Image Generation**: Create images from text descriptions
- **Multiple Styles**: Realistic, artistic, cartoon, abstract
- **Different Sizes**: Square, landscape, portrait formats
- **Image Gallery**: View your generated images
- **Download Options**: PNG, JPG, PDF formats
- **Responsive Design**: Works on all devices

## 🔧 Troubleshooting

**"API key not configured" error:**
- Make sure you created the `.env` file in the backend directory
- Verify your API key is correct
- Restart the server after adding the API key

**"Failed to generate image" error:**
- Check your internet connection
- Verify your API key has sufficient credits
- Try a simpler prompt

**Server won't start:**
- Make sure you're in the backend directory
- Check that all dependencies are installed
- Verify Node.js version is 14 or higher

## 📱 Usage Tips

1. **Be Specific**: Detailed descriptions produce better results
2. **Use Adjectives**: Include colors, styles, and moods
3. **Mention Style**: Specify artistic styles (e.g., "oil painting", "digital art")
4. **Include Context**: Describe the setting, lighting, and composition

## 🎯 Example Prompts

- "A majestic dragon flying over a medieval castle at sunset, oil painting style"
- "A futuristic city with flying cars and neon lights, digital art"
- "A serene forest with sunlight filtering through trees, realistic photography"
- "A cute cartoon cat playing with a ball of yarn, vibrant colors"

---

**Happy Creating! 🎨✨** 