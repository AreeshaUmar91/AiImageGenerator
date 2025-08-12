# 🚀 Deployment Guide

## Why Netlify/Vercel Deployment Failed

### ❌ Main Issues:

1. **Missing Configuration Files**: No `netlify.toml` or `vercel.json`
2. **Backend Dependencies**: The app requires a Node.js backend server
3. **Build Process**: No build command defined
4. **Static File Structure**: Netlify/Vercel expect static files in the root or specified directory

### ✅ Solutions:

## Option 1: Frontend-Only Deployment (Recommended for Demo)

### Netlify Deployment:
1. **Push your code to GitHub**
2. **Connect Netlify to your GitHub repo**
3. **Set build settings:**
   - Build command: (leave empty)
   - Publish directory: `frontend`
4. **Deploy!**

### Vercel Deployment:
1. **Push your code to GitHub**
2. **Import to Vercel**
3. **Set root directory to `frontend`**
4. **Deploy!**

## Option 2: Full-Stack Deployment

### For Netlify Functions:
1. Create `netlify/functions/generate-image.js`:

```javascript
const fetch = require('node-fetch');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { prompt } = JSON.parse(event.body);
    
    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt.trim() })
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        image: `data:image/png;base64,${base64Image}`,
        prompt: prompt,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

2. **Update frontend API calls to use Netlify functions:**

```javascript
// In script.js, change the fetch URL to:
const response = await fetch('/.netlify/functions/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, style, size })
});
```

3. **Set environment variables in Netlify dashboard:**
   - `CLIPDROP_API_KEY`: Your ClipDrop API key

### For Vercel Serverless Functions:
1. Create `api/generate-image.js`:

```javascript
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;
    
    const response = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: {
        "x-api-key": process.env.CLIPDROP_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: prompt.trim() })
    });

    if (!response.ok) {
      throw new Error('API call failed');
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    res.status(200).json({
      image: `data:image/png;base64,${base64Image}`,
      prompt: prompt,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
```

2. **Update frontend API calls:**

```javascript
// In script.js, change the fetch URL to:
const response = await fetch('/api/generate-image', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, style, size })
});
```

3. **Set environment variables in Vercel dashboard:**
   - `CLIPDROP_API_KEY`: Your ClipDrop API key

## Option 3: Separate Backend Deployment

### Deploy Backend to:
- **Railway**: Easy Node.js deployment
- **Render**: Free tier available
- **Heroku**: Classic choice
- **DigitalOcean App Platform**: Scalable

### Update Frontend:
Change the API URL in `script.js` to your deployed backend URL:

```javascript
const response = await fetch('https://your-backend-url.com/generate', {
  // ... rest of the code
});
```

## 🎯 Quick Fix for Current Issue:

1. **Push your code to GitHub**
2. **Connect to Netlify/Vercel**
3. **Set publish directory to `frontend`**
4. **Deploy frontend only**

## 📝 Important Notes:

- **Frontend-only deployment**: Works for demo, but no image generation
- **Full-stack deployment**: Requires serverless functions or separate backend
- **Environment variables**: Must be set in deployment platform dashboard
- **CORS**: Handle cross-origin requests properly

## 🚀 Recommended Approach:

1. **Start with frontend-only deployment** to showcase the UI
2. **Add serverless functions** for full functionality
3. **Or deploy backend separately** for more control

---

**Your app will now deploy successfully! 🎉**
