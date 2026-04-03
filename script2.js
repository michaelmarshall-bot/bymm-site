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

    //Design Page Logo Spread Hero Logic
    (() => {
        const container = document.querySelector('.hero-section');
        const logos = Array.from(document.querySelectorAll('.floating-logo'));

        if (container && logos.length > 0) {
            const rows = 8; 
            const cols = 8;
            const cells = [];
            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    if (!(r >= 3 && r <= 4 && c >= 2 && c <= 5)) {
                        cells.push({ r, c });
                    }
                }
            }
            const shuffledCells = cells.sort(() => Math.random() - 0.5);
            logos.forEach((logo, index) => {
                if (index >= shuffledCells.length) {
                    logo.style.display = 'none'; 
                    return;
                }
                const { r, c } = shuffledCells[index];
                const jitterTop = (Math.random() * 4) - 2; 
                const jitterLeft = (Math.random() * 4) - 2;
                const top = (r * (100 / rows)) + (100 / rows / 2) + jitterTop;
                const left = (c * (100 / cols)) + (100 / cols / 2) + jitterLeft;
                logo.style.top = `${top}%`;
                logo.style.left = `${left}%`;
                logo.style.transform = `translate(-50%, -50%)`;
            });
        }
    })(); // End Logo Spread

    // --- DESIGN PAGE HERO FLICKER ---
    (() => {
        const heroElements = document.querySelectorAll('.hero-title, .floating-logo, .hero-anim');
        
        // Only proceed if these elements actually exist on the current page
        if (heroElements.length > 0) {
            function triggerRandomFlicker() {
                const nextWait = Math.floor(Math.random() * (18000 - 12000 + 1)) + 12000;

                setTimeout(() => {
                    heroElements.forEach(el => el.classList.add('is-flickering'));

                    setTimeout(() => {
                        heroElements.forEach(el => el.classList.remove('is-flickering'));
                        triggerRandomFlicker(); 
                    }, 1000); 
                }, nextWait);
            }

            // Start the loop
            setTimeout(triggerRandomFlicker, 6000);
        }
    })(); // End Flicker Logic



// Noise Page Logic
   // --- NOISE PAGE LOGIC (Refined Integration) ---
const audio = document.getElementById('audio-player');
const svg = document.getElementById('tapeMachine');

