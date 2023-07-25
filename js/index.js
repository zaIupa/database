"use strict"

function redirection() {
    window.location.replace("search/index.html");
}

const loadBox = document.querySelector(".load-box");

function removeSound() {
    loadBox.removeEventListener("animationiteration", secretLoad);
    window.removeEventListener("click", clickWindow);  
}

function secretLoad(e) {
    if (Math.random() <= 0.2) {
        const SOUND = new Audio("./sound/s1.mp3");
        const secretLoad = document.querySelector(".secret-load");
        secretLoad.classList = "secret-load";
        loadBox.classList = "load-box none";
        SOUND.load()
        SOUND.play();
        setTimeout(() => {
            SOUND.pause();
            secretLoad.classList = "secret-load none";
            loadBox.classList = "load-box";
        }, 2900);

        removeSound();
    }
}

function clickWindow() {
    loadBox.addEventListener("animationiteration", secretLoad);   
}

window.addEventListener("click", clickWindow);



async function checkСonnection() {
    let response = await fetch("https://zaiupa.github.io/database/", { 
        method: "GET", 
        headers: { 
            'Content-Type': 'application/json'
        }
    });

    if (response.status == 200) {
        redirection();
    }
}

checkСonnection();
