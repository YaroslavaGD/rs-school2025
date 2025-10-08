const page = document.querySelector('.page');
const navButton = document.querySelector('.nav-button');
const nav = document.querySelector('.nav');
const navItems = [... document.querySelectorAll('.nav__item')];

const accordion = [...document.querySelectorAll('.faq-list__item')];

const modal = document.querySelector('.modal');
const modalWindow = modal.querySelector('.modal__window');
const modalButton = modal.querySelector('.modal__button');
const modalPriceButtons = [... document.querySelectorAll('.price__button')];

// MENU-FUNCTIONS
const toggleMenu = () => {
  const isOpen = navButton.classList.contains('nav-button--open');
  navButton.classList.toggle('nav-button--open');
  nav.classList.toggle('nav--open');
  page.classList.toggle('page--clip');
}

navButton.addEventListener('click', (e) => {
  e.stopPropagation();

  toggleMenu();
});

navItems.forEach(element => {
  element.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      toggleMenu();
      page.classList.remove('page--clip');
    }
  })
});

document.addEventListener('click', e => {
  const target = e.target;
  const isNav = target == nav || nav.contains(target);
  const isNavButton = target == navButton;
  const isNavOpen = nav.classList.contains('nav--open');

  if (!isNav && !isNavButton && isNavOpen) {
    toggleMenu();
  }
});

window.addEventListener('resize', function() {
  if (document.documentElement.clientWidth >= 768) {
    navButton.classList.remove('nav-button--open');
    page.classList.remove('page--clip');
    nav.classList.remove('nav--open');
  }
}, false);

//MODAL
const toggleModal = () => {
  const isOpen = modal.classList.contains('modal--open');
  modal.classList.toggle('modal--open');
  page.classList.toggle('page--clip');
}

modalPriceButtons.forEach(priceButton => {
  priceButton.addEventListener('click', e => {
    e.stopPropagation();
    toggleModal();
  });
});

modalButton.addEventListener('click', e => {
  e.stopPropagation();
  toggleModal();
});

document.addEventListener('click', e => {
  const target = e.target;
  const isModalWindow = target == modalWindow || modalWindow.contains(target);
  const isModalButton = target == modalButton;
  const isModalOpen = modal.classList.contains('modal--open');

  if (!isModalWindow && !isModalButton && isModalOpen) {
    toggleModal();
  }
});

// ACCORDION
accordion.forEach((targetElement, index) => {
  targetElement.addEventListener('click', e => {
    accordion.forEach(anyElement => {
      if (anyElement !== targetElement) anyElement.removeAttribute('open');
    })
  });

  targetElement.addEventListener('toggle', () => {
    if (targetElement.open) {
      localStorage.setItem('openAccordionId', index);
    } else {
      localStorage.removeItem('openAccordionId');
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  const savedIndex = localStorage.getItem('openAccordionId');
  if (savedIndex !== null && accordion[savedIndex]) {
    accordion.forEach(element => element.removeAttribute('open'));
    accordion[savedIndex].setAttribute('open', 'true');
  }
});