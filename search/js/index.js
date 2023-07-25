"use strict";

const input = document.getElementById("input");
const submitButton = document.getElementById("submitButton");
const boxNicknames = document.getElementById("boxNicknames");
const pagination = document.getElementById("pagination");
const nicknameInfo = document.getElementById("nicknameInfo");
const container = document.querySelector(".container");
const innerNicknames = document.querySelector(".inner-nicknames");


// * функция поиска по нику, в параметрах ник и страница
async function search(nickname, page) {
    return await fetch(`https://freely-living-asp.ngrok-free.app/results?nickname=${nickname}&page=${page}`, { 
        method: "GET", 
        mode: 'cors', 
        headers: { 
            'Content-Type': 'application/json', 
            'ngrok-skip-browser-warning': 'true'
        }
    })
    .then(response => response.json());
}

// * функция пагинации, поиск ников, создание ников и переключение странички
async function relocate(e) {
    setLocalStorage("current", e.target.innerText);
    let nicknames = await search(getNickname(), getCurrentPage());
    createBoxNames(nicknames.accounts);
    createPagination();
}

// * создаёт range(n, N) цифир в пагинацию и ивенты для них
function addPagination(startPag, endPag) {
    for (let i = startPag; i <= endPag; i++) {
        let element = document.createElement("p");
        element.classList = i == getCurrentPage() ? "active-pagination" : "inactive-pagination";

        element.innerText = i;
        pagination.append(element);
        element.addEventListener("click", relocate);
    }
}

function addDots() {
    let element = document.createElement("span");
    element.innerText = "...";
    pagination.append(element);
}

function paternPag(arr) {
    for (const item of arr) {
        if (item == "dot") {
            addDots();
            continue;
        }

        addPagination(item[0], item[1]);
    }
}

// * патерны пагинации, сама фунция содзания пагинации
function createPagination() {
    pagination.innerHTML = "";
    let start = Number(getStartPage());
    let end = Number(getEndPage());
    let current = Number(getCurrentPage());

    if (current <= start + 2 && end > 5) {
        paternPag([[start, start + 3], "dot", [end, end]])
    } else if (current >= end - 2 && end > 5) {
        paternPag([[start, start], "dot", [end - 3, end]])
    } else if (end <= 5) {
        paternPag([[start, end]])
    } else {
        paternPag([[start, start], "dot", [current - 1, current + 1], "dot", [end, end]])
    }
}

// * добовляет имя и линию между именами
function addName(object, i, arrLength) {
    let element = document.createElement("p");
    element.innerText = object.nickname;
    boxNicknames.append(element);

    if (arrLength !== i + 1) {
        let line = document.createElement("div");
        boxNicknames.append(line);
    }
}

// * отображает массив имен полученных запросом ...?nickname=""&page=12
function createBoxNames(arr) {
    boxNicknames.classList = "box-nicknames";
    boxNicknames.innerHTML = "";
    console.log(arr);
    arr.forEach((item, i) => {
        addName(item, i, arr.length);
    });
}

function setLocalStorage(name, pageNum) {
    localStorage.setItem(name, pageNum);
}

// ? выдаёт начальную страницу
function getStartPage() {
    return localStorage.getItem("startPage");
}

// ? выдаёт конечную страницу
function getEndPage() {
    return localStorage.getItem("endPage");
}

function getCurrentPage() {
    return localStorage.getItem("current");
}

function getNickname() {
    return localStorage.getItem("inputNickname");
}

async function submitClick(e) {
    const startPage = "1";
    const current = "1";
    const nickname = input.value;
    let nicknames = await search(nickname, startPage);
    const endPage = nicknames.totalPages;

    console.log(nicknames);

    if (!nicknameInfo.classList.contains("none")) {
        await animHide(nicknameInfo, 500);
    }

    setLocalStorage("startPage", startPage);
    setLocalStorage("endPage", endPage);
    setLocalStorage("current", current);
    setLocalStorage("inputNickname", nickname);
    createBoxNames(nicknames.accounts);
    createPagination();

    if (innerNicknames.classList.contains("none")) {
        await animShow(innerNicknames, 500);
    }
}

function setValueNickname(obj) {
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const element = document.getElementById(key);
            if (!obj[key]) {
                obj[key] = "None"
            }
            
            element.innerText = obj[key];
        }
    }
}

async function animShow(obj, timeout) {
    removeEvent();
    obj.classList.toggle("none");
    obj.animate([{opacity: 0}, {opacity: 1}], timeout);

    await new Promise((resolve) =>
        setTimeout(() => {
            addEvent();
            return resolve();
        }, timeout - 100)
    );
}

async function animHide(obj, timeout) {
    removeEvent();
    obj.animate([{opacity: 1}, {opacity: 0}], timeout);

    await new Promise((resolve) =>
        setTimeout(() => {
            obj.classList.toggle("none");
            addEvent();
            return resolve();
        }, timeout - 100)
    );
}

async function getNicknameServer(nickname) {
    return await fetch(`https://freely-living-asp.ngrok-free.app/account/${nickname}`, { 
        method: "GET", 
        mode: 'cors', 
        headers: { 
            'Content-Type': 'application/json', 
            'ngrok-skip-browser-warning': 'true'
        }
    })
    .then(response => response.json());
}

async function openNickname(e) {
    let nameRow = e.target.innerText;
    if (nameRow === "" || e.target.id === "boxNicknames") {
        return;
    }
    let dataNickname = await getNicknameServer(nameRow);

    setValueNickname(dataNickname);
    console.log(dataNickname)
    let nicknameImg = document.getElementById("nicknameImg");
    nicknameImg.src = `https://mc-heads.net/head/${dataNickname.nickname}`;
    await animHide(innerNicknames, 500);
    await animShow(nicknameInfo, 500);

    nicknameInfo.classList = "nickname-info";
}

function checkTg() {
    // ! берется запросом булл значение
    return "";
}

function copyValueElement(e) {
    if (checkTg()) {
        // ! берется запросом
        let tgValue = "";
        navigator.clipboard.writeText(tgValue);
        return;
    }

    let element = e.currentTarget.querySelector("p");
    navigator.clipboard.writeText(element.innerText);
}

const copyButtons = document.querySelectorAll(".copy-info");
for (const button of copyButtons) {
    button.addEventListener("click", copyValueElement);
}

function removeEvent() {
    submitButton.removeEventListener("click", submitClick);
    boxNicknames.removeEventListener("click", openNickname);
}

function addEvent() {
    submitButton.addEventListener("click", submitClick);
    boxNicknames.addEventListener("click", openNickname);
}

addEvent();