// 1. Debugging Check
if (!audio || !svg) {
    console.error("Tape Machine Error: Missing Elements", { audio, svg });
} else {
    console.log("Tape Machine Initialized: Elements found.");
    
    const ui = {
        playBtn: document.getElementById('play-pause-btn'),
        stopBtn: document.getElementById('stop-btn'),
        skipBtn: document.getElementById('skip-btn'),
        vol: document.getElementById('volume-slider'),
        progress: document.getElementById('progress-bar'),
        playIcon: document.getElementById('play-icon'),
        current: document.getElementById('current-time'),
        duration: document.getElementById('duration')
    };

    const machine = {
        path: svg.querySelector('#Tape'),
        tapeTab: svg.querySelector('#tapeTab'),
        meterL: svg.querySelector('#meterLeft'),
        meterR: svg.querySelector('#meterRight'),
        stopBtnSVG: svg.querySelector('#button13'),
        playBtnsSVG: ['button5', 'button10', 'button12', 'button14'].map(id => svg.querySelector(`#${id}`)),
        faders: Array.from({length: 7}, (_, i) => svg.querySelector(`#fader${i + 1}`)),
        knobs: ['smknob1', 'smknob2', 'smknob3', 'smknob4', 'knob1', 'knob2'].map(id => svg.querySelector(`#${id}`))
    };

    const spools = {
        anti: ['tape1', 'tape2', 'supplyReel', 'spool1', 'spool5'].map(id => svg.querySelector(`#${id}`)),
        clock: ['spool2', 'spool3', 'spool4'].map(id => svg.querySelector(`#${id}`)),
        takeup: svg.querySelector('#takeupReel')
    };

    let audioCtx, analyser, dataArray, source;
    let animationFrameId;
    let tapeStartTime = null;
    let pausedTimeOffset = 0;
    const tapeLoopDuration = 5000;

    const initAudio = () => {
        if (audioCtx) return;
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        source = audioCtx.createMediaElementSource(audio);
        source.connect(analyser);
        analyser.connect(audioCtx.destination);
        analyser.fftSize = 64; 
        dataArray = new Uint8Array(analyser.frequencyBinCount);
    };

    const randomizeHardware = () => {
        machine.knobs.forEach(k => k && (k.style.transform = `rotate(${Math.round(Math.random() * 160 - 80)}deg)`));
        machine.faders.forEach(f => f && (f.style.transform = `translateY(-${(Math.random() * 13.4).toFixed(2)}px)`));
    };

    const resetHardware = (fullStop = false) => {
        machine.faders.forEach(f => f && (f.style.transform = `translateY(0)`));
        machine.playBtnsSVG.forEach(b => b && b.classList.remove('btn-pressed'));
        if (fullStop) {
            if (machine.meterL) machine.meterL.style.transform = `rotate(60deg)`;
            if (machine.meterR) machine.meterR.style.transform = `rotate(-60deg)`;
        }
    };

    const animate = (currentTime) => {
        if (audio.paused) {
            cancelAnimationFrame(animationFrameId);
            return;
        }

        if (!tapeStartTime) tapeStartTime = currentTime - pausedTimeOffset;
        const elapsed = currentTime - tapeStartTime;
        const progress = (elapsed % tapeLoopDuration) / tapeLoopDuration;
        
        const rot = (elapsed / 20) % 360; 
        spools.anti.forEach(el => el && (el.style.transform = `rotate(-${rot}deg)`));
        spools.clock.forEach(el => el && (el.style.transform = `rotate(${rot}deg)`));
        if (spools.takeup) spools.takeup.style.transform = `rotate(-${rot * 1.05}deg)`;

        if (machine.path && machine.tapeTab) {
            const len = machine.path.getTotalLength();
            const dist = len - (progress * len);
            const p = machine.path.getPointAtLength(dist);
            const nextDist = dist - 2 < 0 ? dist + 2 : dist - 2;
            const nextP = machine.path.getPointAtLength(nextDist);
            let angle = Math.atan2(nextP.y - p.y, nextP.x - p.x) * (180 / Math.PI);
            if (dist - 2 < 0) angle += 180;
            const w = parseFloat(machine.tapeTab.getAttribute('width')) || 0;
            const h = parseFloat(machine.tapeTab.getAttribute('height')) || 0;
            machine.tapeTab.setAttribute('transform', `translate(${p.x}, ${p.y}) rotate(${angle + 90}) translate(${-w/2}, ${-h/2})`);
        }

        if (analyser) {
            analyser.getByteFrequencyData(dataArray);
            const avg = dataArray.reduce((a, b) => a + b) / dataArray.length;
            const bounce = (avg / 255) * 120;
            if (machine.meterL) machine.meterL.style.transform = `rotate(${60 + bounce}deg)`;
            if (machine.meterR) machine.meterR.style.transform = `rotate(${-60 - bounce}deg)`;
        }

        animationFrameId = requestAnimationFrame(animate);
    };

    // --- Events ---
    ui.playBtn.addEventListener('click', () => {
        if (audio.paused) {
            initAudio();
            if (audioCtx.state === 'suspended') audioCtx.resume();
            audio.play().then(() => {
                ui.playIcon.className = 'pause-icon';
                machine.playBtnsSVG.forEach(b => b && b.classList.add('btn-pressed'));
                randomizeHardware();
                // Reset sync
                tapeStartTime = null; 
                animationFrameId = requestAnimationFrame(animate);
            }).catch(e => console.error("Playback failed:", e));
        } else {
            audio.pause();
            ui.playIcon.className = 'play-icon';
            // Capture progress to resume smoothly
            pausedTimeOffset = performance.now() - (tapeStartTime || performance.now());
            resetHardware();
        }
    });

    ui.stopBtn.addEventListener('click', () => {
        audio.pause();
        audio.currentTime = 0;
        pausedTimeOffset = 0;
        ui.playIcon.className = 'play-icon';
        resetHardware(true);
        if (machine.stopBtnSVG) {
            machine.stopBtnSVG.classList.add('btn-pressed');
            setTimeout(() => machine.stopBtnSVG.classList.remove('btn-pressed'), 250);
        }
    });

    ui.skipBtn.addEventListener('click', () => {
        audio.currentTime += 10;
        randomizeHardware();
    });

    if (ui.vol) {
        ui.vol.addEventListener('input', (e) => audio.volume = e.target.value);
    }

    // Time Formatter
    const fmt = (s) => {
        if (isNaN(s)) return "0:00";
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec < 10 ? '0' : ''}${sec}`;
    };

    audio.addEventListener('loadedmetadata', () => {
        if (ui.duration) ui.duration.textContent = fmt(audio.duration);
    });

    audio.addEventListener('timeupdate', () => {
        if (ui.progress) ui.progress.value = (audio.currentTime / audio.duration) * 100 || 0;
        if (ui.current) ui.current.textContent = fmt(audio.currentTime);
    });

    if (ui.progress) {
        ui.progress.addEventListener('input', () => {
            audio.currentTime = (ui.progress.value / 100) * audio.duration;
        });
    }
}

});