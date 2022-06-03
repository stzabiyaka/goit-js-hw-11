import ImagesApiService from "./js-classes/images-api-service.js";
import ToTopButton from "./js-classes/to-top-button.js";
import InfiniteScroll from "./js-classes/infinite-scroll.js";
import onLoadPageScroll from "./js-modules/onload-page-scroll.js";
import LoadIndicator from "./js-classes/load-indicator.js";
import ThemeButton from "./js-classes/theme-button.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import cardTemplate from './templates/image-card.hbs';

import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadIndicator: document.querySelector('.load-more'),
};

const imagesApiService = new ImagesApiService();
const toTopButton = new ToTopButton();
const themeButton = new ThemeButton();
const infiniteScroll = new InfiniteScroll({onTriggered: loadNextPage});
const loadIndicator = new LoadIndicator({target: refs.loadIndicator});

const PER_PAGE = 40;

let galleryLightbox = null;



refs.form.addEventListener('submit', onFormSubmit);

function onFormSubmit (evt) {
    evt.preventDefault();
    imagesApiService.searchQuery = evt.currentTarget.elements.searchQuery.value.trim().replace(' ', '+');
    
    if (imagesApiService.searchQuery === '') {
        Notify.warning('Please, fill in search field with at least one symbol');
        refs.form.reset();
        return;
    }

    clearGallery();
    imagesApiService.resetPage();
    imagesApiService.perPage = PER_PAGE;
    loadData();
}

async function loadData () {
    loadIndicator.show();
    
    try {
        const data = await imagesApiService.getImages();
        updateGalley(data);
    }
    
    catch (error) {
        console.log('Error occured:', error.message);
    }
    
}

function updateGalley (data) {
    loadIndicator.hide();

    if (data.totalHits === 0) {
        Notify.failure('Sorry, there are no images matching your search query. Please try again');
        return;
    }

    renderPage(data.hits);

    if (imagesApiService.page === 1) {
        galleryLightbox = new SimpleLightbox('.gallery a');
        Notify.success(`Hooray! We found ${data.totalHits} images.`);
        checkForLoadMore();
    } else {
        galleryLightbox.refresh();
        onLoadPageScroll(refs.gallery);
    }
    
    checkForLoadMore();
}

function checkForLoadMore () {
    if (!imagesApiService.isFinalPage) {
        infiniteScroll.init();
        return true;
    } 

    if (imagesApiService.totalPages > 1) {
        Notify.info("We're sorry, but you've reached the end of search results.");
    }

    return false;
}

function renderPage (data) {
    const markup = data.map(element => cardTemplate(element)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function loadNextPage () {
    imagesApiService.incrementPage();
    if (checkForLoadMore()){
        loadData ();
    }
}

function clearGallery () {
    refs.gallery.innerHTML='';
}