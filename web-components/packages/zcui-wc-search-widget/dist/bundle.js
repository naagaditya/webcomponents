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
        .zcui-wc-search-widget{display:flex;padding:20px;font-size:12px;flex-direction:column;font-family:Arial, Helvetica, sans-serif;background-image:url("../img/bg.svg");background-size:contain}.zcui-wc-search-widget header{display:flex;margin:auto}.zcui-wc-search-widget header .logo-container{padding:0 20px;margin:10px 0;border-right:solid 1px #cecece}.zcui-wc-search-widget header .logo{width:127px}.zcui-wc-search-widget header .title{padding:10px 20px;font-size:13px;width:125px}.zcui-wc-search-widget label{letter-spacing:.5px;font-size:13px;margin:0 10px}.zcui-wc-search-widget .search-input{display:flex;margin-top:10px;flex-direction:column;padding:10px 0}.zcui-wc-search-widget .search-input .input-box{border:solid 1px #8ABD50;margin:7px 10px 20px;display:flex}.zcui-wc-search-widget .search-input .input-box .city{flex:1;border-right:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .area{flex:1}.zcui-wc-search-widget .search-input .input-box .date{width:21%}.zcui-wc-search-widget .search-input .input-box .month{width:45%;border-right:solid 1px #8ABD50;border-left:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .time{width:34%}.zcui-wc-search-widget .search-input .input-box select{opacity:0;position:absolute;top:0;left:0;bottom:0;right:0}.zcui-wc-search-widget .search-input .input-box .input{position:relative;height:35px}.zcui-wc-search-widget .search-input .input-wrapper{display:flex;flex-direction:column}.zcui-wc-search-widget .date-time{display:flex;flex-wrap:wrap;justify-content:space-between}.zcui-wc-search-widget .date-time .input-wrapper{min-width:256px;flex:1}.zcui-wc-search-widget button{font-size:12px;font-weight:bold;padding:14px;width:100%;max-width:420px;border-radius:2.2px;background-color:#6fbe45;box-shadow:1px 1px 7px 0 rgba(186,185,185,0.5);color:#fff;text-transform:uppercase;margin:auto}

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
      <label>Pick-up Location</label>
      <div class="input-box">
        <div class="input city">
          <span>Select City</span>
          <select>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
            <option value="option1">option1</option>
          </select>
        </div>
        <div class="input area">
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
    <div class="date-time">

      <div class="input-wrapper">
        <label>Start Date and Time</label>
        <div class="input-box">
          <div class="input date">
            <span>Select City</span>
            <select>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
            </select>
          </div>
          <div class="input month">
            <span>Select City</span>
            <select>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
            </select>
          </div>
          <div class="input time">
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
          <div class="input date">
            <span>Select City</span>
            <select>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
            </select>
          </div>
          <div class="input month">
            <span>Select City</span>
            <select>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
              <option value="option1">option1</option>
            </select>
          </div>
          <div class="input time">
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