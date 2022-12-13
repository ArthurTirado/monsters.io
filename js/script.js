"use strict";
let monsterImgAlt = ["unicornMonster", "jellyMonster", "bombMonster", "sixEyedMonster", "cloudMonster"];
let createdMonsterNames = [];

let MAX_DESCRIPTION_LENGTH = 128;
let MAX_FEATURE_SUM = 10;
let MAX_NB_MONSTERS = 5;
let MAX_MONSTER_NAME_LENGTH = 16;

let ATTACK_INDEX = 0;
let DEFENCE_INDEX = 1;
let HEALTH_POINTS_INDEX = 2;

let MIN_INDEX = 0;
let MAX_INDEX = 1;

let LEVEL_EASY = 0;
let LEVEL_MEDIUM = 1;
let LEVEL_HARD = 2;
let LEVEL_IMPOSSIBLE = 3;

let bossFeatures =
[
    // Level easy : attack, defence, health 
    [2, 2, 10],
    // Level medium
    [2, 4, 15],
    // Level Hard
    [3, 6, 15],
    // Level impossible
    [4, 9, 10]
];
let currentBossFeatures = [bossFeatures[LEVEL_EASY][ATTACK_INDEX], bossFeatures[LEVEL_EASY][DEFENCE_INDEX], bossFeatures[LEVEL_EASY][HEALTH_POINTS_INDEX]];
let bossInfos = [
    "Cette boss est pas très habile dans l'art de la bataille. Il est le plus facile, ideal pour les debutants",
    "Le boss ne fait pas de quartiers, pas de prisioniers. Cachez vous, attendez, et esperez qu'il ne vous trouve jamais",
    "Un vrai maître de bataille, cette boss attaque ses ennemies sans aucune pitié. Recommandé aux mieux joueurs seulement",
    "Bonne chance."
];
let monsterFeatures =
[
    //unicornMonster
    [
        // min and max attack points
        [1, 5],
        // min and max defence points
        [1, 5],
        // min and max health points
        [1, 5]
    ],
    //jellyMonster
    [
        // min and max attack points
        [1, 3],
        // min and max defence points
        [2, 6],
        // min and max health points
        [1, 7]
    ],
    //bombMonster
    [
        // min and max attack points
        [3, 6],
        // min and max defence points
        [0, 6],
        // min and max health points
        [2, 4]
    ],
    //sixEyedMonster
    [
        // min and max attack points
        [1, 5],
        // min and max defence points
        [2, 4],
        // min and max health points
        [1, 5]
    ],
    //cloudMonster
    [
        // min and max attack points
        [1, 8],
        // min and max defence points
        [1, 3],
        // min and max health points
        [1, 4]
    ]
];

//Boss
let canCreateMonster = true;
document.getElementById("bossLevel").addEventListener("change", updateBossLevel);
let bossElem = document.getElementById("boss");
let attackBossElem = bossElem.querySelector(".attackPoints");
let defenceBossElem = bossElem.querySelector(".defencePoints");
let healthBossElem = bossElem.querySelector(".healthPoints");
function updateBossLevel(e)
{
    let level = -1;
    bossElem.classList.remove("dead");
    switch(e.target.value)
    {
        case "easy":
            level = LEVEL_EASY;
            break;
        case "medium":
            level = LEVEL_MEDIUM;
            break;
        case "hard":
            level = LEVEL_HARD;
            break;
        case "impossible":
            level = LEVEL_IMPOSSIBLE;
            break;
    }
    document.getElementById("bossInfo").textContent = bossInfos[level];
    attackBossElem.textContent = bossFeatures[level][ATTACK_INDEX];
    defenceBossElem.textContent = bossFeatures[level][DEFENCE_INDEX];
    healthBossElem.textContent = bossFeatures[level][HEALTH_POINTS_INDEX];

    currentBossFeatures[ATTACK_INDEX] = bossFeatures[level][ATTACK_INDEX];
    currentBossFeatures[DEFENCE_INDEX] = bossFeatures[level][DEFENCE_INDEX];
    currentBossFeatures[HEALTH_POINTS_INDEX] = bossFeatures[level][HEALTH_POINTS_INDEX];
}

//#region FORM_VALIDATION
document.getElementById("monsterCreation").addEventListener("submit", validateForm);
let monsterStatElems = document.querySelectorAll("#monsterStats input[type='text']");

