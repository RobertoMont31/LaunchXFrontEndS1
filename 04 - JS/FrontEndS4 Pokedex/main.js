// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const pokePrevButton = document.querySelector('.left-button');
const pokeNextButton = document.querySelector('.right-button');
const pokeAttackOne = document.querySelector('.attack-one');
const pokeAttackTwo = document.querySelector('.attack-two');

// Constants and Variables
let prevUrl = null;
let nextUrl = null;


//Functions

const resetScreen = () => {
    mainScreen.classList.remove('hide');
    const classListLength = mainScreen.classList.length;
    for (let i = 0; i < classListLength; i++) {
        mainScreen.classList.remove(mainScreen.classList[0]);
    }
    mainScreen.classList.add("main-screen");
};

const capitalize = (str) => str[0].toUpperCase()+str.substr(1);

const fetchPokeList = url => {
    fetch(url)
    .then(res => res.json())
    .then(data => {
        const { results, previous, next } = data;
        prevUrl = previous; 
        nextUrl = next; 

        for (let i = 0; i < pokeListItems.length ; i++) {
            const pokeListItem = pokeListItems[i];
            const resultData = results[i];

            if (resultData) {
                const { name, url } = resultData;
                const urlArray = url.split('/');
                const id = urlArray[urlArray.length - 2];
                pokeListItem.textContent = id + '. '+capitalize(name);
            } else {
                pokeListItem.textContent = '';
            }
        }
    });
};

const handleRightClick = () => {
    if (nextUrl){
        fetchPokeList(nextUrl);
    };
}; 

const handleLeftClick = () => {
    if(prevUrl){
        fetchPokeList(prevUrl);
    }
};

const handleListItemClick = (e) =>{
    if (!e.target) return;

    const listItem = e.target;
    if (!listItem.textContent) return;

    const id = listItem.textContent.split('.')[0];
    fetchPokeData(id);
};

const fetchPokeData = id => {

    fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then(res => res.json())
    .then(data => {
        resetScreen();
        const dataTypes = data['types'];
        const dataFirstType = dataTypes[0];
        pokeTypeOne.textContent = dataFirstType['type']['name'];
        if(dataTypes[1]) {
            const dataFirstType = dataTypes[1];
            const dataSecondType = dataTypes[0];
            pokeTypeTwo.classList.remove('hide');
            pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
            pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
            mainScreen.classList.add(dataFirstType['type']['name'])
        } else {
            const dataFirstType = dataTypes[0];
            pokeTypeOne.textContent = dataFirstType['type']['name'];
            pokeTypeTwo.classList.add('hide');
            pokeTypeTwo.textContent = "";
            mainScreen.classList.add(dataFirstType['type']['name'])
        };

        const dataMoves = data['moves'];
        const dataFirstMove = dataMoves[0];
        pokeAttackOne.textContent = dataFirstMove['move']['name'];
        if (dataMoves[1]) {
            const dataFirstMove = dataMoves[1];
            const dataSecondMove = dataMoves[0];
            pokeAttackTwo.classList.remove('hide');
            pokeAttackOne.textContent = capitalize(dataFirstMove['move']['name']);
            pokeAttackTwo.textContent = capitalize(dataSecondMove['move']['name']);
            mainScreen.classList.add(dataFirstMove['move']['name'])
        } else { 
            const dataFirstMove = dataMoves[0];
            pokeAttackOne.textContent = dataFirstMove['move']['name'];
            pokeAttackTwo.classList.add('hide');
            pokeAttackTwo.textContent = "";
            mainScreen.classList.add(dataFirstMove['move']['name'])
        };
        

        mainScreen.classList.add(dataFirstType['type']['name']);
        mainScreen.classList.remove('hide');
        pokeName.textContent = capitalize(data['name']);
        pokeId.textContent = '#'+ data['id'].toString().padStart(3, '0');
        pokeWeight.textContent = data['weight'];
        pokeHeight.textContent = data['height'];
        pokeFrontImage.src = data['sprites']['front_default'] || '';
        pokeBackImage.src = data['sprites']['back_default'] || ''; 
    });

};

// event handlers 

pokeNextButton.addEventListener('click', handleRightClick);
pokePrevButton.addEventListener('click', handleLeftClick);

for (const pokeListItem of pokeListItems){
    pokeListItem.addEventListener('click', handleListItemClick);
}

//Initialize App

fetchPokeList('https://pokeapi.co/api/v2/pokemon?offset=0&limit=20');