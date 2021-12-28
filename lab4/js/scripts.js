'use strict';

// buttons
const playBtn = document.getElementById('play-btn');
const closeBtn = document.getElementById('close-btn');
const startBtn = document.getElementById('start-btn');

// work areas
const workArea = document.getElementById('work');
const animArea = document.getElementById('animation');
const controls = document.getElementById('controls');
const storageList = document.getElementById('storageInfo');
const notifications = document.getElementById('notifications');

// circles
const smallCircle = document.getElementById('circle1');
const bigCircle = document.getElementById('circle2');

// general
let animAreaHeight = $('animation').height();
let animAreaWidth = $('animation').width();
let isBiggerMoving = false;
let isSmallerMoving = false;

// parameters
let BiggerDiameter = 0;
let SmallerDiameter = 0;
let shiftForSmaller = 0;
let shiftForBigger = 0;

//#region getting data from server
getContentParameters(1).then(() => {
    console.log('Async function |getContentParameters| works correctly');
}).catch(error => {
    console.log('Error executing the async function |getContentParameters|' + error);
});

async function getContentParameters(id){
    let url = 'https://localhost:44346/api/parameters/' + id;
    let response = await fetch(url);

    if (response.ok) {
        let contentParameters = await response.json();
        // setting parameter values
        BiggerDiameter = contentParameters.biggerDiameter;
        SmallerDiameter = contentParameters.smallerDiameter;
        shiftForSmaller = contentParameters.shiftForSmaller;
        shiftForBigger = contentParameters.shiftForBigger;
    } else {
        alert("HTTP ERROR: " + response.status);
    }
}
//#endregion


//#region events of buttons
function activateWorkArea(isVisible){
    if (isVisible) {
        workArea.classList.remove('none');
        localStorage.clear();
        eventsCounter = 0;

        displayEventsInNotifications('Play button was pressed.');
        saveEventsToLocalStorage('Work area appeared.');
    }
    else {
        displayEventsInNotifications('Close button was pressed.');
        saveEventsToLocalStorage('Work area disappeared.');
        workArea.classList.add('none');
        controls.removeChild(notifications);
        controls.appendChild(startBtn);
        controls.appendChild(notifications);

        isSmallerMoving = false;
        isBiggerMoving = false;
        setInitialPositionOfCircles(animAreaHeight, animAreaWidth);
        addEventsFromLocalStorageToBlock4();
    }
}

closeBtn.addEventListener('click', function (){
    activateWorkArea(false);
});

playBtn.addEventListener('click', function () {
    activateWorkArea(true);
});

//#region creating buttons (stop and reload)
// creating reload animations button with js
let reloadBtn = document.createElement('BUTTON');
reloadBtn.type = 'Reload';
reloadBtn.id = 'reload-btn';
reloadBtn.innerText = 'Reload';

function reloadAnimation(){
    displayEventsInNotifications('Reload button was pressed.');
    isSmallerMoving = false;
    isBiggerMoving = false;

    setInitialPositionOfCircles(animArea.clientHeight, animArea.clientWidth);
    controls.removeChild(reloadBtn);
    controls.removeChild(notifications);
    controls.appendChild(startBtn);
    controls.appendChild(notifications);
}

reloadBtn.addEventListener('click', function (){
    reloadAnimation();
});

// creating stop animations button with js
let stopBtn = document.createElement('BUTTON');
stopBtn.type = 'Stop';
stopBtn.id = 'stop-btn';
stopBtn.innerText = 'Stop';

function stopAnimation(){
    displayEventsInNotifications('Stop button was pressed.');
    isSmallerMoving = false;
    isBiggerMoving = false;
    keepChecking = false;
    controls.removeChild(stopBtn);
    controls.removeChild(notifications);
    controls.appendChild(reloadBtn);
    controls.appendChild(notifications);
}

stopBtn.addEventListener('click', function (){
   stopAnimation();
});
//#endregion

function startMoving(){
    displayEventsInNotifications('Start button was pressed.');
    controls.removeChild(startBtn);
    controls.removeChild(notifications);
    controls.appendChild(stopBtn);
    controls.appendChild(notifications);

    isSmallerMoving = true;
    isBiggerMoving = true;
    keepChecking = true;
    animAreaHeight = animArea.clientHeight;
    animAreaWidth = animArea.clientWidth;

    moveSmallerCircle(animAreaHeight / 2);
    moveBiggerCircle(animAreaWidth / 2);
    checkIfSmallerOverlayedByBigger(xForSmaller, animAreaHeight / 2, animAreaWidth / 2, yForBigger);
}

