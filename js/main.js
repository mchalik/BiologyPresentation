window.addEventListener("scroll", function () {
    let iceElem = document.querySelectorAll('.js-paralax');
    iceElem.forEach(function(e){
        let screenHeight = 768;
        let neededTranslate = ( - pageYOffset + screenHeight) / screenHeight / 10 * 1000;
        e.style.transform = `translateY(${neededTranslate}%)`;
    });
});