'use strict';

const TIME_INTERVAL = 3600000;
const MAX_HEALTH = 100;
const MIN_HEALTH = 0;
let goodieInterval = undefined;
let globalState = {};


function getTabsCount() {
  return new Promise((resolve) => {
    chrome.tabs.query({}, (tabs) => {
      let tabCount = tabs.length > 0 ? tabs.length - 1 : 0;
      resolve(tabCount);
    });
  });
}

function getStorage() {
  return new Promise((resolve) => {
    chrome.storage.local.get(`pet`, (data) => {
      if (typeof data.pet !== `undefined`) {
        globalState = data.pet;
        resolve(data.pet);
      } else {
          console.log("DEBUG: GETSTORAGE ELSE");
          const state = {
            hp: MAX_HEALTH,
            goodieLevel: 0,
            goodieStage: 0,
            goodieTimestamp: 0,
            pet: ``,
            petStatus: ``,
            tabCount: 0
          };

          getTabsCount().then(tabCount => {
            state.tabCount = tabCount;
            return chrome.storage.local.set({pet: state});
          }).then(() => {
            globalState = state;
            resolve(state);
          });
      }
    });
  });
}

function clearGoodieTimer() {
    clearInterval(goodieInterval);
    goodieInterval = undefined;
}

function handleGoodieTimer() {

  // if more than 5 tabs,  goodie timer else start it if it hasnt already been.
  const tabCount = globalState.tabCount;

  if (tabCount > 5) {
    clearGoodieTimer();
    return;
  }

  const now = Date.now();
  const canUpdate = now - globalState.goodieTimestamp >= TIME_INTERVAL ? true : false;

  if (tabCount < 6 && typeof goodieInterval === `undefined` && canUpdate) {
    goodieInterval = setInterval(() => {

      if (globalState.goodieLevel < 2) {
        if (globalState.goodieStage < 9) {
          globalState.goodieStage++;
          globalState.goodieTimestamp = Date.now();
        } else if (globalState.goodieStage === 9) {
          globalState.goodieStage = 0;
          globalState.goodieLevel++;
          globalState.goodieTimestamp = Date.now();
        }
      } else if (globalState.goodieLevel === 2) {
        globalState.goodieStage = 9;
        globalState.goodieTimestamp = Date.now();
        clearGoodieTimer();
      }

      globalState.lastUpdatedAt = Date.now();
      chrome.storage.local.set({pet: globalState});
      // console.log(`DEBUG: goodie timer started`, goodieInterval, state);
    }, TIME_INTERVAL);
  }
}

function updatePetState() {
  let state = {};

  getStorage().then(result => {
    state = result;
    return getTabsCount();
  }).then(tabCount => {
    state.tabCount = tabCount;
    state.hp = MAX_HEALTH - 4 * state.tabCount;
    //Can't go lower than 0 hp
    if(state.hp <= 1){
    state.hp = 0;
  }

    let statusText = [];
    const randIndex = Math.floor(Math.random() * 3);

    if (state.hp === MAX_HEALTH) {
      statusText = [
      `"The Pangolin is the only animal in the world covered head to toe in keratin scales "`,
      `"The Pangolin is the only animal in the world covered head to toe in keratin scales"`,
      `"The Pangolin is the only animal in the world covered head to toe in keratin scales"`];
      state.petStatus = statusText[randIndex];
    } else if (state.hp <= 99 && state.hp >= 80 || state.hp == 96 || state.hp == 92 || state.hp == 88 || state.hp == 84 || state.hp == 80) {
      statusText = [`There are 8 species of pangolin!`,
        `Like a skunk, pangolins can release a noxious- smelling acid to deter predators.`,
        `Pangolins are the most trafficked animals in the world!`];
      state.petStatus = statusText[randIndex];
    } else if (state.hp <= 79 && state.hp >= 60 || state.hp == 76 || state.hp == 72 || state.hp == 68 || state.hp == 64 || state.hp == 60) {
      statusText = [
        `There are eight species of Pangolin. Four are found in Asia: the Chinese, the Malayan, the Indian and the Palawan Pangolin. Four are found in Africa: the Tree Pangolin, the Giant Ground Pangolin, the Cape Pangolin and the Long-tailed Pangolin.`,
        `Cute pangolin pups hitch a ride on their mother’s tails for three months and remain in their mother’s care for five months before braving life solo.`,
        `A pangolin is taken from the wild every 5 minutes`];
      state.petStatus = statusText[randIndex];
    } else if (state.hp <= 59 && state.hp >= 40 || state.hp == 56 || state.hp == 52 || state.hp == 48 || state.hp == 44 || state.hp == 40) {
      statusText = [
        `The largest Pangolin is the Ground Pangolin`,
        `The smallest Pangolin is the Black-bellied Pangolin`,
        `Pangolins are also known as scaly ant-eaters`];
      state.petStatus = statusText[randIndex];
    } else if (state.hp <= 39 && state.hp >= 20 || state.hp == 36 || state.hp == 32 || state.hp == 28 || state.hp == 24 || state.hp == 20) {
      statusText = [
        `There are only 50,000 Pangolins left in existence!`,
        `There are 8 types of Pangolin`,
        `Pangolins have been linked with strands of Coronavirus!`];
      state.petStatus = statusText[randIndex];
    } else if (state.hp <= 19 && state.hp > 1) {
      statusText = [
        `Your Pangolin is Feeling Sick... Close tabs to heal your pet `,
        `Your Pangolin is Feeling Sick... Close tabs to heal your pet`,
        `Your Pangolin is feeling Sick.... Close tabs to heal your pet `];
      state.petStatus = statusText[randIndex];
    } else if(state.hp === MIN_HEALTH){
      statusText = [
        `RIP Pet Pangolin... Close more tabs to bring your endangered pet back to life `,
        `RIP Pet Pangolin... Close more tabs to bring your endangered pet back to life  `,
        `RIP Pet Pangolin... Close more tabs to bring your endangered pet back to life `];

      state.petStatus = statusText[randIndex];

}


//      `RIP Pet Pangolin... Close more tabs to bring your Endangeed Pet Back to Life!`];
    chrome.storage.local.set({pet: state}, () => {
      globalState = state;
      handleGoodieTimer();
    });
  });
}



chrome.runtime.onInstalled.addListener(() => {
  getStorage().then(state => {
    handleGoodieTimer();

    chrome.tabs.create({
       url: "index.html"
    });
  });
});


chrome.tabs.onCreated.addListener(() => {
  updatePetState();
});

chrome.tabs.onRemoved.addListener(() => {
  updatePetState();
});

chrome.tabs.onUpdated.addListener(() => {
  updatePetState();
});
