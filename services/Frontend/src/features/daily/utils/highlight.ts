import styles from "./styles/highlight.module.scss";

const DATA_HIGHLIGHTED_ATTRIBUTE_NAME = "data-highlighted";
const HIGHLIGHT_DURATION = 3000;
const HIGHLIGHT_CLASSNAME = styles.element;

export const highlightElement = (element: Element) => {
    element.scrollIntoView({ behavior: "smooth", block: "start" });

    element.classList.add(HIGHLIGHT_CLASSNAME);
    element.setAttribute(DATA_HIGHLIGHTED_ATTRIBUTE_NAME, "true");

    setTimeout(() => {
        element.classList.remove(HIGHLIGHT_CLASSNAME);
        element.removeAttribute(DATA_HIGHLIGHTED_ATTRIBUTE_NAME);
    }, HIGHLIGHT_DURATION);
};
