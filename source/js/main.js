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
      if (tabsButtons && tabsButtons.length > 0 && tabsContents && tabsContents.length > 0) {
        for (let i = 0; i < tabsButtons.length; i++) {
          tabsButtons[i].addEventListener('click', () => {
            removeTabsContentsActiveClass(tabsButtons, tabsContents);
            tabsButtons[i].classList.add('is-active');
            tabsContents[i].classList.add('is-active');
          });
        }
      }
    };

    const tabsButtons = Array.from(document.querySelectorAll('[data-tab-button]'));
    const tabsContents = Array.from(document.querySelectorAll('[data-tab-content]'));

    setTabsEventListener(tabsButtons, tabsContents);
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
