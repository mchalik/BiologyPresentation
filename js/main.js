"use strict";

document.getElementsByClassName('main__wrapper')[0].dataset.page = localStorage.getItem('page') || 0;
document.getElementsByClassName('section--slided')[0].dataset.slide = localStorage.getItem('slide') || 0;

const parallaxEvent = new CustomEvent('parallax');


(function scrollPages() {
    const slidesContainer = document.querySelector('.main__wrapper');
    let initialPosition = null;
    let moving = false;
    let scrolled = false;
    let page = parseInt(slidesContainer.dataset.page);

    function scrollPageUp() {
        if (page >= 2) return;

        slidesContainer.dataset.page = ++page;
        window.dispatchEvent(parallaxEvent);
        localStorage.setItem("page", page.toString());
    }
    function scrollPageDown() {
        if (page <= 0) return;

        slidesContainer.dataset.page = --page;
        window.dispatchEvent(parallaxEvent);
        localStorage.setItem("page", page.toString());
    }

    const scrollStart = (e) => {
        if (e.target.classList.contains('slider__ice'))  return;

        initialPosition = e.pageY;
        moving = true;
    };


    const scrollMove = (e) => {
        if (!moving) return;
        if (scrolled) return;

        const currentPosition = e.pageY;
        const diff = initialPosition - currentPosition;

        if (diff > 20) {
            scrollPageUp();
            scrolled = true;
        } else if (diff < -20) {
            scrollPageDown();
            scrolled = true;
        }
    };


    const scrollEnd = (e) => {
        moving = false;
        scrolled = false;
    };

    const wheelHandler = (e) => {
        let y = e.deltaY;
        if (y > 0) {
            scrollPageUp();
        } else {
            scrollPageDown();
        }

    };

    if (window.PointerEvent) {
        window.addEventListener('pointerdown', scrollStart);
        window.addEventListener('pointermove', scrollMove);
        window.addEventListener('pointerup', scrollEnd);

    } else {
        window.addEventListener('touchdown', scrollStart);
        window.addEventListener('touchmove', scrollMove);
        window.addEventListener('touchup', scrollEnd);

        window.addEventListener('mousedown', scrollStart);
        window.addEventListener('mousemove', scrollMove);
        window.addEventListener('mouseup', scrollEnd);

        window.addEventListener('mousedown', scrollStart);
        window.addEventListener('mousemove', scrollMove);
        window.addEventListener('mouseup', scrollEnd);
    }
    window.addEventListener('wheel', wheelHandler);
}());

(function slideShow() {

    const slider = document.querySelector('.slider__ice');
    const sliderFilledLine = document.querySelector('.slider__line--filled');
    const sliderLineWidth = document.querySelector('.slider__line').getBoundingClientRect().width;
    const slideContainer = document.querySelector('.section--slided');
    let initialPosition = null;
    let moving = false;
    let sliderInitialPosition = 0;

    (function adjustSlider() {
        const currentSlide = parseInt(slideContainer.dataset.slide);

        switch (currentSlide) {
            case 0:
                slider.style.left = 0 + '%';
                sliderFilledLine.style.width = 0 + '%';
                break;

            case 1:
                slider.style.left = 50 + '%';
                sliderFilledLine.style.width = 50 + '%';
                break;

            case 2:
                slider.style.left = 100 + '%';
                sliderFilledLine.style.width = 100 + '%';
                break;

            default:
        }
    }());

    function findLeftPosition(el) {
        const leftPositionString = window.getComputedStyle(el).left;
        const leftPositionNumber = parseFloat(leftPositionString.match(/\d+(\.\d+)?(?=px)/));

        return leftPositionNumber / sliderLineWidth * 100;
    }

    function switchSlide() {

        let sliderEndPosition = findLeftPosition(slider);

        if (sliderEndPosition < 25) {
            slideContainer.dataset.slide = "0";
            localStorage.setItem("slide", "0");
        }
        else if (sliderEndPosition < 75) {
            slideContainer.dataset.slide = "1";
            localStorage.setItem("slide", "1");
        }
        else if (sliderEndPosition <= 100) {
            slideContainer.dataset.slide = "2";
            localStorage.setItem("slide", "2");
        }
    }

    const gestureStart = (e) => {
        initialPosition = e.pageX;
        moving = true;
        sliderInitialPosition = findLeftPosition(slider);

    };

    const gestureMove = (e) => {
        if (!moving) return;

        const currentPosition = e.pageX;
        let diff = currentPosition - initialPosition;
        let diffPercent = diff / sliderLineWidth * 100;
        let newPosition = sliderInitialPosition + diffPercent;

        if (newPosition < 0) return;
        if (newPosition > 100) return;

        slider.style.left = newPosition + '%';
        sliderFilledLine.style.width = newPosition + '%';
        switchSlide();
    };

    const gestureEnd = (e) => {
        if (!moving) return;

        moving = false;

        let sliderReleasePosition = parseInt(findLeftPosition(slider));
        let sliderEndPosition = 0;

        if (sliderReleasePosition < 25) sliderEndPosition = 0;
        else if (sliderReleasePosition < 75) sliderEndPosition = 50;
        else if (sliderReleasePosition <= 100) sliderEndPosition = 100;

        (function loop() {
            if (sliderReleasePosition === sliderEndPosition) return;

            if (sliderReleasePosition > sliderEndPosition) {
                sliderReleasePosition--;
            } else {
                sliderReleasePosition++;
            }
            slider.style.left = sliderReleasePosition + '%';
            sliderFilledLine.style.width = sliderReleasePosition + '%';
            setTimeout(loop, 8);
        }());
    };


    if (window.PointerEvent) {
        slider.addEventListener('pointerdown', gestureStart);
        window.addEventListener('pointermove', gestureMove);
        window.addEventListener('pointerup', gestureEnd);

    } else {
        slider.addEventListener('touchdown', gestureStart);
        window.addEventListener('touchmove', gestureMove);
        window.addEventListener('touchup', gestureEnd);

        slider.addEventListener('mousedown', gestureStart);
        window.addEventListener('mousemove', gestureMove);
        window.addEventListener('mouseup', gestureEnd);

    }
}());



(function parallax() {
    const screenHeight = 768;
    const iceElem = document.querySelectorAll('.js-parallax');
    const mainWrapper = document.querySelector('.main__wrapper');

    window.addEventListener("parallax", () => {
        iceElem.forEach((e) => {
            let paralaxed = false;

            mainWrapper.addEventListener('transitionend', () => {
                setTimeout(() => {
                    paralaxed = true;
                }, 1000);
            });

            (function loop() {
                if (paralaxed) return;

                const mainWrapperYPosition = mainWrapper.getBoundingClientRect().y;
                const neededTranslate = (mainWrapperYPosition + screenHeight) / screenHeight * 500;

                e.style.transform = `translateY(${neededTranslate}px)`;
                setTimeout(loop, 16);
            }());
        });
    });
}());

window.addEventListener('load', function() {
    document.querySelector('.main').classList.remove('hidden');
});