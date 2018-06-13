
class AdiLoader extends HTMLElement {
  
  static get observedAttributes() {
    return ['height', 'width', 'circle-radius', 'color', 'distance'];
  }
  
  constructor() {
    super();
    this.template = document.createElement('template');
    this.setProps();
    this.updateTemplate();
    this.currentAnimationTime = 0;
    this.animationRunning = false;
    // this.centreY = 0;
    // this.firstCircle = null;
    // this.secondCircle = null;
    // this.thirdCircle = null;
    this.animate = this.animate.bind(this);
  }
  updateTemplate () {
    this.template.innerHTML = `
      <svg height="${this.height}" width="${this.width}" id="loader">
        <circle id="c" cx="${this.getCord(1, 'x')}" cy="${this.getCord(1, 'y')}" r="${this.circleRadius}" fill="${this.color}"></circle>
        <circle id="d" cx="${this.getCord(2, 'x')}" cy="${this.getCord(2, 'y')}" r="${this.circleRadius}" fill="${this.color}"></circle>
        <circle id="e" cx="${this.getCord(3, 'x')}" cy="${this.getCord(3, 'y')}" r="${this.circleRadius}" fill="${this.color}"></circle>
      </svg>
      `;
  }
  setProps () {
    this.height = this.getAttribute('height') || '100px';
    this.width = this.getAttribute('width') || '100px';
    this.circleRadius = this.getAttribute('circle-radius') || '10';
    this.color = this.getAttribute('color') || '#000';
    this.distance = this.getAttribute('distance') || '30';
  }

  getCord(position, cord) {
    let distance = 0, hw = this.height;
    if (position == 1) distance = -parseInt(this.distance);
    if (position == 3) distance = +parseInt(this.distance);
    if (cord == 'x') hw = this.width;
    return (parseInt(hw.replace('px', '')) / 2) + distance;
  }
  animate() {
    this.firstCircle.setAttribute('cy', this.centreY + 20 * (Math.sin(this.currentAnimationTime)));
    this.secondCircle.setAttribute('cy', this.centreY + 20 * (Math.sin(this.currentAnimationTime + 1)));
    this.thirdCircle.setAttribute('cy', this.centreY + 20 * (Math.sin(this.currentAnimationTime + 2)));

    this.currentAnimationTime += 0.10;
    
    requestAnimationFrame(this.animate);
  }
  connectedCallback() {
    this.updateShadowDom();
  }

  attributeChangedCallback (attr, oldVal, newVal) {
    if (oldVal != newVal) {
      this.setProps();
      this.updateTemplate();
      this.updateShadowDom();
    }
  }
  
  updateShadowDom () {
    const templateContent = this.template.content.cloneNode(true);
    this._content = templateContent.getElementById('loader');
    if (this.shadowRoot) {
      this.shadowRoot.replaceChild(templateContent, this.shadowRoot.firstElementChild);
    }
    else {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.appendChild(templateContent); 
    }
    
    this.centreY = this.getCord(2, 'y');
    this.firstCircle = this._content.getElementById('c');
    this.secondCircle = this._content.getElementById('d');
    this.thirdCircle = this._content.getElementById('e');
    this.currentAnimationTime = 0;
    !this.animationRunning && this.animate(); 
    this.animationRunning = true;
  }

}

window.customElements.define('adi-loader', AdiLoader);