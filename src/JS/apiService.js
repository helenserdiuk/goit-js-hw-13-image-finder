const API_KEY = '20753274-3f8d2754c12358a259804227b';
const API_URL = 'https://pixabay.com/api';

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchArticles() {
    const url = `${API_URL}/?image_type=photo&orientation=horizontal&q=${this.searchQuery}&page=${this.page}&per_page=12&key=${API_KEY}`;
    return fetch(url)
      .then(res => res.json())
      .then(data => {
        this.page += 1;

        return data;
      });
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(str) {
    this.searchQuery = str;
  }
}