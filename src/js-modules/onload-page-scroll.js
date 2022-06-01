export default function onLoadPageScroll (target) {
    const { height: cardHeight } = target
  .firstElementChild.getBoundingClientRect();

    window.scrollBy({
        top: cardHeight * 2,
        behavior: "smooth",
    });
}