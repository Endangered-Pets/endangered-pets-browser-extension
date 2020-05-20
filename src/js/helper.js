'use strict';

const helper = {
  /*
  * item
  *
  * Based on current HP, randomly select and display items for endangered pet.
  */
  item: (elements, state) => {
    const allItems = [elements.item.item1, elements.item.item2, elements.item.item3,
      elements.item.item4, elements.item.item5, elements.item.item6];
    let displayItems = [];

    // reset items
    allItems.forEach(elem => {
      elem.style.display = `none`;
    });

    if (state.goodieLevel > 0) {
      allItems.forEach(elem => {
        elem.classList.add(`color`);
      });
    }

    if(state.hp >= 80){
      displayItems = allItems;
    }
    else if (state.hp <= 79 && state.hp >= 50) {
      // pet is angry, show 5 items
      displayItems = allItems.slice(0,4);
    } else if (state.hp <= 49 && state.hp >= 20) {
      // pet is sick, show 5 items
      displayItems = allItems.slice(0,3);
    } else if (state.hp <= 19 && state.hp >= 1) {
      // pet is dying, show no items
      displayItems = allItems.slice(0,2);
    }
    else if (state.hp <=0) {
    displayItems = allItems.slice(0,0);
    }

    // display the items
    displayItems.forEach(elem => {
      elem.style.display = `block`;
    });
  },
  /*
  * setRandomAsset
  *
  * Pick one of the three assets randomly, at each state.
  *
  */
  setRandomAsset: (elements, state) => {
    const randIndex = Math.floor(Math.random() * 3);
    const stateAssets = {
      state1: [
        `../../assets/browser-pets/pangolin/state1.gif`
      ],
      state2: [
        `../../assets/browser-pets/pangolin/state1.gif`
      ],
      state3: [
        `../../assets/browser-pets/pangolin/state2.gif`
      ],
      state4: [
        `../../assets/browser-pets/pangolin/state2.gif`
      ],
      state5: [
        `../../assets/browser-pets/pangolin/state3.gif`
      ],
      state6: [
        `../../assets/browser-pets/pangolin/state6.gif`
      ]
    };

    if (state.hp == 100) {
      // pet is full health
      elements.pet.src = stateAssets.state1[0];
    } else if (state.hp <= 99 && state.hp >= 80 || state.hp == 96 || state.hp == 92 || state.hp == 88 || state.hp == 84 || state.hp == 80) {
      // pet is content
      elements.pet.src = stateAssets.state1[0];
    } else if (state.hp <= 79 && state.hp >= 60 || state.hp == 76 || state.hp == 72 || state.hp == 68 || state.hp == 64 || state.hp == 60) {
      // pet is irritated
      elements.pet.src = stateAssets.state2[0];
    } else if (state.hp <= 59 && state.hp >= 40 || state.hp == 56 || state.hp == 52 || state.hp == 48 || state.hp == 44 || state.hp == 40) {
      // pet is angry
      elements.pet.src = stateAssets.state3[0];
    } else if (state.hp <= 39 && state.hp >= 20 || state.hp == 36 || state.hp == 32 || state.hp == 28 || state.hp == 24 || state.hp == 20) {
      // pet is sick
      elements.pet.src = stateAssets.state4[0];
    } else if (state.hp <= 19 && state.hp >= 1 || state.hp == 16 || state.hp == 12 || state.hp == 8 || state.hp == 4) {
      // pet is dying
      elements.pet.src = stateAssets.state5[0];
    } else if (state.hp === 0) {
      // pet is dead (RIP)
      elements.pet.src = stateAssets.state6[0];
    }
  },
  /*
  * handleGoodieTimer
  *
  * Start the interval timer that will be used to get new goodies based on tab count over a period of time.
  */
  handleGoodieTimer: (elements, state) => {
    // if more than 5 tabs, stop goodie timer else start it if it hasnt already been.
    // remove pending blink animation on next goodie segment.
    if (state.tabCount > 5) {

      const uiSegments = elements.goodieUISegments;
      for (let idx = 0; idx < uiSegments.length; idx++) {
        uiSegments[idx].classList.remove(`toggle`);
      }
    }
    if(state.tabCount < 11){
      elements.pet.addEventListener(`mouseover`, function() {
        elements.pet.src = `../../assets/browser-pets/pangolin/touch-state.gif`;
      });
      elements.pet.addEventListener(`mouseout`, function() {
        elements.pet.src = `../../assets/browser-pets/pangolin/state1.gif`;
      });
    }



  },
  /*
  * updateGoodieUI
  *
  * Update goodie UI.
  */
  updateGoodieUI: (elements, state) => {
    const goodieLevel = state.goodieLevel;
    const numberOfSegments = state.goodieStage;
    const uiSegments = elements.goodieUISegments;

    // we either have a goodie or are on a new goodie stage. turn off all goodie segments.
    if (numberOfSegments === 0 && goodieLevel < 2) {
      for (let idx = 0; idx < uiSegments.length; idx++) {
        uiSegments[idx].classList.remove(`on`);
        uiSegments[idx].classList.remove(`toggle`);
        uiSegments[idx].classList.add(`off`);
      }

      uiSegments[0].classList.add(`toggle`);
    } else {
      // If goodie has been unlocked, turn on required number of segments.
      for (let idx = 0; idx <= numberOfSegments; idx++) {
        uiSegments[idx].classList.remove(`off`);
        uiSegments[idx].classList.remove(`toggle`);
        uiSegments[idx].classList.add(`on`);
      }

      if (numberOfSegments < 10 && goodieLevel < 2) {
        uiSegments[numberOfSegments].classList.add(`toggle`);
      }
    }

    elements.goodieSilhouettes.classList.remove(`level-0`);
    elements.goodieSilhouettes.classList.remove(`level-1`);
    elements.goodieSilhouettes.classList.add(`level-${state.goodieLevel}`);

    helper.setUI(elements, state);
  },
  /*
  *
  */
  setUI: (elements, state) => {
    const hp = state.hp <= 0 ? state.hp = 0 : state.hp;

    // handle hp update
    elements.goodieState.innerText = `${state.goodieStage}/10`;
    elements.hpProgressBar.style.width = `${hp}%`;
    elements.hpState.innerText = `${Math.abs(hp)}/100`;
    elements.petStatus.innerText = `${state.petStatus}`;
    elements.tabCount.innerText = `You have ${state.tabCount} tabs open`;

    // set random pet asset from the variants
    helper.setRandomAsset(elements, state);

    helper.item(elements, state);
  }
};
