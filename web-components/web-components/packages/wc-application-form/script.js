import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';

class WcApplicationForm extends HTMLElement {
  static get observedAttributes() {
    return [
      'post-url',
      'jd',
      'role'
    ];
  }

  constructor() {
    super();
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.createShadowDom = this.createShadowDom.bind(this);
    this.setProps = this.setProps.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.close = this.close.bind(this);
    this.apply = this.apply.bind(this);
    this.changeEmail = this.changeEmail.bind(this);
    this.changeName = this.changeName.bind(this);
    this.changePhone = this.changePhone.bind(this);
    this.success = this.success.bind(this);
    this.invalidName = this.invalidEmail = this.invalidPhone = false;
    this.openSuccess = false;
  }

  get htmlTemplate() {
    return html`
      <style>
        <%- style %>
      </style>
      <%- html %>
    `;
  }

  setProps() {
    this.postUrl = this.getAttribute('post-url');
    this.jd = this.getAttribute('jd');
    this.role = this.getAttribute('role');
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
    const loaderScriptTag = document.createElement('script');
    loaderScriptTag.src = "https://unpkg.com/@zoomcarindia/wc-loader@1.0.5/wc-loader.js";
    this.appendChild(loaderScriptTag);
    this.createShadowDom();
  }

  _postData(url, data) {
    return fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data)
    }).then(response => {
      if ([500, 404].indexOf(response.status) != -1) {
        const errorPromise = new Promise((resolve, reject) => {
          resolve(response.statusText);
          reject(response.statusText);
        });
        throw errorPromise;
      }
      else if (!response.ok) {
        throw response.json();
      }
      return response.json();
    });
  }

  _validateEmail(email) {
    if (!email) return false;
    const reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    return reg.test(email);
  }

  _validatePhone(phone) {
    if (!phone) return false;
    var phoneno = /^\d{10}$/;
    return phone.match(phoneno);
  }
  
  _validateFile(fileInput) {
    const fileImage = fileInput.parentElement.getElementsByTagName('path');
    if (!this.fileName) {
      fileImage[0].style.fill = '#f0506e';
      fileImage[1].style.fill = '#f0506e';
      return true;
    }
    fileImage[0].style.fill = '#222220';
    fileImage[1].style.fill = '#222220';
    return false;
  }
  
  changeEmail(e) {
    this.email = e.target.value;
    this.invalidEmail = !this._validateEmail(this.email);
    this.updateShadowDom();
  }
  changeName(e) {
    this.name = e.target.value;
    this.invalidName = !(this.name && this.name.trim());
    this.updateShadowDom();
  }
  changePhone(e) {
    this.phone = e.target.value;
    this.invalidPhone = !this._validatePhone(this.phone);
    this.updateShadowDom();
  }
  _validateAll() {
    this.invalidEmail = !this._validateEmail(this.email);
    this.invalidName = !(this.name && this.name.trim());
    this.invalidPhone = !this._validatePhone(this.phone);
    this.invalidFile = !this.fileName;
    this.animateFeilds = true;
    this.updateShadowDom();
    setTimeout(() => {
      this.animateFeilds = false;
      this.updateShadowDom();
    }, 1000);
    return !(this.invalidEmail || this.invalidName || this.invalidPhone || this.invalidFile);
  }
  apply() {
    if (this._validateAll()) {
      const data = {
        email: this.email,
        file: this.resumeFile,
        fullName: this.name,
        jd: this.jd,
        name: this.name,
        phone: this.phone,
        role: this.role
      };
      this.openLoader = true;
      this.updateShadowDom();
      this._postData(this.postUrl, data).then(data => {
        this.openLoader = false;
        if (data.errorMessage) {
          this.errorResponseMsg = data.errorMessage || 'Something Went wrong. Please try again';
        }
        if (data.ok) {
          this.openSuccess = true;
        }
        this.updateShadowDom();

      }).catch(error => {
        this.openLoader = false;
        this.errorResponseMsg = error.errorMessage || 'Something Went wrong. Please try again';
        this.updateShadowDom();
      });
    }
    
  }
  close() {
    this.dispatchEvent(new CustomEvent('closeform', {
      bubbles: true
    }));
  }
  fileChange(event) {
    event.preventDefault();
    this.resumeFile = null;
    this.fileName = null;

    const files = event.target.files || (event.dataTransfer && event.dataTransfer.files) || event.path[0].files;

    if (files && files[0]) {
      var reader = new FileReader();

      reader.onload = e => {
        this.resumeFile = e.target.result;
        this.fileName = files[0].name;
        this.updateShadowDom();
      }
      reader.readAsDataURL(files[0]);
    }
  }
  success() {
    this.openSuccess = false;
    this.updateShadowDom();
    this.dispatchEvent(new CustomEvent('submitsuccess', {
      detail: {
        message: 'Success'
      },
      bubbles: true
    }));
  }
}

window.customElements.define('wc-application-form', WcApplicationForm);
