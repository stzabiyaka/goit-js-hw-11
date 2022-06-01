export default class LoadIndicator {
    constructor({target, visible = false}) {
        this.target = target;
        this.visible = visible;

        visible && this.show();
    }

    show() {
        this.target.classList.add('is-visible');
    }

    hide() {
        this.target.classList.remove('is-visible');
    }
}