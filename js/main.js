document.getElementsByClassName('main__wrapper')[0].dataset.page = localStorage.getItem('page') || 0;
document.getElementsByClassName('section--slided')[0].dataset.slide = localStorage.getItem('slide') || 0;

let parallaxEvent = new CustomEvent('parallax');


(function scrollPages() {
    let initialPosition = null;
    let moving = false;
    let scrolled = false;
    let slidesContainer = document.querySelector('.main__wrapper');
    let page = parseInt(slidesContainer.dataset.page);
    function scrollPageUp() {
        if (page < 2) slidesContainer.dataset.page = ++page;
        window.dispatchEvent(parallaxEvent);
        localStorage.setItem("page", page.toString());
    }
    function scrollPageDown() {
        if (page > 0) {
            slidesContainer.dataset.page = --page;
            window.dispatchEvent(parallaxEvent);
            localStorage.setItem("page", page.toString());
        }

    }

    let scrollStart = (e) => {
        if (e.target.classList.contains('slider__ice'))  return;

        initialPosition = e.pageY;
        moving = true;
    };


    let scrollMove = (e) => {
        if (!moving) return;
        if (scrolled) return;
        let currentPosition = e.pageY;
        let diff = initialPosition - currentPosition;


        if (diff > 20) {
            scrollPageUp();
            scrolled = true;
        } else if (diff < -20) {
            scrollPageDown();
            scrolled = true;
        }
    };


    let scrollEnd = (e) => {
        moving = false;
        scrolled = false;
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
    }
}());

(function slideShow() {

    const slider = document.querySelector('.slider__ice');
    const sliderFilledLine = document.querySelector('.slider__line--filled');
    const sliderLineWidth = document.querySelector('.slider__line').getBoundingClientRect().width;
    let initialPosition = null;
    let moving = false;
    let sliderInitialPosition = 0;
    const slideContainer = document.querySelector('.section--slided');

    (function adjustSlider() {
        if (slideContainer.dataset.slide == 0) {
            slider.style.left = 0 + '%';
            sliderFilledLine.style.width = 0 + '%';
        } else if(slideContainer.dataset.slide == 1) {
            slider.style.left = 50 + '%';
            sliderFilledLine.style.width = 50 + '%';
        } else if(slideContainer.dataset.slide == 2) {
            slider.style.left = 100 + '%';
            sliderFilledLine.style.width = 100 + '%';
        }
    }());

    function findLeftPosition(el) {
        const leftPositionString = window.getComputedStyle(el).left;
        return parseFloat(leftPositionString.match(/.*(?=px)/)) / sliderLineWidth * 100;
    }

    function switchSlide() {

        sliderEndPosition = findLeftPosition(slider);

        if (sliderEndPosition < 25) {
            slideContainer.dataset.slide = 0;
            localStorage.setItem("slide", "0");
        }
        else if (sliderEndPosition < 75) {
            slideContainer.dataset.slide = 1;
            localStorage.setItem("slide", "1");
        }
        else if (sliderEndPosition < 100) {
            slideContainer.dataset.slide = 2;
            localStorage.setItem("slide", "2");
        }

    }

    const gestureStart = (e) => {
        initialPosition = e.pageX;
        moving = true;
        sliderInitialPosition = findLeftPosition(slider) || 0;

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
        moving = false;
        let sliderInitPosition = parseInt(findLeftPosition(slider));
        let sliderEndPosition = 0;

        if (sliderInitPosition < 25) sliderEndPosition = 0;
        else if (sliderInitPosition < 75) sliderEndPosition = 50;
        else if (sliderInitPosition <= 100) sliderEndPosition = 100;

        (function loop() {

            if (sliderInitPosition === sliderEndPosition ) return;
            if (sliderInitPosition > sliderEndPosition) {
                sliderInitPosition--;
            } else {
                sliderInitPosition++;
            }
            slider.style.left = sliderInitPosition + '%';
            sliderFilledLine.style.width = sliderInitPosition + '%';
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
    let iceElem = document.querySelectorAll('.js-parallax');
    window.addEventListener("parallax", () => {
        iceElem.forEach(function (e) {

            const  screenHeight = 768;

            let paralaxed = false;
            const mainWrapper = document.querySelector('.main__wrapper');
            mainWrapper.addEventListener('transitionend', (e) => {
                setTimeout((e) => {
                    paralaxed = true;
                }, 1000);
            });
            (function loop() {

                let mainWrapperYPosition = mainWrapper.getBoundingClientRect().y;
                let neededTranslate = (mainWrapperYPosition + screenHeight) / screenHeight  * 300;
                e.style.transform = `translateY(${neededTranslate}px)`;
                if (paralaxed) return;
                setTimeout(loop, 16);
            }())
        });
    });

}());