startBtn.addEventListener('click', function (){
    startMoving();
});
//#endregion

//#region manipulations with coordinates of circles
function setCoordinatesForSmallerCircle(x, y){
    smallCircle.style.top = y + 'px';
    smallCircle.style.left = x + 'px';
}

function setCoordinatesForBiggerCircle(x, y){
    bigCircle.style.top = y + 'px';
    bigCircle.style.left = x + 'px';
}

function setInitialPositionOfCircles(height, width){
    isMovingRight = true;
    isMovingDown = true;
    xForSmaller = 0;
    yForBigger = 0;

    setCoordinatesForSmallerCircle(0, height / 2);
    setCoordinatesForBiggerCircle(width / 2, 0);
}
//#endregion

//#region moving circles

// moving smaller circle
let xForSmaller = 0;
let isMovingRight = true;

function moveSmallerCircle(yForSmaller){
    animAreaWidth = animArea.clientWidth;

    if (isSmallerMoving){
        if (xForSmaller >= animAreaWidth - SmallerDiameter) {
            isMovingRight = false;
            displayEventsInNotifications('Yellow circle hit the right wall.');
        }
        if (xForSmaller <= 0) {
            isMovingRight = true;
            displayEventsInNotifications('Yellow circle hit the left wall.')
        }

        if (isMovingRight){
            xForSmaller += shiftForSmaller;
            setCoordinatesForSmallerCircle(xForSmaller, yForSmaller);
        }
        else {
            xForSmaller -= shiftForSmaller;
            setCoordinatesForSmallerCircle(xForSmaller, yForSmaller);
        }

        setTimeout(function (){
            moveSmallerCircle(yForSmaller);
        }, 5);
    } else {
        return;
    }
}

let keepChecking = true;
function checkIfSmallerOverlayedByBigger(xOfSmaller, yOfSmaller, xOfBigger, yOfBigger){
    if (keepChecking){
        if (xOfSmaller >= xOfBigger && xOfSmaller <= xOfBigger + 32 &&
            yOfSmaller >= yOfBigger & yOfSmaller <= yOfBigger + 32){
            stopAnimation();
            displayEventsInNotifications('Red circle overlayed a yellow one.');
            console.log('animation stopped');
        }
        setTimeout( function (){
            checkIfSmallerOverlayedByBigger(xForSmaller, yOfSmaller,
                xOfBigger, yForBigger);
        }, 1);
    } else {
        return;
    }
}

// moving bigger circle
let yForBigger = 0;
let isMovingDown = true;

function moveBiggerCircle(xForBigger){
    animAreaHeight = animArea.clientHeight;

    if (isBiggerMoving){
        if (yForBigger >= animAreaHeight - BiggerDiameter) {
            isMovingDown = false;
            displayEventsInNotifications('Red circle hit the bottom wall.');
        }
        if (yForBigger <= 0) {
            isMovingDown = true;
            displayEventsInNotifications('Red circle hit the top wall.');
        }

        if (isMovingDown){
            yForBigger += shiftForBigger;
            setCoordinatesForBiggerCircle(xForBigger, yForBigger);
        } else {
            yForBigger -= shiftForBigger;
            setCoordinatesForBiggerCircle(xForBigger, yForBigger);
        }

        setTimeout(function (){
            moveBiggerCircle(xForBigger);
        }, 5);
    } else {
        return;
    }
}

//#endregion

function displayEventsInNotifications(event){
    notifications.innerText = event;
    saveEventsToLocalStorage(event);
}

let eventsCounter = 0;
function saveEventsToLocalStorage(event){
    let date = new Date();

    event = event + ' - ' + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds();
    localStorage.setItem(`${eventsCounter}event`, event);
    eventsCounter++;
}

function addEventsFromLocalStorageToBlock4(){
    for (let i = 0; i < eventsCounter + 1; i++){
        let li = document.createElement('LI');
        li.id = `${i}event`;
        li.innerText = localStorage.getItem(`${i}event`);
        storageList.appendChild(li);
    }
}





