// Global variables
let generatedImages = [];
let isGenerating = false;

// DOM elements
const promptInput = document.getElementById('prompt');
const charCount = document.getElementById('charCount');
const generateBtn = document.getElementById('generateBtn');
const loading = document.getElementById('loading');
const resultContainer = document.getElementById('resultContainer');
const downloadSection = document.getElementById('downloadSection');
const gallery = document.getElementById('gallery');
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Add event listeners
    promptInput.addEventListener('input', updateCharCount);
    promptInput.addEventListener('keydown', handleEnterKey);
    
    // Load saved images from localStorage
    loadSavedImages();
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === errorModal) {
            closeModal();
        }
    });
    
    // Close modal with X button
    document.querySelector('.close').addEventListener('click', closeModal);
    
    // Initialize character count
    updateCharCount();
}

// Update character count
function updateCharCount() {
    const count = promptInput.value.length;
    charCount.textContent = count;
    
    // Change color based on length
    if (count > 500) {
        charCount.style.color = '#dc3545';
    } else if (count > 300) {
        charCount.style.color = '#ffc107';
    } else {
        charCount.style.color = '#6c757d';
    }
}

// Handle Enter key
function handleEnterKey(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
        generateImage();
    }
}

// Clear prompt
function clearPrompt() {
    promptInput.value = '';
    updateCharCount();
    promptInput.focus();
}

// Generate image
async function generateImage() {
    const prompt = promptInput.value.trim();
    
    if (!prompt) {
        showError('Please enter a description for your image!');
        return;
    }
    
    if (prompt.length < 10) {
        showError('Please provide a more detailed description (at least 10 characters).');
        return;
    }
    
    if (isGenerating) {
        return;
    }
    
    isGenerating = true;
    setGeneratingState(true);
    
    try {
        const style = document.getElementById('style').value;
        const size = document.getElementById('size').value;
        
        const response = await fetch('http://localhost:3000/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                prompt, 
                style, 
                size 
            })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to generate image');
        }
        
        if (data.image) {
            displayResult(data.image, prompt, data.timestamp);
            addToGallery(data.image, prompt, data.timestamp);
            saveToLocalStorage(data.image, prompt, data.timestamp);
        } else {
            throw new Error('No image data received');
        }
        
    } catch (error) {
        console.error('Generation error:', error);
        showError(`Failed to generate image: ${error.message}`);
    } finally {
        isGenerating = false;
        setGeneratingState(false);
    }
}

// Set generating state
function setGeneratingState(generating) {
    generateBtn.disabled = generating;
    loading.style.display = generating ? 'block' : 'none';
    resultContainer.style.display = generating ? 'none' : 'block';
    
    if (generating) {
        generateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
    } else {
        generateBtn.innerHTML = '<i class="fas fa-wand-magic-sparkles"></i> Generate Image';
    }
}

// Display result
function displayResult(imageData, prompt, timestamp) {
    resultContainer.innerHTML = `
        <img id="generatedImage" src="${imageData}" alt="Generated Image" />
        <div class="image-info">
            <p><strong>Prompt:</strong> ${prompt}</p>
            <p><strong>Generated:</strong> ${new Date(timestamp).toLocaleString()}</p>
        </div>
    `;
    downloadSection.style.display = 'block';
}

// Add to gallery
function addToGallery(imageData, prompt, timestamp) {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    galleryItem.innerHTML = `
        <img src="${imageData}" alt="Generated Image" onclick="viewImage('${imageData}', '${prompt}')" />
        <div class="gallery-item-info">
            <p>${prompt.substring(0, 50)}${prompt.length > 50 ? '...' : ''}</p>
            <p class="timestamp">${new Date(timestamp).toLocaleDateString()}</p>
        </div>
    `;
    
    gallery.insertBefore(galleryItem, gallery.firstChild);
    
    // Limit gallery to 10 items
    if (gallery.children.length > 10) {
        gallery.removeChild(gallery.lastChild);
    }
}

// View image in modal
function viewImage(imageData, prompt) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 800px;">
            <span class="close" onclick="this.parentElement.parentElement.remove()">&times;</span>
            <h3>Generated Image</h3>
            <img src="${imageData}" alt="Generated Image" style="width: 100%; max-height: 500px; object-fit: contain;" />
            <p style="margin-top: 15px;"><strong>Prompt:</strong> ${prompt}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.remove();
        }
    });
}

// Download functions
function downloadImage(format) {
    const img = document.getElementById('generatedImage');
    if (!img) {
        showError('No image to download');
        return;
    }
    
    const link = document.createElement('a');
    link.href = img.src;
    link.download = `ai_generated_image_${Date.now()}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function downloadPDF() {
    const img = document.getElementById('generatedImage');
    if (!img) {
        showError('No image to download');
        return;
    }
    
    try {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF();
        
        // Add title
        pdf.setFontSize(16);
        pdf.text('AI Generated Image', 20, 20);
        
        // Add image
        pdf.addImage(img.src, 'PNG', 20, 30, 170, 150);
        
        // Add prompt info
        pdf.setFontSize(12);
        const prompt = document.querySelector('.image-info p:first-child').textContent.replace('Prompt: ', '');
        pdf.text(`Prompt: ${prompt}`, 20, 190);
        
        pdf.save(`ai_generated_image_${Date.now()}.pdf`);
    } catch (error) {
        showError('Failed to generate PDF. Please try again.');
    }
}

// Local storage functions
function saveToLocalStorage(imageData, prompt, timestamp) {
    const imageItem = { imageData, prompt, timestamp };
    generatedImages.unshift(imageItem);
    
    // Keep only last 10 images
    if (generatedImages.length > 10) {
        generatedImages = generatedImages.slice(0, 10);
    }
    
    localStorage.setItem('generatedImages', JSON.stringify(generatedImages));
}

function loadSavedImages() {
    const saved = localStorage.getItem('generatedImages');
    if (saved) {
        try {
            generatedImages = JSON.parse(saved);
            generatedImages.forEach(item => {
                addToGallery(item.imageData, item.prompt, item.timestamp);
            });
        } catch (error) {
            console.error('Failed to load saved images:', error);
            localStorage.removeItem('generatedImages');
        }
    }
}

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorModal.style.display = 'block';
}

function closeModal() {
    errorModal.style.display = 'none';
}

// Utility functions
function formatDate(timestamp) {
    return new Date(timestamp).toLocaleString();
}

// Export functions for global access
window.generateImage = generateImage;
window.downloadImage = downloadImage;
window.downloadPDF = downloadPDF;
window.clearPrompt = clearPrompt;
window.viewImage = viewImage;
