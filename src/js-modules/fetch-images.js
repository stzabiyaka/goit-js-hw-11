
const BASE_URL = 'https://pixabay.com/api/';
const ACCESS_KEY = '27723162-12c5df9d8fe49465a0d14715c';
const perPage = 40;
const queryParameters = 'image_type=photo';

export function fetchImages({query, page = 1, per_page}) {
    return fetch(`${BASE_URL}?key=${ACCESS_KEY}&q=${query}&${queryParameters}&per_page=${per_page}&page=${page}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('not found');
        }

        return response.json();
    });
}