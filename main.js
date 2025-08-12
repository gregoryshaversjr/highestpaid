// Close mobile menu when a nav link is clicked
document.addEventListener('DOMContentLoaded', function() {
  var menuToggle = document.getElementById('menu-toggle');
  var navLinks = document.querySelectorAll('nav a');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (menuToggle.checked) {
        menuToggle.checked = false;
      }
    });
  });

  // Sticky Header Enhancement
  const header = document.querySelector('header');
  let headerScrollTop = 0;
  
  // Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    // Add scrolled class when scrolling down
    if (scrollTop > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Show/hide back to top button
    if (scrollTop > 300) {
      backToTopBtn.classList.add('show');
    } else {
      backToTopBtn.classList.remove('show');
    }
    
    headerScrollTop = scrollTop;
  });

  // Back to Top Button Click Handler
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Responsive Video Player Enhancement
  const videos = document.querySelectorAll('.responsive-video');
  
  function optimizeVideosForDevice() {
    const isMobile = window.innerWidth <= 600;
    
    videos.forEach(video => {
      if (isMobile) {
        // Mobile optimizations
        video.setAttribute('preload', 'metadata');
        video.style.maxHeight = '300px';
        video.style.objectFit = 'cover';
      } else {
        // Desktop optimizations
        video.setAttribute('preload', 'metadata');
        video.style.maxHeight = 'none';
        video.style.objectFit = 'contain';
      }
      
      // Add loading optimization
      video.setAttribute('loading', 'lazy');
    });
  }
  
  // Initialize video optimization
  optimizeVideosForDevice();
  
  // Re-optimize on window resize
  window.addEventListener('resize', optimizeVideosForDevice);

  // Fullscreen Video Preview Feature
  function addFullscreenFeature() {
    videos.forEach(video => {
      // Add fullscreen icon overlay
      const container = video.closest('.video-container') || video.parentElement;
      if (container && !container.querySelector('.fullscreen-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'fullscreen-overlay';
        overlay.innerHTML = '<div class="fullscreen-icon">⛶</div>';
        container.style.position = 'relative';
        container.appendChild(overlay);

        // Add click handler for fullscreen
        overlay.addEventListener('click', () => enterFullscreen(video));
        video.addEventListener('click', () => enterFullscreen(video));
      }
    });
  }

  function enterFullscreen(video) {
    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
    
    // Auto-play in fullscreen if not already playing
    if (video.paused) {
      video.play().catch(console.log);
    }
  }

  // Initialize fullscreen feature
  addFullscreenFeature();

  // Image Lightbox/Popup Feature
  function initImageLightbox() {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
      <div class="lightbox-container">
        <button class="lightbox-close">&times;</button>
        <img class="lightbox-image" src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(lightbox);

    // Get all clickable images (Tesla results, testimonials, family images)
    const clickableImages = document.querySelectorAll('img[src$=".png"], img[src$=".PNG"], .tesla-result-img, .testimonial-graphic, .centered-img img');
    
    console.log('Found clickable images:', clickableImages.length);
    clickableImages.forEach((img, index) => {
      console.log(`Image ${index}:`, {
        src: img.src,
        getAttribute: img.getAttribute('src'),
        alt: img.alt,
        className: img.className
      });
    });
    
    clickableImages.forEach(img => {
      // Add click cursor and hover effect
      img.style.cursor = 'pointer';
      img.style.touchAction = 'manipulation'; // Better touch handling
      img.classList.add('clickable-image');
      
      // Unified click handler for both mobile and desktop
      function handleImageClick(e) {
        e.preventDefault();
        e.stopPropagation();
        
        // Get the image source - try multiple methods
        let imageSrc = img.src || img.getAttribute('src');
        
        console.log('Original img.src:', img.src);
        console.log('img.getAttribute("src"):', img.getAttribute('src'));
        console.log('window.location.href:', window.location.href);
        
        // For file:// protocol, use the absolute src property
        if (window.location.protocol === 'file:') {
          imageSrc = img.src; // This should already be absolute for file:// URLs
        } else {
          // For http/https, handle relative paths
          if (imageSrc && !imageSrc.startsWith('http') && !imageSrc.startsWith('data:')) {
            if (imageSrc.startsWith('./')) {
              imageSrc = imageSrc.substring(2);
            }
            if (!imageSrc.startsWith('/')) {
              imageSrc = './' + imageSrc;
            }
            imageSrc = new URL(imageSrc, window.location.href).href;
          }
        }
        
        const imageAlt = img.alt || 'Image';
        
        console.log('Final imageSrc:', imageSrc);
        console.log('Image element:', img);
        
        openLightbox(imageSrc, imageAlt);
      }
      
      // Use only click event for simplicity and compatibility
      img.addEventListener('click', handleImageClick);
    });

    function openLightbox(src, caption) {
      const lightboxImg = lightbox.querySelector('.lightbox-image');
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      
      console.log('Opening lightbox with src:', src);
      
      // Validate the source
      if (!src || src === '' || src === 'undefined') {
        console.error('Invalid image source:', src);
        lightboxCaption.textContent = 'Invalid image source';
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        return;
      }
      
      // Clear previous image first
      lightboxImg.src = '';
      lightboxImg.style.display = 'none';
      
      // Set caption
      lightboxCaption.textContent = caption;
      
      // Show lightbox
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden';
      
      // Load and display image
      lightboxImg.onload = function() {
        console.log('Image loaded successfully:', src);
        lightboxImg.style.display = 'block';
      };
      
      lightboxImg.onerror = function() {
        console.error('Failed to load image:', src);
        console.error('Current working directory:', window.location.href);
        lightboxImg.style.display = 'none';
        lightboxCaption.textContent = `Failed to load image: ${src}`;
      };
      
      // Set the image source (this will trigger onload or onerror)
      lightboxImg.src = src;
    }

    function closeLightbox() {
      lightbox.style.display = 'none';
      document.body.style.overflow = 'auto'; // Restore scrolling
      console.log('Lightbox closed');
    }

    // Enhanced close lightbox handlers for mobile
    const closeBtn = lightbox.querySelector('.lightbox-close');
    closeBtn.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('touchend', (e) => {
      e.preventDefault();
      closeLightbox();
    });
    
    // Close when clicking/touching outside image
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    
    lightbox.addEventListener('touchend', (e) => {
      if (e.target === lightbox) {
        e.preventDefault();
        closeLightbox();
      }
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.style.display === 'flex') {
        closeLightbox();
      }
    });
  }

  // Initialize image lightbox
  initImageLightbox();

  // Theme Toggle Functionality
  function initThemeToggle() {
    const mobileThemeToggle = document.getElementById('themeToggle');
    const desktopThemeToggle = document.getElementById('desktopThemeToggle');
    const mobileThemeIcon = mobileThemeToggle.querySelector('.theme-icon');
    const desktopThemeIcon = desktopThemeToggle.querySelector('.desktop-theme-icon');
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    // Update icons based on current theme
    updateThemeIcons(currentTheme);
    
    // Theme toggle click handlers for both buttons
    function handleThemeToggle() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Apply new theme
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeIcons(newTheme);
      
      // Optional: Add a subtle animation to indicate the change
      document.body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        document.body.style.transition = '';
      }, 300);
    }
    
    // Add click handlers to both buttons
    mobileThemeToggle.addEventListener('click', handleThemeToggle);
    desktopThemeToggle.addEventListener('click', handleThemeToggle);
    
    function updateThemeIcons(theme) {
      const iconText = theme === 'dark' ? '☀️' : '🌙';
      mobileThemeIcon.textContent = iconText;
      desktopThemeIcon.textContent = iconText;
    }
  }

  // Initialize theme toggle
  initThemeToggle();

  // Cookie Consent Banner
  function initCookieConsent() {
    const cookieBanner = document.getElementById('cookie-consent');
    const acceptBtn = document.getElementById('cookie-accept');
    const declineBtn = document.getElementById('cookie-decline');
    const privacyBtn = document.getElementById('privacy-policy');
    
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent');
    
    // Show banner if no choice has been made
    if (!cookieChoice) {
      setTimeout(() => {
        cookieBanner.classList.add('show');
      }, 2000); // Show after 2 seconds
    }
    
    // Accept cookies
    acceptBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'accepted');
      cookieBanner.classList.remove('show');
      
      // Here you would initialize your analytics/tracking code
      console.log('Cookies accepted - Initialize tracking');
    });
    
    // Decline cookies
    declineBtn.addEventListener('click', () => {
      localStorage.setItem('cookieConsent', 'declined');
      cookieBanner.classList.remove('show');
      
      // Here you would disable non-essential tracking
      console.log('Cookies declined - Disable non-essential tracking');
    });
    
    // Privacy policy link
    privacyBtn.addEventListener('click', () => {
      // Close cookie banner and open privacy modal
      cookieBanner.classList.remove('show');
      document.getElementById('privacy-modal').classList.add('show');
      document.body.style.overflow = 'hidden';
    });
  }

  // Disclaimer Modal and Privacy Policy Modal
  function initModals() {
    // Disclaimer Modal
    const disclaimerModal = document.getElementById('disclaimer-modal');
    const disclaimerTrigger = document.getElementById('disclaimer-trigger');
    const disclaimerClose = disclaimerModal.querySelector('.disclaimer-close');
    const disclaimerUnderstood = document.getElementById('disclaimer-understood');
    
    // Privacy Policy Modal
    const privacyModal = document.getElementById('privacy-modal');
    const privacyTrigger = document.getElementById('privacy-trigger');
    const privacyClose = privacyModal.querySelector('.privacy-close');
    const privacyUnderstood = document.getElementById('privacy-understood');
    
    // Generic modal functions
    function openModal(modal) {
      modal.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
      modal.classList.remove('show');
      document.body.style.overflow = 'auto';
    }
    
    // Disclaimer Modal handlers
    disclaimerTrigger.addEventListener('click', () => openModal(disclaimerModal));
    disclaimerClose.addEventListener('click', () => closeModal(disclaimerModal));
    disclaimerUnderstood.addEventListener('click', () => closeModal(disclaimerModal));
    
    // Privacy Policy Modal handlers
    privacyTrigger.addEventListener('click', () => openModal(privacyModal));
    privacyClose.addEventListener('click', () => closeModal(privacyModal));
    privacyUnderstood.addEventListener('click', () => closeModal(privacyModal));
    
    // Close when clicking outside modal
    disclaimerModal.addEventListener('click', (e) => {
      if (e.target === disclaimerModal) closeModal(disclaimerModal);
    });
    
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal(privacyModal);
    });
    
    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (disclaimerModal.classList.contains('show')) closeModal(disclaimerModal);
        if (privacyModal.classList.contains('show')) closeModal(privacyModal);
      }
    });
  }

  // Initialize cookie consent and modals
  initCookieConsent();
  initModals();

  // Mobile CTA Double-Click Functionality
  function initMobileCTA() {
    const mobileCTALink = document.getElementById('mobile-cta-link');
    let clickTimeout;
    let clickCount = 0;
    let lastTouchEnd = 0;

    if (mobileCTALink) {
      // Prevent zoom on double-tap
      mobileCTALink.style.touchAction = 'manipulation';
      mobileCTALink.style.userSelect = 'none';
      mobileCTALink.style.webkitUserSelect = 'none';
      
      // Handle touch events for mobile
      mobileCTALink.addEventListener('touchend', function(e) {
        const now = new Date().getTime();
        
        // Prevent default to avoid zoom and click conflicts
        e.preventDefault();
        
        // Check if this is a double tap (within 300ms)
        if (now - lastTouchEnd <= 300) {
          // Double tap detected - open in new tab
          e.stopPropagation();
          
          // Add visual feedback
          mobileCTALink.style.transform = 'scale(0.95)';
          mobileCTALink.style.transition = 'transform 0.1s ease';
          
          setTimeout(() => {
            mobileCTALink.style.transform = 'scale(1)';
            // Open in new tab
            window.open('https://www.highestpaid.online/', '_blank');
          }, 100);
          
          lastTouchEnd = 0; // Reset
        } else {
          // Single tap - scroll to enroll section after delay
          setTimeout(() => {
            if (lastTouchEnd === now) { // Make sure no second tap occurred
              document.getElementById('enroll').scrollIntoView({ 
                behavior: 'smooth' 
              });
            }
          }, 300);
          lastTouchEnd = now;
        }
      });

      // Handle regular click events for desktop
      mobileCTALink.addEventListener('click', function(e) {
        // Only handle if not a touch device
        if (!('ontouchstart' in window)) {
          clickCount++;
          
          if (clickCount === 1) {
            // Set timeout for single click
            clickTimeout = setTimeout(() => {
              // Single click: scroll to enroll section (default anchor behavior)
              clickCount = 0;
              // Let the default anchor behavior happen
            }, 300);
          } else if (clickCount === 2) {
            // Double click: prevent default and redirect to external site
            e.preventDefault();
            clearTimeout(clickTimeout);
            clickCount = 0;
            
            // Add visual feedback for double-click
            mobileCTALink.style.transform = 'scale(0.95)';
            mobileCTALink.style.transition = 'transform 0.1s ease';
            
            setTimeout(() => {
              mobileCTALink.style.transform = 'scale(1)';
              // Redirect to the external site
              window.open('https://www.highestpaid.online/', '_blank');
            }, 100);
          }
        }
      });

      // Reset click count after a longer delay for desktop
      mobileCTALink.addEventListener('mouseup', () => {
        if (!('ontouchstart' in window)) {
          setTimeout(() => {
            clickCount = 0;
          }, 500);
        }
      });
    }
  }

  // Initialize mobile CTA functionality
  initMobileCTA();
  
  // Lazy load videos when they come into view
  if ('IntersectionObserver' in window) {
    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const video = entry.target;
          if (video.getAttribute('data-src')) {
            video.src = video.getAttribute('data-src');
            video.removeAttribute('data-src');
          }
          videoObserver.unobserve(video);
        }
      });
    });
    
    videos.forEach(video => {
      videoObserver.observe(video);
    });
  }

  // Hide CTA bar when user scrolls to #form-section
  var ctaBar = document.getElementById('mobile-cta-bar');
  var formSection = document.getElementById('form-section');
  if (ctaBar && formSection) {
    window.addEventListener('scroll', function() {
      var rect = formSection.getBoundingClientRect();
      if (rect.top <= window.innerHeight && rect.bottom >= 0) {
        ctaBar.style.display = 'none';
      } else {
        ctaBar.style.display = '';
      }
    });
  }

  // FAQ Accordion
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);
      var answer = document.getElementById(btn.getAttribute('aria-controls'));
      if (answer) {
        answer.hidden = expanded;
      }
    });
  });

  // Scroll-based animation using IntersectionObserver
  const animatedElements = document.querySelectorAll('.animate');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });
    animatedElements.forEach(el => {
      observer.observe(el);
    });
  } else {
    // Fallback for browsers without IntersectionObserver
    animatedElements.forEach(el => {
      el.classList.add('visible');
    });
  }

  // Countdown Timer
  function startCountdown() {
    // Set deadline - 7 days from now (you can customize this)
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    
    const countdownElement = document.getElementById('countdown-timer');
    if (!countdownElement) return;

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = deadline.getTime() - now;

      if (distance < 0) {
        countdownElement.innerHTML = '<div class="countdown-expired">Enrollment Closed</div>';
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      countdownElement.innerHTML = `
        <div class="countdown-container">
          <div class="countdown-item">
            <span class="countdown-number">${days}</span>
            <span class="countdown-label">Days</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${hours}</span>
            <span class="countdown-label">Hours</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${minutes}</span>
            <span class="countdown-label">Minutes</span>
          </div>
          <div class="countdown-item">
            <span class="countdown-number">${seconds}</span>
            <span class="countdown-label">Seconds</span>
          </div>
        </div>
      `;
    }

    // Update immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // Start countdown when page loads
  startCountdown();

  // CTA Button Animations
  function initCTAAnimations() {
    const ctaButtons = document.querySelectorAll('.cta-button');
    
    ctaButtons.forEach((button, index) => {
      // Add different animations to different buttons
      if (index === 0) {
        // First CTA (hero) gets pulse animation
        button.classList.add('pulse');
      } else if (index === 1) {
        // Second CTA gets flash animation
        button.classList.add('flash');
      } else {
        // Others get bounce (default)
        // Already has bounce from CSS
      }
      
      // Stop animation on hover and restart when mouse leaves
      button.addEventListener('mouseenter', function() {
        this.style.animationPlayState = 'paused';
      });
      
      button.addEventListener('mouseleave', function() {
        this.style.animationPlayState = 'running';
      });
    });
    
    // Add special animation to enrollment CTA
    const enrollCTA = document.querySelector('#enroll .cta-button');
    if (enrollCTA) {
      enrollCTA.classList.add('wiggle');
      
      // Make it extra flashy every 10 seconds
      setInterval(() => {
        enrollCTA.classList.add('flash');
        setTimeout(() => {
          enrollCTA.classList.remove('flash');
        }, 3000);
      }, 10000);
    }
    
    // Add attention-grabbing animation to exit popup CTA
    const exitPopupCTA = document.querySelector('.exit-popup-button');
    if (exitPopupCTA) {
      exitPopupCTA.classList.add('pulse');
    }
  }

  // Initialize CTA animations
  initCTAAnimations();

  // Exit Intent Popup
  let exitIntentShown = false;
  let exitPopupTimer = null;

  function showExitIntentPopup() {
    if (exitIntentShown) return;
    exitIntentShown = true;
    
    const overlay = document.getElementById('exit-intent-overlay');
    overlay.classList.add('show');
    
    // Start 10-minute countdown for the popup offer
    startExitPopupCountdown();
  }

  function hideExitIntentPopup() {
    const overlay = document.getElementById('exit-intent-overlay');
    overlay.classList.remove('show');
    if (exitPopupTimer) {
      clearInterval(exitPopupTimer);
    }
  }

  function startExitPopupCountdown() {
    let timeLeft = 600; // 10 minutes in seconds
    const countdownElement = document.getElementById('exit-popup-countdown');
    
    exitPopupTimer = setInterval(() => {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      countdownElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      timeLeft--;
      
      if (timeLeft < 0) {
        clearInterval(exitPopupTimer);
        hideExitIntentPopup();
      }
    }, 1000);
  }

  // Exit intent detection
  document.addEventListener('mouseleave', function(e) {
    if (e.clientY <= 0) {
      showExitIntentPopup();
    }
  });

  // Mobile exit intent (scroll to top quickly)
  let lastScrollTop = 0;
  window.addEventListener('scroll', function() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop < lastScrollTop && scrollTop < 100 && lastScrollTop > 300) {
      showExitIntentPopup();
    }
    lastScrollTop = scrollTop;
  });

  // Close popup events
  document.addEventListener('click', function(e) {
    const overlay = document.getElementById('exit-intent-overlay');
    const popup = document.querySelector('.exit-popup');
    const closeBtn = document.querySelector('.exit-popup-close');
    
    // Close if clicking overlay or close button
    if (e.target === overlay || e.target === closeBtn) {
      hideExitIntentPopup();
    }
  });

  // Prevent popup from showing again for 24 hours if closed
  const storage = localStorage.getItem('exitIntentShown');
  if (storage && Date.now() - parseInt(storage) < 24 * 60 * 60 * 1000) {
    exitIntentShown = true;
  }

  // Store timestamp when popup is closed
  document.querySelector('.exit-popup-close').addEventListener('click', function() {
    localStorage.setItem('exitIntentShown', Date.now().toString());
  });

  // Escape key closes popup
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hideExitIntentPopup();
    }
  });
});
