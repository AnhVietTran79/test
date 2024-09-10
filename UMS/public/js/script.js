// Source:
const iconClose = document.querySelector('.icon-close');


//Image slider
const slides = document.querySelectorAll(".slides img");
let slideIndex = 1;
let intervalId = null;

document.addEventListener("DOMContentLoaded", initializeSlider);

function initializeSlider(){
    if(slides.length > 0){
        slides[slideIndex].classList.add("displaySlide");
        intervalId = setInterval(nextSlide, 5000);
    }
}

function showSlide(index){
    if(index >= slides.length){
        slideIndex = 0;
    }
    else if(index < 0){
        slideIndex = slides.length - 1;
    }

    slides.forEach(slide => {
        slide.classList.remove("displaySlide");
    });
    slides[slideIndex].classList.add("displaySlide");
}

function prevSlide(){
    clearInterval(intervalId);
    slideIndex--;
    showSlide(slideIndex);
}

function nextSlide(){
    slideIndex++;
    showSlide(slideIndex);
}

//View password function
const logInputField = document.getElementById('logPassword');
const logInputIcon= document.getElementById('log-pass-icon');
const regInputField = document.getElementById('regPassword');
const regInputIcon= document.getElementById('reg-pass-icon');

function myLogPassword() {
    if(logInputField.type === "password") {
        logInputField.type = "text";
        logInputIcon.name = "eye";
        logInputIcon.style.cursor = "pointer";
    }
    else{
        logInputField.type = "password";
        logInputIcon.name = "eye-off";
        logInputIcon.style.cursor = "pointer";
    }
}

function myRegPassword() {
    if(regInputField.type === "password") {
        regInputField.type = "text";
        regInputIcon.name = "eye";
        regInputIcon.style.cursor = "pointer";
    }
    else{
        regInputField.type = "password";
        regInputIcon.name = "eye-off";
        regInputIcon.style.cursor = "pointer";
    }
}

function changeIcon(value){
    if(value.length > 0){
        logInputIcon.name = "eye";
        regInputIcon.name = "eye";
    } else {
        logInputIcon.name = "eye-off";
        regInputIcon.name = "eye-off";
    }
}

//RESPONSIVE NAVBAR
function showSidebar() {
    document.querySelector('.side-bar').classList.add('active');
}

function hideSidebar() {
    document.querySelector('.side-bar').classList.remove('active');
}