function validateForm(e){
    e.preventDefault();
    let errorMessageListElem = document.getElementById("errorMessage");
    errorMessageListElem.innerHTML = "";
    let hasError = false;

    // Name verification
    let monsterName = document.getElementById("cardTitle").value;
    if(monsterName.length < 1 || monsterName.length > MAX_MONSTER_NAME_LENGTH)
    {
        errorMessageListElem.innerHTML += "<li>Le nom est obligatoire</li>";
        hasError = true;
    }
    else
    {
        for(let i = 0; i < createdMonsterNames.length; i++)
        {
            if(createdMonsterNames[i] == monsterName)
            {
                errorMessageListElem.innerHTML += "<li>Le nom ne peut pas être répété</li>";
                hasError = true;
            }
        }
    }

    // Description verification
    let monsterDescription = document.getElementById("cardDescription").value;
    if(monsterDescription.length > MAX_DESCRIPTION_LENGTH)
    {
        errorMessageListElem.innerHTML += "<li>La description ne peut pas dépasser " + MAX_NB_CARACTERS_FOR_DESCRIPTION + " caractères</li>";
        hasError = true;
    }

    // Total sum verification
    let sumOfAttackDefenceHealth = computeTheSumADHP();
    if(sumOfAttackDefenceHealth > MAX_FEATURE_SUM)
    {
        errorMessageListElem.innerHTML += "<li>La somme des points d'attaque, de défence et de points de vie ne doit pas dépasser " + MAX_FEATURE_SUM + "</li>";
        hasError = true;
    }
    
    // Num of monsters
    if(createdMonsterNames.length == MAX_NB_MONSTERS)
    {
        errorMessageListElem.innerHTML += "<li>Vous avez atteint le nombre maximal de monstres</li>";
        hasError = true;
    }

    // Points verification
    for(let i = 0; i < monsterStatElems.length; i++)
    {
        if(monsterStatElems[i].value < 0)
        { 
            errorMessageListElem.innerHTML += "<li>Les points d'attaque, de défence et de points de vie ne doivent pas être négatifs</li>";
            hasError = true;
        }
    }

    let monsterNum = getMonsterNum();
    let monsterIndex = monsterNum - 1;

    let monsterDamage = document.getElementById("attack").value;
    let monsterDef = document.getElementById("defence").value;
    let monsterHP = document.getElementById("life").value;

    
    if(monsterDamage < monsterFeatures[monsterIndex][ATTACK_INDEX][MIN_INDEX] || monsterDamage > monsterFeatures[monsterIndex][ATTACK_INDEX][MAX_INDEX])
    {
        errorMessageListElem.innerHTML += "<li>Les points d'attaque du monstre doivent être entre " +  monsterFeatures[monsterIndex][ATTACK_INDEX][MIN_INDEX] + " et " +  monsterFeatures[monsterIndex][ATTACK_INDEX][MAX_INDEX] + "</li>";
        hasError = true;
    }
    if(monsterDef < monsterFeatures[monsterIndex][DEFENCE_INDEX][MIN_INDEX] || monsterDef > monsterFeatures[monsterIndex][DEFENCE_INDEX][MAX_INDEX])
    {
        errorMessageListElem.innerHTML += "<li>Les points de défence du monstre doivent être entre " +  monsterFeatures[monsterIndex][DEFENCE_INDEX][MIN_INDEX] + " et " +  monsterFeatures[monsterIndex][DEFENCE_INDEX][MAX_INDEX] + "</li>";
        hasError = true;
    }
    if(monsterHP < monsterFeatures[monsterIndex][HEALTH_POINTS_INDEX][MIN_INDEX] || monsterHP > monsterFeatures[monsterIndex][HEALTH_POINTS_INDEX][MAX_INDEX])
    {
        errorMessageListElem.innerHTML += "<li>Les points de vie du monstre doivent être entre " +  monsterFeatures[monsterIndex][HEALTH_POINTS_INDEX][MIN_INDEX] + " et " +  monsterFeatures[monsterIndex][HEALTH_POINTS_INDEX][MAX_INDEX] + "</li>";
        hasError = true;
    }

    if(!hasError && canCreateMonster)
    {
        createdMonsterNames[createdMonsterNames.length] = monsterName;
        
        let monsterColor = getMonsterColor();
        createMonster(monsterName, monsterNum, monsterColor, monsterImgAlt[monsterIndex], monsterDescription, monsterDamage, monsterDef, monsterHP);
    }
    if(!canCreateMonster)
    {
        errorMessageListElem.innerHTML += "<li> Vous ne peuvez pas créer des monstres après avoir commencé une bataille</li>";
    }
    
}
//#endregion
function getMonsterNum(){
    let monsterTypesRadioElem = document.querySelectorAll("#monsterSelect input");
    let monsterType = 0;
    for(let i = 0; i < monsterTypesRadioElem.length && monsterType == 0; i++)
    {
        if(monsterTypesRadioElem[i].checked)
        {
            monsterType = monsterTypesRadioElem[i].value;
        }
    }
    return monsterType;
}
function getMonsterColor(){
    let monsterColorsRadioElem = document.querySelectorAll("#monsterColors input");
    let monsterColor = "";
    for(let i = 0; i < monsterColorsRadioElem.length; i++)
    {
        if(monsterColorsRadioElem[i].checked)
        {
            monsterColor = monsterColorsRadioElem[i].value;
        }
    }
    return monsterColor;
}

//#region UPDATING_THE_SUM_ATTACK-DEFENCE-HP
for(let i = 0; i < monsterStatElems.length; i++)
{
    monsterStatElems[i].addEventListener("change", updateSum);
}
function updateSum(){
    let sum = computeTheSumADHP();
    let sumElem = document.getElementById("statsResult");
    sumElem.textContent = sum + "/10";
    sumElem.classList.remove("error");
    if(sum > MAX_FEATURE_SUM)
    {
        sumElem.classList.add("error");
    }
}

