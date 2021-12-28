'use strict';

addInputParametersForm();

//region firstTask + post method nested in addInputContentOfTabsForm function
function addInputNumOfTabsForm(){
    let formToGetNumOfTabs = document.createElement('FORM');
    formToGetNumOfTabs.action = 'lab-work.html';
    formToGetNumOfTabs.method = 'POST';

    let formInputNumOfTabs = document.createElement('INPUT');
    formInputNumOfTabs.type = 'number';
    formInputNumOfTabs.id = 'numOfTabsInput';
    formInputNumOfTabs.autocomplete = 'off';
    formInputNumOfTabs.placeholder = 'define num of tabs';
    formToGetNumOfTabs.appendChild(formInputNumOfTabs);

    let btn = document.createElement('BUTTON');
    btn.innerHTML = "Submit";
    btn.onclick = function (){
        let numOfTabs = document.getElementById('numOfTabsInput').value;
        if (numOfTabs === null || numOfTabs <= 0){
            alert('Number of tabs can not be null or equal to ' + numOfTabs);
            return;
        }
        if (numOfTabs > 10){
            alert('Why do you need than many tabs? Lmao');
            return;
        }

        addInputContentOfTabsForm(numOfTabs);
        document.getElementById("box 5").removeChild(formToGetNumOfTabs);
    };
    formToGetNumOfTabs.appendChild(btn);
    document.getElementById("box 5").appendChild(formToGetNumOfTabs);
}

function addInputContentOfTabsForm(numOfTabs){
    let formToGetContentOfTabs = document.createElement('FORM');
    formToGetContentOfTabs.action = 'lab-work.html';
    formToGetContentOfTabs.method = 'POST';

    for (let i = 0; i < numOfTabs; i++){
        let formInputContentOfTabs = document.createElement('INPUT')
        formInputContentOfTabs.type = 'text';
        formInputContentOfTabs.id = 'contentOfTabs' + i;
        formInputContentOfTabs.autocomplete = 'off';
        formInputContentOfTabs.placeholder = 'input tab' + (i + 1) + ' content';
        formToGetContentOfTabs.appendChild(formInputContentOfTabs);
    }

    let contentsButton = document.createElement('BUTTON');
    contentsButton.innerHTML = "Submit";
    contentsButton.onclick = function (){
        let contentsOfTabs = [];
        for (let i = 0; i < numOfTabs; i++){
            contentsOfTabs[i] = document.getElementById('contentOfTabs' + i).value;
        }

        // TODO: CONTENT OF TABS AND THEIR NUMBER IS HERE
        postContentsParameters(numOfTabs, convertStringArrayToSingleString(contentsOfTabs)).then(() => {
            console.log('Async function |postContentsParameters| works correctly');
        }).catch(error => {
            console.log('Error executing the async function |postContentsParameters|' + error);
        });

        addTabsToTheMainBlock(numOfTabs, contentsOfTabs);
        document.getElementById("box 5").removeChild(formToGetContentOfTabs);
    };
    formToGetContentOfTabs.appendChild(contentsButton);
    document.getElementById("box 5").appendChild(formToGetContentOfTabs);
}

function addInputParametersForm(){
    addInputNumOfTabsForm();
}

function addTabsToTheMainBlock(numOfTabs, contentsOfTabs){
    let tabsWrapper = document.createElement('ul');
    tabsWrapper.className = 'nav nav-tabs';

    for (let i = 0; i < numOfTabs; i++){
        let tab = document.createElement('li');
        tab.className = 'nav-item';

        let linkTab = document.createElement('a');
        linkTab.className = 'nav-link';
        linkTab.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        linkTab.target = '_blank';
        linkTab.text = contentsOfTabs[i];
        tab.appendChild(linkTab);

        tabsWrapper.appendChild(tab);
    }
    document.getElementById('box 5').appendChild(tabsWrapper);
}
//endregion

//region secondTask
function getUniqueUserID() {
    let randomVal = Math.floor(Math.random() * 100) + Date.now() - 1637269800000;
    while (randomVal > 100000){
        randomVal -= 95000;
    }
    return randomVal;
}

function convertStringArrayToSingleString(stringArray){
    return stringArray.join(' ');
}

async function postContentsParameters(numOfTabs, contentsOfTabs){
    if (localStorage.length > 0){
        putContentsParameters(numOfTabs, contentsOfTabs).then(() => {
            console.log('Async function |putContentsParameters| works correctly');
        }).catch(error => {
            console.log('Error executing the async function |putContentsParameters|' + error);
        });
        return;
    }
    if (localStorage.length === 0){
        let newUserID = getUniqueUserID();
        localStorage.setItem('id', newUserID);
    }

    let contentsParameters = {
        "id": localStorage.getItem('id'),
        "numOfTabs": numOfTabs,
        "contentOfTabs": contentsOfTabs
    };

    let url = 'https://localhost:44346/api/parameters/';
    let response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(contentsParameters)
    });

    if (response.ok) {
        alert('good to go');
    } else {
        alert("HTTP ERROR: " + response.status);
    }
}

async function putContentsParameters(numOfTabs, contentsOfTabs){
    let newContentsParameters = {
        "id": localStorage.getItem('id'),
        "numOfTabs": numOfTabs,
        "contentOfTabs": contentsOfTabs
    };

    let url = 'https://localhost:44346/api/parameters/' + localStorage.getItem('id');
    let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(newContentsParameters)
    });

    if (response.ok) {
        alert('good to go');
    } else {
        alert("HTTP ERROR: " + response.status);
    }
}
//endregion


