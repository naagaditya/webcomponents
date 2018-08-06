class WcToggleBtn extends HTMLElement {
  static get observedAttributes() {
    return [
      'height',
      'width',
      'on-text',
      'off-text',
      'slider-color',
      'on-bg-color',
      'off-bg-color',
      'on-text-color',
      'off-text-color'
    ];
  }
  constructor() {
    super();
    this.setProps();
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.template = document.createElement('template');
  }
  get htmlTemplate() {
    const checkbox = this._checkbox || {};
    
    return `<div><style>
      .switch {
        position: relative;
        display: inline-block;
        width: ${this.width};
        height: ${this.height};
      }

      .switch input {display:none;}

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: ${this.offBgColor};
        -webkit-transition: .4s;
        transition: .4s;
      }
        .text {
          margin-top: 7px;
          margin-right: 40px;
          margin-left: 40px;
          transition: .4s;
          text-transform: uppercase;
          font-size: 13px;
          text-align: center;
          color: ${this.offTextColor};
        }

      .slider:before {
        position: absolute;
        content: "";
        height: ${this.sliderLength};
        width: ${this.sliderLength};
        left: 4px;
        bottom: 4px;
        background-color: ${this.sliderColor};
        -webkit-transition: .4s;
        transition: .4s;
        color: #000;
      }

      input:checked + .slider {
        background-color: ${this.onBgColor};
      }
        input:checked + .slider .text {
          margin-left: 10px;
          color: ${this.onTextColor};
        }

      input:focus + .slider {
        box-shadow: 0 0 1px #2196F3;
      }

      input:checked + .slider:before {
        -webkit-transform: translateX(${parseInt(this.width.replace('px', ''))-parseInt(this.sliderLength.replace('px',''))-8}px);
        -ms-transform: translateX(${parseInt(this.width.replace('px', '')) - parseInt(this.sliderLength.replace('px','')) - 8}px);
        transform: translateX(${parseInt(this.width.replace('px', '')) - parseInt(this.sliderLength.replace('px','')) - 8}px);
      }

      /* Rounded sliders */
      .slider.round {
        border-radius: 34px;
      }

      .slider.round:before {
        border-radius: 50%;
      }
    </style>
    <label class="switch" id="switch">
      <input type="checkbox" id="checkbox" ${checkbox.checked ? 'checked': ''}>
      <div class="slider round">
        <div class="text" id="toggle-text">${checkbox.checked ? this.onText : this.offText}</div>
      </div>
    </label></div>`;
  }
  setProps () {
    this.height = this.getAttribute('height') || '34px';
    this.sliderLength = (parseInt(this.height.replace('px', '')) - 8) + 'px' ;
    this.width = this.getAttribute('width') || '90px';
    this.onBgColor = this.getAttribute('on-bg-color') || '#41b883';
    this.offBgColor = this.getAttribute('off-bg-color') || '#ccc';
    this.onText = this.getAttribute('on-text') || 'On';
    this.offText = this.getAttribute('off-text') || 'Off';
    this.sliderColor = this.getAttribute('slider-color') || '#fff';
    this.onTextColor = this.getAttribute('on-text-color') || '#fff';
    this.offTextColor = this.getAttribute('off-text-color') || '#fff';
  }

  connectedCallback () {
    this.updateShadowDom();
  }
  toggleCheckbox () {
    this._toggleText.innerHTML = this._checkbox.checked ? this.onText : this.offText;
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: {
        isChecked: this._checkbox.checked,
      },
      bubbles: true
    }));
  }

  updateShadowDom() {
    this.template.innerHTML = this.htmlTemplate;
    const templateContent = this.template.content.cloneNode(true);
    this._content = templateContent.getElementById('switch');
    this._checkbox = templateContent.getElementById('checkbox');
    this._toggleText = templateContent.getElementById('toggle-text');
    this._checkbox.onclick = this.toggleCheckbox;
    if (this.shadowRoot) {
      this.shadowRoot.replaceChild(templateContent, this.shadowRoot.firstElementChild);
      // Object.values(this.shadowRoot.children).forEach(child => this.shadowRoot.removeChild(child));
      this.shadowRoot.appendChild(templateContent);
    }
    else {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(templateContent);
    }
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal != newVal) {
      this.setProps();
      this.updateShadowDom();
    }
  }
}

window.customElements.define('wc-toggle-btn', WcToggleBtn);