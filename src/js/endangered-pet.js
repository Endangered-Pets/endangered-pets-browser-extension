'use strict';

document.addEventListener(`DOMContentLoaded`, () => {
  //Change Background to random color from colors array
  var colors = ['#FC7E7E', '#F2CC7B', '#A2D8C0', '#C8B8F2'];
  document.body.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

  let state;
  const elements = {
    body: document.getElementById(`endangered-pet`),
    preloader: document.getElementById(`preloader-container`),
    goodieState: document.getElementById(`goodie-state`),
    goodieUISegments: document.querySelectorAll('.goodie-segment'),
    goodieSilhouettes: document.getElementById('goodie-silhouettes'),
    hpProgressBar: document.getElementById(`hp-indicator`),
    hpState: document.getElementById(`hp-indicator-text`),
    item: {
      item1: document.getElementById(`item-1`),
      item2: document.getElementById(`item-2`),
      item3: document.getElementById(`item-3`),
      item4: document.getElementById(`item-4`),
      item5: document.getElementById(`item-5`),
      item6: document.getElementById(`item-6`)
    },
    pet: document.querySelector(`#pet a img`),
    petStatus: document.getElementById(`pet-text`),
    tabCount: document.getElementById(`tab-count`),
    tips: document.querySelectorAll(`.tip`),
    tipModals: {
      goodie: document.getElementById(`goodie-tip`),
      health: document.getElementById(`health-tip`),
      pet: document.getElementById(`pet-tip`)
    }
  };

  chrome.storage.onChanged.addListener((changes, areaName) => {
    state = changes.pet.newValue;

    // preemptively call function to update UI based on goodie progress from prior tab/session
    helper.updateGoodieUI(elements, state);

    // call handleGoodieTimer to see if we meet tab count requirements
    helper.handleGoodieTimer(elements, state);

    // set UI
    helper.setUI(elements, state);

    // hide preloader
    elements.preloader.style.display = `none`;
  });



  // tip modals - click, mouseover, mouseout
  elements.tips.forEach(tip => {
    tip.addEventListener(`click`, e => {
      e.preventDefault();
    });

    tip.addEventListener(`mouseenter`, e => {
      e.preventDefault();
      const anchor = e.currentTarget;

      // prevent spamming
      if (anchor.classList.contains(`transition`)) {
        return;
      }

      if (anchor.classList.contains(`goodie`)) {
        elements.tipModals.goodie.style.display = `grid`;
      } else if (anchor.classList.contains(`health`)) {
        elements.tipModals.health.style.display = 'grid';
      } else {
        elements.tipModals.pet.style.display = `grid`;
      }

      anchor.classList.add(`transition`);
    });

    tip.addEventListener(`mouseleave`, e => {
      e.preventDefault();
      const anchor = e.currentTarget;

      if (anchor.classList.contains(`goodie`)) {
        elements.tipModals.goodie.style.display = `none`;
      } else if (anchor.classList.contains(`health`)) {
        elements.tipModals.health.style.display = `none`;
      } else {
        elements.tipModals.pet.style.display = `none`;
      }

      anchor.classList.remove(`transition`);
    });
  });
});
