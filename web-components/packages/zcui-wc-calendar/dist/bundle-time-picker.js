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
      dateList.push(this._get12HrTime(dt));
      dt.setMinutes(dt.getMinutes() + step);
    }
    return dateList;
  }
  isTimeAllowed(time) {
    let time24h = parseInt(this.convertTo24Hour(time).replace(':', ''));
    let minTime = parseInt(this.minTime.replace(':', ''));
    let maxTime = parseInt(this.maxTime.replace(':', ''));
    return (time24h >= minTime && time24h <= maxTime)
  }
  addClassNames(time) {
    let classNames = ['time'];
    let time24h = this.convertTo24Hour(time);
    if (!this.isTimeAllowed(time)) classNames.push('disable');
    if (time24h == this.selectedTime) classNames.push('selected')
    return classNames.join(' ')
  }
  convertTo24Hour(time12h) {
    const [time, meridiemStatus] = time12h.split(' ')
    let [hrs, minutes] = time.split(':')
    hrs = hrs == '12' ? '00' : hrs
    hrs = (meridiemStatus.toLowerCase() === 'pm') ? parseInt(hrs, 10) + 12 : parseInt(hrs, 10);
    return `${hrs}:${minutes}`
  }
  _get12HrTime(time) {
    let t = time.toTimeString().slice(0, 5);
      let hrs, minutes;
      [hrs, minutes] = t.split(':');
      var h = hrs % 12 || 12;
      var ampm = (hrs < 12 || hrs === 24) ? "AM" : "PM";
      return `${h}:${minutes} ${ampm}`
  }
  _ifRequiredConvertTo24Hr(time){
    let time24h;
    let ampmRegex = /[p,a].?m.?/ig;
    let isAmPmFormat = ampmRegex.test(time.toLowerCase());
    if(isAmPmFormat) {
      time24h = this.convertTo24Hour(time);
      return time24h;
    }
    return time;
  }
  setProps() {
    this.minTime = this._ifRequiredConvertTo24Hr(this.getAttribute('min-time'))|| 0;
    this.maxTime = this._ifRequiredConvertTo24Hr(this.getAttribute('max-time')) || 24;
    this.selectedTime = this._ifRequiredConvertTo24Hr(this.getAttribute('selected-time')) || null;
    // this.visibleMonthCount = this.getAttribute('visible-months') || 6;
  }

  get htmlTemplate () { 
    return html`
    <style>
      .time-containers{padding-right:6px}.time-containers .time{text-align:center;transition:0.2s;padding:10px 0;margin:0}.time-containers .time:hover{color:white;transition:0.2s;background:#B4D3A2;cursor:pointer;border-radius:50px}.time-containers .time.selected{color:white;transition:0.2s;background:#B4D3A2;cursor:pointer;border-radius:50px}.time-containers .time.disable{display:none;color:#b9b9b9;font-weight:300;cursor:not-allowed}.time-containers .time.disable:hover{background:white;color:#b9b9b9}@media screen and (max-width: 425px){.time-containers{padding:0}.time-containers .time{padding:7px 0;margin:0;margin-bottom:4px}}

    </style>
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div class="time-containers">
        ${repeat(this.timeList, (time, i)=>html`
        <p 
          class$="${this.addClassNames(time)}"
          on-click=${e => {this.handleTimeSelection(time)}}
        >
          ${time}
        </p>
        `)} 
    </div>

</body>
</html>
  `;
  };
  handleTimeSelection(time) {
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