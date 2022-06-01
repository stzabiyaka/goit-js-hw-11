export default class InfiniteScroll {
    constructor({onTriggered}) {
        this.onTriggered = onTriggered;
        this.target = document.documentElement;
        this.checkHandler = this.check.bind(this);
    }

    init() {
        window.addEventListener('scroll', this.checkHandler);
    }

    check () {
        if (this.target.getBoundingClientRect().bottom < this.target.clientHeight+50) {
            this.onTriggered();
            this.remove();
        }
      }
    
    remove () {
        window.removeEventListener('scroll', this.checkHandler);
    }  
}