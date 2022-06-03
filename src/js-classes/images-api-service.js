export default class ImagesApiService {
        searchQuery;
        page;
        perPage;
        totalPages;
        isFinalPage;
        #BASE_URL;
        #ACCESS_KEY;
        #queryParameters;
    constructor () {
        this.axios = require('axios').default;
        this.searchQuery = '';
        this.page = 1;
        this.perPage = 40;
        this.totalPages = 0;
        this.isFinalPage = false;
        this.#BASE_URL = 'https://pixabay.com/api/';
        this.#ACCESS_KEY = '27723162-12c5df9d8fe49465a0d14715c';
        this.#queryParameters = 'image_type=photo&orientation=horizontal&safesearch=true';
    }

    async getImages() {
        const url = `${this.#BASE_URL}?key=${this.#ACCESS_KEY}&q=${this.searchQuery}&${this.#queryParameters}&per_page=${this.perPage}&page=${this.page}`;
            const response = await this.axios.get(url);
            this.totalPages = Math.ceil(response.data.totalHits / this.perPage);
            if (this.page === this.totalPages) {
                this.isFinalPage = true;
            }
            return response.data;
    }
    

    incrementPage() {
        this.page += 1;
    }

    resetPage () {
        this.page = 1;
        this.isFinalPage = false;
    }

    get searchQuery () {
        return this.searchQuery;
    }

    set searchQuery (newQuery) {
        this.searchQuery = newQuery;
    }

    get page () {
        return this.page;
    }

    set page (newPage) {
        this.page = newPage;
    }

    get perPage () {
        return this.perPage;
    }

    set perPage (newPerPage) {
        this.perPage = newPerPage;
    }

    get totalPages () {
        return this.totalPages;
    }
    
    get isFinalPage () {
        return this.isFinalPage;
    }
}