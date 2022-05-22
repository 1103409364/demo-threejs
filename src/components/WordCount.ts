// Create a class for the element
export class WordCount extends HTMLParagraphElement {
  // count words in element's parent element
  private wcParent = this.parentNode;
  private textElement;

  constructor() {
    // Always call super first in constructor
    super();
    // Create a shadow root
    const shadow = this.attachShadow({ mode: "open" });
    // Create text node and add word count to it
    this.textElement = document.createElement("span");
    // Append it to the shadow root
    shadow.appendChild(this.textElement);

    this.init();
  }
  init() {
    this.addEvent();
    this.addStyle();
    this.updateCount();
  }
  addStyle() {
    this.textElement.style.color = "red";
  }
  addEvent() {
    this.wcParent?.addEventListener("input", this.updateCount.bind(this));
  }
  // count words in element's text
  countWords() {
    const text = this.wcParent?.textContent || "";
    return text
      .trim()
      .split(/\s+/g)
      .filter((a) => a.trim().length > 0).length;
  }
  updateCount() {
    const count = `Words: ${this.countWords()}`;
    this.textElement.textContent = count;
  }
}
// Define the new element
customElements.define("word-count", WordCount, { extends: "p" });
// https://developer.mozilla.org/zh-CN/docs/Web/Web_Components#%E4%BE%8B%E5%AD%90
// https://github.com/mdn/web-components-examples
// https://developer.mozilla.org/zh-CN/docs/Web/Web_Components/Using_shadow_DOM
