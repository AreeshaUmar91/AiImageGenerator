// Authentication Modal JavaScript

// Show the authentication modal
function showAuthModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }
}

// Close the authentication modal
function closeModal() {
  const modal = document.getElementById('authModal');
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto'; // Restore scrolling
  }
}

// Navigate to signup page
function goToSignup() {
  window.location.href = 'signup.html';
}

// Navigate to login page
function goToLogin() {
  window.location.href = 'login.html';
}

// Login as guest (go directly to image generator)
function loginAsGuest() {
  // Set guest mode flag
  localStorage.setItem('isGuestMode', 'true');
  localStorage.setItem('guestLoginTime', new Date().toISOString());
  
  // Show guest mode notification
  showGuestNotification();
  
  // Redirect to image generator after a short delay
  setTimeout(() => {
    window.location.href = 'generator.html';
  }, 1500);
}

// Show guest mode notification
function showGuestNotification() {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'guest-notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-user-clock"></i>
      <span>Welcome! You're now in guest mode. Images won't be saved permanently.</span>
    </div>
  `;
  
  // Add notification styles
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    color: #333;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
    z-index: 1001;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
    font-weight: 600;
  `;
  
  // Add notification content styles
  const notificationContent = notification.querySelector('.notification-content');
  notificationContent.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  // Add icon styles
  const icon = notification.querySelector('i');
  icon.style.cssText = `
    font-size: 1.2rem;
    color: #333;
  `;
  
  document.body.appendChild(notification);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Close modal when clicking outside
document.addEventListener('click', function(event) {
  const modal = document.getElementById('authModal');
  if (event.target === modal) {
    closeModal();
  }
});

// Close modal with Escape key
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
});

// Add slideInRight animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
  @keyframes slideInRight {
    from {
      opacity: 0;
      transform: translateX(100%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(animationStyles);

// Check if user is already logged in or in guest mode
function checkAuthStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const isGuestMode = localStorage.getItem('isGuestMode');
  
  if (isLoggedIn === 'true' || isGuestMode === 'true') {
    // User is already authenticated, redirect to generator
    window.location.href = 'generator.html';
  }
}

// Initialize modal functionality
document.addEventListener('DOMContentLoaded', function() {
  // Check auth status when modal page loads
  checkAuthStatus();
  
  // Add click event listeners for better UX
  const authOptions = document.querySelectorAll('.auth-option');
  authOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Add click effect
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});

// Export functions for global access
window.showAuthModal = showAuthModal;
window.closeModal = closeModal;
window.goToSignup = goToSignup;
window.goToLogin = goToLogin;
window.loginAsGuest = loginAsGuest;
