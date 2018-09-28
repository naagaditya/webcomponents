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
    this.mon = "1";
    this.today = new Date();
    this.setProps = this.setProps.bind(this);
    this.handleDateSelection = this.handleDateSelection.bind(this);
    this.handleTimeSelection = this.handleTimeSelection.bind(this);
  }
  handleTimeSelection(data) {
    this.selectedTime = data.detail.time;
    this.dispatchDateTimeChange();
    this.updateShadowDom();
  }
  handleDateSelection(data) {
    this.selectedDate = data.detail.date;
    this.dispatchDateTimeChange();
    this.updateShadowDom();
  }
  dispatchDateTimeChange(){
    this.dispatchEvent(new CustomEvent('datetime-change', {bubbles: true, composed: true, detail:{
      time: this.selectedTime,
      date: this.selectedDate
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
      <%- style %>
    </style>
    <%- html %>
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
