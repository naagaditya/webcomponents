import { html, render } from '../../../../lib/lit-extended.js';
import { repeat } from '../../../../lib/repeat.js';

class ZcuiWcDateTimePicker extends HTMLElement {
  static get observedAttributes() {
    return [
      'max-date-time',
      'min-date-time',
      'interval-in-min',
      'time',
      'ends',
      'default-starts',
      'default-ends'
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
    this.disableNextMonth = this.disablePrevMonth = false;
    this.showDateTimePicker = false;

    // bind this in all functions
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.toggleOpenMonthList = this.toggleOpenMonthList.bind(this);
    this.toggleOpenYearList = this.toggleOpenYearList.bind(this);
    this.toggleOpenStartTimeList = this.toggleOpenStartTimeList.bind(this);
    this.toggleOpenEndTimeList = this.toggleOpenEndTimeList.bind(this);
    this._flipPage = this._flipPage.bind(this);
    this.setNextMonth = this.setNextMonth.bind(this);
    this.setPrevMonth = this.setPrevMonth.bind(this);
    this._updateMonthRange = this._updateMonthRange.bind(this);
    this.closeDropDowns = this.closeDropDowns.bind(this);
    this._checkDisabledNextPrevArrow = this._checkDisabledNextPrevArrow.bind(this);
    this.isValidDate = this.isValidDate.bind(this);
    this.isDateInRange = this.isDateInRange.bind(this);
    this.changeSelectingDate = this.changeSelectingDate.bind(this);
    this.openDateTimePicker = this.openDateTimePicker.bind(this);
    this.submit = this.submit.bind(this);

    //initialize Calendar
    this.selectingDateFromSummary = null;
    this.selectingDate = 'starts'; //can be starts or ends
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
    const maxDateTimeProps = this.getAttribute('max-date-time');
    const minDateTimeProps = this.getAttribute('min-date-time');
    const defaultStartsProps = this.getAttribute('default-starts');
    const defaultEndsProps = this.getAttribute('default-ends');

    this.maxDateTime = maxDateTimeProps ? new Date(maxDateTimeProps) : new Date(new Date().setMonth(new Date().getMonth() + 5));
    this.minDateTime = minDateTimeProps ? new Date(minDateTimeProps) : new Date(new Date().setMonth(new Date().getMonth() - 5));
    this.intervalInMin = parseInt(this.getAttribute('interval-in-min'));
    this.canPickTime = this.getAttribute('time') == 'true';
    this.canPickEnds = this.getAttribute('ends') == 'true';
    this.startDateTime = defaultStartsProps ? new Date(defaultStartsProps) : new Date();
    this.endDateTime = this.canPickEnds && (defaultEndsProps ? new Date(defaultEndsProps) : new Date(new Date().setDate(this.startDateTime.getDate() + 5)));
    this._initializeCalendar();
    this._updateCalendarRange();
    this._updateTimeRange();
    this._flipPage();
    
  }

  _initializeCalendar() {
    this.selectedMonth = this.startDateTime.getMonth();
    this.selectedYear = this.startDateTime.getFullYear();
    this.dateRange = {
      from: null,
      to: null
    }
    if (this.canPickEnds) {
      this.dateRange = {
        from: new Date(this.startDateTime),
        to: new Date(this.endDateTime)
      }
    }
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
      if (date <= 0) return;
      const pickedDate = new Date(this.selectedYear, this.selectedMonth, date).getTime();
      const starts = new Date(this.startDateTime).getTime();
      const ends = new Date(this.endDateTime).getTime();
      if (pickedDate > starts) {
        this.selectingDate = this.selectingDateFromSummary || 'ends';
      }
      if (pickedDate < starts || pickedDate == starts || pickedDate == ends) {
        this.selectingDate = 'starts';
      }
      
      if (pickedDate > ends && this.selectingDateFromSummary == 'starts') {
        this.selectingDate = 'starts';
        this.selectingDateFromSummary = null;
        this.endDateTime = new Date(pickedDate);
      }
      if (pickedDate < starts && this.selectingDateFromSummary == 'ends') {
        this.selectingDate = 'ends';
        this.selectingDateFromSummary = null;
        this.startDateTime = new Date(pickedDate);
      }

      let dateTimeToChange;
      if (this.selectingDate == 'starts') {
        dateTimeToChange = this.startDateTime;
      }
      else {
        dateTimeToChange = this.endDateTime;
      }

      dateTimeToChange = dateTimeToChange;
      dateTimeToChange.setDate(date);
      dateTimeToChange.setMonth(this.selectedMonth);
      dateTimeToChange.setYear(this.selectedYear);
      if (this.canPickEnds) {
        this.dateRange = {
          from: new Date(this.startDateTime),
          to: new Date(this.endDateTime)
        }
      }
      this._updateTimeRange();
      this.updateShadowDom();
      
    }
  }

