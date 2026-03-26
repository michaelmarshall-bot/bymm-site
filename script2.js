document.addEventListener('DOMContentLoaded', () => {
    // Footer Year
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Parallax Effects
    const dust = document.querySelector('.dust-overlay');
    const scanlines = document.querySelector('.scanlines');
    const screen = document.getElementById('lcd-screen');

    window.addEventListener('scroll', () => {
        const offset = window.pageYOffset;
        if (dust) dust.style.backgroundPositionY = `${offset * 0.1}px`;
        if (scanlines) scanlines.style.backgroundPositionY = `${offset * 0.6}px`;
    });

    // LCD Interference Flicker (Phosphor hum)
    setInterval(() => {
        if (Math.random() > 0.995 && screen) {
            screen.style.opacity = "0.92";
            setTimeout(() => screen.style.opacity = "1", 40);
        }
    }, 150);

    //Hero Card Click Event
    const card = document.querySelector('.hero-section .card');

    if (card) {
        card.addEventListener('click', (e) => {
            card.classList.toggle('is-active');

            e.stopPropagation(); 
        });
    }

// Testimonial Logic
    const testimonialWrappers = document.querySelectorAll('.testimonial-wrapper');

testimonialWrappers.forEach((wrapper) => {
  const slider = wrapper.querySelector('.slider-container');
  const nextBtn = wrapper.querySelector('.slideArrow.next');
  const prevBtn = wrapper.querySelector('.slideArrow.prev');
  

  if (!slider || !nextBtn || !prevBtn) return;

    // Detect Directional Context
  const style = window.getComputedStyle(slider);
  const isReverse = style.flexDirection === 'row-reverse' || style.direction === 'rtl';
  
    // Context for Bidirectional Drag & Drop
  const directionMultiplier = isReverse ? -1 : 1;

    // Arrow Logic (.is-hidden)
  const updateArrows = () => {
    const scrollLeft = slider.scrollLeft;
    const maxScroll = slider.scrollWidth - slider.clientWidth;
    
    // In 'row-reverse', the "Start" is often the Max Scroll or 0 
    // depending on the browser. This logic normalizes that.
    const isAtStart = isReverse 
      ? Math.abs(scrollLeft) <= 10 
      : scrollLeft <= 10;

    const isAtEnd = isReverse 
      ? Math.abs(scrollLeft) >= maxScroll - 10 
      : scrollLeft >= maxScroll - 10;

    // Toggle visibility based on visual progress
    if (isAtStart) {
      prevBtn.classList.add('is-hidden');
    } else {
      prevBtn.classList.remove('is-hidden');
    }

    if (isAtEnd) {
      nextBtn.classList.add('is-hidden');
    } else {
      nextBtn.classList.remove('is-hidden');
    }
  };

  slider.addEventListener('scroll', updateArrows);
  // Run once on load to set initial state
  setTimeout(updateArrows, 50);

  // Drag-and-Drop (Direction-Aware)
  let isDown = false;
  let startX;
  let scrollLeftState;

  slider.addEventListener('mousedown', (e) => {
    isDown = true;
    slider.style.scrollSnapType = 'none'; 
    startX = e.pageX - slider.offsetLeft;
    scrollLeftState = slider.scrollLeft;
    slider.style.cursor = 'grabbing';
  });

  const stopDragging = () => {
    isDown = false;
    slider.style.cursor = 'grab';
    slider.style.scrollSnapType = 'x mandatory';
  };

  slider.addEventListener('mouseleave', stopDragging);
  slider.addEventListener('mouseup', stopDragging);

  slider.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    
    // Mouse Movement
    const walk = (x - startX) * 2 * directionMultiplier; 
    slider.scrollLeft = scrollLeftState - walk;
  });

  // Click-to-Scroll (Direction-Aware)
  nextBtn.addEventListener('click', () => {
    const slideWidth = slider.querySelector('.slide').offsetWidth;
    slider.scrollBy({ left: slideWidth * directionMultiplier, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    const slideWidth = slider.querySelector('.slide').offsetWidth;
    slider.scrollBy({ left: -slideWidth * directionMultiplier, behavior: 'smooth' });
  });
});

    // Texture Loader
        /*const cards = document.querySelectorAll('.card');
        const totalImages = 48;
        const folderPath = 'assets/textures/grunge/';

        cards.forEach((card, index) => {
            const imageNum = (index % totalImages) + 1;
            const paddedNum = imageNum.toString().padStart(3, '0');
            const imageUrl = `url('${folderPath}${paddedNum}.jpg')`;
            
            // Update the CSS variable on the parent element
            card.style.setProperty('--bg-texture', imageUrl);
        }); */

    //Color Rotator

    // Target the specific elements you want to color
    const evenChildren = document.querySelectorAll('.card');
    const step = 40;

    evenChildren.forEach((el, index) => {
    // Apply a unique hue to each specific child element
    const hue = (index * step) % 360;
    el.style.setProperty('--card-hue', hue);
    });

//DESIGN PAGE

    //Design Page Hero Logic

    const container = document.querySelector('.hero-section');
    const logos = Array.from(document.querySelectorAll('.floating-logo'));

    if (!container || logos.length === 0) return;

    const rows = 8; 
    const cols = 8;
    const cells = [];

    // Rows 3-4 and columns 2-5 excluded to create a clearing for text
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const isTextRow = r >= 3 && r <= 4;
            const isTextCol = c >= 2 && c <= 5;

            if (!(isTextRow && isTextCol)) {
                cells.push({ r, c });
            }
        }
    }

    // 2. Shuffle cells for organic distribution
    const shuffledCells = cells.sort(() => Math.random() - 0.5);

    // 3. Position logos
    logos.forEach((logo, index) => {
        if (index >= shuffledCells.length) {
            logo.style.display = 'none'; 
            return;
        }

        const { r, c } = shuffledCells[index];

        // Small jitter (±3%) keeps it from looking like a perfect table
        // Constrain the random jitter so the logo stays inside its grid cell
        const jitterTop = (Math.random() * 4) - 2; 
        const jitterLeft = (Math.random() * 4) - 2;

        // Apply positions (using the 8x8 grid logic from before)
        const top = (r * (100 / rows)) + (100 / rows / 2) + jitterTop;
        const left = (c * (100 / cols)) + (100 / cols / 2) + jitterLeft;
        
        // Apply position without rotation
        logo.style.top = `${top}%`;
        logo.style.left = `${left}%`;
        logo.style.transform = `translate(-50%, -50%)`;
    });


    //Design Page Hero Flicker Logic
    const hero = document.querySelector('.hero-section');

    function triggerRandomFlicker() {
        // 1. Generate random delay between 12,000ms and 18,000ms
        const nextWait = Math.floor(Math.random() * (18000 - 12000 + 1)) + 12000;

        setTimeout(() => {
            // 2. Start the flicker
            hero.classList.add('is-flickering');

            // 3. Stop it after 1 second
            setTimeout(() => {
                hero.classList.remove('is-flickering');
                // 4. Repeat the cycle
                triggerRandomFlicker();
            }, 1000); 

        }, nextWait);
    }

    // Start the loop after your initial 6s load animation finishes
    setTimeout(triggerRandomFlicker, 6000);

});