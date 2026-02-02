// responsive-adaptive.js - Handles responsive and adaptive features for all screen sizes

// ==================== DEVICE DETECTION ====================
const deviceDetection = {
  isMobile: () => window.innerWidth <= 480,
  isTablet: () => window.innerWidth > 480 && window.innerWidth <= 768,
  isDesktop: () => window.innerWidth > 768 && window.innerWidth <= 1920,
  isUltraWide: () => window.innerWidth > 1920, // TV/Large screens
  isPhone: () => /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
  isTouchDevice: () => /Mobi|Android|Touch/i.test(navigator.userAgent) || 
                        'ontouchstart' in window
};

// ==================== RESPONSIVE IMAGE HANDLER ====================
function optimizeImages() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (deviceDetection.isMobile()) {
      img.loading = 'lazy'; // Lazy load on mobile
      if (img.src.includes('unsplash')) {
        img.src = img.src.replace('300x200', '240x160');
      }
    } else if (deviceDetection.isTablet()) {
      img.loading = 'lazy';
      if (img.src.includes('unsplash')) {
        img.src = img.src.replace('300x200', '400x300');
      }
    } else if (deviceDetection.isUltraWide()) {
      if (img.src.includes('unsplash')) {
        img.src = img.src.replace('300x200', '600x450');
      }
    }
  });
}

// ==================== FLUID TYPOGRAPHY ====================
function setFluidTypography() {
  const root = document.documentElement;
  const width = window.innerWidth;
  
  // Responsive font sizing
  if (deviceDetection.isMobile()) {
    root.style.fontSize = '14px';
  } else if (deviceDetection.isTablet()) {
    root.style.fontSize = '15px';
  } else if (deviceDetection.isDesktop()) {
    root.style.fontSize = '16px';
  } else if (deviceDetection.isUltraWide()) {
    root.style.fontSize = '18px';
  }
}

// ==================== ADAPTIVE LAYOUT HANDLER ====================
function adaptLayoutForDevice() {
  const container = document.querySelector('.container');
  const servicesGrid = document.querySelector('.services-grid');
  const formGrid = document.querySelector('.form-grid');
  
  if (deviceDetection.isMobile()) {
    if (container) {
      container.style.padding = '15px 10px';
    }
    if (servicesGrid) {
      servicesGrid.style.gridTemplateColumns = '1fr';
    }
    if (formGrid) {
      formGrid.style.gridTemplateColumns = '1fr';
    }
  } else if (deviceDetection.isTablet()) {
    if (container) {
      container.style.padding = '20px 20px';
    }
    if (servicesGrid) {
      servicesGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
    if (formGrid) {
      formGrid.style.gridTemplateColumns = '1fr';
    }
  } else if (deviceDetection.isDesktop()) {
    if (container) {
      container.style.padding = '40px 20px';
    }
    if (servicesGrid) {
      servicesGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
    if (formGrid) {
      formGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    }
  } else if (deviceDetection.isUltraWide()) {
    if (container) {
      container.style.padding = '50px 30px';
    }
    if (servicesGrid) {
      servicesGrid.style.gridTemplateColumns = 'repeat(4, 1fr)';
    }
    if (formGrid) {
      formGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    }
  }
}

// ==================== ADAPTIVE NAVIGATION ====================
function adaptNavigation() {
  const nav = document.querySelector('nav');
  
  if (deviceDetection.isMobile()) {
    nav.style.gap = '5px';
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.style.fontSize = '0.75rem';
      link.style.padding = '6px 10px';
      link.style.margin = '4px';
    });
  }
}

// ==================== TOUCH DEVICE OPTIMIZATION ====================
function optimizeForTouch() {
  if (deviceDetection.isTouchDevice()) {
    // Increase button sizes for touch
    const buttons = document.querySelectorAll('.btn, button, nav a');
    buttons.forEach(btn => {
      btn.style.minHeight = '44px'; // Apple touch target minimum
      btn.style.minWidth = '44px';
      btn.style.padding = (parseFloat(btn.style.padding) || 12) + 4 + 'px ' + 
                          (parseFloat(btn.style.padding) || 12) + 4 + 'px';
    });
    
    // Add active states for touch feedback
    buttons.forEach(btn => {
      btn.addEventListener('touchstart', () => {
        btn.style.opacity = '0.8';
      });
      btn.addEventListener('touchend', () => {
        btn.style.opacity = '1';
      });
    });
  }
}

