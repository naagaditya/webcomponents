import { html, render } from '../lib/lit-extended.js';
import { directive } from '../lib/lit-html.js';
import { repeat } from '../lib/repeat.js';


class zcCalendar extends HTMLElement {  
  static get observedAttributes() {
  return [
    'visible-months',
    'min-date',
    'max-date',
    'min-time',
    'max-time',
    'selected-time'
  ];
}
  constructor() {
    super();
    this.today = new Date();
    this.setProps = this.setProps.bind(this);
    this.handleDateSubmission = this.handleDateSubmission.bind(this);
    this.handleDateTimeSelection = this.handleDateTimeSelection.bind(this);
  }
  handleDateSubmission(data) {
    this.dispatchDateTimeChange(true);
  }
  handleDateTimeSelection(data) {
    if(data.detail.time) this.selectedTime = data.detail.time;
    if(data.detail.date) this.selectedDate = data.detail.date;
    this.updateShadowDom();
    this.dispatchDateTimeChange();
  }
  dispatchDateTimeChange(isSubmitted=false){
    this.dispatchEvent(new CustomEvent('datetime-change', {bubbles: true, composed: true, detail:{
      time: this.selectedTime,
      date: this.selectedDate,
      isSubmitted,
    }}));
  }
  setProps() {
    this.minDate = this.getAttribute('min-date');
    this.maxDate = this.getAttribute('max-date');
    this.selectedDate = this.getAttribute('selected-date');
    this.selectedTime = this.getAttribute('selected-time');
    this.minTime = this.getAttribute('min-time') || '00:00';
    this.maxTime = this.getAttribute('max-time') || '23:30';
    this.visibleMonthCount = this.getAttribute('visible-months') || 6;
    this.months =  Array.apply(null, { length: this.visibleMonthCount }).map((x, i) => {
        var result = new Date(this.today);
        result.setDate(1);
        result.setMonth(i+this.today.getMonth())
        return result
      })
    this.monthsTemplate = html`${this.months.join(' ')}`
  }

  get htmlTemplate () { 
    return html`
    <style>
      .cal-wrapper{scroll-behavior:smooth;position:absolute;z-index:2;height:325px;background:white;border-radius:3px;width:360px;box-shadow:0 1px 5px #888;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif}.cal-wrapper .date-wrapper{width:270px;display:inline-block;overflow-y:scroll;height:325px}.cal-wrapper .done{position:absolute;font-size:18px;text-align:center;font-weight:500;top:10px;margin:6px;color:#6fbe45;text-transform:uppercase;background:white;border:none;outline:none}.cal-wrapper .time-wrapper{width:85px;display:inline-block;text-align:center;vertical-align:top;height:260px;margin-top:60px;overflow-y:scroll}@media screen and (max-width: 360px){.cal-wrapper{width:120%}.cal-wrapper .date-wrapper{width:70%}}@media screen and (min-width: 360px) and (max-width: 425px){.cal-wrapper{width:93.5%}.cal-wrapper .date-wrapper{width:75%}.cal-wrapper .done{margin:0;margin-top:6px;width:23%;text-align:center;background:transparent}.cal-wrapper .time-wrapper{width:23%;font-size:14px}}

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
    <div class="cal-wrapper">
        <div class="date-wrapper">
            ${repeat(this.months, (month, i)=>html`
            <zc-month-calendar 
            on-date-tap= ${data => this.handleDateTimeSelection(data)} 
            start-year$="${month.getFullYear()}" 
            start-month$="${month.getMonth()}"
            selected-date$="${this.selectedDate}"
            min-date$="${this.minDate}"
            max-date$="${this.maxDate}"
            ></zc-month-calendar>
            `)}
        </div>
        <button class="done" on-click=${e =>{this.handleDateSubmission()}}>Done</button>
        <div class="time-wrapper">
            <zc-time-picker 
            on-time-tap=${data =>this.handleDateTimeSelection(data)}
            selected-time$="${this.selectedTime}"
            min-time$="${this.minTime}"
            max-time$="${this.maxTime}"></zc-time-picker>
        </div>
    </div>

</body>
</html>
  `;
  };

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

window.customElements.define('zc-calendar', zcCalendar);