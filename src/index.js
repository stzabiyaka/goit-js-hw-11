import {fetchImages} from "./js-modules/fetch-images.js";
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import cardTemplate from './templates/image-card.hbs';
import "simplelightbox/dist/simple-lightbox.min.css";

const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    loadBtn: document.querySelector('.load-more'),
}
const PER_PAGE = 40;
let totalPages = 0;
const fetchOptions = {};

refs.form.addEventListener('submit', onFormSubmit);

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
    fetchOptions.per_page = PER_PAGE;

    loadPage(fetchOptions);
    
    let gallery = new SimpleLightbox('.gallery a');
    makeLoadBtnVisible();
    refs.form.reset();
}

function loadPage (options) {
    fetchImages(options)
    .then(handleResult)
    .catch(handleError);
}

function handleResult (value) {
    if (value.total === 0) {
        Notify.failure('Sorry, there is no images for your search request');
        return;
    }
    totalPages = Math.ceil(value.totalHits / PER_PAGE);
    console.log(value);
    renderGallery(value.hits);
}

function handleError (error) {
    console.log(error);
}

function renderGallery (data) {
    const markup = data.map(element => cardTemplate(element)).join('');
    refs.gallery.insertAdjacentHTML('beforeend', markup);
}

function onLoadBtnClick () {
    fetchOptions.page += 1;
    loadPage (fetchOptions);
    checkLoadBtn();
}

function makeLoadBtnVisible () {
    if (fetchOptions.page < totalPages) {
        refs.loadBtn.addEventListener('click', onLoadBtnClick);
        refs.loadBtn.classList.add('is-visible');
        return;
    }
    notifyFinish();
}

function checkLoadBtn () {
    if (fetchOptions.page !== totalPages) {
        return;
    } 
        refs.loadBtn.classList.remove('is-visible');
        refs.loadBtn.removeEventListener('click', onLoadBtnClick);
        notifyFinish();
}

function notifyFinish () {
    Notify.info('That`s all images, that we have for you');
}
