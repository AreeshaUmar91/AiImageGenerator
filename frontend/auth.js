// Authentication JavaScript functionality

// Password toggle functionality
function togglePassword(inputId) {
  const input = document.getElementById(inputId);
  const button = input.nextElementSibling;
  const icon = button.querySelector('i');
  
  if (input.type === 'password') {
    input.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    input.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

// Form validation and submission
document.addEventListener('DOMContentLoaded', function() {
  // Signup form handling
  const signupForm = document.getElementById('signupForm');
  if (signupForm) {
    signupForm.addEventListener('submit', handleSignup);
  }
  
  // Login form handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', handleLogin);
  }
  
  // Real-time validation
  setupRealTimeValidation();
});

// Handle signup form submission
function handleSignup(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const fullName = formData.get('fullName');
  const email = formData.get('email');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  const terms = formData.get('terms');
  
  // Validation
  if (!validateSignupForm(fullName, email, password, confirmPassword, terms)) {
    return;
  }
  
  // Simulate signup process
  showLoadingState(event.target);
  
  setTimeout(() => {
    // Store user data (in real app, this would go to backend)
    const userData = {
      fullName,
      email,
      password: btoa(password), // Basic encoding (not secure for production)
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
    
    // Show success message
    showAlert('Thank you for signing up! Welcome to AI Image Generator!', 'success');
    
    // Redirect to generator page after 2 seconds
    setTimeout(() => {
      window.location.href = 'generator.html';
    }, 2000);
    
  }, 1500);
}

// Handle login form submission
function handleLogin(event) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  const rememberMe = formData.get('rememberMe');
  
  // Validation
  if (!validateLoginForm(email, password)) {
    return;
  }
  
  // Simulate login process
  showLoadingState(event.target);
  
  setTimeout(() => {
    // Check if user exists (in real app, this would validate against backend)
    const storedUserData = localStorage.getItem('userData');
    
    if (storedUserData) {
      const userData = JSON.parse(storedUserData);
      
      if (userData.email === email && atob(userData.password) === password) {
        // Login successful
        localStorage.setItem('isLoggedIn', 'true');
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
        }
        
        showAlert('Login successful! Redirecting to image generator...', 'success');
        
        // Redirect to generator page
        setTimeout(() => {
          window.location.href = 'generator.html';
        }, 1500);
        
      } else {
        showAlert('Invalid email or password. Please try again.', 'error');
        hideLoadingState(event.target);
      }
    } else {
      showAlert('No account found with this email. Please sign up first.', 'error');
      hideLoadingState(event.target);
    }
    
  }, 1500);
}

// Validate signup form
function validateSignupForm(fullName, email, password, confirmPassword, terms) {
  let isValid = true;
  
  // Clear previous error states
  clearErrorStates();
  
  // Full name validation
  if (fullName.trim().length < 2) {
    showFieldError('fullName', 'Full name must be at least 2 characters long');
    isValid = false;
  }
  
  // Email validation
  if (!isValidEmail(email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Password validation
  if (password.length < 6) {
    showFieldError('password', 'Password must be at least 6 characters long');
    isValid = false;
  }
  
  // Confirm password validation
  if (password !== confirmPassword) {
    showFieldError('confirmPassword', 'Passwords do not match');
    isValid = false;
  }
  
  // Terms validation
  if (!terms) {
    showAlert('Please accept the terms and conditions', 'error');
    isValid = false;
  }
  
  return isValid;
}

// Validate login form
function validateLoginForm(email, password) {
  let isValid = true;
  
  // Clear previous error states
  clearErrorStates();
  
  // Email validation
  if (!isValidEmail(email)) {
    showFieldError('email', 'Please enter a valid email address');
    isValid = false;
  }
  
  // Password validation
  if (password.length === 0) {
    showFieldError('password', 'Password is required');
    isValid = false;
  }
  
  return isValid;
}

// Email validation helper
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Show field error
function showFieldError(fieldId, message) {
  const input = document.getElementById(fieldId);
  const wrapper = input.closest('.input-wrapper');
  
  wrapper.classList.add('error');
  
  // Create error message element if it doesn't exist
  let errorElement = wrapper.querySelector('.error-message');
  if (!errorElement) {
    errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    wrapper.appendChild(errorElement);
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Clear error states
function clearErrorStates() {
  document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    wrapper.classList.remove('error', 'success');
  });
  
  document.querySelectorAll('.error-message').forEach(message => {
    message.style.display = 'none';
  });
}

// Show loading state
function showLoadingState(form) {
  const submitBtn = form.querySelector('.auth-btn');
  const originalText = submitBtn.innerHTML;
  
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
  
  // Store original text for restoration
  submitBtn.dataset.originalText = originalText;
}

// Hide loading state
function hideLoadingState(form) {
  const submitBtn = form.querySelector('.auth-btn');
  
  submitBtn.disabled = false;
  submitBtn.innerHTML = submitBtn.dataset.originalText || 'Submit';
}

// Show alert message
function showAlert(message, type = 'info') {
  // Remove existing alerts
  const existingAlert = document.querySelector('.alert');
  if (existingAlert) {
    existingAlert.remove();
  }
  
  // Create alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <div class="alert-content">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="alert-close" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  
  // Add alert styles
  alert.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    padding: 15px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
  `;
  
  // Add alert content styles
  const alertContent = alert.querySelector('.alert-content');
  alertContent.style.cssText = `
    display: flex;
    align-items: center;
    gap: 10px;
  `;
  
  // Add close button styles
  const closeBtn = alert.querySelector('.alert-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: white;
    cursor: pointer;
    margin-left: auto;
    padding: 5px;
  `;
  
  document.body.appendChild(alert);
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (alert.parentElement) {
      alert.remove();
    }
  }, 5000);
}

// Setup real-time validation
function setupRealTimeValidation() {
  const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"]');
  
  inputs.forEach(input => {
    input.addEventListener('blur', function() {
      validateField(this);
    });
    
    input.addEventListener('input', function() {
      // Clear error state when user starts typing
      const wrapper = this.closest('.input-wrapper');
      wrapper.classList.remove('error');
      
      const errorMessage = wrapper.querySelector('.error-message');
      if (errorMessage) {
        errorMessage.style.display = 'none';
      }
    });
  });
}

// Validate individual field
function validateField(input) {
  const value = input.value.trim();
  const fieldId = input.id;
  
  // Clear previous error state
  const wrapper = input.closest('.input-wrapper');
  wrapper.classList.remove('error');
  
  let errorMessage = '';
  
  switch (fieldId) {
    case 'fullName':
      if (value.length < 2) {
        errorMessage = 'Full name must be at least 2 characters long';
      }
      break;
      
    case 'email':
      if (!isValidEmail(value)) {
        errorMessage = 'Please enter a valid email address';
      }
      break;
      
    case 'password':
      if (value.length < 6) {
        errorMessage = 'Password must be at least 6 characters long';
      }
      break;
      
    case 'confirmPassword':
      const password = document.getElementById('password').value;
      if (value !== password) {
        errorMessage = 'Passwords do not match';
      }
      break;
  }
  
  if (errorMessage) {
    showFieldError(fieldId, errorMessage);
  } else {
    // Show success state
    wrapper.classList.add('success');
  }
}

// Add alert styles to the page
const alertStyles = document.createElement('style');
alertStyles.textContent = `
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
document.head.appendChild(alertStyles);
