import { html, render } from '../../../../lib/lit-extended.js';
import { repeat } from '../../../../lib/repeat.js';

class ZcuiWcDateTimePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'max-date-time',
      'min-date-time'
    ];
  }

  constructor() {
    super();
    this.updateShadowDom = this.updateShadowDom.bind(this);
  }

  get htmlTemplate() {
    return html`
      <style>
        <%- style %>
      </style>
      <%- html %>
    `;
  }

  createShadowDom() {
    this.attachShadow({ mode: 'open' });
    this.updateShadowDom();
  }

  updateShadowDom() {
    if (this.shadowRoot) {
      render(this.htmlTemplate, this.shadowRoot);
    }
  }

  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal != newVal) {
      this.setProps();
      this.updateShadowDom();
    }
  }

  setProps() {
    this.maxDateTime = new Date(this.getAttribute('max-date-time'));
    this.minDateTime = new Date(this.getAttribute('min-date-time'));
    
  }

  connectedCallback() {
    this.createShadowDom();
  }
}

window.customElements.define('zcui-wc-date-time-picker', ZcuiWcDateTimePicker);
