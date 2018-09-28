import { html, render } from '../lib/lit-extended.js';
import { directive } from '../lib/lit-html.js';
import { repeat } from '../lib/repeat.js';


class zcTimePicker extends HTMLElement {  
  static get observedAttributes() {
  return [
    'min-time',
    'max-time',
    'selected-time'
  ];
}
  constructor() {
    super();
    this.selectedTime = null;
    this.isTimeAllowed = this.isTimeAllowed.bind(this);
    this.convertTo24Hour = this.convertTo24Hour.bind(this);
    this.handleTimeSelection = this.handleTimeSelection.bind(this);
    this.timeInterval = 30;
    this.timeList = this._getTimeList(this.timeInterval);
  }
  _getTimeList(step){
    let dateList = []
    var dt = new Date(1970, 0, 1, 0, 0, 0, 0);
    while(dt.getDate() === 1){
      var time = dt.toLocaleTimeString('en-US',  {hour: '2-digit', minute: '2-digit', hour12: true});
      dt.setMinutes(dt.getMinutes() + step);
      dateList.push(time);
    }
    return dateList;
  }
  isTimeAllowed(time) {
    let time24h = parseInt(this.convertTo24Hour(time).replace(':', ''));
    let minTime = parseInt(this.minTime.replace(':', ''));
    let maxTime = parseInt(this.maxTime.replace(':', ''));
    // console.log('......................');
    // console.log('minTime--->', minTime)
    // console.log('time24h--->', time24h)
    // console.log('maxTime--->', maxTime)
    // console.log('......................');
    return (time24h >= minTime && time24h <= maxTime)
  }
  addClassNames(time) {
    let classNames = ['time'];
    if (!this.isTimeAllowed(time)) classNames.push('disable');
    if (this.selectedTime == time) classNames.push('selected')
    return classNames.join(' ')
  }
  convertTo24Hour(time12h) {
    const [time, meridiemStatus] = time12h.split(' ')
    let [hrs, minutes] = time.split(':')
    hrs = hrs == '12' ? '00' : hrs
    hrs = (meridiemStatus.toLowerCase() === 'pm') ? parseInt(hrs, 10) + 12 : parseInt(hrs, 10);
    return `${hrs}:${minutes}`
  }
  setProps() {
    this.minTime = this.getAttribute('min-time') || 0;
    this.maxTime = this.getAttribute('max-time') || 24;
    this.selectedTime = this.getAttribute('selected-time') || null;
    // console.log('minTime-->', this.minTime);
    // console.log('maxTime--->', this.maxTime);
    // this.visibleMonthCount = this.getAttribute('visible-months') || 6;
  }

  get htmlTemplate () { 
    return html`
    <style>
      <%- style %>
    </style>
    <%- html %>
  `;
  };
  handleTimeSelection(time) {
    console.log(time)
    this.dispatchEvent(new CustomEvent('time-tap', {bubbles: true, composed: true, detail:{
      time: time,
    }}));
  }
  connectedCallback() {
    this.createShadowDom();
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
}

window.customElements.define('zc-time-picker', zcTimePicker);
