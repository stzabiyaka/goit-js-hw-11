import {fetchImages} from "./js-modules/fetch-images.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import cardTemplate from './templates/image-card.hbs';
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadIndicator: document.querySelector('.load-more'),
    toTopBtn: document.querySelector('.to-top-button'),
}
let totalPages = 0;
const PER_PAGE = 40;
const fetchOptions = {per_page: PER_PAGE};
let galleryLightbox = null;

refs.form.addEventListener('submit', onFormSubmit);
window.addEventListener('scroll', showToTopBtn);

function onFormSubmit (evt) {
    const query = evt.currentTarget.elements.searchQuery.value.trim().replace(' ', '+');
    
    evt.preventDefault();
    
    if (query === '') {
        Notify.warning('Please, fill in search field with at least one symbol');
        refs.form.reset();
        return;
    }

    refs.gallery.innerHTML='';

    fetchOptions.query = query;
    fetchOptions.page = 1;

    loadPage(fetchOptions);
}

function loadPage (options) {
    fetchImages(options)
    .then(handleResult)
    .catch(handleError);
    showLoadIndicator();
}

function handleResult (value) {
    hideLoadIndicator();

    if (fetchOptions.page === 1) {
        if (value.total === 0) {
            Notify.failure('Sorry, there are no images matching your search query. Please try again');
            return;
        }
        totalPages = Math.ceil(value.totalHits / PER_PAGE);
        renderGallery(value.hits);
        galleryLightbox = new SimpleLightbox('.gallery a');
        checkForLoadMore();
        Notify.success(`Hooray! We found ${value.totalHits} images.`);
        return;
    }
    
    renderGallery(value.hits);
    galleryLightbox.refresh();
    onLoadPageScroll();
    checkForLoadMore();
}

function handleError (error) {
    console.log(error);
}

function renderGallery (data) {
    const markup = data.map(element => cardTemplate(element)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function checkForLoadMore () {
    if (fetchOptions.page <= totalPages && totalPages > 1) {
        window.addEventListener('scroll', infiniteScroll);
        return true;
    } 

    if (fetchOptions.page > totalPages) {
        Notify.info("We're sorry, but you've reached the end of search results.");
        return false;
    }
    return false;
}

function onInfiniteScrollTriggered () {
    fetchOptions.page += 1;
    if (checkForLoadMore()){
        loadPage (fetchOptions);
    }
}

function showLoadIndicator() {
    refs.loadIndicator.classList.add('is-visible');
}

function hideLoadIndicator () {
    refs.loadIndicator.classList.remove('is-visible');
}

function onLoadPageScroll () {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}

function showToTopBtn() {
    const target = document.documentElement;
    if (target.scrollTop > 50) {
      refs.toTopBtn.classList.add('is-visible');
      refs.toTopBtn.addEventListener('click', scrollToTop);
    } else {
      refs.toTopBtn.classList.remove('is-visible');
      refs.toTopBtn.removeEventListener('click', scrollToTop);
    }
  }

  function scrollToTop() {
    window.scroll({
        top: 0,
        behavior: "smooth",
      });
  }

  function infiniteScroll () {
    const target = document.documentElement;
    if (target.getBoundingClientRect().bottom < target.clientHeight+50) {
        onInfiniteScrollTriggered();
        window.removeEventListener('scroll', infiniteScroll);
    }
  }
