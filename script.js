document.addEventListener('DOMContentLoaded', () => {
    // Homepage infinite scroll image gallery
    const scrollContainer = document.getElementById('homepage-scroll-container');
    const scrollInner = document.getElementById('homepage-scroll-inner');

    if (scrollContainer && scrollInner) {
        // Pre-defined image sets - each set is used for one screen, no overlapping
        const imageSets = [
            ['images/2.jpg', 'images/9.jpg', 'images/17.jpg'],  // Original first screen
            ['images/1.jpg', 'images/5.jpg', 'images/12.jpg'],
            ['images/3.jpg', 'images/8.jpg', 'images/14.jpg'],
            ['images/11.jpg', 'images/4.jpg', 'images/18.jpg'],  // Moved 4.jpg to position 2
            ['images/6.jpg', 'images/10.jpg', 'images/21.png'],
            ['images/7.png', 'images/20.jpg', 'images/13.jpg'],  // Moved 20.jpg to position 2
            ['images/16.jpg', 'images/2.jpg', 'images/5.jpg'],
        ];

        // Image captions mapping
        const imageCaptions = {
            'images/1.jpg': 'עדי עובדיה, ׳פונט קונצ\'רטו׳, פרויקט גמר, המחלקה לתקשורת חזותית, 2024.',
            'images/2.jpg': '\'Blubbles\', פרויקט הגמר של דליק סמקאי, 2020',
            'images/3.jpg': '\'מה שנגזר החוצה מְעַלַּק, כתב ספרדי רהוט\', פרויקט הגמר של אלה יהודאי, 2020',
            'images/4.jpg': '\'Being\', פרויקט הגמר של מתי קלטר, 2020',
            'images/5.jpg': 'אור כחלון, \'בוטוקרטיה\', פרויקט גמר, 2023',
            'images/6.jpg': 'צילום: יובל נאור',
            'images/7.png': 'פריים מתוך פרויקט הגמר של תומר קציר, 2020',
            'images/8.jpg': 'מתוך שבוע הגשות במחלקה.',
            'images/9.jpg': 'צילום: יובל נאור',
            'images/10.jpg': 'מתוך שבוע הגשות במחלקה.',
            'images/11.jpg': '\'סינטיפייטר\', פרויקט הגמר של מיכאל ברזילאי, מתוך תערוכת הבוגרים 2019',
            'images/12.jpg': 'מתוך כנס המשחקים הבינלאומי.',
            'images/13.jpg': 'מתוך כנס המשחקים הבינלאומי.',
            'images/14.jpg': 'בניה המר, וימפל: גופן גלותי חדש, פרויקט גמר, 2023',
            'images/16.jpg': 'צילום: נעם דבל',
            'images/17.jpg': 'שי פיגל, פרנקנשטיין; או, פרומתיאוס המודרני, פרויקט גמר, 2023',
            'images/18.jpg': 'עדי עובדיה, ׳פונט קונצ\'רטו׳, פרויקט גמר, המחלקה לתקשורת חזותית, 2024.',
            'images/20.jpg': 'פיטר יעקב מלץ',
            'images/21.png': 'זוכי התחרות לשנת 2025 בקטגוריית פרויקטי גמר',
        };

        const totalSets = imageSets.length;

        // Create an image wrapper with the original structure
        function createImageWrapper(imageSrc, wrapperClass = '') {
            const wrapper = document.createElement('div');
            wrapper.className = 'image-wrapper' + (wrapperClass ? ' ' + wrapperClass : '');

            const gradientImg = document.createElement('img');
            gradientImg.src = imageSrc;
            gradientImg.alt = '';
            gradientImg.className = 'gradient-map-image';

            const originalImg = document.createElement('img');
            originalImg.src = imageSrc;
            originalImg.alt = '';
            originalImg.className = 'original-image';

            const caption = document.createElement('div');
            caption.className = 'image-caption';
            caption.textContent = imageCaptions[imageSrc] || '';

            wrapper.appendChild(gradientImg);
            wrapper.appendChild(originalImg);
            wrapper.appendChild(caption);

            // Add hover effect
            wrapper.addEventListener('mouseenter', () => {
                gradientImg.style.opacity = '0';
                originalImg.style.opacity = '1';
                caption.style.opacity = '1';
            });

            wrapper.addEventListener('mouseleave', () => {
                gradientImg.style.opacity = '1';
                originalImg.style.opacity = '0';
                caption.style.opacity = '0';
            });

            // Add click handler for lightbox
            wrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                // Open lightbox with this image
                const lightboxOverlay = document.querySelector('.lightbox-overlay');
                const lightboxImage = document.querySelector('.lightbox-image');
                const lightboxCaption = document.querySelector('.lightbox-caption');
                if (lightboxOverlay && lightboxImage) {
                    lightboxImage.src = imageSrc;
                    lightboxCaption.textContent = imageCaptions[imageSrc] || '';
                    lightboxOverlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });

            return wrapper;
        }

        // Create a screen with 3 images using a specific image set
        function createScreen(setIndex) {
            const screen = document.createElement('div');
            screen.className = 'homepage-screen';

            const images = imageSets[setIndex % totalSets];

            // Create the 3 image wrappers with original position classes
            screen.appendChild(createImageWrapper(images[0], ''));
            screen.appendChild(createImageWrapper(images[1], 'image-wrapper-2'));
            screen.appendChild(createImageWrapper(images[2], 'image-wrapper-3'));

            return screen;
        }

        // Update images in a screen
        function updateScreenImages(screen, setIndex) {
            const images = imageSets[setIndex % totalSets];
            const wrappers = screen.element.querySelectorAll('.image-wrapper');
            wrappers.forEach((wrapper, i) => {
                const gradientImg = wrapper.querySelector('.gradient-map-image');
                const originalImg = wrapper.querySelector('.original-image');
                if (gradientImg) gradientImg.src = images[i];
                if (originalImg) originalImg.src = images[i];
            });
        }

        // Track screens and scroll position
        let screens = [];
        let scrollY = 0;
        const screenHeight = scrollContainer.clientHeight;
        const screenGap = 100; // Gap between screens in pixels
        const screenWithGap = screenHeight + screenGap;
        const numScreens = 5; // Total number of screen elements to cycle through

        // Initialize with screens
        function initScreens() {
            for (let i = 0; i < numScreens; i++) {
                const screen = createScreen(i);
                screen.dataset.index = i;
                scrollInner.appendChild(screen);
                screens.push({ element: screen, position: i, setIndex: i });
            }
            updateScreenPositions();
        }

        // Update screen positions based on scroll (infinite loop)
        function updateScreenPositions() {
            const offset = scrollY % screenWithGap;
            const currentScreenIndex = Math.floor(scrollY / screenWithGap);

            screens.forEach((screen, i) => {
                // Calculate which position this screen should be at
                let relativePos = screen.position - currentScreenIndex;

                // Wrap around for infinite scroll
                while (relativePos < -1) {
                    relativePos += numScreens;
                    screen.position += numScreens;
                    screen.setIndex = screen.position % totalSets;
                    updateScreenImages(screen, screen.setIndex);
                }
                while (relativePos >= numScreens - 1) {
                    relativePos -= numScreens;
                    screen.position -= numScreens;
                    screen.setIndex = ((screen.position % totalSets) + totalSets) % totalSets;
                    updateScreenImages(screen, screen.setIndex);
                }

                // Position the screen with gap
                const yPos = relativePos * screenWithGap - offset;
                screen.element.style.transform = `translateY(${yPos}px)`;
            });
        }

        // Handle wheel events for scrolling (infinite loop in both directions)
        document.addEventListener('wheel', (e) => {
            // Only handle if on homepage (not inner-page)
            if (!document.body.classList.contains('inner-page')) {
                scrollY += e.deltaY;

                // Allow infinite scrolling - wrap around when going too far negative
                const totalHeight = totalSets * screenWithGap;
                if (scrollY < 0) {
                    scrollY += totalHeight;
                    // Update all screen positions
                    screens.forEach(screen => {
                        screen.position += totalSets;
                    });
                }

                updateScreenPositions();
                e.preventDefault();
            }
        }, { passive: false });

        // Initialize
        initScreens();
    }

    // Image hover effect - handle all image wrappers
    const imageWrappers = document.querySelectorAll('.image-wrapper, .page-image-wrapper, .page-section-image-wrapper, .staff-head-image-wrapper, .guidelines-image-wrapper');
    imageWrappers.forEach(wrapper => {
        const gradientImage = wrapper.querySelector('.gradient-map-image');
        const originalImage = wrapper.querySelector('.original-image');
        const caption = wrapper.querySelector('.image-caption');

        wrapper.addEventListener('mouseenter', () => {
            if (gradientImage) gradientImage.style.opacity = '0';
            if (originalImage) originalImage.style.opacity = '1';
            if (caption) caption.style.opacity = '1';
        });

        wrapper.addEventListener('mouseleave', () => {
            if (gradientImage) gradientImage.style.opacity = '1';
            if (originalImage) originalImage.style.opacity = '0';
            if (caption) caption.style.opacity = '0';
        });

        // Add click handler for lightbox
        wrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            // Get the image src from the original image
            const imgSrc = originalImage ? originalImage.src : (gradientImage ? gradientImage.src : '');
            const captionText = caption ? caption.textContent : '';

            // Open lightbox
            const lightboxOverlay = document.querySelector('.lightbox-overlay');
            const lightboxImage = document.querySelector('.lightbox-image');
            const lightboxCaption = document.querySelector('.lightbox-caption');
            if (lightboxOverlay && lightboxImage && imgSrc) {
                lightboxImage.src = imgSrc;
                lightboxCaption.textContent = captionText;
                lightboxOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    // Page transition handling
    const navLinks = document.querySelectorAll('.nav-link, .page-header-link');
    const isOnInnerPage = document.body.classList.contains('inner-page');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            const isGoingToInnerPage = href.includes('.html') && href !== 'index.html';

            animatePageTransition(isGoingToInnerPage, href);
        });
    });

    function animatePageTransition(toInnerPage, href) {
        const content = document.querySelector('.content');
        const plusGrid = document.querySelector('.plus-grid');
        const topRuler = document.querySelector('.ruler-top');
        const leftRuler = document.querySelector('.ruler-left');
        const rightRuler = document.querySelector('.ruler-right');
        const bottomRuler = document.querySelector('.ruler-bottom');
        const homepageScroll = document.querySelector('.homepage-scroll-container');

        // Check if transitioning between two inner pages (same grid layout)
        const isInnerToInner = isOnInnerPage && toInnerPage;

        // For inner-to-inner transitions, just fade content (no ruler animation needed)
        if (isInnerToInner) {
            if (content) {
                content.style.transition = 'opacity 0.3s ease-in-out';
                content.style.opacity = '0';
            }

            sessionStorage.setItem('pageTransition', 'inner-to-inner');
            setTimeout(() => {
                window.location.href = href;
            }, 320);
            return;
        }

        // For homepage <-> inner page transitions
        // Store which direction we're going
        sessionStorage.setItem('pageTransition', toInnerPage ? 'to-inner' : 'to-homepage');

        // Fade out content and gallery
        if (content) {
            content.style.transition = 'opacity 0.3s ease-in-out';
            content.style.opacity = '0';
        }
        if (homepageScroll) {
            homepageScroll.style.transition = 'opacity 0.3s ease-in-out';
            homepageScroll.style.opacity = '0';
        }

        // Fade out plus grid
        if (plusGrid) {
            plusGrid.style.transition = 'opacity 0.3s ease-in-out';
            plusGrid.style.opacity = '0';
        }

        // For both directions: just fade out rulers (animation happens on enter)
        if (topRuler) {
            topRuler.style.transition = 'opacity 0.3s ease-in-out';
            topRuler.style.opacity = '0';
        }
        if (leftRuler) {
            leftRuler.style.transition = 'opacity 0.3s ease-in-out';
            leftRuler.style.opacity = '0';
        }
        if (rightRuler) {
            rightRuler.style.transition = 'opacity 0.3s ease-in-out';
            rightRuler.style.opacity = '0';
        }
        if (bottomRuler) {
            bottomRuler.style.transition = 'opacity 0.3s ease-in-out';
            bottomRuler.style.opacity = '0';
        }

        setTimeout(() => {
            window.location.href = href;
        }, 320);
    }


    // Page enter animation - smooth fade in when coming from another page
    function animatePageEnter() {
        const transitionType = sessionStorage.getItem('pageTransition');
        if (!transitionType) return;

        sessionStorage.removeItem('pageTransition');

        // Get elements to animate in
        const content = document.querySelector('.content');
        const plusGrid = document.querySelector('.plus-grid');
        const topRuler = document.querySelector('.ruler-top');
        const leftRuler = document.querySelector('.ruler-left');
        const rightRuler = document.querySelector('.ruler-right');
        const bottomRuler = document.querySelector('.ruler-bottom');
        const homepageScroll = document.querySelector('.homepage-scroll-container');
        const borderFrame = document.querySelector('.border-frame');

        // Check transition direction
        const arrivingAtHomepage = transitionType === 'to-homepage';
        const arrivingAtInner = transitionType === 'to-inner';
        const isInnerToInner = transitionType === 'inner-to-inner';
        const currentIsHomepage = !document.body.classList.contains('inner-page');
        const currentIsInner = document.body.classList.contains('inner-page');

        // For inner-to-inner transitions, rulers are identical - no animation needed
        // Just remove the transitioning class immediately to show rulers
        if (isInnerToInner) {
            document.documentElement.classList.remove('page-transitioning');
            // Just fade in the content
            if (content) {
                content.style.opacity = '0';
                content.style.transition = 'none';
                document.body.offsetHeight; // Force reflow
                requestAnimationFrame(() => {
                    content.style.transition = 'opacity 0.4s ease-out';
                    content.style.opacity = '1';
                });
            }
            return;
        }

        // Get ruler dimensions
        const rulerWidth = topRuler ? topRuler.getBoundingClientRect().width : 0;
        const rulerHeight = leftRuler ? leftRuler.getBoundingClientRect().height : 0;

        // Start content and other elements hidden
        if (content) {
            content.style.opacity = '0';
            content.style.transition = 'none';
        }
        if (homepageScroll) {
            homepageScroll.style.opacity = '0';
            homepageScroll.style.transition = 'none';
        }
        if (plusGrid) {
            plusGrid.style.opacity = '0';
            plusGrid.style.transition = 'none';
        }
        if (borderFrame) {
            borderFrame.style.opacity = '0';
            borderFrame.style.transition = 'none';
        }
        if (bottomRuler) {
            bottomRuler.style.opacity = '0';
            bottomRuler.style.transition = 'none';
        }

        // For arriving at homepage: position numbers at their "inner page" positions
        // and hide the extra numbers that didn't exist on inner page
        if (arrivingAtHomepage && currentIsHomepage) {
            // Homepage has 31 top numbers, inner page had 16
            // Homepage has 16 side numbers, inner page had 11
            const innerTopCount = 16;
            const innerSideCount = 11;
            const homepageTopCount = 31;
            const homepageSideCount = 16;

            // Position top ruler numbers
            if (topRuler) {
                const topSpans = topRuler.querySelectorAll('span');
                // Calculate where number 15 would be on inner page (the "edge" where new numbers emerge from)
                const number15HomepageRatio = 15 / (homepageTopCount - 1);
                const number15InnerRatio = 15 / (innerTopCount - 1); // = 1.0 (left edge)
                const number15Offset = (number15HomepageRatio - number15InnerRatio) * rulerWidth;

                topSpans.forEach((span, i) => {
                    if (i < innerTopCount) {
                        // Numbers that existed on inner page - start at their inner page positions
                        const homepageRatio = i / (homepageTopCount - 1);
                        const innerRatio = i / (innerTopCount - 1);
                        // Start offset: where it would be on inner page relative to homepage position
                        const startOffset = (homepageRatio - innerRatio) * rulerWidth;
                        span.style.transform = `translateX(${startOffset}px)`;
                        span.style.transition = 'none';
                        span.style.opacity = '1';
                    } else {
                        // New numbers (16-30) - start at position of number 15 and slide out
                        // They emerge from where the last inner page number is
                        const homepageRatio = i / (homepageTopCount - 1);
                        // Start all new numbers at roughly where number 15 ends up
                        const startOffset = number15Offset;
                        span.style.transform = `translateX(${startOffset}px)`;
                        span.style.opacity = '0';
                        span.style.transition = 'none';
                    }
                });
            }

            // Position left ruler numbers
            if (leftRuler) {
                const leftSpans = leftRuler.querySelectorAll('span');
                // Calculate where number 10 would be (last inner page number)
                const number10HomepageRatio = 10 / (homepageSideCount - 1);
                const number10InnerRatio = 10 / (innerSideCount - 1); // = 1.0 (bottom)
                const number10Offset = (number10InnerRatio - number10HomepageRatio) * rulerHeight;

                leftSpans.forEach((span, i) => {
                    if (i < innerSideCount) {
                        const homepageRatio = i / (homepageSideCount - 1);
                        const innerRatio = i / (innerSideCount - 1);
                        const startOffset = (innerRatio - homepageRatio) * rulerHeight;
                        span.style.transform = `translateY(${startOffset}px)`;
                        span.style.transition = 'none';
                        span.style.opacity = '1';
                    } else {
                        // New numbers start at position of number 10
                        span.style.transform = `translateY(${number10Offset}px)`;
                        span.style.opacity = '0';
                        span.style.transition = 'none';
                    }
                });
            }

            // Position right ruler numbers
            if (rightRuler) {
                const rightSpans = rightRuler.querySelectorAll('span');
                const number10HomepageRatioR = 10 / (homepageSideCount - 1);
                const number10InnerRatioR = 10 / (innerSideCount - 1);
                const number10OffsetR = (number10InnerRatioR - number10HomepageRatioR) * rulerHeight;

                rightSpans.forEach((span, i) => {
                    if (i < innerSideCount) {
                        const homepageRatio = i / (homepageSideCount - 1);
                        const innerRatio = i / (innerSideCount - 1);
                        const startOffset = (innerRatio - homepageRatio) * rulerHeight;
                        span.style.transform = `translateY(${startOffset}px)`;
                        span.style.transition = 'none';
                        span.style.opacity = '1';
                    } else {
                        // New numbers start at position of number 10
                        span.style.transform = `translateY(${number10OffsetR}px)`;
                        span.style.opacity = '0';
                        span.style.transition = 'none';
                    }
                });
            }
        } else if (arrivingAtInner && currentIsInner) {
            // Arriving at inner page from homepage
            // Inner page has 16 top numbers (0-15), homepage had 31
            // Inner page has 11 side numbers (0-10), homepage had 16
            const innerTopCount = 16;
            const innerSideCount = 11;
            const homepageTopCount = 31;
            const homepageSideCount = 16;

            // Position top ruler numbers at their "homepage" positions (more compressed)
            if (topRuler) {
                const topSpans = topRuler.querySelectorAll('span');
                topSpans.forEach((span, i) => {
                    // Start at homepage position relative to inner position
                    const innerRatio = i / (innerTopCount - 1);
                    const homepageRatio = i / (homepageTopCount - 1);
                    const startOffset = (homepageRatio - innerRatio) * rulerWidth;
                    span.style.transform = `translateX(${startOffset}px)`;
                    span.style.transition = 'none';
                    span.style.opacity = '1';
                });
            }

            // Position left ruler numbers
            if (leftRuler) {
                const leftSpans = leftRuler.querySelectorAll('span');
                leftSpans.forEach((span, i) => {
                    const innerRatio = i / (innerSideCount - 1);
                    const homepageRatio = i / (homepageSideCount - 1);
                    const startOffset = (homepageRatio - innerRatio) * rulerHeight;
                    span.style.transform = `translateY(${startOffset}px)`;
                    span.style.transition = 'none';
                    span.style.opacity = '1';
                });
            }

            // Position right ruler numbers
            if (rightRuler) {
                const rightSpans = rightRuler.querySelectorAll('span');
                rightSpans.forEach((span, i) => {
                    const innerRatio = i / (innerSideCount - 1);
                    const homepageRatio = i / (homepageSideCount - 1);
                    const startOffset = (homepageRatio - innerRatio) * rulerHeight;
                    span.style.transform = `translateY(${startOffset}px)`;
                    span.style.transition = 'none';
                    span.style.opacity = '1';
                });
            }
        } else {
            // For other transitions, just hide rulers
            if (topRuler) topRuler.style.opacity = '0';
            if (leftRuler) leftRuler.style.opacity = '0';
            if (rightRuler) rightRuler.style.opacity = '0';
        }

        // Force reflow to ensure transforms are applied
        document.body.offsetHeight;

        // Use double requestAnimationFrame to ensure styles are committed before revealing
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Now remove the transitioning class (after transforms are fully applied)
                document.documentElement.classList.remove('page-transitioning');

                if (arrivingAtHomepage && currentIsHomepage) {
                // Animate ruler numbers to their natural positions
                const innerTopCount = 16;
                const innerSideCount = 11;

                if (topRuler) {
                    const topSpans = topRuler.querySelectorAll('span');
                    topSpans.forEach((span, i) => {
                        if (i < innerTopCount) {
                            // Existing numbers - animate to natural position
                            span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                            span.style.transform = 'translateX(0)';
                        } else {
                            // New numbers - slide in AND fade in simultaneously
                            span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                            span.style.transform = 'translateX(0)';
                            span.style.opacity = '1';
                        }
                    });
                }

                if (leftRuler) {
                    const leftSpans = leftRuler.querySelectorAll('span');
                    leftSpans.forEach((span, i) => {
                        if (i < innerSideCount) {
                            span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                            span.style.transform = 'translateY(0)';
                        } else {
                            span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                            span.style.transform = 'translateY(0)';
                            span.style.opacity = '1';
                        }
                    });
                }

                if (rightRuler) {
                    const rightSpans = rightRuler.querySelectorAll('span');
                    rightSpans.forEach((span, i) => {
                        if (i < innerSideCount) {
                            span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                            span.style.transform = 'translateY(0)';
                        } else {
                            span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                            span.style.transform = 'translateY(0)';
                            span.style.opacity = '1';
                        }
                    });
                }
            } else if (arrivingAtInner && currentIsInner) {
                // Animate inner page ruler numbers to their natural positions
                if (topRuler) {
                    const topSpans = topRuler.querySelectorAll('span');
                    topSpans.forEach((span) => {
                        span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                        span.style.transform = 'translateX(0)';
                    });
                }

                if (leftRuler) {
                    const leftSpans = leftRuler.querySelectorAll('span');
                    leftSpans.forEach((span) => {
                        span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                        span.style.transform = 'translateY(0)';
                    });
                }

                if (rightRuler) {
                    const rightSpans = rightRuler.querySelectorAll('span');
                    rightSpans.forEach((span) => {
                        span.style.transition = 'transform 0.4s ease-out, opacity 0.4s ease-out';
                        span.style.transform = 'translateY(0)';
                    });
                }
            } else {
                // Simple fade in for rulers
                if (topRuler) {
                    topRuler.style.transition = 'opacity 0.35s ease-out';
                    topRuler.style.opacity = '1';
                }
                if (leftRuler) {
                    leftRuler.style.transition = 'opacity 0.35s ease-out';
                    leftRuler.style.opacity = '1';
                }
                if (rightRuler) {
                    rightRuler.style.transition = 'opacity 0.35s ease-out';
                    rightRuler.style.opacity = '1';
                }
            }

            if (bottomRuler) {
                bottomRuler.style.transition = 'opacity 0.35s ease-out';
                bottomRuler.style.opacity = '1';
            }
            if (borderFrame) {
                borderFrame.style.transition = 'opacity 0.3s ease-out';
                borderFrame.style.opacity = '1';
            }
            if (plusGrid) {
                plusGrid.style.transition = 'opacity 0.35s ease-out 0.1s';
                plusGrid.style.opacity = '1';
            }
            if (homepageScroll) {
                homepageScroll.style.transition = 'opacity 0.4s ease-out 0.15s';
                homepageScroll.style.opacity = '1';
            }
            if (content) {
                content.style.transition = 'opacity 0.4s ease-out 0.15s';
                content.style.opacity = '1';
            }
            });
        });
    }

    // Run enter animation on page load
    animatePageEnter();

    // Mobile title scaling - JavaScript fallback for Safari compatibility
    // Safari doesn't support length/length division in CSS calc, so we handle it in JS for mobile
    function updateMobileTitleScale() {
        const title = document.querySelector('.title');
        if (!title) return;

        const vw = window.innerWidth;

        // Only apply JS scaling on mobile (480px and below)
        if (vw <= 480) {
            // Scale from 0.22 at 320px to 0.30 at 480px
            const minVw = 320;
            const maxVw = 480;
            const minScale = 0.22;
            const maxScale = 0.30;

            const ratio = Math.max(0, Math.min(1, (vw - minVw) / (maxVw - minVw)));
            const scale = minScale + ratio * (maxScale - minScale);

            title.style.transform = `scale(${scale})`;
        } else {
            // Above 480px, let CSS handle it (remove any inline style)
            title.style.transform = '';
        }
    }

    // Run on load and resize
    updateMobileTitleScale();
    window.addEventListener('resize', updateMobileTitleScale);

    // Right ruler navigation (0-4)
    const rightRulerSpans = document.querySelectorAll('.ruler-right span');
    const navPages = [
        { index: 0, href: 'index.html', label: 'עמוד הבית', color: '#109955' },
        { index: 1, href: 'program.html', label: 'תוכנית הלימודים', color: '#0946E1' },
        { index: 2, href: 'staff.html', label: 'סגל המחלקה', color: '#F200BA' },
        { index: 3, href: 'guidelines.html', label: 'הוראות ונהלים', color: '#EF0004' },
        { index: 4, href: 'courses.html', label: 'קורסים', color: '#FFAA00' }
    ];

    // Store tooltips by href for access from main nav links
    const rulerTooltips = {};

    navPages.forEach(({ index, href, label, color }) => {
        const span = rightRulerSpans[index];
        if (span) {
            span.classList.add('ruler-nav');

            // Add tooltip to body
            const tooltip = document.createElement('div');
            tooltip.className = 'ruler-nav-tooltip';
            tooltip.textContent = label;
            tooltip.style.backgroundColor = color;
            document.body.appendChild(tooltip);

            // Store tooltip reference with index for main nav link access
            rulerTooltips[index] = { tooltip, span };

            // Position and show tooltip on hover
            span.addEventListener('mouseenter', () => {
                const rect = span.getBoundingClientRect();
                // Position tooltip to the left of the nav square, vertically centered
                // Nav square is 24px centered on 20px span, so extends 2px beyond left edge
                const top = rect.top + rect.height / 2;
                const right = window.innerWidth - rect.left + 9;
                tooltip.style.top = top + 'px';
                tooltip.style.right = right + 'px';
                tooltip.style.left = 'auto';
                tooltip.style.transform = 'translateY(-50%)';
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });

            span.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });

            // Add click handler
            span.addEventListener('click', (e) => {
                e.preventDefault();
                const isGoingToInnerPage = href.includes('.html') && href !== 'index.html';
                animatePageTransition(isGoingToInnerPage, href);
            });
        }
    });

    // Sync main nav link hovers with ruler nav links (homepage only)
    const mainNavLinks = document.querySelectorAll('.nav-link');
    if (mainNavLinks.length > 0) {
        // Map: nav-link-1 → ruler index 1, nav-link-2 → ruler index 2, etc.
        const navLinkToRulerIndex = {
            'nav-link-1': 1, // program
            'nav-link-2': 2, // staff
            'nav-link-3': 3, // guidelines
            'nav-link-4': 4  // courses
        };

        mainNavLinks.forEach(link => {
            // Find which nav-link-X class this link has
            const linkClass = Array.from(link.classList).find(c => c.startsWith('nav-link-') && c !== 'nav-link');
            if (linkClass && navLinkToRulerIndex[linkClass] !== undefined) {
                const rulerIndex = navLinkToRulerIndex[linkClass];
                const rulerNavSpan = rightRulerSpans[rulerIndex];

                if (rulerNavSpan) {
                    link.addEventListener('mouseenter', () => {
                        rulerNavSpan.classList.add('hover');
                    });

                    link.addEventListener('mouseleave', () => {
                        rulerNavSpan.classList.remove('hover');
                    });
                }
            }
        });
    }

    // Image Carousel functionality
    const carousel = document.querySelector('.image-carousel');
    if (carousel) {
        const mainImage = carousel.querySelector('.carousel-active-image');
        const thumbnailsContainer = carousel.querySelector('.carousel-thumbnails');
        const thumbnailsWrapper = carousel.querySelector('.carousel-thumbnails-wrapper');
        const prevButton = carousel.querySelector('.carousel-arrow-prev');
        const nextButton = carousel.querySelector('.carousel-arrow-next');
        const originalThumbnails = Array.from(carousel.querySelectorAll('.carousel-thumb'));

        // Hardcoded image sources (12 images)
        const imageSources = [
            'final-project-images/1.webp',
            'final-project-images/2.webp',
            'final-project-images/3.webp',
            'final-project-images/4.webp',
            'final-project-images/5.webp',
            'final-project-images/6.webp',
            'final-project-images/7.webp',
            'final-project-images/8.webp',
            'final-project-images/9.webp',
            'final-project-images/10.webp',
            'final-project-images/11.webp',
            'final-project-images/12.webp'
        ];

        // Image captions
        const imageCaptions = [
            'רעיה קבנובסקי, שטעטל',
            'ליאור קימל, ליברטו: גופן קלאסי עכשווי',
            'שיראל מימון מרי אהבה וקנין, ויהי חושך | אור אחר',
            'שחר עמרני, שלושה כלבים',
            'ורוניקה פומזן, ורוניקה',
            'הדר אדלשטיין, חלמתי שאני יולדת את החתול שלי',
            'יסכה זיתון, הקלטות של אמהות',
            'יובל גרף, הדס חיימוביץ׳, Mindful Solutionism',
            'נועה פיזנטי, בין המילים',
            'נועה ישראלי, לימבוטופיה',
            'שיר שקד, אמא',
            'טל רוזנברג, ניתאי מזיג, אדיטור'
        ];

        const captionElement = carousel.querySelector('.carousel-caption');

        const totalImages = imageSources.length;
        let currentIndex = 5; // Starting with the 6th image (index 5)

        // Get responsive thumbnail dimensions based on screen width
        function getThumbDimensions() {
            // Use mobile dimensions at 768px and below (when parallax is hidden)
            const isMobileLayout = window.innerWidth <= 768;
            return {
                thumbWidth: isMobileLayout ? 60 : 80,
                activeThumbWidth: isMobileLayout ? 80 : 100,
                gap: 8
            };
        }

        // Clone thumbnails for infinite loop effect
        // Add clones at the end (first few images) and at the start (last few images)
        const cloneCount = totalImages; // Clone all for seamless looping

        // Clone all thumbnails and append to end
        originalThumbnails.forEach((thumb, idx) => {
            const clone = thumb.cloneNode(true);
            clone.setAttribute('data-clone', 'end');
            clone.setAttribute('data-original-index', idx);
            thumbnailsContainer.appendChild(clone);
        });

        // Clone all thumbnails and prepend to start
        for (let i = totalImages - 1; i >= 0; i--) {
            const clone = originalThumbnails[i].cloneNode(true);
            clone.setAttribute('data-clone', 'start');
            clone.setAttribute('data-original-index', i);
            thumbnailsContainer.insertBefore(clone, thumbnailsContainer.firstChild);
        }

        // Get all thumbnails including clones
        const allThumbnails = Array.from(carousel.querySelectorAll('.carousel-thumb'));

        // The virtual index in the extended array (original thumbnails start at cloneCount)
        let virtualIndex = cloneCount + currentIndex;

        function updateThumbnailStates() {
            allThumbnails.forEach((thumb, idx) => {
                const img = thumb.querySelector('img');
                if (idx === virtualIndex) {
                    thumb.classList.add('active');
                    img.classList.remove('gradient-map-image');
                } else {
                    thumb.classList.remove('active');
                    img.classList.add('gradient-map-image');
                }
            });
        }

        function centerOnIndex(index, animate = true) {
            const wrapperWidth = thumbnailsWrapper.offsetWidth;
            if (wrapperWidth === 0) return;

            // Get responsive dimensions
            const { thumbWidth, activeThumbWidth, gap } = getThumbDimensions();

            // Calculate the position of the center of the target thumbnail
            let targetOffset = 0;
            for (let i = 0; i < index; i++) {
                targetOffset += thumbWidth + gap;
            }
            // Add half of the active thumb width to get to its center
            targetOffset += activeThumbWidth / 2;

            // Calculate how much to shift so the target is centered in the wrapper
            const shift = targetOffset - (wrapperWidth / 2);

            if (!animate) {
                thumbnailsContainer.style.transition = 'none';
            } else {
                thumbnailsContainer.style.transition = 'transform 0.4s ease';
            }

            thumbnailsContainer.style.transform = `translateX(${shift}px)`;

            if (!animate) {
                thumbnailsContainer.offsetHeight;
                thumbnailsContainer.style.transition = 'transform 0.4s ease';
            }
        }

        function jumpToRealPosition() {
            // If we've scrolled into the cloned area, jump back to the real position
            if (virtualIndex < cloneCount) {
                // We're in the start clones, jump to end of originals
                virtualIndex = virtualIndex + totalImages;
                centerOnIndex(virtualIndex, false);
            } else if (virtualIndex >= cloneCount + totalImages) {
                // We're in the end clones, jump to start of originals
                virtualIndex = virtualIndex - totalImages;
                centerOnIndex(virtualIndex, false);
            }
        }

        function updateCarousel(newRealIndex) {
            currentIndex = newRealIndex;

            // Calculate direction and update virtual index
            const oldVirtual = virtualIndex;
            virtualIndex = cloneCount + newRealIndex;

            // Update main image
            mainImage.src = imageSources[newRealIndex];

            // Update thumbnail states
            updateThumbnailStates();

            // Center on the new active thumbnail
            centerOnIndex(virtualIndex);
        }

        function navigateCarousel(direction) {
            // direction: 1 for next, -1 for previous
            virtualIndex += direction;

            // Calculate the real index (wrapping around)
            currentIndex = ((virtualIndex - cloneCount) % totalImages + totalImages) % totalImages;

            // Update main image
            mainImage.src = imageSources[currentIndex];

            // Update caption
            if (captionElement) {
                captionElement.textContent = imageCaptions[currentIndex];
            }

            // Update thumbnail states
            updateThumbnailStates();

            // Center with animation
            centerOnIndex(virtualIndex, true);

            // After animation, check if we need to jump
            setTimeout(jumpToRealPosition, 450);
        }

        // Thumbnail click handler
        allThumbnails.forEach((thumb, idx) => {
            thumb.addEventListener('click', () => {
                const originalIndex = thumb.hasAttribute('data-original-index')
                    ? parseInt(thumb.getAttribute('data-original-index'))
                    : parseInt(thumb.getAttribute('data-index'));

                virtualIndex = idx;
                currentIndex = originalIndex;

                mainImage.src = imageSources[originalIndex];
                if (captionElement) {
                    captionElement.textContent = imageCaptions[originalIndex];
                }
                updateThumbnailStates();
                centerOnIndex(virtualIndex, true);

                setTimeout(jumpToRealPosition, 450);
            });
        });

        // Previous button (goes to previous image)
        prevButton.addEventListener('click', () => {
            navigateCarousel(-1);
        });

        // Next button (goes to next image)
        nextButton.addEventListener('click', () => {
            navigateCarousel(1);
        });

        // Initial setup
        updateThumbnailStates();
        if (captionElement) {
            captionElement.textContent = imageCaptions[currentIndex];
        }
        requestAnimationFrame(() => {
            centerOnIndex(virtualIndex, false);
        });

        // Recenter on window resize
        window.addEventListener('resize', () => {
            centerOnIndex(virtualIndex, false);
        });
    }

    // Staff hover image functionality
    const staffImages = {
        'דנה גז': 'images/lecturers-images/19.jpg',
        'איל זקין': 'images/lecturers-images/22.jpg',
        'נעמי גיגר': 'images/lecturers-images/23.jpg',
        'עמית טריינין': 'images/lecturers-images/24.jpg',
        'עידן רוזה': 'images/lecturers-images/25.png',
        'אמיתי גלעד': 'images/lecturers-images/26.jpg',
        'בן לב': 'images/lecturers-images/27.png',
    };

    // Create hover image element
    const hoverImage = document.createElement('img');
    hoverImage.className = 'staff-hover-image';
    document.body.appendChild(hoverImage);

    // Add data-image attributes to staff names and setup hover handlers
    const staffNameSelectors = [
        '.staff-head-name',
        '.staff-senior-name',
        '.staff-lecturer-name',
        '.staff-admin-name'
    ];

    staffNameSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(nameEl => {
            const name = nameEl.textContent.trim();
            if (staffImages[name]) {
                nameEl.setAttribute('data-image', staffImages[name]);

                nameEl.addEventListener('mouseenter', () => {
                    hoverImage.src = staffImages[name];
                    hoverImage.classList.add('visible');

                    // Position image to the right of the name
                    const rect = nameEl.getBoundingClientRect();
                    const imgWidth = 150;
                    const maxRight = window.innerWidth - 45; // 35px ruler + 10px padding
                    let left = rect.right + 20;

                    // If image would overflow, position to the left of the name instead
                    if (left + imgWidth > maxRight) {
                        left = rect.left - imgWidth - 20;
                    }

                    hoverImage.style.top = rect.top + 'px';
                    hoverImage.style.left = left + 'px';
                });

                nameEl.addEventListener('mouseleave', () => {
                    hoverImage.classList.remove('visible');
                });
            }
        });
    });

    // Parallax scroll effect - content slower, images faster (desktop only)
    const parallaxContainer = document.getElementById('final-project-parallax');
    const parallaxContent = parallaxContainer?.querySelector('.parallax-content');
    const parallaxImages = parallaxContainer?.querySelector('.parallax-images');

    if (parallaxContainer && parallaxContent && parallaxImages) {
        const contentStartSpeed = 0.15; // Content starts scrolling at 15% of normal speed
        const contentEndSpeed = 0.3; // Content ends at 30% scroll speed
        const imageSpeed = 1.6; // Images scroll at 120% of normal speed

        window.addEventListener('scroll', () => {
            // Disable parallax on mobile (768px and below)
            if (window.innerWidth <= 768) {
                parallaxContent.style.transform = 'translateY(0)';
                parallaxImages.style.transform = 'translateY(0)';
                return;
            }

            const containerRect = parallaxContainer.getBoundingClientRect();
            const containerTop = containerRect.top + window.scrollY;
            const containerHeight = parallaxContainer.offsetHeight;
            const containerBottom = containerTop + containerHeight;
            const scrollY = window.scrollY;

            // Check if we're within the parallax section
            if (scrollY >= containerTop && scrollY <= containerBottom) {
                // Calculate progress through section (0 to 1)
                const scrollIntoSection = scrollY - containerTop;
                const progress = scrollIntoSection / containerHeight;

                // Ease the content speed
                const easedProgress = progress * progress; // quadratic ease-in
                const currentContentSpeed = contentStartSpeed + (contentEndSpeed - contentStartSpeed) * easedProgress;

                // Content scrolls slower - push it down
                const contentOffset = scrollIntoSection * (1 - currentContentSpeed);
                parallaxContent.style.transform = `translateY(${contentOffset}px)`;

                // Images scroll faster - pull them up
                const imageOffset = scrollIntoSection * (imageSpeed - 1);
                parallaxImages.style.transform = `translateY(-${imageOffset}px)`;
            } else if (scrollY < containerTop) {
                // Before section - reset
                parallaxContent.style.transform = 'translateY(0)';
                parallaxImages.style.transform = 'translateY(0)';
            } else {
                // After section - reset
                parallaxContent.style.transform = 'translateY(0)';
                parallaxImages.style.transform = 'translateY(0)';
            }
        });
    }

    // Courses page - click to expand course descriptions
    const courseItems = document.querySelectorAll('.course-item');
    courseItems.forEach(item => {
        item.addEventListener('click', (e) => {
            // Don't toggle if clicking on an image (let lightbox handle it)
            if (e.target.tagName === 'IMG') return;
            // Toggle the 'open' class on the clicked course
            item.classList.toggle('open');
        });
    });

    // ==================== LIGHTBOX ====================

    // Create lightbox elements
    const lightboxOverlay = document.createElement('div');
    lightboxOverlay.className = 'lightbox-overlay';
    lightboxOverlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close"></button>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
            <div class="lightbox-caption"></div>
        </div>
    `;
    document.body.appendChild(lightboxOverlay);

    const lightboxImage = lightboxOverlay.querySelector('.lightbox-image');
    const lightboxCaption = lightboxOverlay.querySelector('.lightbox-caption');
    const lightboxClose = lightboxOverlay.querySelector('.lightbox-close');

    // Function to open lightbox
    function openLightbox(imgSrc, caption) {
        lightboxImage.src = imgSrc;
        lightboxCaption.textContent = caption || '';
        lightboxOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }

    // Function to close lightbox
    function closeLightbox() {
        lightboxOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }

    // Get caption for an image
    function getImageCaption(img) {
        // Check for sibling caption elements
        const parent = img.parentElement;

        // Check for .image-caption sibling
        const captionSibling = parent.querySelector('.image-caption');
        if (captionSibling) return captionSibling.textContent;

        // Check for .course-image-caption sibling
        const courseCaptionSibling = parent.querySelector('.course-image-caption');
        if (courseCaptionSibling) return courseCaptionSibling.textContent;

        // Check for .carousel-caption
        const carouselCaption = document.querySelector('.carousel-caption');
        if (img.classList.contains('carousel-active-image') && carouselCaption) {
            return carouselCaption.textContent;
        }

        // Fall back to alt text
        return img.alt || '';
    }

    // Helper function to handle image click for lightbox
    function handleImageClick(e) {
        const img = e.target;

        // Check if clicked element is an image
        if (img.tagName !== 'IMG') return;

        // Skip lightbox image itself and carousel thumbnails
        if (img.classList.contains('lightbox-image') || img.closest('.carousel-thumb')) {
            return;
        }

        e.stopPropagation();
        const imgSrc = img.src;
        const caption = getImageCaption(img);
        openLightbox(imgSrc, caption);
    }

    // Use event delegation on document body to capture all image clicks across the site
    // Using capture phase (true) to catch events before they're blocked by pointer-events: none
    document.body.addEventListener('click', handleImageClick, true);

    // Close lightbox on overlay click
    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay || e.target === lightboxClose) {
            closeLightbox();
        }
    });

    // Close lightbox on close button click
    lightboxClose.addEventListener('click', closeLightbox);

    // Close lightbox on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightboxOverlay.classList.contains('active')) {
            closeLightbox();
        }
    });

    // Program page - gentle parallax scroll for images
    const isProgramPage = document.body.classList.contains('page-program');

    if (isProgramPage) {
        const parallaxImages = document.querySelectorAll('.page-image-wrapper, .page-section-image-wrapper');
        const parallaxSpeed = 0.12; // Gentle speed - 12% of scroll distance

        function updateProgramParallax() {
            // Disable on mobile (768px and below)
            if (window.innerWidth <= 768) {
                parallaxImages.forEach(wrapper => {
                    wrapper.style.transform = 'translateY(0)';
                });
                return;
            }

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            parallaxImages.forEach(wrapper => {
                const rect = wrapper.getBoundingClientRect();
                const wrapperTop = rect.top + scrollY;

                // Calculate how far the element is from the center of the viewport
                const elementCenter = wrapperTop + rect.height / 2;
                const viewportCenter = scrollY + windowHeight / 2;
                const distanceFromCenter = elementCenter - viewportCenter;

                // Apply gentle parallax - moves opposite to scroll direction
                const offset = distanceFromCenter * parallaxSpeed;
                wrapper.style.transform = `translateY(${offset}px)`;
            });
        }

        // Run on scroll with requestAnimationFrame for smooth performance
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateProgramParallax();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Initial call
        updateProgramParallax();

        // Update on resize
        window.addEventListener('resize', updateProgramParallax);
    }

    // Guidelines page - gentle parallax scroll for images
    const isGuidelinesPage = document.body.classList.contains('page-guidelines');

    if (isGuidelinesPage) {
        const guidelinesParallaxImages = document.querySelectorAll('.guidelines-image-wrapper');
        const guidelinesParallaxSpeed = 0.17; // Gentle speed - 17% of scroll distance

        function updateGuidelinesParallax() {
            // Disable on mobile (768px and below)
            if (window.innerWidth <= 768) {
                guidelinesParallaxImages.forEach(wrapper => {
                    wrapper.style.transform = 'translateY(0)';
                });
                return;
            }

            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;

            guidelinesParallaxImages.forEach(wrapper => {
                const rect = wrapper.getBoundingClientRect();
                const wrapperTop = rect.top + scrollY;

                // Calculate how far the element is from the center of the viewport
                const elementCenter = wrapperTop + rect.height / 2;
                const viewportCenter = scrollY + windowHeight / 2;
                const distanceFromCenter = elementCenter - viewportCenter;

                // Apply gentle parallax - moves opposite to scroll direction
                const offset = distanceFromCenter * guidelinesParallaxSpeed;
                wrapper.style.transform = `translateY(${offset}px)`;
            });
        }

        // Run on scroll with requestAnimationFrame for smooth performance
        let guidelinesTicking = false;
        window.addEventListener('scroll', () => {
            if (!guidelinesTicking) {
                requestAnimationFrame(() => {
                    updateGuidelinesParallax();
                    guidelinesTicking = false;
                });
                guidelinesTicking = true;
            }
        });

        // Initial call
        updateGuidelinesParallax();

        // Update on resize
        window.addEventListener('resize', updateGuidelinesParallax);
    }

    // Mobile bottom nav carousel with swipe navigation
    const mobileNavCarousel = document.getElementById('mobile-nav-carousel');

    if (mobileNavCarousel) {
        const track = mobileNavCarousel.querySelector('.mobile-nav-track');
        const items = mobileNavCarousel.querySelectorAll('.mobile-nav-item');
        const currentIndex = parseInt(mobileNavCarousel.dataset.current) || 0;
        const totalItems = items.length;
        const itemWidth = 60; // vw

        // Mark current item as active
        items[currentIndex]?.classList.add('active');

        // Add click handlers for nav items (for taps, not swipes)
        items.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Only navigate if not the current page
                if (index !== currentIndex) {
                    e.preventDefault();
                    const href = item.getAttribute('href');
                    // Animate to the clicked position, then navigate
                    positionTrack(index, true);
                    setTimeout(() => {
                        window.location.href = href;
                    }, 300);
                }
            });
        });

        // Position track to show current page centered
        // Each item is 70vw wide, we need to center it
        // Offset = (item position * itemWidth) - (50vw - itemWidth/2)
        // This centers the current item in the viewport
        function positionTrack(index, animate = false) {
            const centerOffset = (100 - itemWidth) / 2; // 15vw on each side to center
            const offset = (index * itemWidth) - centerOffset;

            if (animate) {
                track.style.transition = 'transform 0.3s ease';
            } else {
                track.style.transition = 'none';
            }

            // RTL layout - positive translateX moves items to the right
            track.style.transform = `translateX(${offset}vw)`;
        }

        // Initial position
        positionTrack(currentIndex);

        // Touch/swipe handling
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        let baseOffset = 0;

        track.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            currentX = startX;
            isDragging = true;
            track.style.transition = 'none';
            // Calculate base offset for current position
            const centerOffset = (100 - itemWidth) / 2;
            baseOffset = (currentIndex * itemWidth) - centerOffset;
        }, { passive: true });

        track.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            currentX = e.touches[0].clientX;
            const diff = startX - currentX;
            // Convert pixel difference to vw (content follows finger)
            const diffVw = (diff / window.innerWidth) * 100;
            const offset = baseOffset - diffVw;
            track.style.transform = `translateX(${offset}vw)`;
        }, { passive: true });

        track.addEventListener('touchend', () => {
            if (!isDragging) return;
            isDragging = false;

            const diff = startX - currentX;
            const threshold = window.innerWidth * 0.15; // 15% of screen width

            // RTL: swiping right (diff < 0) goes to higher index (next page)
            // swiping left (diff > 0) goes to lower index (previous page)
            if (diff < -threshold && currentIndex < totalItems - 1) {
                // Swipe right - go to next page
                const nextItem = items[currentIndex + 1];
                if (nextItem) {
                    // Animate to next position first, then navigate
                    positionTrack(currentIndex + 1, true);
                    setTimeout(() => {
                        window.location.href = nextItem.getAttribute('href');
                    }, 300);
                }
            } else if (diff > threshold && currentIndex > 0) {
                // Swipe left - go to previous page
                const prevItem = items[currentIndex - 1];
                if (prevItem) {
                    // Animate to previous position first, then navigate
                    positionTrack(currentIndex - 1, true);
                    setTimeout(() => {
                        window.location.href = prevItem.getAttribute('href');
                    }, 300);
                }
            } else {
                // Snap back to current position
                positionTrack(currentIndex, true);
            }
        });
    }

});
