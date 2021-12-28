'use strict'

//region third + fourth tasks
if (localStorage.length > 0){
    let id = localStorage.getItem('id');

    getContentParameters(id).then(() => {
        console.log('Async function |getContentParameters| works correctly');
    }).catch(error => {
        console.log('Error executing the async function |getContentParameters|' + error);
    });
}

function convertStringToStringArray(contentsOfTabsString){
    return contentsOfTabsString.split(/ +/)
}

async function getContentParameters(id){
    let url = 'https://localhost:44346/api/parameters/' + id;
    let response = await fetch(url);

    if (response.ok) {
        let contentParameters = await response.json();
        addTabsToTheMainBlock(contentParameters.numOfTabs, contentParameters.contentOfTabs)
    } else {
        alert("HTTP ERROR: " + response.status);
    }
}

function addTabsToTheMainBlock(numOfTabs, contentsOfTabs){
    let contentsOfTabsArr = convertStringToStringArray(contentsOfTabs);

    let tabsWrapper2 = document.createElement('ul');
    tabsWrapper2.className = 'tabsWrapper';
    for (let i = 0; i < numOfTabs; i++){
        let tab2 = document.createElement('li');
        //TODO: CSS CLASSNAME

        let linkTab2 = document.createElement('a');
        //TODO: CSS CLASSNAME
        linkTab2.href = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
        linkTab2.target = '_blank';
        linkTab2.text = contentsOfTabsArr[i];
        tab2.appendChild(linkTab2);

        tabsWrapper2.appendChild(tab2);
    }
    document.getElementById('box 5').appendChild(tabsWrapper2);
}
//endregion
