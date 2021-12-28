'use strict';
//region part of 5th task
addPhotosFromLocalStorageToPage();
//endregion

//region 1st task
function changePlacesOfTwoTexts(text1 , text2){
    let temp = text1.innerHTML;
    text1.innerHTML = text2.innerHTML;
    text2.innerHTML = temp;
}

let text2 = document.getElementById("text2");
let text6 = document.getElementById("text6");

changePlacesOfTwoTexts(text2, text6);
//endregion

//region 2nd task
let rhombusSide = 10;
let rhombusHeight = 7;

function countRhombusArea(sideOfRhombus, heightOfRhombus){
    return sideOfRhombus * heightOfRhombus;
}

let rhombusArea = countRhombusArea(rhombusSide, rhombusHeight);

let paragraphElementWithRhombusArea = document.createElement('p');
paragraphElementWithRhombusArea.append("Area of rhombus is: " + rhombusArea);
document.getElementById("box 5").append(paragraphElementWithRhombusArea);
//endregion

//region 5th task
let photosFormIsAdded = false;
let addedPhotosCounter = localStorage.length - 1;

function showPhotosForm() {
    if (!photosFormIsAdded){
        let formToGetPhotosFrom = document.createElement('FORM');
        formToGetPhotosFrom.name = 'imageForm';
        formToGetPhotosFrom.action = 'lab-work.html';
        formToGetPhotosFrom.method = 'POST';

        let photoInput = document.createElement('INPUT');
        photoInput.id = 'photoInput';
        photoInput.type = 'TEXT';
        photoInput.name = 'photosInput';
        photoInput.placeholder = 'paste an image URL here';
        formToGetPhotosFrom.appendChild(photoInput);

        let photosBtn = document.createElement('BUTTON');
        photosBtn.innerHTML = 'Submit';

        photosBtn.onclick = function () {
            let input = document.getElementById('photoInput');
            let image = document.createElement('img');
            addedPhotosCounter++;  //here
            image.src = " " + input.value;
            image.name = "addedImages1";

            document.getElementById("box 1").append(image);
            return false;
        };
        formToGetPhotosFrom.appendChild(photosBtn);

//button '1 - save photos'
        let savePhotosBtn = document.createElement('BUTTON');
        savePhotosBtn.innerHTML = '1 - save photos';

        savePhotosBtn.onclick = function () {
            window.close();
            window.open("https://ddanny165.github.io/lab2/html/lab-work.html");
            let d = document.getElementsByName("addedImages1");

            if (localStorage.length - 1 <= d.length){
                let indexOfLastAddedPhoto = 0;

                if (localStorage.length > 1){
                    indexOfLastAddedPhoto = localStorage.length - 1;
                }

                for (let i = indexOfLastAddedPhoto; i < d.length; i++) {
                    let image = document.createElement('img');
                    image.src = " " + d[i].src;
                    image.name = "addedImages4";

                    document.getElementById("box 4").append(image);
                    let iterator = localStorage.length;
                    localStorage.setItem('image' + iterator, image.src);
                }
                return false;
            }
            else{
                let sessionElementsCounter = 0;

                for (let i = 0; i < d.length; i++) {
                    let image = document.createElement('img');
                    image.src = " " + d[i].src;
                    image.name = "addedImages4";

                    document.getElementById("box 4").append(image);
                    let iterator = localStorage.length;
                    localStorage.setItem('image' + iterator, image.src);
                    sessionElementsCounter++;
                }

                for (let i = 0; i < sessionElementsCounter; i++) {
                    document.getElementById('box 4').removeChild(d[i]);
                }
                return false;
            }
        };
        formToGetPhotosFrom.appendChild(savePhotosBtn);

//button '2 - delete all photos'
        let deletePhotosBtn = document.createElement('BUTTON');
        deletePhotosBtn.innerHTML = '2 - delete all photos';

        deletePhotosBtn.onclick = function () {
            window.close();
            window.open("https://ddanny165.github.io/lab2/html/lab-work.html");
            //deleting photos from local storage
            let borderColor = localStorage.getItem('color');
            localStorage.clear();
            localStorage.setItem('color', borderColor)
            //deleting img from html
            let d = document.getElementsByName("addedImages1");
            for (let i = 0; i < d.length; i++) {
                document.getElementById('box 4').removeChild(d[i]);
            }
        };
        formToGetPhotosFrom.appendChild(deletePhotosBtn);

        document.getElementById("box 5").append(formToGetPhotosFrom);
        photosFormIsAdded = true;
    }
}

