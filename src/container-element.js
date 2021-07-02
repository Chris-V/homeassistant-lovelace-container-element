import { createThing } from 'custom-card-helpers';

customElements.define(
  "container-element",
  class HuiContainerElement extends HTMLElement {
    constructor() {
      super();

      this._hass = undefined;
      this._config = {};

      this._container = undefined;
      this._elements = [];
    }

    setConfig(config) {
      this._config = config;

      if (!Array.isArray(config.elements)) {
        this._config.elements = [];
      }

      this.updateContainerStyle();

      this.clearChildren();
      this._elements = this.createChildren(this._config.elements);
      this.refreshChildren();
    }

    updateContainerStyle() {
      this.removeAttribute("style");
      this.style.transform = "none";

      this.applyStyleProperties(this, this._config.style || {});
    }

    set hass(hass) {
      this._hass = hass;

      this.refreshChildren();
    }

    clearChildren() {
      this._elements.forEach((element) => {
        if (element.parentElement) {
          element.parentElement.removeChild(element);
        }
      });

      this._elements = [];
    }

    createChildren(elements) {
      return this._config.elements
        .map((config) => this.createChild(config));
    }

    createChild(config) {
      if (typeof config !== "object" || !config.type) {
        throw Error('Invalid element. Missing "type" property.')
      }

      const type = config.type.indexOf("custom:") === 0
        ? config.type
        : `custom:hui-${config.type}-element`

      const element = createThing({ ...config, type });
      element.classList.add("element");

      this.applyStyleProperties(element, config.style || {})

      return element;
    }

    applyStyleProperties(node, style) {
      Object.entries(style).forEach(([property, value]) => {
        node.style.setProperty(property, value);
      });
    }

    refreshChildren() {
      if (!this._hass) {
        return;
      }

      this._elements.forEach((element) => {
        element.hass = this._hass;

        if (!element.parentElement) {
          this.appendChild(element);
        }
      });
    }
  }
);
