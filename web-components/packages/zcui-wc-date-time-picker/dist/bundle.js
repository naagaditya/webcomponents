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
        .zcui-wc-date-time-picker-wrapper{width:fit-content;width:-moz-fit-content;outline:none;position:relative}.zcui-wc-date-time-picker{padding:20px;border:solid 1px #cecece;border-radius:5px;margin:auto;min-width:fit-content;min-width:-moz-fit-content;position:absolute;left:0;right:0;border-top:none;background:#fff}.zcui-wc-date-time-picker .d-f{display:flex}.zcui-wc-date-time-picker .fd-c{flex-direction:column}.zcui-wc-date-time-picker .jc-c{justify-content:center}.zcui-wc-date-time-picker .jc-se{justify-content:space-evenly}.zcui-wc-date-time-picker .ai-c{align-items:center}.zcui-wc-date-time-picker .flip-month-page{justify-content:space-around}.zcui-wc-date-time-picker .flip-month-page .left-arrow{border-left:solid 1.5px #6b46bc;border-bottom:solid 1.5px #6b46bc;margin-right:10px;cursor:pointer}.zcui-wc-date-time-picker .flip-month-page .right-arrow{border-right:solid 1.5px #6b46bc;border-top:solid 1.5px #6b46bc;margin-left:10px;cursor:pointer}.zcui-wc-date-time-picker .flip-month-page .arrow{height:12px;width:12px;transform:rotate(45deg)}.zcui-wc-date-time-picker .flip-month-page .arrow.disabled{pointer-events:none;border-color:#cecece}.zcui-wc-date-time-picker .change-month,.zcui-wc-date-time-picker .change-year,.zcui-wc-date-time-picker .change-time{position:relative;cursor:pointer;border:solid 2px #e5e8e9bf;border-radius:5px;padding:5px 10px;margin:0 7px}.zcui-wc-date-time-picker .change-month .down-arrow,.zcui-wc-date-time-picker .change-year .down-arrow,.zcui-wc-date-time-picker .change-time .down-arrow{margin-top:2px;height:8px;width:8px;transform:rotate(45deg);border-right:solid 1.5px #6b46bc;border-bottom:solid 1.5px #6b46bc;margin-left:10px}.zcui-wc-date-time-picker .change-month .month-list,.zcui-wc-date-time-picker .change-month .year-list,.zcui-wc-date-time-picker .change-month .time-list,.zcui-wc-date-time-picker .change-year .month-list,.zcui-wc-date-time-picker .change-year .year-list,.zcui-wc-date-time-picker .change-year .time-list,.zcui-wc-date-time-picker .change-time .month-list,.zcui-wc-date-time-picker .change-time .year-list,.zcui-wc-date-time-picker .change-time .time-list{z-index:1;position:absolute;top:29px;left:0;height:100px;right:0;border:solid 1px #e5e8e9bf;border-top:none;overflow:scroll;padding-top:5px;background:#fff}.zcui-wc-date-time-picker .change-month .month-list span,.zcui-wc-date-time-picker .change-month .year-list span,.zcui-wc-date-time-picker .change-month .time-list span,.zcui-wc-date-time-picker .change-year .month-list span,.zcui-wc-date-time-picker .change-year .year-list span,.zcui-wc-date-time-picker .change-year .time-list span,.zcui-wc-date-time-picker .change-time .month-list span,.zcui-wc-date-time-picker .change-time .year-list span,.zcui-wc-date-time-picker .change-time .time-list span{box-sizing:border-box;padding:5px 10px;width:100%;text-align:left}.zcui-wc-date-time-picker .change-month .month-list span:hover,.zcui-wc-date-time-picker .change-month .year-list span:hover,.zcui-wc-date-time-picker .change-month .time-list span:hover,.zcui-wc-date-time-picker .change-year .month-list span:hover,.zcui-wc-date-time-picker .change-year .year-list span:hover,.zcui-wc-date-time-picker .change-year .time-list span:hover,.zcui-wc-date-time-picker .change-time .month-list span:hover,.zcui-wc-date-time-picker .change-time .year-list span:hover,.zcui-wc-date-time-picker .change-time .time-list span:hover{background:#6b46bc;color:#fff}.zcui-wc-date-time-picker .change-month .month-name,.zcui-wc-date-time-picker .change-year .month-name,.zcui-wc-date-time-picker .change-time .month-name{width:70px}.zcui-wc-date-time-picker .calendar{margin:auto;font-size:14px;width:288px;color:#94979b}.zcui-wc-date-time-picker .calendar .day-name{padding-top:10px;font-size:0}.zcui-wc-date-time-picker .calendar .dates{padding:10px 0;font-size:0}.zcui-wc-date-time-picker .calendar .dates .date-cell{cursor:pointer;border:solid 1px #fff}.zcui-wc-date-time-picker .calendar .dates .date-cell.selected{background:#6b46bc;color:#fff;border-radius:50%}.zcui-wc-date-time-picker .calendar .dates .date-cell.date-in-range{background:#f2f4f7;border-color:#f2f4f7;border-radius:0}.zcui-wc-date-time-picker .calendar .dates .date-cell:hover{border-color:#6b46bc;border-radius:50%}.zcui-wc-date-time-picker .divider{border-bottom:solid 1.5px #e5e8e9bf}.zcui-wc-date-time-picker .date-cell{font-size:14px;display:inline-block;width:40px;text-align:center;padding:10px 0}.zcui-wc-date-time-picker .date-cell.disabled{pointer-events:none;color:#cecece}.zcui-wc-date-time-picker .summary{display:flex;align-items:center}.zcui-wc-date-time-picker .summary .from-summary,.zcui-wc-date-time-picker .summary .to-summary{cursor:pointer;padding:10px 0px}.zcui-wc-date-time-picker .summary .date{width:40px;text-align:right;font-size:40px;padding:0 6px;color:#6b46bc}.zcui-wc-date-time-picker .summary .mon-year-day{width:105px}.zcui-wc-date-time-picker .summary .title{color:#94979b;font-size:12px}.zcui-wc-date-time-picker .summary .selected-day-name{color:#94979b}.zcui-wc-date-time-picker .summary .time-circle{height:20px;width:20px;border:solid 1px #6b46bc;border-radius:50%;margin-left:16px;margin-right:4px}.zcui-wc-date-time-picker .summary .time-circle::after{content:'';display:block;height:8px;width:5px;border-left:solid 1px #6b46bc;border-bottom:solid 1px #6b46bc;margin:4px 0 0 8px}.zcui-wc-date-time-picker .summary .change-time{height:fit-content;height:-moz-fit-content;padding:8px 10px}.zcui-wc-date-time-picker .summary .change-time .down-arrow{margin-top:0}.zcui-wc-date-time-picker .summary .change-time .time-name{width:65px;font-size:15px}.zcui-wc-date-time-picker-display{display:flex;align-items:center;width:fit-content;width:-moz-fit-content;cursor:pointer;border:solid 2px #e5e8e9bf;border-radius:5px;background:#fff}.zcui-wc-date-time-picker-display .starts,.zcui-wc-date-time-picker-display .ends{padding:10px;border-bottom:solid 1px #fff}.zcui-wc-date-time-picker-display .starts.selected,.zcui-wc-date-time-picker-display .ends.selected{border-color:#6b46bc}.hide{display:none}.footer{padding-top:20px;text-align:right}.footer .done{background:#6b46bc;color:#fff;padding:5px 15px;border-radius:6px;cursor:pointer}

      </style>
      <div on-blur=${this.openDateTimePicker(false)} tabindex="0" class="zcui-wc-date-time-picker-wrapper">

  <div class="zcui-wc-date-time-picker-display" on-click=${this.openDateTimePicker(true)}>
    <div
      on-click=${this.changeSelectingDate(`starts`)}
      class$="${this.selectingDateFromSummary == 'starts' ? 'starts selected' : 'starts'}">
      <span>${this.calendarWeekDays[this.startDateTime.getDay()].substr(0,3)},</span>
      <span>${this.monthNames[this.startDateTime.getMonth()].substr(0,3)}</span>
      <span>${this.startDateTime.getDate()},</span>
      <span>${this.startDateTime.getFullYear()},</span>
      <span class$="${this.canPickTime ? '' : 'hide'}">${this.formatedAMPMTime(this.startDateTime)}</span>
    </div>
    <div class$="${this.canPickEnds ? '' : 'hide'}">→</div>
    <div
      on-click=${this.changeSelectingDate(`ends`)}
      class$="${this.canPickEnds ? `${this.selectingDateFromSummary == 'ends' ? 'ends selected' : 'ends'}` : 'hide'}">
      <span>${this.calendarWeekDays[this.endDateTime.getDay()].substr(0,3)},</span>
      <span>${this.monthNames[this.endDateTime.getMonth()].substr(0,3)}</span>
      <span>${this.endDateTime.getDate()},</span>
      <span>${this.endDateTime.getFullYear()},</span>
      <span class$="${this.canPickTime ? '' : 'hide'}">${this.formatedAMPMTime(this.endDateTime)}</span>
    </div>
  </div>
  
  
  <div class$="${this.showDateTimePicker ? 'zcui-wc-date-time-picker d-f' : 'hide'}" on-click=${this.closeDropDowns(this)}>
    <div class="flip-month-page d-f ai-c">
      <span
        on-click=${this.setPrevMonth}
        class$="${this.disablePrevMonth ? 'arrow left-arrow disabled' : 'arrow left-arrow'}">
      </span>
      <span class="change-month d-f">
        <div class="d-f" on-click=${this.toggleOpenMonthList}>
          <span class="month-name">${this.monthNames[this.selectedMonth]}</span>
          <div class="down-arrow"></div>
        </div>
        <div
          class$="${this.openMonthList ? 'month-list d-f ai-c fd-c' : 'hide'}">
          ${repeat(this.monthRangeVal, month => html`
            <span on-click=${this.selectMonth(month)}>${this.monthNames[month]}</span>
          `)}
        </div>
      </span>
      <span class="change-year d-f">
        <div class="d-f" on-click=${this.toggleOpenYearList}>
          <span class="year-name">${this.selectedYear}</span>
          <div class="down-arrow"></div>
        </div>
        <div class$="${this.openYearList ? 'year-list d-f ai-c fd-c' : 'hide'}">
          ${repeat(this.yearRangeVal, year => html`
            <span on-click=${this.selectYear(year)}>${year}</span>
          `)}
        </div>
      </span>
      <span
        on-click="${this.setNextMonth}"
        class$="${this.disableNextMonth ? 'arrow right-arrow disabled' : 'arrow right-arrow'}">
      </span>
    </div>
    <div class="calendar">
      <div class="day-name">
        <span class="date-cell">SU</span>
        <span class="date-cell">MO</span>
        <span class="date-cell">TU</span>
        <span class="date-cell">WE</span>
        <span class="date-cell">TH</span>
        <span class="date-cell">FR</span>
        <span class="date-cell">SA</span>
      </div>
      <div class="divider"></div>
      <!-- (this.endDateOfCalendar-this.startDateOfCalendar+1) will give total dates 
      startDateOfCalendar starts with -ve val or 1 startDateOfCalendar is starts with sunday -->
  
      <div class="dates">
        ${repeat(Array(this.endDateOfCalendar-this.startDateOfCalendar+1).fill(), (date, i) => html`
          <span
            on-click=${this.selectDate(this.startDateOfCalendar+i)}
            class$="${this.isSelectedDate(this.startDateOfCalendar + i) ? 'selected date-cell' : `${this.isValidDate(this.startDateOfCalendar + i) ? `${this.isDateInRange(this.startDateOfCalendar + i) ? 'date-cell date-in-range' : 'date-cell'}` : 'date-cell disabled'}`}">
            ${this.startDateOfCalendar+i > 0 ? this.startDateOfCalendar+i : ''}
          </span>
        `)}
      </div>
    </div>
    <div class$="${this.canPickTime ? 'divider' : 'hide'}"></div>
    <div class$="${this.canPickTime ? 'summary d-f fd-c jc-se' : 'hide'}">
      <div
        class$="${this.selectingDateFromSummary == 'starts' ? 'from-summary selected-summary' : 'from-summary'}"
        on-click=${this.changeSelectingDate(`starts`)}>
        <div class$="${this.canPickEnds ? 'title' : 'hide'}">FROM</div>
        <div class="d-f ai-c">
          <div class="date">${this.startDateTime.getDate()}</div>
          <div class="d-f fd-c jc-c mon-year-day">
            <div>
              <span class="month">${this.monthNames[this.startDateTime.getMonth()]}</span>
              <span class="year">${this.startDateTime.getFullYear()}</span>
            </div>
            <div class="selected-day-name">${this.calendarWeekDays[this.startDateTime.getDay()]}</div>
          </div>
          <div class="time-circle"></div>
          <span class="change-time d-f">
            <div class="d-f" on-click=${this.toggleOpenStartTimeList}>
              <span class="time-name">${this.formatedAMPMTime(this.startDateTime)}</span>
              <div class="down-arrow"></div>
            </div>
            <div class$="${this.openStartTimeList ? 'time-list d-f ai-c fd-c' : 'hide'}">
              ${repeat(this.timeRangeVal, time => html`
              <span on-click=${this.selectTime(`starts`, time)}>${time}</span>
              `)}
            </div>
          </span>
        </div>
      </div>
      <div
        class$="${this.canPickEnds ? 'to-summary' : 'hide'}"
        on-click=${this.changeSelectingDate(`ends`)}>
        <div class="title">TO</div>
        <div class="d-f ai-c">
          <div class="date">${this.endDateTime.getDate()}</div>
          <div class="d-f fd-c jc-c mon-year-day">
            <div>
              <span class="month">${this.monthNames[this.endDateTime.getMonth()]}</span>
              <span class="year">${this.endDateTime.getFullYear()}</span>
            </div>
            <div class="selected-day-name">${this.calendarWeekDays[this.endDateTime.getDay()]}</div>
          </div>
          <div class="time-circle"></div>
          <span class="change-time d-f">
            <div class="d-f" on-click=${this.toggleOpenEndTimeList}>
              <span class="time-name">${this.formatedAMPMTime(this.endDateTime)}</span>
              <div class="down-arrow"></div>
            </div>
            <div class$="${this.openEndTimeList ? 'time-list d-f ai-c fd-c' : 'hide'}">
              ${repeat(this.timeRangeVal, time => html`
              <span on-click=${this.selectTime(`ends`, time)}>${time}</span>
              `)}
            </div>
          </span>
        </div>
      </div>
    </div>
    <div class="divider"></div>
    <div class="footer">
      <a class="done" on-click=${this.submit}>DONE</a>
    </div>
  </div>
</div>
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