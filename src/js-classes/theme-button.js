export default class ThemeButton {
    #LOCALSTORAGE_THEME_KEY;
    constructor () {
        this.refs = {
            themeBtn: document.querySelector('.theme-button'),
            target: document.body
            }
        this.#LOCALSTORAGE_THEME_KEY = 'userTheme';
        
        this.#initTheme();
        this.refs.themeBtn.addEventListener('click', this.#changeTheme.bind(this));
    }

    #initTheme() {
        const themeState = this.#getThemeState();
        this.#setBtnTitle(themeState);

        if (themeState === 'light') {
            return;
        }
        
        this.#toggleClass();
    }

    #changeTheme() {
        const themeState = this.#inverseTheme(this.#getThemeState());

        this.#toggleClass();
        this.#setThemeState (themeState);
        this.#setBtnTitle(themeState);
    }

    #getThemeState() {
        const themeState = localStorage.getItem(this.#LOCALSTORAGE_THEME_KEY);
        try {
            return themeState !== null ? JSON.parse(themeState) : 'light';
        } catch (error) {
            console.log('Get theme state error', error.message);
        }
    }

    #setThemeState(theme) {
        try {
            const themeState = JSON.stringify(theme);
            localStorage.setItem(this.#LOCALSTORAGE_THEME_KEY, themeState);
        } catch (error) {
            console.error("Set theme state error: ", error.message);
        }
    }

    #setBtnTitle (theme) {
        theme = this.#inverseTheme(theme);
        this.refs.themeBtn.title = `Change theme to ${theme}`;
    }

    #inverseTheme (theme) {
        return theme === 'light' ? 'dark' : 'light';
    }

    #toggleClass() {
        const values = Object.values(this.refs);
        for (const value of values) {
            value.classList.toggle('theme-dark');
        }
    }
}