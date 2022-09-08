import {iosVhFix} from './utils/ios-vh-fix';
import {initModals} from './modules/modals/init-modals';

// ---------------------------------

window.addEventListener('DOMContentLoaded', () => {

  // Utils
  // ---------------------------------

  iosVhFix();

  // Modules
  // ---------------------------------

  // все скрипты должны быть в обработчике 'DOMContentLoaded', но не все в 'load'
  // в load следует добавить скрипты, не участвующие в работе первого экрана
  window.addEventListener('load', () => {
    initModals();

    // Удаление классов отключённого js

    Array.from(document.querySelectorAll('[data-has-no-js]')).forEach((element) => element.classList.remove('has-no-js'));

    // Кнопка проигрывания видео

    const videoButton = document.querySelector('[data-video-button]');
    const videoPlayer = document.querySelector('[data-video-player]');
    const videoPoster = document.querySelector('[data-video-poster]');

    if (videoButton && videoPlayer && videoPoster) {
      const hideVideoPoster = () => {
        setTimeout(() => {
          videoPoster.style.display = 'none';
        }, 500);
      };
      videoButton.addEventListener('click', () => {
        videoPoster.style.opacity = '0';
        videoPlayer.style.display = 'block';
        hideVideoPoster();
        videoPlayer.src += '&autoplay=1';
      });
    }

    // Табы

    const removeTabsContentsActiveClass = (tabsButtons, tabsContents) => {
      tabsButtons.forEach((button) => {
        button.classList.remove('is-active');
      });
      tabsContents.forEach((content) => {
        content.classList.remove('is-active');
      });
    };

    const setTabsEventListener = (tabsButtons, tabsContents) => {
      for (let i = 0; i < tabsButtons.length; i++) {
        tabsButtons[i].addEventListener('click', (evt) => {
          if (tabsButtons[i].href) {
            evt.preventDefault();
          }
          removeTabsContentsActiveClass(tabsButtons, tabsContents);
          tabsButtons[i].classList.add('is-active');
          tabsContents[i].classList.add('is-active');
        });
      }
    };

    const tabsButtons = Array.from(document.querySelectorAll('[data-tab-button]'));
    const tabsContents = Array.from(document.querySelectorAll('[data-tab-content]'));

    if (tabsButtons && tabsButtons.length > 0 && tabsContents && tabsContents.length > 0) {
      setTabsEventListener(tabsButtons, tabsContents);
    }

    // Слайдер

    const SliderDirections = {
      PREVIOUS: 'prev',
      NEXT: 'next',
    };

    const tabletMediaQuery = window.matchMedia('(max-width: 1199px)');
    const mobileMediaQuery = window.matchMedia('(max-width: 767px)');

    const updateSlidesNum = () => {
      let slidesNum = 4;
      if (mobileMediaQuery.matches) {
        slidesNum = 1;
      } else if (tabletMediaQuery.matches) {
        slidesNum = 2;
      }
      return slidesNum;
    };

    const slidersContainersArray = Array.from(document.querySelectorAll('[data-slider]'));
    let slidersArray = [];

    const getSliders = (slidesNum) => {
      for (let i = 0; i < slidersContainersArray.length; i++) {
        slidersArray[i] = {};
        slidersArray[i].numberOfSlides = slidersContainersArray[i].getAttribute('data-slides-num') ? slidersContainersArray[i].getAttribute('data-slides-num') : slidesNum;
        slidersArray[i].sliderLoop = slidersContainersArray[i].getAttribute('data-slider-loop');
        slidersArray[i].sliderPrevButton = slidersContainersArray[i].querySelector('[data-slider-prev-btn]');
        slidersArray[i].sliderNextButton = slidersContainersArray[i].querySelector('[data-slider-next-btn]');
        slidersArray[i].sliderCardsList = slidersContainersArray[i].querySelector('[data-slider-list]');
        slidersArray[i].slidesCollection = slidersArray[i].sliderCardsList.children;
        slidersArray[i].firstVisibleSlideIndex = 0;
        slidersArray[i].lastVisibleSlideIndex = slidersArray[i].numberOfSlides > slidersArray[i].slidesCollection.length ? (slidersArray[i].slidesCollection.length - 1) : (slidersArray[i].numberOfSlides - 1);
        slidersArray[i].prevPossibleClicks = 0;
        slidersArray[i].nextPossibleClicks = slidersContainersArray[i].getAttribute('data-slider-loop') ? '' : (slidersArray[i].slidesCollection.length - slidersArray[i].numberOfSlides);

        slidersArray[i].showSlide = (direction) => {
          if (direction === SliderDirections.PREVIOUS) {
            slidersArray[i].slidesCollection[slidersArray[i].lastVisibleSlideIndex].style.display = 'none';
            slidersArray[i].slidesCollection[slidersArray[i].slidesCollection.length - 1].style.display = 'grid';
            slidersArray[i].sliderCardsList.insertBefore(slidersArray[i].slidesCollection[slidersArray[i].slidesCollection.length - 1], slidersArray[i].slidesCollection[slidersArray[i].firstVisibleSlideIndex]);
          } else if (direction === SliderDirections.NEXT) {
            slidersArray[i].slidesCollection[slidersArray[i].firstVisibleSlideIndex].style.display = 'none';
            slidersArray[i].sliderCardsList.appendChild(slidersArray[i].slidesCollection[slidersArray[i].firstVisibleSlideIndex]);
            slidersArray[i].slidesCollection[slidersArray[i].lastVisibleSlideIndex].style.display = 'grid';
          }
        };
      }
    };

    const setSliderButtonsAbility = (slider) => {
      if (slider.slidesCollection.length <= slider.numberOfSlides && !slider.sliderLoop) {
        slider.sliderNextButton.setAttribute('disabled', 'true');
      }
      if (slider.firstVisibleSlideIndex === 0 && !slider.sliderLoop) {
        slider.sliderPrevButton.setAttribute('disabled', 'true');
      }
    };

    const updateSliderButtonsAbility = (slider) => {
      if (slider.prevPossibleClicks === 0) {
        slider.sliderPrevButton.setAttribute('disabled', 'true');
      } else {
        slider.sliderPrevButton.removeAttribute('disabled');
      }

      if (slider.nextPossibleClicks <= 0) {
        slider.sliderNextButton.setAttribute('disabled', 'true');
      } else {
        slider.sliderNextButton.removeAttribute('disabled');
      }
    };

    const setSliderCardsVisibility = (slider) => {
      for (let j = slider.firstVisibleSlideIndex; j <= slider.lastVisibleSlideIndex; j++) {
        slider.slidesCollection[j].style.display = 'grid';
      }

      if (slider.slidesCollection.length > slider.numberOfSlides) {
        for (let j = slider.numberOfSlides; j < slider.slidesCollection.length; j++) {
          slider.slidesCollection[j].style.display = 'none';
        }
      }
    };

    const increasePossibleClicks = (slider, direction) => {
      if (direction === SliderDirections.PREVIOUS) {
        slider.prevPossibleClicks--;
        slider.nextPossibleClicks++;
      } else if (direction === SliderDirections.NEXT) {
        slider.prevPossibleClicks++;
        slider.nextPossibleClicks--;
      }
    };

    const requestSlide = (slider, direction) => {
      if (!slider.sliderLoop) {
        if ((direction === SliderDirections.PREVIOUS && slider.prevPossibleClicks === 0) || (direction === SliderDirections.NEXT && slider.nextPossibleClicks <= 0)) {
          return;
        }
        increasePossibleClicks(slider, direction);
        updateSliderButtonsAbility(slider);
      }
      slider.showSlide(direction);
    };

    let touchstartX = 0;
    let touchendX = 0;

    const checkDirection = (slider) => {
      if (touchendX < touchstartX) {
        requestSlide(slider, SliderDirections.NEXT);
      }
      if (touchendX > touchstartX) {
        requestSlide(slider, SliderDirections.PREVIOUS);
      }
    };

    const setSliderEventListeners = (slider) => {
      slider.sliderPrevButton.addEventListener('click', () => requestSlide(slider, SliderDirections.PREVIOUS));
      slider.sliderNextButton.addEventListener('click', () => requestSlide(slider, SliderDirections.NEXT));

      document.addEventListener('touchstart', (evt) => {
        touchstartX = evt.changedTouches[0].screenX;
      });

      document.addEventListener('touchend', (evt) => {
        touchendX = evt.changedTouches[0].screenX;
        checkDirection(slider);
      });
    };

    const setSliders = (slidesNum) => {
      getSliders(slidesNum);
      for (let i = 0; i < slidersArray.length; i++) {
        setSliderButtonsAbility(slidersArray[i]);
        setSliderCardsVisibility(slidersArray[i]);
        setSliderEventListeners(slidersArray[i]);
      }
    };

    const updateSliders = (slidesNum) => {
      getSliders(slidesNum);
      for (let i = 0; i < slidersArray.length; i++) {
        setSliderButtonsAbility(slidersArray[i]);
        setSliderCardsVisibility(slidersArray[i]);
      }
    };

    let currentSlidesNum = updateSlidesNum();

    if (slidersContainersArray && slidersContainersArray.length > 0) {
      setSliders(currentSlidesNum);

      window.addEventListener('resize', () => {
        let newSlidesNum = updateSlidesNum();
        if (newSlidesNum !== currentSlidesNum) {
          currentSlidesNum = newSlidesNum;
          updateSliders(currentSlidesNum);
        }
      });
    }

    // Маска для телефона

    const phoneInputs = document.querySelectorAll('[data-tel-input]');

    if (phoneInputs && phoneInputs.length > 0) {

      let getInputNumbersValue = function (input) {
        return input.value.replace(/\D/g, '');
      };

      let onPhoneInput = (e) => {
        let input = e.target;
        let inputNumbersValue = getInputNumbersValue(input);
        let selectionStart = input.selectionStart;
        let formattedInputValue = '';

        if (!inputNumbersValue) {
          input.value = '';
        }

        if (input.value.length !== selectionStart) {
          if (e.data && /\D/g.test(e.data)) {
            input.value = inputNumbersValue;
          }
          return;
        }

        let firstNumber = input.value[0] !== '+' ? input.value[0] : '';

        formattedInputValue = input.value = '+7(' + firstNumber;
        if (inputNumbersValue.length > 1) {
          formattedInputValue += inputNumbersValue.substring(1, 4);
        }
        if (inputNumbersValue.length >= 5) {
          formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
        }
        if (inputNumbersValue.length >= 8) {
          formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
        }
        if (inputNumbersValue.length >= 10) {
          formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
        }
        input.value = formattedInputValue;
      };

      let onPhoneKeyDown = function (e) {
        let inputValue = e.target.value.replace(/\D/g, '');
        if (e.keyCode === 8 && inputValue.length === 1) {
          e.target.value = '';
        }
      };

      for (let phoneInput of phoneInputs) {
        phoneInput.addEventListener('keydown', onPhoneKeyDown);
        phoneInput.addEventListener('input', onPhoneInput, false);
        phoneInput.addEventListener('paste', (event) => {
          event.preventDefault();
        });
      }
    }
  });
});

// ---------------------------------

// ❗❗❗ обязательно установите плагины eslint, stylelint, editorconfig в редактор кода.

// привязывайте js не на классы, а на дата атрибуты (data-validate)

// вместо модификаторов .block--active используем утилитарные классы
// .is-active || .is-open || .is-invalid и прочие (обязателен нейминг в два слова)
// .select.select--opened ❌ ---> [data-select].is-open ✅

// выносим все в дата атрибуты
// url до иконок пинов карты, настройки автопрокрутки слайдера, url к json и т.д.

// для адаптивного JS используется matchMedia и addListener
// const breakpoint = window.matchMedia(`(min-width:1024px)`);
// const breakpointChecker = () => {
//   if (breakpoint.matches) {
//   } else {
//   }
// };
// breakpoint.addListener(breakpointChecker);
// breakpointChecker();

// используйте .closest(el)
