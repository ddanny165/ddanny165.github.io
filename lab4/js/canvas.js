const workArea = document.getElementById('work');
const box3 = document.getElementById('box3');
const storageList = document.getElementById('storageInfo');
const playBtn = document.getElementById('play-btn');

let canvas = document.getElementById('canvas-animation');
let context = canvas.getContext('2d');

canvas.height = workArea.clientHeight;
canvas.width = workArea.clientWidth;

//#region setting initial values
let keepChecking = true;

// for smaller
let xForSmaller = 0;
let yForSmaller = canvas.height / 2;
let isSmallerMoving = true;
let isMovingRight = true;

// for bigger
let xForBigger = canvas.width / 2;
let yForBigger = 10;
let isBiggerMoving = true;
let isMovingDown = true;
//#endregion


//#region getting data from server
let biggerSize = 0;
let smallerSize = 0;
let shiftForSmaller = 0;
let shiftForBigger = 0;

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
        biggerSize = contentParameters.biggerDiameter;
        smallerSize = contentParameters.smallerDiameter;
        shiftForSmaller = contentParameters.shiftForSmaller;
        shiftForBigger = contentParameters.shiftForBigger;
    } else {
        alert("HTTP ERROR: " + response.status);
    }
}
//#endregion

// creating stop animations button with js
let stopBtn = document.createElement('BUTTON');
stopBtn.type = 'Stop';
stopBtn.id = 'stop-btn';
stopBtn.innerText = 'Stop';

let reloadBtn = document.createElement('BUTTON');
reloadBtn.type = 'Reload';
reloadBtn.id = 'reload-btn';
reloadBtn.innerText = 'Reload';

//#buttons and their events
function startAnimation(){
    keepChecking = true;
    isSmallerMoving = true;
    isBiggerMoving = true;
    saveEventsToLocalStorage('Start button was pressed.');

    checkIfSmallerOverlayedByBigger();
    moveBiggerCircle();
    moveSmallerCircle();
    box3.removeChild(playBtn);
    box3.appendChild(stopBtn);
    box3.removeChild(reloadBtn);
}
playBtn.addEventListener('click', function (){
    startAnimation();
});

function stopAnimation(){
    keepChecking = false;
    isSmallerMoving = false;
    isBiggerMoving = false;
    box3.removeChild(stopBtn);
    box3.appendChild(playBtn);
    box3.appendChild(reloadBtn);
    addEventsFromLocalStorageToBlock4();
}
stopBtn.addEventListener('click', function (){
   stopAnimation();
});

function reloadAnimation(){
    clearSmallerCircle();
    clearBiggerCircle();

    isSmallerMoving = false;
    isBiggerMoving = false;
    xForSmaller = 10;
    yForSmaller = canvas.height / 2;
    xForBigger = canvas.width / 2;
    yForBigger = 25;

    drawCircle(xForSmaller, yForSmaller, smallerSize, true);
    drawCircle(xForBigger, yForBigger, biggerSize, false);
    box3.removeChild(reloadBtn);
}

reloadBtn.addEventListener('click', function (){
    reloadAnimation();
});
//#endregion

//#region clearing circles
function clearSmallerCircle(){
    context.beginPath();
    context.clearRect(xForSmaller - smallerSize / 2 - 1, yForSmaller - smallerSize / 2 - 1,
        smallerSize + 2, smallerSize + 2);
    context.closePath();
}

function clearBiggerCircle(){
    context.beginPath();
    context.clearRect(xForBigger - biggerSize / 2 - 1, yForBigger - biggerSize / 2 - 1,
        biggerSize + 2, biggerSize + 2);
    context.closePath();
}
//#endregion

//#region moving circles
function drawCircle(xOfCircle, yOfCircle, circleDiameter, isSmaller){
    context.beginPath();
    context.arc(xOfCircle, yOfCircle, circleDiameter / 2,
        0, 2 * Math.PI, false);
    if (isSmaller){
        context.fillStyle = 'yellow';
    }
    else {
        context.fillStyle = 'red';
    }
    context.fill();
    context.closePath();
}

function moveSmallerCircle() {
    if (isSmallerMoving){
        clearSmallerCircle();
        if (xForSmaller >= canvas.width - smallerSize) {
            isMovingRight = false;
            saveEventsToLocalStorage('Yellow circle hit the right wall.');
        }
        if (xForSmaller <= 0) {
            isMovingRight = true;
            saveEventsToLocalStorage('Yellow circle hit the left wall.');
        }

        if (isMovingRight){
            xForSmaller += shiftForSmaller;
        }
        else {
            xForSmaller -= shiftForSmaller;
        }

        drawCircle(xForSmaller, yForSmaller, smallerSize, true);

        setTimeout(function (){
            moveSmallerCircle(yForSmaller);
        }, 15);
    } else {
        return;
    }
}

function moveBiggerCircle(){
    if (isBiggerMoving){
        clearBiggerCircle();
        if (yForBigger >= workArea.offsetHeight - biggerSize * 0.6) {
            isMovingDown = false;
            saveEventsToLocalStorage('Red circle hit the bottom wall.');
        }

        if (yForBigger <= biggerSize / 2) {
            isMovingDown = true;
            saveEventsToLocalStorage('Red circle hit the top wall.');
        }

        if (isMovingDown){
            yForBigger += shiftForBigger;
        } else {
            yForBigger -= shiftForBigger;
        }

        drawCircle(xForBigger, yForBigger, biggerSize, false);

        setTimeout(function (){
            moveBiggerCircle();
        }, 15);
    } else {
        return;
    }
}
//#endregion

//#region checkingIfNotOverlayed
function checkIfSmallerOverlayedByBigger(){
    if (keepChecking){
        if (xForSmaller >= xForBigger - 25 && xForSmaller <= xForBigger + 25 &&
            yForSmaller >= yForBigger - 25 && yForSmaller <= yForBigger + 25){
            saveEventsToLocalStorage('Red circle overlayed the yellow one.');
            stopAnimation();
            console.log('animation stopped');
        }
        setTimeout( function (){
            checkIfSmallerOverlayedByBigger();
        }, 5);
    } else {
        return;
    }
}
//#endregion

//#region working with local storage
let eventsCounter = 0;
function saveEventsToLocalStorage(event){
    let date = new Date();

    event = event + ' - ' + date.getHours() + ':'
        + date.getMinutes() + ':'
        + date.getSeconds();
    localStorage.setItem(`${eventsCounter}event2`, event);
    eventsCounter++;
}

function addEventsFromLocalStorageToBlock4(){
    for (let i = 0; i < eventsCounter + 1; i++){
        let li = document.createElement('LI');
        li.id = `${i}event2`;
        li.innerText = localStorage.getItem(`${i}event2`);
        storageList.appendChild(li);
    }
}
//#endregion