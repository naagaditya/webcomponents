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
        .zcui-wc-search-widget{display:flex;padding:20px;font-size:12px;flex-direction:column;font-family:Arial, Helvetica, sans-serif}.zcui-wc-search-widget header{display:flex;margin:auto}.zcui-wc-search-widget header .logo-container{padding:0 20px;margin:10px 0;border-right:solid 1px #cecece}.zcui-wc-search-widget header .logo{width:127px}.zcui-wc-search-widget header .title{padding:10px 20px;font-size:13px;width:125px}.zcui-wc-search-widget label{color:green;letter-spacing:.5px}.zcui-wc-search-widget .search-input{display:flex;margin-top:10px;flex-direction:column}.zcui-wc-search-widget .search-input .input-box{display:inline;border:solid 1px #cecece3d;box-shadow:3px 5px 5px #8888882e;padding:5px;margin:7px 0}.zcui-wc-search-widget .search-input .input-box select{opacity:0;position:absolute;top:0;left:0;bottom:0;right:0}.zcui-wc-search-widget .search-input .input-box .input{position:relative;height:35px}.zcui-wc-search-widget .search-input .input-wrapper{display:flex;flex-direction:column}

      </style>
      <div class="zcui-wc-search-widget">
  <header>
    <div class="logo-container">
      <img alt="logo" src="../img/logo.svg" class="logo"/>
    </div>
    <i class="title">
       Enjoy Self Drive Cars Starting <b>Rs 60/Hr*</b>
    </i>
    
  </header>
  <div class="search-input">
    <div class="input-wrapper">
      <label>Pick Up Location</label>
      <div class="input-box">
        <div class="input">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
        <div class="input">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
      </div>
    </div>

    <div class="input-wrapper">
      <label>Start Date and Time</label>
      <div class="input-box">
        <div class="input">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
        <div class="input">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
      </div>
    </div>
    
    <div class="input-wrapper">
      <label>End Date and Time</label>
      <div class="input-box">
        <div class="input">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
        <div class="input">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
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