# AI Image Generator

A modern, feature-rich AI image generator built with Node.js and vanilla JavaScript. Create stunning images from text descriptions using the ClipDrop API.

## ✨ Features

- **Text-to-Image Generation**: Transform text descriptions into beautiful images
- **Multiple Styles**: Choose from realistic, artistic, cartoon, and abstract styles
- **Different Sizes**: Generate images in square, landscape, or portrait formats
- **Image Gallery**: View and manage your generated images
- **Download Options**: Download images as PNG, JPG, or PDF
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Local Storage**: Images are saved locally for easy access
- **Modern UI**: Beautiful, intuitive interface with animations

## 🚀 Quick Start

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- ClipDrop API key (free at [clipdrop.co/apis](https://clipdrop.co/apis))

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd ai-image-generator
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   CLIPDROP_API_KEY=your_clipdrop_api_key_here
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   npm start
   # or for development with auto-restart:
   npm run dev
   ```

5. **Open the application**
   Navigate to `http://localhost:3000` in your browser

## 📁 Project Structure

```
ai-image-generator/
├── backend/
│   ├── server.js          # Express server with API endpoints
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables (create this)
├── frontend/
│   ├── generator.html     # Main application interface
│   ├── generator.css      # Modern styling and animations
│   ├── script.js          # Frontend functionality
│   └── index.html         # Landing page
└── README.md             # This file
```

## 🎨 How to Use

1. **Enter a Description**: Type a detailed description of the image you want to generate
2. **Choose Style**: Select from realistic, artistic, cartoon, or abstract styles
3. **Select Size**: Choose square, landscape, or portrait format
4. **Generate**: Click the "Generate Image" button
5. **Download**: Save your image in PNG, JPG, or PDF format
6. **Gallery**: View your recent generations in the sidebar

### Tips for Better Results

- **Be Specific**: Detailed descriptions produce better results
- **Use Adjectives**: Include colors, styles, and moods
- **Mention Style**: Specify artistic styles (e.g., "oil painting", "digital art")
- **Include Context**: Describe the setting, lighting, and composition

## 🔧 API Endpoints

- `POST /generate` - Generate image from text prompt
- `GET /health` - Server health check
- `GET /styles` - Get available image styles

### Example API Usage

```javascript
const response = await fetch('http://localhost:3000/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'A majestic dragon flying over a medieval castle at sunset',
    style: 'realistic',
    size: '1024x1024'
  })
});

const data = await response.json();
console.log(data.image); // Base64 encoded image
```

## 🛠️ Development

### Backend Development

```bash
cd backend
npm run dev  # Auto-restart on file changes
```

### Frontend Development

The frontend is served statically by the backend server. Simply edit the HTML, CSS, or JavaScript files and refresh your browser.

### Adding New Features

1. **New API Endpoints**: Add routes in `backend/server.js`
2. **UI Components**: Modify `frontend/generator.html` and `generator.css`
3. **Functionality**: Extend `frontend/script.js`

## 🔒 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `CLIPDROP_API_KEY` | Your ClipDrop API key | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## 📱 Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [ClipDrop API](https://clipdrop.co/apis) for image generation
- [Font Awesome](https://fontawesome.com/) for icons
- [jsPDF](https://github.com/parallax/jsPDF) for PDF generation

## 🆘 Troubleshooting

### Common Issues

**"API key not configured" error**
- Make sure you've created a `.env` file in the backend directory
- Verify your ClipDrop API key is correct
- Restart the server after adding the API key

**"Failed to generate image" error**
- Check your internet connection
- Verify your API key has sufficient credits
- Try a simpler prompt

**Images not loading**
- Check browser console for errors
- Ensure the backend server is running
- Verify CORS settings

### Getting Help

If you encounter any issues:

1. Check the browser console for error messages
2. Verify all dependencies are installed
3. Ensure your API key is valid
4. Check the server logs for backend errors

## 🔄 Updates

Stay updated with the latest features and improvements by checking the repository regularly.

---

**Happy Image Generating! 🎨✨** 