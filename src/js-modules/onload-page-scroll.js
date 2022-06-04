export default function onLoadPageScroll (target) {
  //   const { height: cardHeight } = target
  // .firstElementChild.getBoundingClientRect();

  const height = window.innerHeight / 2;

    window.scrollBy({
        top: height,
        behavior: "smooth",
    });
}