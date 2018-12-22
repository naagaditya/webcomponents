import { html, render } from '../../../../lib/lit-extended.js';
import { repeat } from '../../../../lib/repeat.js';

class ZcuiWcDateTimePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'max-date-time',
      'min-date-time',
      'interval-in-min'
    ];
  }

  constructor() {
    super();
    // initialize variables
    this.openMonthList = this.openYearList = this.openStartTimeList = this.openEndTimeList = false;
    this.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    this.monthRangeVal = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    this.yearRangeVal = [2018];
    this.calendarWeekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    this.intervalInMin = 30;
    this.timeRangeVal = Array.apply(null, { length: 24 * 60 / this.intervalInMin }).map((x, i) => {
      const hrs = (Math.ceil((i + 1) / 2)) % 24;
      if (i <= 12) {
        return i % 2 == 0 ? `${hrs}:00` : `${hrs}:30`;
      }
      return i % 2 == 0 ? `${hrs}:00` : `${hrs}:30`;
    })
    this.disableNextMonth = this.disablePrevMonth = false;

    // bind this in all functions
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.toggleOpenMonthList = this.toggleOpenMonthList.bind(this);
    this.toggleOpenYearList = this.toggleOpenYearList.bind(this);
    this.toggleOpenStartTimeList = this.toggleOpenStartTimeList.bind(this);
    this.toggleOpenEndTimeList = this.toggleOpenYearList.bind(this);
    this._flipPage = this._flipPage.bind(this);
    this.setNextMonth = this.setNextMonth.bind(this);
    this.setPrevMonth = this.setPrevMonth.bind(this);
    this._updateMonthRange = this._updateMonthRange.bind(this);
    this.closeDropDowns = this.closeDropDowns.bind(this);
    this._checkDisabledNextPrevArrow = this._checkDisabledNextPrevArrow.bind(this);

    //initialize Calendar
    this.startDate = new Date();
    this.selectedMonth = this.startDate.getMonth();
    this.selectedYear = this.startDate.getFullYear();
    this.endDate = null;    
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
    this.intervalInMin = parseInt(this.getAttribute('interval-in-min'));
    this._updateCalendarRange();
    this._flipPage();
    
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

  toggleOpenStartTimeList() {
    this.openStartTimeList = !this.openStartTimeList;
    this.updateShadowDom();
  }

  toggleOpenEndTimeList() {
    this.openEndTimeList = !this.openEndTimeList;
    this.updateShadowDom();
  }

  selectMonth(month) {
    return () => {
      this.selectedMonth = month;
      this.openMonthList = false;
      this._flipPage();
    }
  }

  selectYear(year) {
    return () => {
      this.selectedYear = year;
      this.openYearList = false;
      this._updateMonthRange();
      this._flipPage();
    }
  }
  selectDate(date) {
    return () => {
      if (date > 0) {
        this.startDate.setDate(date);
        this.startDate.setMonth(this.selectedMonth);
        this.startDate.setYear(this.selectedYear);
        this.updateShadowDom();
      }
    }
  }

  selectStartTime(time) {
    return () => {
      console.log(time);
      this.openStartTimeList = false;
      this.updateShadowDom();
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
    this.selectedMonth++;
    if (this.selectedMonth == 12) {
      this.selectedMonth = 0;
      this.selectedYear++;
    }
    this._flipPage();
  }
  setPrevMonth() {
    this.selectedMonth--;
    if (this.selectedMonth == -1) {
      this.selectedMonth = 11;
      this.selectedYear--;
    }
    this._flipPage();
  }

  _flipPage() {
    let tempDate = new Date();
    tempDate.setDate(1);
    tempDate.setMonth(this.selectedMonth);
    tempDate.setYear(this.selectedYear);
    this.startDateOfCalendar = 1 - tempDate.getDay();
    tempDate.setMonth(this.startDate.getMonth() + 1);
    tempDate.setDate(0);
    this.endDateOfCalendar = tempDate.getDate();
    this._checkDisabledNextPrevArrow();
    this._updateMonthRange();
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
    // this.openMonthList = false;
    // this.openYearList = false;
    // this.updateShadowDom();
  }
  _checkDisabledNextPrevArrow() {
    let tempDate = new Date();
    tempDate.setYear(this.startDate.getFullYear());
    this.disableNextMonth = this.disablePrevMonth = false;
    // check for prev mon
    tempDate.setDate(this.minDateTime.getDate());
    let previousMon = new Date(tempDate.setMonth(this.startDate.getMonth() - 1));
    if (previousMon < this.minDateTime) {
      this.disablePrevMonth = true;
    }
    // check for next mon
    tempDate.setDate(this.maxDateTime.getDate());
    let nextMon = new Date(tempDate.setMonth(this.startDate.getMonth() + 1));
    if (nextMon > this.maxDateTime) {
      this.disableNextMonth = true;
    }
  }

  getSelectedDate(date) {
    if (date > 0) {
      const selectedDate = new Date();
      selectedDate.setDate(date);
      selectedDate.setMonth(this.selectedMonth);
      selectedDate.setYear(this.selectedYear);
      selectedDate.setHours(0,0,0,0);
      return selectedDate;
    }
  }
  getStartDate() {
    const tempDate = new Date(this.startDate.getTime());
    tempDate.setHours(0, 0, 0, 0);
    return tempDate;
  }
}

window.customElements.define('zcui-wc-date-time-picker', ZcuiWcDateTimePicker);
