import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';

class ZcuiWcSearchWidget extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
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

  connectedCallback() {
    this.createShadowDom();
  }
  
}

  window.customElements.define('zcui-wc-search-widget', ZcuiWcSearchWidget);