  selectTime(type, time) {
    return () => {
      const timeArr = time.split(' ')[0].split(':');
      const ampm = time.split(' ')[1];
      const hrs = ampm == 'PM' ? parseInt(timeArr[0]) % 12 + 12 : timeArr[0] == 12 ? 0 : timeArr[0];
      if (type == 'starts') {
        this.startDateTime.setHours(hrs, timeArr[1])
        this.openStartTimeList = false;
      }
      else {
        this.endDateTime.setHours(hrs, timeArr[1])
        this.openEndTimeList = false;
      }
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
    this.startDateOfCalendar = 1 - new Date(this.selectedYear, this.selectedMonth, 1).getDay();
    this.endDateOfCalendar = new Date(this.selectedYear, this.selectedMonth + 1, 0).getDate();
    this._checkDisabledNextPrevArrow();
    this._updateMonthRange();
  }

  _updateMonthRange() {
    this.monthRangeVal = Array.apply(null, { length: 12 }).map((x, i) => i);
    if (this.selectedYear == this.minDateTime.getFullYear()) {
      const minMonth = this.minDateTime.getMonth();
      if (this.selectedMonth < minMonth) {
        this.startDateTime.setMonth(minMonth);
      }
      this.monthRangeVal = Array.apply(null, { length: 11 - minMonth + 1 }).map((x, i) => i + minMonth);
      if (!this.monthRangeVal.includes(this.selectedMonth)) {
        this.selectedMonth = this.monthRangeVal[0];
      }
    }
    if (this.selectedYear == this.maxDateTime.getFullYear()) {
      const maxMonth = this.maxDateTime.getMonth();
      if (this.selectedMonth > maxMonth) {
        this.startDateTime.setMonth(maxMonth);
      }
      this.monthRangeVal = Array.apply(null, { length: maxMonth + 1 }).map((x, i) => i);
      if (!this.monthRangeVal.includes(this.selectedMonth)) {
        this.selectedMonth = this.monthRangeVal[this.monthRangeVal.length - 1];
      }
    }
  }
  closeDropDowns() {
    return (e) => {
      const skipForClasses = ['month-name', 'year-name', 'time-name', 'down-arrow'];
      if (skipForClasses.includes(e.path[0].className)) return;
      this.openMonthList = false;
      this.openYearList = false;
      this.openEndTimeList = false;
      this.openStartTimeList = false;
      this.updateShadowDom(); // dont delete this line because this is updating other actions also like flip page, time select, date select etc.
    }
  }
  _checkDisabledNextPrevArrow() {
    this.disableNextMonth = this.disablePrevMonth = false;
    // check for prev mon
    let previousMon = new Date(this.minDateTime);
    previousMon.setYear(this.selectedYear);
    previousMon.setMonth(this.selectedMonth - 1);
    if (previousMon < this.minDateTime) {
      this.disablePrevMonth = true;
    }
    // check for next mon
    let nextMon = new Date(this.maxDateTime);
    nextMon.setYear(this.selectedYear);
    nextMon.setMonth(this.selectedMonth + 1);
    if (nextMon > this.maxDateTime) {
      this.disableNextMonth = true;
    }
  }

  getSelectedDate(date) {
    if (date > 0) {
      const selectedDate = new Date(this.selectedYear, this.selectedMonth, date);
      return selectedDate;
    }
  }
  getDateOnly(dateTime) {
    const tempDate = new Date(dateTime.getTime());
    tempDate.setHours(0, 0, 0, 0);
    return tempDate;
  }
  _updateTimeRange() {
    const divisor = Math.round(60 / this.intervalInMin);
    this.intervalInMin = 60 / divisor; //normalizing interval (making divisor of 60)
    const minutes = Array.apply(null, { length: divisor }).map((x, i) => this.intervalInMin * i);
    const minDateTime = new Date(this.minDateTime).setMilliseconds(0);
    const maxDateTime = new Date(this.maxDateTime).setMilliseconds(0);
    this.timeRangeVal = Array.apply(null, { length: 24 * divisor }).map((x, i) => {
      const hrs = Math.floor(i / divisor) % 24;
      const tempDate = this.getSelectedDate(this.startDateTime.getDate()).setHours(hrs, minutes[i % divisor], 0);
      if (tempDate < minDateTime || tempDate > maxDateTime) {
        return null;
      }
      const ampm = hrs < 12 ? 'AM' : 'PM';
      return `${hrs%12 ? hrs%12 : 12}:${(i % divisor) ? minutes[i % divisor] : '00'} ${ampm}`;
    }).filter(x=>x);
  }

  isSelectedDate(date) {
    return (this.getSelectedDate(date) &&
      this.getDateOnly(this.startDateTime).getTime() == this.getSelectedDate(date).getTime() ||
      (this.endDateTime && this.getSelectedDate(date) && this.canPickEnds &&
      this.getDateOnly(this.endDateTime).getTime() == this.getSelectedDate(date).getTime())
      );
  }

  isValidDate(date) {
    if (date <= 0) return false;
    const minDateTime = new Date(this.minDateTime).setHours(0, 0, 0, 0);
    const maxDateTime = new Date(this.maxDateTime).setHours(0, 0, 0, 0);
    const tempDate = this.getSelectedDate(date).setHours(0, 0, 0, 0);
    return !(tempDate < minDateTime || tempDate > maxDateTime);
  }
  formatedAMPMTime(date) {
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    const strTime = hours + ':' + minutes + ' ' + ampm;
    return strTime;
  }

  isDateInRange(date) {
    if (!this.dateRange.from || !this.dateRange.to) return false;
    const pickingDate = this.getSelectedDate(date).setHours(0, 0, 0, 0);
    const fromDate = this.dateRange.from.setHours(0, 0, 0, 0);
    const toDate = this.dateRange.to.setHours(0, 0, 0, 0);
    return (pickingDate > fromDate && pickingDate < toDate);
  }

  changeSelectingDate(selectingDate) {
    return () => {
      this.selectingDateFromSummary = selectingDate;
    }
  }

  openDateTimePicker(isShow) {
    return () => {
      this.showDateTimePicker = isShow;
      this.updateShadowDom();
    }
  }
  submit() {
    this.dispatchEvent(new CustomEvent('done', {
      detail: {
        from: this.startDateTime,
        to: this.canPickEnds && this.endDateTime
      },
      bubbles: true
    }));
    this.showDateTimePicker = false;
    this.updateShadowDom();
  }
}

window.customElements.define('zcui-wc-date-time-picker', ZcuiWcDateTimePicker);
