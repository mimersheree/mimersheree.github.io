let projectCards;
let projectObserver;

function toggleMenu() {
    const menu = document.querySelector(".menu-links");
    const icon = document.querySelector(".hamburger-icon");
    menu.classList.toggle("open");
    icon.classList.toggle("open"); // Opens and closes hamburger icon menu
}

// Project card transitions
function restartProjectCardsTransition() {
    if (projectCards && projectObserver) {
        projectCards.forEach(card => {
            projectObserver.unobserve(card);
            card.classList.remove('is-visible');
            card.style.removeProperty('--animation-delay');
            card.offsetHeight;
        });

        requestAnimationFrame(() => {
            setTimeout(() => {
                projectCards.forEach(card => {
                    projectObserver.observe(card);
                });
            }, 50);
        });
    }
}

// Scroll up button
const scrollBtn = document.getElementById('scrollUpBtn');
let isAtTop = true; 
let hasTriggeredRestart = false; 

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const threshold = window.innerHeight / 2;

    if (scrollY > threshold) {
        scrollBtn.classList.add('show');
    } else {
        scrollBtn.classList.remove('show');
    }

    if (scrollY <= 10 && !isAtTop && !hasTriggeredRestart) { 
        isAtTop = true;
        hasTriggeredRestart = true;

        setTimeout(() => {
            restartProjectCardsTransition();
        }, 100);

        setTimeout(() => {
            hasTriggeredRestart = false;
        }, 1500);
    } else if (scrollY > 100) { 
        isAtTop = false;
    }
});

scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        restartProjectCardsTransition();
    }, 800); s
});

let scrollTimeout;
function handleScrollEnd() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        if (window.scrollY === 0) {
            restartProjectCardsTransition();
        }
    }, 150);
}


