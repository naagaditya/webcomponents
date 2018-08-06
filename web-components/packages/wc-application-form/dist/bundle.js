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
        .overlay{position:fixed;top:0;right:0;left:0;bottom:0;background-color:#343d44d9;overflow:auto;z-index:9}.success-modal{max-width:320px;margin:150px auto;padding:20px;border-radius:5px;border:none;background:#fff;position:relative}.success-modal header{text-align:center;font-size:26px;margin:30px 0 -15px;display:flex;align-items:center;justify-content:center}.success-modal header .icon{position:absolute;width:80px;top:-36px}.success-modal .modal-body{padding:30px}.success-modal button{cursor:pointer;color:#fff;border-radius:4px;background:#32BEA6;border:none;width:100%;padding:15px;font-size:15px}.application-form{position:relative;border-radius:10px;margin:20px auto;width:360px;background:#fff}.application-form header{font-weight:bold;letter-spacing:2px;font-size:12px;position:relative;padding:20px 30px;text-transform:uppercase}.application-form button{padding:30px;text-align:center;font-size:12px;width:100%;background-color:#A71632;border:none;color:#fff;font-weight:bold;cursor:pointer;border-bottom-right-radius:10px;border-bottom-left-radius:10px}.loader{position:absolute;top:50px;bottom:0;right:0;left:0;background:#ffffffb5;display:flex;align-items:center;justify-content:center}.flex-box{display:flex;align-items:center;justify-content:center}.basic-details{flex-direction:column;padding-bottom:20px}.feild-container{display:flex;flex-direction:column;flex:1;padding:20px 30px;align-items:flex-start;box-sizing:border-box;width:100%;position:relative;margin-top:10px}input{width:100%;border:0;border-bottom:solid 1px #cecece;box-sizing:border-box;font-size:15px;padding-bottom:10px}.file-container{padding:40px;background-color:#F3F8FE;border-top:solid 1px #b5c7e9;flex-direction:column;text-align:center;position:relative;cursor:pointer}.file-upload-msg{padding-top:20px;font-size:17px;color:#bebebe;font-family:serif;width:260px}.close-btn{position:absolute;right:15px;top:3px;font-size:24px;color:#959599;cursor:pointer}.placeholder{position:absolute;top:25px;left:30px;transform:translate(0, -20px);font-size:11px;letter-spacing:2px;transition:.5s;opacity:0.4;font-family:inherit}input:invalid+.placeholder{transform:translate(0, 0);font-family:system-ui;font-size:13px;letter-spacing:2px;opacity:1}input:focus+.placeholder{transform:translate(0, -20px);font-size:11px;letter-spacing:2px;opacity:0.4;font-family:inherit}input:focus{outline:none}button:focus{outline:none}input[type="file"]{display:none}.invalid-field{border-color:#f0506e}.invalid-label{color:#f0506e}.invalid-file-svg path{fill:#f0506e}.file-svg path{fill:#222220}@keyframes pulse{from{transform:scale3d(1, 1, 1)}50%{transform:scale3d(1.05, 1.05, 1.05)}to{transform:scale3d(1, 1, 1)}}@keyframes big-pulse{from{transform:scale3d(1, 1, 1)}50%{transform:scale3d(1.25, 1.25, 1.25)}to{transform:scale3d(1, 1, 1)}}.pulse{animation-name:pulse}.big-pulse{animation-name:big-pulse}.animated{animation-duration:1s;animation-fill-mode:both}.hide{display:none}.title{padding:0px 30px;letter-spacing:1px}

      </style>
      <div class="overlay" on-drop=${this.fileChange} on-dragover=${(e) => { e.preventDefault(); }}>
  <div class$="${this.openSuccess ? 'success-modal' : 'hide'}">
    <header>
      <div class="icon">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 496.158 496.158" style="enable-background:new 0 0 496.158 496.158;" xml:space="preserve">
          <path style="fill:#32BEA6;" d="M496.158,248.085c0-137.021-111.07-248.082-248.076-248.082C111.07,0.003,0,111.063,0,248.085
        	c0,137.002,111.07,248.07,248.082,248.07C385.088,496.155,496.158,385.087,496.158,248.085z" />
          <path style="fill:#FFFFFF;" d="M384.673,164.968c-5.84-15.059-17.74-12.682-30.635-10.127c-7.701,1.605-41.953,11.631-96.148,68.777
        	c-22.49,23.717-37.326,42.625-47.094,57.045c-5.967-7.326-12.803-15.164-19.982-22.346c-22.078-22.072-46.699-37.23-47.734-37.867
        	c-10.332-6.316-23.82-3.066-30.154,7.258c-6.326,10.324-3.086,23.834,7.23,30.174c0.211,0.133,21.354,13.205,39.619,31.475
        	c18.627,18.629,35.504,43.822,35.67,44.066c4.109,6.178,11.008,9.783,18.266,9.783c1.246,0,2.504-0.105,3.756-0.322
        	c8.566-1.488,15.447-7.893,17.545-16.332c0.053-0.203,8.756-24.256,54.73-72.727c37.029-39.053,61.723-51.465,70.279-54.908
        	c0.082-0.014,0.141-0.02,0.252-0.043c-0.041,0.01,0.277-0.137,0.793-0.369c1.469-0.551,2.256-0.762,2.301-0.773
        	c-0.422,0.105-0.641,0.131-0.641,0.131l-0.014-0.076c3.959-1.727,11.371-4.916,11.533-4.984
        	C385.405,188.218,389.034,176.214,384.673,164.968z" />
          <g>
        </svg>
      </div>
       Awesome!
    </header>
    <div class="modal-body">
      You have successfully applied for ${this.role} role.
    </div>
    <button on-click=${this.success}>OK</button>
  </div>
  <div class$="${this.openSuccess ? 'hide' : 'application-form'}">
    <header class="flex-box">
      APPLY FOR
      <span class="close-btn" on-click=${this.close}>&times;</span>
    </header>
    <div class="title">${this.role}</div>
    <div class="basic-details flex-box">
      <span
        class$="${this.errorResponseMsg ? '' : 'hide'}"
        style="color: #f0506e;padding: 10px 30px;">
        ${this.errorResponseMsg}
      </span>
      <div
        style="width:100%;"
        class$="${this.invalidName && this.animateFeilds ? 'animated pulse' : ''}">
        <label class$="${this.invalidName ? 'invalid-label feild-container' : 'feild-container'}">
          <input
            class$="${this.invalidName ? 'invalid-field' : ''}"
            class="name"
            type="text"
            required
            on-input=${this.changeName}>
          <span class="placeholder">NAME</span>
        </label>
      </div>
      <div
        style="width:100%;"
        class$="${this.invalidEmail && this.animateFeilds ? 'animated pulse' : ''}">
        <label class$="${this.invalidEmail ? 'invalid-label feild-container' : 'feild-container'}">
          <input
            class$="${this.invalidEmail ? 'invalid-field' : ''}"
            class="email"
            type="text"
            required
            on-input=${this.changeEmail}>
          <span class="placeholder">EMAIL</span>
        </label>
      </div>
      <div
        style="width:100%;"
        class$="${this.invalidPhone && this.animateFeilds ? 'animated pulse' : ''}">
        <label class$="${this.invalidPhone ? 'invalid-label feild-container' : 'feild-container'}">
          <input
            class$="${this.invalidPhone ? 'invalid-field' : ''}"
            class="phone"
            type="text"
            required
            on-input=${this.changePhone}>
          <span class="placeholder">PHONE</span>
        </label>
      </div>

    </div>
    <div class="file-container flex-box" on-click=${e => { e.currentTarget.firstElementChild.click();}}>
      <input class="file" type="file" on-change=${this.fileChange}>
      <div class$="${this.invalidFile && this.animateFeilds ? 'animated big-pulse' : ''}">
        <svg class$="${this.invalidFile ? 'invalid-file-svg' : 'file-svg'}" height="63px" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
          viewBox="0 0 333.324 333.324" style="enable-background:new 0 0 333.324 333.324;" xml:space="preserve">
          <g>
            <path d="M125.255,59.513l33.907-33.907v149.451c0,4.143,3.358,7.5,7.5,7.5s7.5-3.357,7.5-7.5V25.606
              l33.907,33.907c1.464,1.464,3.384,2.196,5.303,2.196s3.839-0.732,5.303-2.196c2.929-2.93,2.929-7.678,0-10.607l-46.71-46.71
              c-2.929-2.928-7.678-2.928-10.606,0l-46.71,46.71c-2.929,2.93-2.929,7.678,0,10.607C117.577,62.441,122.326,62.441,125.255,59.513z
              " />
            <path d="M263.328,87.557h-61.645c-4.142,0-7.5,3.357-7.5,7.5s3.358,7.5,7.5,7.5h54.145v215.767H77.495
              V102.557h54.145c4.142,0,7.5-3.357,7.5-7.5s-3.358-7.5-7.5-7.5H69.995c-4.142,0-7.5,3.357-7.5,7.5v230.767
              c0,4.143,3.358,7.5,7.5,7.5h193.333c4.142,0,7.5-3.357,7.5-7.5V95.057C270.828,90.915,267.47,87.557,263.328,87.557z" />
          </g>
        </svg>
      </div>
      <div class="file-upload-msg">
        ${this.fileName
          ? html `<p>${this.fileName}</p><p>Change File</p>`
          : html `<p>Drag and drop your cv here or browser for a document to upload</p>`
        }
      </div>
    </div>
    <button on-click=${this.apply}>APPLY</button>
    <div class$="${this.openLoader ? 'loader' : 'hide'}">
      <wc-loader height="200px" width="200px" circle-radius="10" color="#cecece" distance="30"></wc-loader>
    </div>
  </div>
</div>
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
    loaderScriptTag.src = "http://zcui-web-components.s3-website.ap-south-1.amazonaws.com/web-components/wc-loader/wc-loader.js";
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
    this.invalidName = !this.name;
    this.updateShadowDom();
  }
  changePhone(e) {
    this.phone = e.target.value;
    this.invalidPhone = !this._validatePhone(this.phone);
    this.updateShadowDom();
  }
  _validateAll() {
    this.invalidEmail = !this._validateEmail(this.email);
    this.invalidName = !this.name;
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