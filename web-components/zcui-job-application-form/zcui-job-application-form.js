class ZcuiJobApplicationForm extends HTMLElement {
  static get observedAttributes() {
    return [
      'post-url',
      'jd',
      'role'
    ];
  }
  constructor() {
    super();
    this.createShadowDom = this.createShadowDom.bind(this);
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.postForm = this.postForm.bind(this);
    this.setProps = this.setProps.bind(this);
    this.close = this.close.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.template = document.createElement('template');
  }
  get htmlTemplate() {

    return `
    <style>
    .uk-button-primary {
    background-color: #0F1214;
    color: #fff;
    border: 1px solid transparent;
}

.uk-button {
    margin: 0;
    border: none;
    border-radius: 0;
    overflow: visible;
    font-size: 14px;
    text-transform: none;
    display: inline-block;
    box-sizing: border-box;
    padding: 0 30px;
    vertical-align: middle;
    line-height: 38px;
    text-align: center;
    text-decoration: none;
    border-radius: 5px;
}
    .uk-margin-medium-top {
    margin-top: 40px !important;
}
    .uk-text-center {
    text-align: center !important;
}
    .uk-link {
    color: #7a838a;
    text-decoration: none;
    cursor: pointer;
}
    .uk-form-custom {
    display: inline-block;
    position: relative;
    max-width: 100%;
    vertical-align: middle;
}
.uk-form-custom input[type="file"] {
    font-size: 500px;
    overflow: hidden;
}
.uk-form-custom select, .uk-form-custom input[type="file"] {
    position: absolute;
    top: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    left: 0;
    -webkit-appearance: none;
    opacity: 0;
    cursor: pointer;
}
    .uk-margin {
    margin-bottom: 20px;
}
    .uk-form-icon:not(.uk-form-icon-flip)+.uk-input {
    padding-left: 40px;
}

.uk-input, .uk-select:not([multiple]):not([size]) {
    height: 40px;
    vertical-align: middle;
    display: inline-block;
}
.uk-input, .uk-select, .uk-textarea {
    max-width: 100%;
    width: 100%;
    border: 0 none;
    padding: 0 10px;
    background: #fff;
    color: #666;
    border: solid 1px #c4c7ca;
}
.uk-input, .uk-textarea {
    -webkit-appearance: none;
}
.uk-input {
    overflow: visible;
}
.uk-input, .uk-select, .uk-textarea, .uk-radio, .uk-checkbox {
    box-sizing: border-box;
    margin: 0;
    border-radius: 0;
    font: inherit;
}
    .uk-form-icon {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    width: 40px;
    display: -ms-inline-flexbox;
    display: -webkit-inline-flex;
    display: inline-flex;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    color: #7a838a
}
.uk-article-meta {
    color: #7a838a;
}
h5, .uk-h5 {
    font-size: 16px;
    line-height: 1.4;
}
.uk-margin-remove {
    margin: 0 !important;
}
[class*='uk-inline'] {
    display: inline-block;
    position: relative;
    max-width: 100%;
    vertical-align: middle;
    -webkit-backface-visibility: hidden
}
#apply {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  z-index: 10000;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, .3);
}
:target {
  display: flex !important;
}
#apply form {
  background-color: white;
  max-width: 400px;
  width: 80%;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  position: relative;
  margin: 20px auto;
}
#apply .close {
  position: absolute;
  right: 20px;
  top: 20px;
}
#apply form .uk-margin {
  display: flex;
  align-items: center;
}
#apply form .uk-form-controls {
  flex: 1;
}
#apply form label {
  width: 75px;
  display: block;
}
#apply form .uk-placeholder {
  margin-bottom: 20px;
  padding: 30px 30px;
  background: transparent;
  border: 1px dashed #e5e5e5;
}
#apply form header {
  /* border-bottom: 1px solid #ccc; */
  padding-bottom: 15px;
  margin-bottom: 30px;
  padding-right: 30px;
}
#apply form header .uk-article-meta {
  margin-bottom: 10px;
}
#apply .uk-cover {
  transform: none;
  top: 0;
  left: 0;
  display: none;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: rgba(255,255,255,.9);
}
#apply form.loading .uk-cover {
  display: flex;
}
#error {
  color: #cc0000;
}
#success {
  color: #00cc00;
}
</style>
<div id="apply">
<form class="uk-cover-container">
<a href="#" id="close-btn" class="close uk-icon" uk-icon="close"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ratio="1"> <path fill="none" stroke="#000" stroke-width="1.06" d="M16,16 L4,4"></path> <path fill="none" stroke="#000" stroke-width="1.06" d="M16,4 L4,16"></path></svg></a>
<header>
<div class="uk-article-meta">Applying for...</div>
<h5 class="uk-margin-remove" id="role-name">${this.role}</h5>
</header>
<div id="error">
</div>
<div id="success">
</div>
<div class="uk-margin uk-margin-remove-top">
<label for="full-name" class="uk-form-label">Full Name</label>
<div class="uk-form-controls uk-inline">
<span class="uk-form-icon uk-icon" uk-icon="icon: user"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ratio="1"> <circle fill="none" stroke="#000" stroke-width="1.1" cx="9.9" cy="6.4" r="4.4"></circle> <path fill="none" stroke="#000" stroke-width="1.1" d="M1.5,19 C2.3,14.5 5.8,11.2 10,11.2 C14.2,11.2 17.7,14.6 18.5,19.2"></path></svg></span>
<input type="text" placeholder="Enter your full name" class="uk-input" id="full-name" name="fullName">
</div>
</div>
<div class="uk-margin">
<label for="email" class="uk-form-label">Email</label>
<div class="uk-form-controls uk-inline">
<span class="uk-form-icon uk-icon" uk-icon="icon: mail"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ratio="1"> <polyline fill="none" stroke="#000" points="1.4,6.5 10,11 18.6,6.5"></polyline> <path d="M 1,4 1,16 19,16 19,4 1,4 Z M 18,15 2,15 2,5 18,5 18,15 Z"></path></svg></span>
<input type="email" placeholder="Enter your Email address" class="uk-input" id="email" name="email">
</div>
</div>
<div class="uk-margin">
<label for="phone" class="uk-form-label">Phone</label>
<div class="uk-form-controls uk-inline">
<span class="uk-form-icon uk-icon" uk-icon="icon: phone"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ratio="1"> <path fill="none" stroke="#000" d="M15.5,17 C15.5,17.8 14.8,18.5 14,18.5 L7,18.5 C6.2,18.5 5.5,17.8 5.5,17 L5.5,3 C5.5,2.2 6.2,1.5 7,1.5 L14,1.5 C14.8,1.5 15.5,2.2 15.5,3 L15.5,17 L15.5,17 L15.5,17 Z"></path> <circle cx="10.5" cy="16.5" r="0.8"></circle></svg></span>
<input type="tel" placeholder="Enter your Phone / Mobile number" class="uk-input" id="phone" name="phone">
</div>
</div>
<div class="js-upload uk-placeholder uk-text-center">
<div style="display: flex; align-items: center;justify-content: center;">
<span uk-icon="icon: cloud-upload" style="margin-right: 5px;" class="uk-icon"><svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" ratio="1"> <path fill="none" stroke="#000" stroke-width="1.1" d="M6.5,14.61 L3.75,14.61 C1.96,14.61 0.5,13.17 0.5,11.39 C0.5,9.76 1.72,8.41 3.31,8.2 C3.38,5.31 5.75,3 8.68,3 C11.19,3 13.31,4.71 13.89,7.02 C14.39,6.8 14.93,6.68 15.5,6.68 C17.71,6.68 19.5,8.45 19.5,10.64 C19.5,12.83 17.71,14.6 15.5,14.6 L12.5,14.6"></path> <polyline fill="none" stroke="#000" points="7.25 11.75 9.5 9.5 11.75 11.75"></polyline> <path fill="none" stroke="#000" d="M9.5,18 L9.5,9.5"></path></svg></span>
<span id="file-name" class="uk-text-middle" style="text-overflow: ellipsis;overflow: hidden;">Attach resume by dropping here or</span>
</div>
<div uk-form-custom="" class="uk-form-custom">
<input type="file" id="file">
<span class="uk-link">selecting one</span>
</div>
</div>
<div class="uk-margin-medium-top">
<button class="uk-button uk-button-primary" id="apply-btn">Apply</button>
</div>
<div class="uk-cover">
<div uk-spinner="" class="uk-spinner uk-icon"><svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg" ratio="1"><circle fill="none" stroke="#000" cx="15" cy="15" r="14"></circle></svg></div>
</div>
</form>
</div>`;
  }
  setProps() {
    this.postUrl = this.getAttribute('post-url');
    this.jd = this.getAttribute('jd');
    this.role = this.getAttribute('role');
  }
  updateShadowDom() {
    if (this._roleName) {
      this._roleName.innerText = this.getAttribute('role');
    }
  }
  postData(url, data) {
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

  postForm() {
    
    const data = {
      email: this._emailInput.value,
      file: this.resumeFile,
      fullName: this._fullNameInput.value,
      jd: this.jd,
      name: this._fullNameInput.value,
      phone: this._emailInput.value,
      role: this.role
    };
    this._errorDiv.innerText = '';
    this._successDiv.innerText = '';
    this.postData(this.postUrl, data).then(data => {
      if (data.errorMessage) {
        this._errorDiv.innerText = data.errorMessage || 'Something Went wrong. Please try again';
      }
      if (data.ok) {
        this._successDiv.innerText = data.Message || 'Success';
        this.dispatchEvent(new CustomEvent('postform', {
          detail: {
            message: data.Message || 'Success'
          },
          bubbles: true
        }));
      }

    }).catch(error => {
      this._errorDiv.innerText = error.errorMessage || 'Something Went wrong. Please try again';
    });
  }

  close() {
    this.dispatchEvent(new CustomEvent('closeform', {
      bubbles: true
    }));
  }

  uploadFile() {
    if (this._fileInput.files && this._fileInput.files[0]) {
      var reader = new FileReader();

      reader.onload = e => {
        this.resumeFile = e.target.result;
        this._fileNameDiv.innerText = this._fileInput.files[0].name;
      }
      reader.readAsDataURL(this._fileInput.files[0]);
    }
  }

  connectedCallback() {
    this.createShadowDom();
  }

  createShadowDom() {
    this.template.innerHTML = this.htmlTemplate;
    const templateContent = this.template.content.cloneNode(true);
    this._applyBtn = templateContent.getElementById('apply-btn');
    this._emailInput = templateContent.getElementById('email');
    this._fullNameInput = templateContent.getElementById('full-name');
    this._phoneInput = templateContent.getElementById('phone');
    this._fileInput = templateContent.getElementById('file');
    this._errorDiv = templateContent.getElementById('error');
    this._successDiv = templateContent.getElementById('success');
    this._roleName = templateContent.getElementById('role-name');
    this._closeBtn = templateContent.getElementById('close-btn');
    this._fileNameDiv = templateContent.getElementById('file-name');
    this._fileInput.onchange = this.uploadFile
    this._applyBtn.onclick = this.postForm;
    this._closeBtn.onclick = this.close;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.appendChild(templateContent);
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    if (oldVal != newVal) {
      this.setProps();
      this.updateShadowDom();
    }
  }
}
window.customElements.define('zcui-job-application-form', ZcuiJobApplicationForm);