// Bubble animations 
document.addEventListener('DOMContentLoaded', function() {
    const bubbles = document.querySelectorAll('.bubble');
    const heroSection = document.querySelector('.hero');
    let touchStartTime = 0;
    let originalPositions = [];

    function initializeBubbles() {
        bubbles.forEach((bubble, index) => {
            const computedStyle = window.getComputedStyle(bubble);
            originalPositions[index] = {
                top: computedStyle.top,
                left: computedStyle.left,
                right: computedStyle.right
            };
            
            randomizeBubblePosition(bubble, index);
            
            const randomDelay = Math.random() * -6; 
            bubble.style.animationDelay = `${randomDelay}s`;
        });
    }

    function randomizeBubblePosition(bubble, index) {
        const heroRect = heroSection.getBoundingClientRect();
        const bubbleSize = bubble.offsetWidth || 100; 
        
        const maxTop = Math.max(0, heroRect.height - bubbleSize - 50);
        const maxLeft = Math.max(0, heroRect.width - bubbleSize - 50);
        
        const randomTop = Math.random() * maxTop;
        const randomLeft = Math.random() * maxLeft;
        
        const topPercent = (randomTop / heroRect.height) * 100;
        const leftPercent = (randomLeft / heroRect.width) * 100;
        
        bubble.style.top = `${Math.min(Math.max(topPercent, 5), 85)}%`;
        bubble.style.left = `${Math.min(Math.max(leftPercent, 5), 85)}%`;
        bubble.style.right = 'auto'; 
    }

    function createHoverMovement(bubble) {
        let isHovering = false;
        let animationId;
        
        function smoothMove() {
            if (!isHovering || bubble.classList.contains('floating-away')) return;
            
            const currentTime = Date.now() * 0.001; 
            const moveX = Math.sin(currentTime * 2) * 15; 
            const moveY = Math.cos(currentTime * 1.5) * 10; 
            
            bubble.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;
            animationId = requestAnimationFrame(smoothMove);
        }
        
        bubble.addEventListener('mouseenter', function() {
            if (!this.classList.contains('floating-away')) {
                isHovering = true;
                this.style.animationPlayState = 'paused';
                this.style.transition = 'transform 0.3s ease-out';
                smoothMove();
            }
        });

        bubble.addEventListener('mouseleave', function() {
            if (!this.classList.contains('floating-away')) {
                isHovering = false;
                cancelAnimationFrame(animationId);
                this.style.animationPlayState = 'running';
                this.style.transform = '';
                this.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }
        });
    }

    // Set up bubble interactions
    bubbles.forEach((bubble, index) => {
        createHoverMovement(bubble);

        bubble.addEventListener('click', function(e) {
            e.preventDefault();
            floatAway(this, index);
        });

        bubble.addEventListener('touchstart', function(e) {
            e.preventDefault();
            touchStartTime = Date.now();
            if (!this.classList.contains('floating-away')) {
                this.style.animationPlayState = 'paused';
                this.style.transform = 'scale(1.1)';
            }
        });

        bubble.addEventListener('touchend', function(e) {
            e.preventDefault();
            const touchDuration = Date.now() - touchStartTime;
            
            if (touchDuration < 500 && !this.classList.contains('floating-away')) {
                floatAway(this, index);
            } else if (!this.classList.contains('floating-away')) {
                this.style.animationPlayState = 'running';
                this.style.transform = '';
            }
        });

        bubble.addEventListener('touchcancel', function(e) {
            e.preventDefault();
            if (!this.classList.contains('floating-away')) {
                this.style.animationPlayState = 'running';
                this.style.transform = '';
            }
        });
    });

    function floatAway(bubble, index) {
        if (bubble.classList.contains('floating-away')) return;

        bubble.classList.add('floating-away');
        bubble.style.animationPlayState = 'paused';
        
        bubble.style.transform = 'scale(1.2) translateY(-30px)';
        bubble.style.transition = 'all 0.3s ease-out';

        setTimeout(() => {
            bubble.style.transform = 'translateY(-100vh) scale(0.8)';
            bubble.style.transition = 'all 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        }, 300);

        setTimeout(() => {
            respawnBubble(bubble, index);
        }, 2500);
    }

    function respawnBubble(bubble, index) {
        bubble.classList.remove('floating-away');
        bubble.style.transform = '';
        bubble.style.opacity = '0';
        bubble.style.transition = 'opacity 1s ease-in-out';
        bubble.style.animationPlayState = 'running';

        randomizeBubblePosition(bubble, index);

        setTimeout(() => {
            bubble.style.opacity = '1';
            
            setTimeout(() => {
                bubble.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
            }, 1000);
        }, 100);
    }
    
    document.addEventListener('visibilitychange', function() {
        bubbles.forEach(bubble => {
            if (document.hidden) {
                bubble.style.animationPlayState = 'paused';
            } else if (!bubble.classList.contains('floating-away')) {
                bubble.style.animationPlayState = 'running';
            }
        });
    });

    window.addEventListener('resize', function() {
        setTimeout(() => {
            bubbles.forEach((bubble, index) => {
                if (!bubble.classList.contains('floating-away')) {
                    randomizeBubblePosition(bubble, index);
                }
            });
        }, 100);
    });

    initializeBubbles();

    setInterval(() => {
        bubbles.forEach((bubble, index) => {
            if (!bubble.classList.contains('floating-away') && Math.random() < 0.3) {
                bubble.style.transition = 'all 2s ease-in-out';
                randomizeBubblePosition(bubble, index);
                
                setTimeout(() => {
                    bubble.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }, 2000);
            }
        });
    }, 15000); 
});

    // Cursor interactions 
     document.addEventListener('DOMContentLoaded', function() {
            const customCursor = document.getElementById('customCursor');
            const projects = document.querySelectorAll('.project');
            let isOverProject = false;
            
            document.addEventListener('mousemove', function(e) {
                customCursor.style.left = e.clientX + 'px';
                customCursor.style.top = e.clientY + 'px';
            });
            
            projects.forEach(project => {
                project.addEventListener('mouseenter', function() {
                    isOverProject = true;
                    customCursor.classList.add('active');
                    document.body.style.cursor = 'none';
                });
                
                project.addEventListener('mouseleave', function() {
                    isOverProject = false;
                    customCursor.classList.remove('active');
                    document.body.style.cursor = 'default';
                });
            });
            
            document.addEventListener('mouseleave', function() {
                customCursor.classList.remove('active');
                document.body.style.cursor = 'default';
            });
            
            document.addEventListener('mouseenter', function() {
                if (isOverProject) {
                    customCursor.classList.add('active');
                    document.body.style.cursor = 'none';
                }
            });
            
            projects.forEach(project => {
                project.addEventListener('click', function() {
                    customCursor.style.transform = 'translate(-50%, -50%) scale(1.2)';
                    setTimeout(() => {
                        customCursor.style.transform = 'translate(-50%, -50%) scale(1)';
                    }, 150);
                    
                    console.log('Project clicked:', this.querySelector('h3').textContent);
                });
            });
        });

       // Project cards 
document.addEventListener('DOMContentLoaded', function() {
    projectCards = document.querySelectorAll('.project'); 

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    projectObserver = new IntersectionObserver((entries, observer) => { 
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    projectCards.forEach(card => {
        projectObserver.observe(card);
    });
});

    // Chatbot
 document.addEventListener('DOMContentLoaded', function() {
    const chatbotContainer = document.querySelector('.chatbot-avatar-container');
    const chatbotBubble = chatbotContainer ? chatbotContainer.querySelector('.chatbot-bubble') : null;
    const chatbotAvatar = chatbotContainer ? chatbotContainer.querySelector('.chatbot-avatar') : null;  

    const prompts = [
        "hi, hello! ✨",
        "how are ya? ( ˵ •̀ ᴗ •́˵)",
        "have a great day! 🐰",
        "smile! because it's worth it 😄",
        "did you drink water today? ₍ᐢ. ̫ .ᐢ₎",
        "thanks for coming! ⸜(｡˃ ᵕ ˂ )⸝",
        "just a lil bun cheering you on 🍓",
        "hope you're having a great time! 🫶🏻"
    ];

    if (chatbotContainer && chatbotBubble && chatbotAvatar) { 
        let lastPromptIndex = -1; 

        function getRandomPrompt() {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * prompts.length);
            } while (randomIndex === lastPromptIndex && prompts.length > 1);
            lastPromptIndex = randomIndex;
            return prompts[randomIndex];
        }

        chatbotContainer.addEventListener('mouseenter', function() {
            if (chatbotBubble.textContent === '') { 
                chatbotBubble.textContent = getRandomPrompt();
            }
        });

        chatbotContainer.addEventListener('click', function() {
            chatbotBubble.textContent = getRandomPrompt();
            chatbotBubble.style.opacity = '1';
            chatbotBubble.style.visibility = 'visible';

             chatbotAvatar.classList.remove('bounce-animation');  
            void chatbotAvatar.offsetWidth;  
            chatbotAvatar.classList.add('bounce-animation');  
        });

        chatbotAvatar.addEventListener('animationend', () => {
            chatbotAvatar.classList.remove('bounce-animation');
        });
    }
});

// Music list 
document.addEventListener('DOMContentLoaded', function() {
    const spotifyPlayButton = document.getElementById('spotifyPlayButton');
    const musicNoteImageWrapper = document.querySelector('.music-image-wrapper');
    const musicListItem = document.querySelector('.music-list li[data-song="zombie-pop"]');

    const spotifySongLink = 'https://open.spotify.com/track/5zhMMVw097YOSvT0oDGgDV?si=12b1151ed25d43f7';

    function openSpotify() {
        if (!spotifyPlayButton || !musicNoteImageWrapper) return;

        spotifyPlayButton.style.transform = 'translate(-50%, -50%) scale(1.2)';
        spotifyPlayButton.classList.add('playing');

        setTimeout(() => {
            if (musicNoteImageWrapper.matches(':hover')) {
                spotifyPlayButton.style.transform = 'translate(-50%, -50%) scale(1.05) rotate(5deg)';
            } else {
                spotifyPlayButton.style.transform = 'translate(-50%, -50%) scale(1)';
            }
        }, 150);

        window.open(spotifySongLink, '_blank');

        if (musicListItem) {
            musicListItem.classList.add('playing');
            setTimeout(() => {
                musicListItem.classList.remove('playing');
            }, 3000);
        }
    }

    if (spotifyPlayButton) {
        spotifyPlayButton.addEventListener('click', openSpotify);
    }
});

// Dark Mode
const themeToggle = document.getElementById('checkbox');
const body = document.body;

function setTheme(isDark) {
    if (isDark) {
        body.classList.add('dark-theme');
        themeToggle.checked = true; 
    } else {
        body.classList.remove('dark-theme');
        themeToggle.checked = false; 
    }
}

setTheme(false);

if (themeToggle) {
    themeToggle.addEventListener('change', () => {
        setTheme(themeToggle.checked);
    });
}