function computeTheSumADHP(){
    let sum = 0;
    for(let i = 0; i < monsterStatElems.length; i++)
    {
        sum += parseInt(monsterStatElems[i].value);
    }
    return sum;
}
//#endregion

//#region CREATE_MONSTER

function createMonster(monsterNom, monsterNum, monsterColor, monsterImgAlt, monsterInfo, monsterDamage, monsterDef, monsterHP){    
    let monsterInner = "<section id=\"" + createdMonsterNames.length + "\" class=\"" + monsterColor + " monsterHover" + "\"><span class=\"monsterName\">" + monsterNom + "</span><img src=\"img/monster" + monsterNum + ".png\" alt=\"" + monsterImgAlt + "\"><p>" + monsterInfo + "</p><div class=\"flexBox\"><img src=\"img/blade.svg\" alt=\"Attack points\"><span class=\"attackPoints\">" + monsterDamage + "</span><img src=\"img/sheild.svg\" alt=\"Defence points\"><span class=\"defencePoints\">" + monsterDef + "</span><img src=\"img/heart.svg\" alt=\"Health points\"><span class=\"healthPoints\">" + monsterHP + "</span></div></section>";
    document.getElementById("monsterList").innerHTML += monsterInner;
    updateCardDeck();
}
//#endregion

function updateCardDeck()
{
    let cards = document.querySelectorAll("#monsterList section");
    for(let i = 0; i < cards.length; i++)
    {
        cards[i].addEventListener("click", attackBoss);
    }
}
let firstAttack = false;
function attackBoss(e)
{
    if(!firstAttack)
    {
        firstAttack = true;
        switchDificultySelect();
    }
    let currentMonsterHealthElem = e.currentTarget.querySelector(".healthPoints");
    if(parseInt(currentMonsterHealthElem.textContent) > 0)
    {
        let currentMonsterAttackElem = e.currentTarget.querySelector(".attackPoints");        
        updateBossLife(parseInt(currentMonsterAttackElem.textContent));

        if(currentBossFeatures[HEALTH_POINTS_INDEX] > 0)
        {
            let currentMonsterDefenceElem = e.currentTarget.querySelector(".defencePoints");
            updateMonsterLife(currentMonsterHealthElem, currentMonsterDefenceElem);
        }
    }
    
    if(parseInt(currentMonsterHealthElem.textContent) < 1)
    {
        currentMonsterHealthElem.textContent = 0;
        e.currentTarget.classList.add("dead");
        e.currentTarget.classList.remove("monsterHover");
        e.currentTarget.removeEventListener("click", attackBoss);
        detectDefeat();
    }
}

function updateMonsterLife(currentMonsterHealthElem, currentMonsterDefenceElem)
{
    if(Math.random() > (parseFloat(currentMonsterDefenceElem.textContent)/10))
    {
        currentMonsterHealthElem.textContent -= currentBossFeatures[ATTACK_INDEX];
    }
}

function updateBossLife(attack)
{
    if(currentBossFeatures[HEALTH_POINTS_INDEX] > 0)
    {
        if(Math.random() > (parseFloat(currentBossFeatures[DEFENCE_INDEX])/10))
        {
            currentBossFeatures[HEALTH_POINTS_INDEX] -= attack;
            healthBossElem.textContent = currentBossFeatures[HEALTH_POINTS_INDEX];
        }
    }
    
    if(currentBossFeatures[HEALTH_POINTS_INDEX] < 1)
    {
        currentBossFeatures[HEALTH_POINTS_INDEX] = 0;
        healthBossElem.textContent = currentBossFeatures[HEALTH_POINTS_INDEX];

        bossElem.classList.add("dead");
        document.getElementById("bossInfo").innerHTML = "<span class=\"victory\">Vous avez gagné!</span>";
        clearCardDeck();
        switchDificultySelect();
        firstAttack = false;
    }
}
function switchDificultySelect()
{
    let dificultySelect = document.getElementById("bossLevel");

    if(dificultySelect.classList.contains("hidden"))
    {
        dificultySelect.classList.remove("hidden");
        dificultySelect.value = "none";
        canCreateMonster = true;
    }
    else
    {
        dificultySelect.classList.add("hidden");
        canCreateMonster = false;
    }
}

function detectDefeat()
{
    let cards = document.querySelectorAll("#monsterList section");
    let nbDisabled = 0;
    for(let i = 0; i < cards.length; i++)
    {
        if(cards[i].classList.contains("dead"))
        {
            nbDisabled++;
        }
    }
    if(nbDisabled == createdMonsterNames.length)
    {
        document.getElementById("bossInfo").innerHTML = "<span class=\"defeat\">Vous avez perdu!</span>";
        clearCardDeck();
        switchDificultySelect();
    }
}
function clearCardDeck()
{
    document.getElementById("monsterList").innerHTML = "";
    createdMonsterNames = [];
}