// ==================== VIEWPORT ORIENTATION HANDLER ====================
function handleOrientationChange() {
  window.addEventListener('orientationchange', () => {
    setTimeout(() => {
      adaptLayoutForDevice();
      setFluidTypography();
      optimizeImages();
    }, 100);
  });
}

// ==================== RESIZE OBSERVER FOR RESPONSIVE BEHAVIOR ====================
function setupResizeObserver() {
  const resizeObserver = new ResizeObserver(() => {
    adaptLayoutForDevice();
    setFluidTypography();
  });
  
  document.querySelectorAll('.container, .services-grid, .form-grid').forEach(element => {
    resizeObserver.observe(element);
  });
}

// ==================== PERFORMANCE OPTIMIZATION FOR LARGE SCREENS ====================
function optimizePerformance() {
  if (deviceDetection.isMobile()) {
    // Reduce animation complexity on mobile
    document.documentElement.style.setProperty('--transition', 'all 0.2s ease');
  } else if (deviceDetection.isUltraWide()) {
    // Enhanced animations on large screens
    document.documentElement.style.setProperty('--transition', 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)');
  }
}

// ==================== ACCESSIBILITY ENHANCEMENTS ====================
function enhanceAccessibility() {
  // Ensure focus visible states work well across devices
  const elements = document.querySelectorAll('a, button, input, select, textarea');
  elements.forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid #f1c40f';
      element.style.outlineOffset = '2px';
    });
    element.addEventListener('blur', () => {
      element.style.outline = 'none';
    });
  });
}

// ==================== ADAPTIVE FOOTER ====================
function adaptFooter() {
  const footer = document.querySelector('footer');
  if (footer) {
    if (deviceDetection.isMobile()) {
      footer.style.fontSize = '0.8rem';
      footer.style.padding = '15px 10px';
    } else if (deviceDetection.isTablet()) {
      footer.style.fontSize = '0.9rem';
      footer.style.padding = '20px 15px';
    } else {
      footer.style.fontSize = '1rem';
      footer.style.padding = '30px 20px';
    }
  }
}

// ==================== RESPONSIVE VIDEO EMBEDDING ====================
function makeVideosResponsive() {
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    const width = iframe.getAttribute('width') || 560;
    const height = iframe.getAttribute('height') || 315;
    const aspectRatio = (height / width) * 100;
    
    const container = document.createElement('div');
    container.style.position = 'relative';
    container.style.width = '100%';
    container.style.paddingBottom = aspectRatio + '%';
    container.style.height = '0';
    container.style.overflow = 'hidden';
    
    iframe.style.position = 'absolute';
    iframe.style.top = '0';
    iframe.style.left = '0';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    
    iframe.parentNode.insertBefore(container, iframe);
    container.appendChild(iframe);
  });
}

// ==================== INITIALIZATION ====================
document.addEventListener('DOMContentLoaded', () => {
  // Log device type for debugging
  console.log('Device Type:', {
    isMobile: deviceDetection.isMobile(),
    isTablet: deviceDetection.isTablet(),
    isDesktop: deviceDetection.isDesktop(),
    isUltraWide: deviceDetection.isUltraWide(),
    isTouchDevice: deviceDetection.isTouchDevice(),
    screenWidth: window.innerWidth,
    screenHeight: window.innerHeight
  });

  // Run adaptive functions
  setFluidTypography();
  adaptLayoutForDevice();
  adaptNavigation();
  adaptFooter();
  optimizeImages();
  optimizeForTouch();
  enhanceAccessibility();
  optimizePerformance();
  makeVideosResponsive();
  handleOrientationChange();
  
  // Setup continuous monitoring
  setupResizeObserver();
});

// ==================== CONTINUOUS MONITORING ====================
window.addEventListener('resize', () => {
  setFluidTypography();
  adaptLayoutForDevice();
  adaptNavigation();
  adaptFooter();
  optimizePerformance();
});

window.addEventListener('load', () => {
  optimizeImages();
  makeVideosResponsive();
});
