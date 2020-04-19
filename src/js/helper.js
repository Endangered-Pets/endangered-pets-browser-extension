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
    displayItems = allItems.slice(0,1);
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
        `../../assets/browser-pets/pangolin/idle-pangolin.gif`,
        `../../assets/browser-pets/pangolin/idle-pangolin.gif`,
        `../../assets/browser-pets/pangolin/idle-pangolin.gif`
      ],
      state2: [
        `../../assets/browser-pets/pangolin/idle-pangolin.gif`,
        `../../assets/browser-pets/pangolin/idle-pangolin.gif`,
        `../../assets/browser-pets/pangolin/idle-pangolin.gif`
      ],
      state3: [
        `../../assets/browser-pets/pangolin/asleep-pangolin.gif`,
        `../../assets/browser-pets/pangolin/asleep-pangolin.gif`,
        `../../assets/browser-pets/pangolin/asleep-pangolin.gif`
      ],
      state4: [
        `../../assets/browser-pets/pangolin/asleep-pangolin.gif`,
        `../../assets/browser-pets/pangolin/asleep-pangolin.gif`,
        `../../assets/browser-pets/pangolin/asleep-pangolin.gif`
      ],
      state5: [
        `../../assets/browser-pets/pangolin/RIP-pangolin.gif`,
        `../../assets/browser-pets/pangolin/RIP-pangolin.gif`,
        `../../assets/browser-pets/pangolin/RIP-pangolin.gif`
      ],
      state6: [
        `../../assets/browser-pets/pangolin/rip.gif`,
        `../../assets/browser-pets/pangolin/rip.gif`,
        `../../assets/browser-pets/pangolin/rip.gif`
      ]
    };

    if (state.hp === 100) {
      // pet is full health
      elements.pet.src = stateAssets.state1[randIndex];
    } else if (state.hp <= 99 && state.hp >= 80) {
      // pet is content
      elements.pet.src = stateAssets.state1[randIndex];
    } else if (state.hp <= 79 && state.hp >= 60) {
      // pet is irritated
      elements.pet.src = stateAssets.state2[randIndex];
    } else if (state.hp <= 59 && state.hp >= 40) {
      // pet is angry
      elements.pet.src = stateAssets.state3[randIndex];
    } else if (state.hp <= 39 && state.hp >= 20) {
      // pet is sick
      //TODO: CHANGE THIS TO STATE 4
      elements.pet.src = stateAssets.state4[randIndex];
    } else if (state.hp <= 19 && state.hp >= 1) {
      // pet is dying
      //TODO: CHANGE THIS TO STATE 5
      elements.pet.src = stateAssets.state5[randIndex];
    } else if (state.hp <= 0) {
      // pet is dead (RIP)
      //TODO: CHANGE THIS TO STATE 6
      elements.pet.src = stateAssets.state6[randIndex];
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
        elements.pet.src = `../../assets/browser-pets/pangolin/bigpangolin.gif`;
      });
      elements.pet.addEventListener(`mouseout`, function() {
        elements.pet.src = `../../assets/browser-pets/pangolin/idle-pangolin.gif`;
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

    // helper.setUI(elements, state);
  },
  /*
  *
  */
  setUI: (elements, state) => {
    const hp = state.hp <= 0 ? 0 : state.hp;

    // handle hp update
    elements.goodieState.innerText = `${state.goodieStage}/10`;
    elements.hpProgressBar.style.width = `${hp}%`;
    elements.hpState.innerText = `${hp}/100`;
    elements.petStatus.innerText = `${state.petStatus}`;
    elements.tabCount.innerText = `You have ${state.tabCount} tabs open`;

    // set random pet asset from the variants
    helper.setRandomAsset(elements, state);

    helper.item(elements, state);
  }
};
