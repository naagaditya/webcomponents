import { html, render } from '../lib/lit-extended.js';
import { repeat } from '../lib/repeat.js';

// const result = myTemplate({title: 'yay this is awesome', body: 'lit-html is way too cool'});
// render(result, document.body);


class zcMonthCalendar extends HTMLElement {  
  static get observedAttributes() {
  return [
    'start-year',
    'end-year',
    'start-month',
    'end-month',
    'start-time',
    'end-time',
    'selected-date',
    'min-date',
    'max-date',
  ];
}
  constructor() {
    super();
  }
  setProps() {
    this.startYear = this.getAttribute('start-year');
    this.minDate = this.getAttribute('min-date') ? new Date(this.getAttribute('min-date')) : null;
    this.maxDate = this.getAttribute('max-date') ? new Date(this.getAttribute('max-date')) : null ;
    this.endYear = this.getAttribute('end-year');
    this.startMonth = this.getAttribute('start-month');
    this.endMonth = this.getAttribute('end-month');
    this.startTime = this.getAttribute('start-time');
    this.endTime = this.getAttribute('end-time');
    this.today = new Date();
    this.selectedDate = this.getAttribute('selected-date') ? this.getAttribute('selected-date') : null;
    this.month = this.startMonth || this.today.getMonth();
    this.year  = this.startYear || this.today.getFullYear();
    this.weekDaysShortLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    this.monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.setProps = this.setProps.bind(this);
    this.handleDateSelection = this.handleDateSelection.bind(this)
    this.isdateAllowed = this.isdateAllowed.bind(this)
    this.addClassNames = this.addClassNames.bind(this)
    this.firstDay = new Date(this.year, this.month, 1);
    this.startingDay = this.firstDay.getDay();
    this.daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.monthLength = this.daysInMonth[this.month];
    if (this.month == 1) {
      if ((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0){
          this.monthLength = 29;
      }
  };
  this.monthGridCount = this.monthLength + this.startingDay > 35 ? 42 : 35;
  this.dates =  Array.apply(null, { length: this.monthGridCount }).map((x, i) => {
    i = i+1;
    let date = (i-this.startingDay > 0 && i-this.startingDay <= this.monthLength ? i-this.startingDay : false);
    return date || '.'
  })
  }
  addClassNames(date) {
    let selectedDate = new Date(this.selectedDate);
    let classNames = ['day',];
    if(selectedDate.getTime() === date.getTime()) classNames.push('selected');
    if(!this.isdateAllowed(date)) classNames.push('disabled');
    return classNames.join(' ');
  }
  isdateAllowed(date) {
    let isValidDate = isNaN(date.getTime()) ?  false : true;
    if(!isValidDate) return false
    
    // if date range is not present idea is to enable all the dates.
    let isDateRangePresent = this.maxDate && this.minDate;
    return isDateRangePresent && isValidDate ? (date >= this.minDate) && (date <= this.maxDate) : true;
  }
  get htmlTemplate () { 
    return html`
    <style>
      .month{width:270px;user-select:none}.month h2{text-align:center;font-size:18px;font-weight:600;color:#2e2e2e}.month .month-grid{padding:10px;border-right:1px solid #ccc}.month .weekdays-container .weekdays .weekday{line-height:32px;width:14.2%;height:35px;text-align:center;display:inline-block}.month .days-containers .day{width:calc(100%/8);height:32px;display:inline-block;text-align:center;transition:0.2s;line-height:32px}.month .days-containers .day:hover{color:white;transition:0.2s;background:#B4D3A2;cursor:pointer;border-radius:50px}.month .days-containers .day.selected{color:white;transition:0.2s;background:#B4D3A2;cursor:pointer;border-radius:50px}.month .days-containers .day.disabled{color:#b9b9b9;font-weight:300;cursor:not-allowed}.month .days-containers .day.disabled:hover{background:white;color:#b9b9b9}@media screen and (max-width: 425px){.month{width:100%}.month .month-grid{padding:0}.month .days-containers .day{height:30px;line-height:29px}.month .weekdays-container .weekdays .weekday{height:31px}}

    </style>
    <div class="month">
<h2>${this.monthLabels[this.month]}  ${this.year}</h2>
<div class="month-grid">
    <div class="weekdays-container">
        <div class="weekdays">
                ${repeat(this.weekDaysShortLabels, weekDayLabel=>html`<div class="weekday">${weekDayLabel}</div>`)}
        </div>
    </div>
    <div class="days-containers">

            ${repeat(this.dates, date=>html`
              <div 
                class$="${this.addClassNames(new Date(`${parseInt(this.month)+1}/${date}/${this.year}`))}"
                on-click=${e => {this.handleDateSelection(date)}}
                disabled$="${!this.isdateAllowed(new Date(`${parseInt(this.month)+1}/${date}/${this.year}`))}"
              >
                ${date}
              </div>`)}
    </div>
</div>
</div>
  `;
  };
  handleDateSelection(date) {
    this.selectedDate = date;
    this.updateShadowDom();
    // adding one in month as js dates are 0 based.
    date = `${parseInt(this.month)+1}/${date}/${this.year}`;
    if(this.isdateAllowed(new Date(date))){
      this.dispatchEvent(new CustomEvent('date-tap', {bubbles: true, composed: true, detail:{
      date: date,
    }}));
    }
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

window.customElements.define('zc-month-calendar', zcMonthCalendar);