function addPhotosFromLocalStorageToPage(){
    addPhotosFromLocalStorageToBox("box 1");
    addPhotosFromLocalStorageToBox("box 4");
}

function addPhotosFromLocalStorageToBox(name) {
    if (localStorage.length > 1) {
        let i = 0;
        if (localStorage.color !== undefined) {
            i = 1;
        }

        for (i; i < localStorage.length; i++) {
            let image = document.createElement('img');
            image.src = " " + localStorage.getItem('image' + i);
            if (image.src !== null) {
                image.name = "addedImages4";
                document.getElementById(""+ name).append(image);
            }
        }
    }
}
//endregion

//region 3rd task
function addNumberForm(){
    let formToGetValuesFrom = document.createElement('FORM');
    formToGetValuesFrom.name = 'myForm';
    formToGetValuesFrom.action = 'lab-work.html';
    formToGetValuesFrom.method = 'POST';

    let formInput = document.createElement('INPUT');
    formInput.id = "input";
    formInput.type='TEXT';
    formInput.name='myInput';
    formInput.autocomplete = 'off';
    formInput.placeholder = 'type in 10 numbers';
    formToGetValuesFrom.appendChild(formInput);

    let btn = document.createElement('BUTTON');
    btn.innerHTML = "Submit";
    btn.onclick = function (){
        let input = document.getElementsByName('myInput');

        let inputString = String(input[0].value);
        const myArr = inputString.split(/ +/);

        let maxValue = Math.max.apply(null, myArr);
        let minValue = Math.min.apply(null, myArr);
        alert("Max value is: "+ maxValue + "\nMin value is: "+ minValue);

        document.cookie = `MaxValue = ${maxValue}; max-age = 7200; secure;`
        document.cookie = `MinValue = ${minValue}; max-age = 7200; secure;`
        alert(document.cookie);
    };
    formToGetValuesFrom.appendChild(btn);

    document.getElementById("box 5").append(formToGetValuesFrom);
}

if (document.cookie.length <= 0){
    addNumberForm();
}else{
    deleteCookies();
}

function deleteCookies(){
    if (document.cookie.length >= 1) {
        let result = confirm("Your cookies: " + document.cookie +
            ".\nWould you like to delete them?")
        if (result === true){
            document.cookie = "MaxValue=; max-age=0";
            document.cookie = "MinValue=; max-age=0";
            document.location.reload();
        }else{
            alert("In order to delete cookies, please reload the page!")
        }
    }
}
//endregion

//region 4th task
let  boxesBorderColor = "black";

if (localStorage.color !== null){
    boxesBorderColor = localStorage.color;
    changeBoxesBorderColor();
}

function getColorNameFromUser(){
    boxesBorderColor = prompt("define color: ", boxesBorderColor)
    if (localStorage.color !== null){
        delete localStorage.color;
    }
    localStorage.setItem("color", boxesBorderColor);
}

function changeBoxesBorderColor(){
    for (let i = 1; i < 7; i++){
        document.getElementById("box "+i).style.borderColor = boxesBorderColor;
    }
}

let input = document.getElementById("input");
input.addEventListener('click', getColorNameFromUser);
input.addEventListener('focus', changeBoxesBorderColor);
//endregion




