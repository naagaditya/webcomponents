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
        .zcui-wc-search-widget{display:flex;padding:10px;font-size:12px;flex-direction:column}.zcui-wc-search-widget img{width:100%;max-width:500px}.zcui-wc-search-widget label{color:green;font-weight:600}.zcui-wc-search-widget .search-input{display:flex;margin-top:10px;flex-direction:column}.zcui-wc-search-widget .search-input .input-box{display:inline}.zcui-wc-search-widget .search-input .input-wrapper{display:flex;flex-direction:column}

      </style>
      <div class="zcui-wc-search-widget">
  <img alt="logo"/>
  <div class="search-input">
    <div class="input-wrapper">
      <label>Pick Up Location</label>
      <div class="input-box">
        <select>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
        </select>
        <select>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
        </select>
      </div>
    </div>

    <div class="input-wrapper">
      <label>Start Date and Time</label>
      <div class="input-box">
        <select>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
        </select>
        <select>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
        </select>
      </div>
    </div>
    
    <div class="input-wrapper">
      <label>End Date and Time</label>
      <div class="input-box">
        <select>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
        </select>
        <select>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
          <option value="option1">option1</option>
        </select>
      </div>
    </div>
    <button> Search Car</button>
  </div>
</div>
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