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
    this.setNextMonth = this.setNextMonth.bind(this);
    this.setPrevMonth = this.setPrevMonth.bind(this);
    this._updateMonthRange = this._updateMonthRange.bind(this);
    this.closeDropDowns = this.closeDropDowns.bind(this);

    //initialize Calendar
    this.startDate = new Date();
    this.endDate = null;
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
      this.startDate.setMonth(month);
      this.openMonthList = false;
      this._flipPage();
    }
  }

  selectYear(year) {
    return () => {
      this.startDate.setYear(year);
      this.openYearList = false;
      this._updateMonthRange();
      this._flipPage();
    }
  }
  
  _updateCalendarRange() {
    const maxYear = this.maxDateTime.getFullYear();
    const minYear = this.minDateTime.getFullYear();
    this.yearRangeVal = Array.apply(null, { length: maxYear - minYear + 1 }).map((x, i) => i + minYear);
    if (maxYear - minYear < 1) {
      const maxMonth = this.maxDateTime.getMonth();
      const minMonth = this.minDateTime.getMonth();
      this.monthRangeVal = Array.apply(null, { length: maxMonth - minMonth + 1 }).map((x, i) => i + minMonth);
    }
  }


  setNextMonth() {
    const currentMonth = this.startDate.getMonth();
    this.startDate.setMonth(currentMonth + 1);
    this._flipPage();
  }
  setPrevMonth() {
    const currentMonth = this.startDate.getMonth();
    this.startDate.setMonth(currentMonth - 1);
    this._flipPage();
  }

  _flipPage() {
    let tempDate = new Date();
    tempDate.setDate(1);
    tempDate.setMonth(this.startDate.getMonth());
    tempDate.setYear(this.startDate.getFullYear());
    this.startDateOfCalendar = 1 - tempDate.getDay();
    tempDate.setMonth(this.startDate.getMonth() + 1);
    tempDate.setDate(0);
    this.endDateOfCalendar = tempDate.getDate();
    this.updateShadowDom();
  }

  _updateMonthRange() {
    this.monthRangeVal = Array.apply(null, { length: 12 }).map((x, i) => i);
    if (this.startDate.getFullYear() == this.minDateTime.getFullYear()) {
      const minMonth = this.minDateTime.getMonth();
      if (this.startDate.getMonth() < minMonth) {
        this.startDate.setMonth(minMonth);
      }
      this.monthRangeVal = Array.apply(null, { length: 11 - minMonth + 1 }).map((x, i) => i + minMonth);
    }
    if (this.startDate.getFullYear() == this.maxDateTime.getFullYear()) {
      const maxMonth = this.maxDateTime.getMonth();
      if (this.startDate.getMonth() > maxMonth) {
        this.startDate.setMonth(maxMonth);
      }
      this.monthRangeVal = Array.apply(null, { length: maxMonth + 1 }).map((x, i) => i);
    }
  }
  closeDropDowns() {
    this.openMonthList = false;
    this.openYearList = false;
  }
}

window.customElements.define('zcui-wc-date-time-picker', ZcuiWcDateTimePicker);
