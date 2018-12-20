import { html, render } from '../../../../lib/lit-extended.js';
import { repeat } from '../../../../lib/repeat.js';

class ZcuiWcDateTimePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'max-date-time',
      'min-date-time'
    ];
  }

  constructor() {
    super();
    // initialize variables
    this.openMonthList = false;
    this.openYearList = false;
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.monthRangeVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.yearRangeVal = [2018];
    // bind this in all functions
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.toggleOpenMonthList = this.toggleOpenMonthList.bind(this);
    this.toggleOpenYearList = this.toggleOpenYearList.bind(this);
    this._flipPage = this._flipPage.bind(this);

    //initialize Calendar
    this.selectedMonth = 4;
    this.selectedYear = 2018;
    this._flipPage();    
  }

  get htmlTemplate() {
    return html`
      <style>
        <%- style %>
      </style>
      <%- html %>
    `;
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

  setProps() {
    this.maxDateTime = new Date(this.getAttribute('max-date-time'));
    this.minDateTime = new Date(this.getAttribute('min-date-time'));
    this._updateCalendarRange();
    
  }

  connectedCallback() {
    this.createShadowDom();
  }

  toggleOpenMonthList() {
    this.openMonthList = !this.openMonthList;
    this.updateShadowDom();
  }

  toggleOpenYearList() {
    this.openYearList = !this.openYearList;
    this.updateShadowDom();
  }

  selectMonth(month) {
    return () => {
      this.selectedMonth = month;
      this.openMonthList = false;
      this.updateShadowDom();
    }
  }

  selectYear(year) {
    return () => {
      this.selectedYear = year;
      this.openYearList = false;
      this.updateShadowDom();
    }
  }
  
  _updateCalendarRange() {
    const maxDate = new Date(this.maxDateTime);
    const minDate = new Date(this.minDateTime);
    const maxYear = maxDate.getFullYear();
    const minYear = minDate.getFullYear();
    this.yearRangeVal = Array.apply(null, { length: maxYear - minYear + 1 }).map((x, i) => i + minYear);
    if (maxYear - minYear < 1) {
      const maxMonth = maxDate.getMonth();
      const minMonth = minDate.getMonth();
      this.monthRangeVal = Array.apply(null, { length: maxMonth - minMonth + 1 }).map((x, i) => i + minMonth);
    }
  }

  _flipPage() {
    var tempDate = new Date();
    tempDate.setYear(this.selectedYear);
    tempDate.setMonth(this.selectedMonth);
    tempDate.setDate(1);
    this.startDateOfCalendar = 1 - tempDate.getDay();
    tempDate.setMonth(this.selectedMonth - 1);
    tempDate.setDate(0);
    this.endDateOfCalendar = tempDate.getDate();
    this.updateShadowDom();
  }
}

window.customElements.define('zcui-wc-date-time-picker', ZcuiWcDateTimePicker);
