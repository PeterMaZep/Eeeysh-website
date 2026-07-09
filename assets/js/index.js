(function() {
    // ===== THEME TOGGLE =====
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const themeLabel = document.getElementById('themeLabel');
    let currentTheme = 'dark';

    function setTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'light') {
            themeIcon.className = 'fas fa-sun';
            themeLabel.textContent = 'Light';
        } else {
            themeIcon.className = 'fas fa-moon';
            themeLabel.textContent = 'Dark';
        }
        localStorage.setItem('theme', theme);
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    themeToggle.addEventListener('click', () => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
    });

    // ===== GALLERY DATA =====
    const galleryItems = [
        { 
            title: 'X Post', 
            desc: 'A Figma made UI for X posts', 
            tag: 'gfx',
            img: 'https://i.postimg.cc/RVGBFr7B/Group-50.png'
        },
        { 
            title: 'Modern Shop UI', 
            desc: 'A modern shop UI made using Figma', 
            tag: 'ui',
            img: 'https://i.postimg.cc/bY9XCXFH/Group-43.png'
        },
        { 
            title: 'Stud Style Shop UI', 
            desc: 'A stud-style shop UI made using Figma', 
            tag: 'ui',
            img: 'https://i.postimg.cc/L69cGyrc/Group-44.png'
        },
        { 
            title: 'Calendar UI', 
            desc: 'Calendar UI for daily rewards made using Figma', 
            tag: 'ui',
            img: 'https://i.postimg.cc/YSD0mGQt/Group-49.png'
        },
        { 
            title: 'Shop Button HUD', 
            desc: 'HUD Shop button made using Figma', 
            tag: 'hud',
            img: 'https://i.postimg.cc/dtCbT3g9/Group-54-(1).png'
        }
    ];

    // ===== STORE DATA =====
    const storeItems = [
        { 
            title: 'Basic Obby Kit', 
            desc: 'A Basic Obby Kit built for Roblox Sold on itch.io', 
            status: 'paid',
            img: 'https://i.postimg.cc/3RWyLC3L/image-12.png',
            link: 'https://eeeysh.itch.io/obbykitrobloxstudio'
        },
        { 
            title: 'Free Basic UI Button Pack', 
            desc: 'A free Free Basic UI Buttons Pack sold on itch.io', 
            status: 'free',
            img: 'https://i.postimg.cc/tRnQhrKF/Group-52.png',
            link: 'https://eeeysh.itch.io/basic-ui-buttons-pack'
        },
        { 
            title: 'Pixel Button Pack', 
            desc: 'A paid Pixel Button Pack sold on itch.io', 
            status: 'paid',
            img: 'https://i.postimg.cc/bNFtKwCc/Group-53.png',
            link: 'https://eeeysh.itch.io/pixel-button-pack'
        },
        { 
            title: 'Eeeysh Icon Vector Pack', 
            desc: 'A paid Vector Icon Pack sold on itch.io', 
            status: 'paid',
            img: 'https://i.postimg.cc/DysSYPXm/New-Project.png',
            link: 'https://eeeysh.itch.io/eeeyshvectoricon'
        }
    ];

    // ===== RENDER GALLERY =====
    const galleryGrid = document.getElementById('galleryGrid');
    const storeGrid = document.getElementById('storeGrid');
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCounter = document.getElementById('lightboxCounter');
    let currentIndex = 0;
    let isZoomed = false;

    function renderGallery(filter = 'all') {
        if (!galleryGrid) return;
        const filtered = filter === 'all' ? galleryItems : galleryItems.filter(item => item.tag === filter);
        
        galleryGrid.innerHTML = filtered.map((item, index) => `
            <div class="gallery-item" data-index="${index}" data-tag="${item.tag}">
                <div class="image-container">
                    <img src="${item.img}" alt="${item.title}" loading="lazy" />
                </div>
                <span class="item-tag">${item.tag}</span>
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                openLightbox(index);
            });
        });
    }

    // ===== RENDER STORE =====
    function renderStore(filter = 'all') {
        if (!storeGrid) return;
        const filtered = filter === 'all' ? storeItems : storeItems.filter(item => item.status === filter);
        
        storeGrid.innerHTML = filtered.map((item, index) => `
            <div class="store-item" data-index="${index}" data-status="${item.status}">
                <div class="image-container">
                    <img src="${item.img}" alt="${item.title}" loading="lazy" />
                </div>
                <span class="item-tag ${item.status}">${item.status === 'free' ? 'FREE' : 'PAID'}</span>
                <div class="item-info">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </div>
        `).join('');

        document.querySelectorAll('.store-item').forEach(item => {
            item.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                const storeItem = storeItems[index];
                if (storeItem && storeItem.link) {
                    window.open(storeItem.link, '_blank');
                }
            });
        });
    }

    // ===== LIGHTBOX FUNCTIONS =====
    function openLightbox(index) {
        currentIndex = index;
        const item = galleryItems[index];
        if (!item) return;
        
        lightboxImage.src = item.img;
        lightboxImage.alt = item.title;
        lightboxImage.classList.remove('zoomed');
        isZoomed = false;
        updateCounter();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        lightboxImage.classList.remove('zoomed');
        isZoomed = false;
    }

    function navigateLightbox(direction) {
        const filtered = document.querySelector('.gallery-header .filter-btn.active')?.dataset.filter || 'all';
        const items = filtered === 'all' ? galleryItems : galleryItems.filter(item => item.tag === filtered);
        
        if (items.length === 0) return;
        
        const currentItem = galleryItems[currentIndex];
        let currentFilteredIndex = items.findIndex(item => item.img === currentItem.img);
        if (currentFilteredIndex === -1) currentFilteredIndex = 0;
        
        let newFilteredIndex = currentFilteredIndex + direction;
        if (newFilteredIndex < 0) newFilteredIndex = items.length - 1;
        if (newFilteredIndex >= items.length) newFilteredIndex = 0;
        
        const newItem = items[newFilteredIndex];
        const newGlobalIndex = galleryItems.findIndex(item => item.img === newItem.img);
        if (newGlobalIndex === -1) return;
        
        currentIndex = newGlobalIndex;
        lightboxImage.src = newItem.img;
        lightboxImage.alt = newItem.title;
        lightboxImage.classList.remove('zoomed');
        isZoomed = false;
        updateCounter();
    }

    function updateCounter() {
        const filtered = document.querySelector('.gallery-header .filter-btn.active')?.dataset.filter || 'all';
        const items = filtered === 'all' ? galleryItems : galleryItems.filter(item => item.tag === filtered);
        const currentItem = galleryItems[currentIndex];
        const idx = items.findIndex(item => item.img === currentItem.img) + 1;
        lightboxCounter.textContent = `${idx} / ${items.length}`;
    }

    // ===== FILTER BUTTONS =====
    document.querySelectorAll('.gallery-header .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.gallery-header .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderGallery(this.dataset.filter);
        });
    });

    document.querySelectorAll('.store-header .filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.store-header .filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            renderStore(this.dataset.filter);
        });
    });

    // ===== LIGHTBOX EVENTS =====
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightboxPrev').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(-1);
    });
    document.getElementById('lightboxNext').addEventListener('click', (e) => {
        e.stopPropagation();
        navigateLightbox(1);
    });

    lightbox.addEventListener('click', function(e) {
        if (e.target === this) closeLightbox();
    });

    lightboxImage.addEventListener('click', function(e) {
        e.stopPropagation();
        isZoomed = !isZoomed;
        this.classList.toggle('zoomed', isZoomed);
    });

    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') navigateLightbox(-1);
        if (e.key === 'ArrowRight') navigateLightbox(1);
    });

    // ===== LOAD GALLERY & STORE =====
    renderGallery('all');
    renderStore('all');

    // ===== MAGNETIC BUTTON =====
    const btn = document.getElementById('magneticBtn');
    if (btn) {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            const strength = 14;
            this.style.transform = `translate(${x / strength}px, ${y / strength}px) scale(1.05)`;
        });
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translate(0, 0) scale(1)';
        });
    }

    // ===== PARALLAX TILT =====
    const container = document.querySelector('.glass-container');
    if (container) {
        container.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            const rotateY = x * 2.2;
            const rotateX = y * -2.2;
            this.style.transform = `perspective(1400px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
            this.style.transition = 'transform 0.06s ease-out';
        });
        container.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1400px) rotateX(0deg) rotateY(0deg) scale(1)';
            this.style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        });
    }

    // ===== SPLIT TAGLINE ANIMATION =====
    const tagline = document.querySelector('.tagline-wrapper');
    if (tagline) {
        const html = tagline.innerHTML;
        const words = html.split(/(\s+)/g).map(word => {
            if (word.trim() === '') return word;
            return `<span style="display:inline-block; animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) forwards; animation-delay: ${(Math.random() * 0.5 + 0.1).toFixed(2)}s; opacity:0;">${word}</span>`;
        });
        tagline.innerHTML = words.join('');
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('.nav-links a, .cta-btn[href^="#"]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const navHeight = document.querySelector('.nav-bar').offsetHeight + 20;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

})();
