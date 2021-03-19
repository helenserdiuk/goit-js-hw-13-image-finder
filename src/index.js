import './styles.css';
import ImgApiService from './JS/apiService.js';
import cardsTemplate from './template/cardsInfo.hbs';

import { error } from '@pnotify/core/dist/PNotify.js';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';

import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';

const imgApiService = new ImgApiService();
const searchTag = document.querySelector('.search');
const gallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.btn');
searchTag.addEventListener('submit', onSearch);

function onSearch(e) {
  e.preventDefault();

  imgApiService.query = e.currentTarget.elements.query.value;
  console.log(imgApiService.query);

  if (imgApiService.query === '') {
    error({
      text: 'Please enter something!',
    });
    return;
  }

  if (imgApiService.query.trim().length === 0) {
    error({
      text: 'Please enter a more specific query!',
    });
    return;
  }

  imgApiService.resetPage();
  imgApiService.fetchArticles().then(data => {
    clearGallery();
    createGalleryMarkup(data);
  });

  showButton();
}

gallery.addEventListener('click', clickGallery);
function clickGallery(event) {
  event.preventDefault();
  if (event.target.nodeName !== 'IMG') {
    return;
  }
  console.log(event.target.dataset);

  const inputTag = basicLightbox.create(`
    <img src="${event.target.dataset.source}" width="800" height="600"> `);
  inputTag.show();
}

function clearGallery() {
  gallery.innerHTML = '';
}

function createGalleryMarkup(data) {
  gallery.insertAdjacentHTML('beforeend', cardsTemplate(data));
}

loadBtn.addEventListener('click', onLoadMore);
function onLoadMore() {
  imgApiService.fetchArticles().then(data => {
    createGalleryMarkup(data);
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  });
}

function showButton() {
  loadBtn.classList.remove('is-hidden');
}

function trackScroll() {
  const scrolled = window.pageYOffset;
  const coords = document.documentElement.clientHeight;
  if (scrolled > coords) {
    goTopBtn.classList.add('back_to_top-show');
  }
}

function backToTop() {
  if (window.pageYOffset > 0) {
    window.scrollBy(0, -80);
    setTimeout(backToTop, 0);
  }
}

const goTopBtn = document.querySelector('.back_to_top');

window.addEventListener('scroll', trackScroll);
goTopBtn.addEventListener('click', backToTop);
