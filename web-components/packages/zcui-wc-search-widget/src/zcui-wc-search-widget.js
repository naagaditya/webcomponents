import { html, render } from '../lib/lit-extended.js';
import { repeat } from '../lib/repeat.js';

class ZcuiWcSearchWidget extends HTMLElement {
  static get observedAttributes() {
    return [];
  }

  constructor() {
    super();
    this.updateShadowDom = this.updateShadowDom.bind(this);
    this.changeCity = this.changeCity.bind(this);
    this.changeDate = this.changeDate.bind(this);
    this.changeMonth = this.changeMonth.bind(this);
    this.changeTime = this.changeTime.bind(this);
    this.searchCar = this.searchCar.bind(this);
    this._validateParams = this._validateParams.bind(this);
    this.filterLocations = this.filterLocations.bind(this);
    this.changeLocation = this.changeLocation.bind(this);
    this.closeLocationList = this.closeLocationList.bind(this);
    this.toggleStartCalender = this.toggleStartCalender.bind(this);
    this.toggleEndCalender = this.toggleEndCalender.bind(this);
    this.handleStartDateTimeChange = this.handleStartDateTimeChange.bind(this);
    this.handleEndDateTimeChange = this.handleEndDateTimeChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.formatTime = this.formatTime.bind(this);
    this._roundTimeHalfHour = this._roundTimeHalfHour.bind(this);
    this._getDefaultTime = this._getDefaultTime.bind(this);
    this._getDefaultDate = this._getDefaultDate.bind(this);
    this.onOutSideClick = this.onOutSideClick.bind(this);
    this._defaultStartTime = this._getDefaultTime('start');
    this._defaultStartDate = this._getDefaultDate('start');
    this._defaultEndTime = this._getDefaultTime('end');
    this._defaultEndDate = this._getDefaultDate('end');
    this.startDate = this._defaultStartDate;
    this.startTime = this._defaultStartTime;
    this.endDate = this._defaultEndDate;
    this.endTime = this._defaultEndTime;
    this.isEditingStartDateTime = false;
    this.isEditingEndDateTime = false;
    this.apiErrorMsg ='';
    this.cities = [];
    this._loadXMLDoc({
      method: 'GET',
      url: 'https://api.zoomcar.com/v4/cities',
      data: {
        platform: 'web'
      }
    }, (err, data) => {
      if (data) {
        this.cities = JSON.parse(data).cities.sort((a, b) => {
          const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        })
      }
      if (err) this.apiErrorMsg = JSON.parse(err).msg;
      this.updateShadowDom();
    });

    this.locations = {};
    this.filteredLocation = [];
    this.isStartCalenderVisible = false;
    this.isEndCalenderVisible = false;
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const today = new Date();
    this.monthsYears = Array.apply(null, { length: 6 }).map((x, i) => {
      const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
      return {
        month: d.getMonth()+1,
        year: d.getFullYear(),
        displayName: `${monthNames[d.getMonth()]}'${d.getFullYear().toString().substr(2)}`
      };
    })

    this.timeList = Array.apply(null, { length: 48 }).map((x, i) => {
      let temp = i;
      let ampm = 'AM';
      if (i >= 24) {
        temp = i - 24;
        ampm = 'PM';
      }
      return temp % 2 ? `${(temp + 1) / 2}:30 ${ampm}` : `${temp / 2 + 1}:00 ${ampm}`;
    })

    const tomorrow = new Date(today.getTime() + (60 * 60 * 1000));
    const nextDayTomorrow = new Date(tomorrow.getTime() + (24 * 60 * 60 * 1000));
    //default values
    this.searchParams = {
      starts: {
        date: tomorrow.getDate(),
        monthYearIndex: tomorrow.getMonth() > today.getMonth() ? 1 : 0,
        time: this._get12HrTime(tomorrow)
      },
      ends: {
        date: nextDayTomorrow.getDate(),
        monthYearIndex: nextDayTomorrow.getMonth() > tomorrow.getMonth() ? 1 : 0,
        time: this._get12HrTime(nextDayTomorrow)
      },
      cityLinkName: 'mumbai',
      cityName: 'Mumbai'

    };
    this._updateLocations();
    this.selectedErrorMessage = 'noError';
    this.errorMessages = {
      noError:{
        message: ''
      },
      emptyCity: {
        message: 'Please select city'
      },
      emptyLocation: {
        message: 'Please select an area'
      },
      startInPast: {
        message: 'Start date can\'t be in past'
      },
      endInPast: {
        message: 'End date can\'t be in past'
      },
      invalidDateRange: {
        message: 'Start date & time needs to be before end date & time'
      },
      notMinimumBookingDuration: {
        message: 'Minimum booking should be greater than 4 hrs'
      }
    }
    this.pickupErrors = ['emptyCity','emptyLocation'];
    this.startsErrors = ['startInPast', 'invalidDateRange'];
    this.endsErrors = ['endInPast', 'notMinimumBookingDuration'];
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

  connectedCallback() {
    Reflect.construct(HTMLElement, [], this.constructor);
    this.createShadowDom();
  }

  _updateLocations() {
    if (this.locations[this.searchParams.cityLinkName]) return;
    this._loadXMLDoc({
      method: 'GET',
      url: 'https://api.zoomcar.com/v4/hubs',
      data: {
        platform: 'web',
        city: this.searchParams.cityLinkName
      }
    }, (err, data) => {
      if (data) {
        const hubs = JSON.parse(data).hubs.sort((a, b) => {
          const nameA = a.name.toLowerCase(), nameB = b.name.toLowerCase()
          if (nameA < nameB) //sort string ascending
            return -1
          if (nameA > nameB)
            return 1
          return 0 //default return value (no sorting)
        })
        this.locations[this.searchParams.cityLinkName] = hubs;
      }
      if (err) this.apiErrorMsg = JSON.parse(err).msg;
      this.updateShadowDom();
    });
  }
  formatDate(date) {
    let dt = new Date(date);
    let extractedDate ='';
    let extractedDay='';
    let extractedMonth='';
    let formattedDate = 'Invalid Date';

    if(isNaN(dt.getTime())) return formattedDate ;

    [extractedDay, extractedDate, extractedMonth] = dt.toDateString().slice(0, -4).split(' ');
    formattedDate = `${extractedDay}, ${extractedDate} ${extractedMonth}`;
    return formattedDate;
  }
  formatTime(time){
    time = time.toLowerCase();
    if (time.indexOf('am') !== -1 || time.indexOf('pm') !== -1) {
      return time.toUpperCase();
    }
    // this is a fallback for UC browser
    return this._get12HrTime(new Date(time));
  }
  _roundTimeHalfHour(time) {
    var timeToReturn = new Date(time);
    timeToReturn.setMilliseconds(Math.ceil(time.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 30) * 30);
    return timeToReturn;
}
  _getDefaultTime(type) {
    let defaultTime = '00:00';
    switch(type) {
      case "start":
        defaultTime = this._get12HrTime(this._roundTimeHalfHour(new Date()));
        break;
      case "end":
        let endTime = new Date();
        endTime.setHours(endTime.getHours() + 4);
        defaultTime = this._get12HrTime(this._roundTimeHalfHour(endTime));
        break
      default:
        console.error('Invalid defualt time type');
    }
    return defaultTime
  }
  _getDefaultDate(type) {
    let defaultDate = '09/05/2018';
    switch(type) {
      case "start":
        defaultDate = new Date().toLocaleDateString('en-US');
        break;
      case "end":
        let endDate = new Date();
        endDate.setHours(endDate.getHours()+4);
        defaultDate = endDate.toLocaleDateString('en-US');
        break
      default:
        console.error('Invalid defualt date type');
    }
    return defaultDate
  }
  handleStartDateTimeChange(data) {
    this.startDate = data.detail.date;
    this.startTime = data.detail.time;
    let isSubmitted = data.detail.isSubmitted;
    if((this._defaultStartDate != this.startDate && this._defaultStartTime != this.startTime && !this.isEditingStartDateTime) || isSubmitted){
      this.isStartCalenderVisible = false;
      this.isEndCalenderVisible = true;
      this.isEditingStartDateTime = true;
    }
    this.updateShadowDom();
  }
  handleEndDateTimeChange(data) {
    let isSubmitted = data.detail.isSubmitted;
    this.endDate = data.detail.date;
    this.endTime = data.detail.time;
    if((this._defaultEndDate != this.endDate && this._defaultEndTime != this.endTime && !this.isEditingEndDateTime) || isSubmitted){
      this.isStartCalenderVisible = false;
      this.isEndCalenderVisible = false;
      this.isEditingEndDateTime = true;
    }
    this.updateShadowDom();
  }
  changeCity(e) {
    this.searchParams.cityLinkName = e.target.value;
    this.searchParams.cityName = this.cities.filter(city => city.link_name == e.target.value)[0].name;
    delete this.searchParams.lat;
    delete this.searchParams.lng;
    this._updateLocations();
    this.searchParams.locationName = '';
    this.updateShadowDom();
  }

  changeDate(val, type) {
    this.searchParams[type].date = val;
    this.updateShadowDom();
  }

  changeMonth(val, type) {
    this.searchParams[type].monthYearIndex = val;
    this.updateShadowDom();
  }

  changeTime(val, type) {
    this.searchParams[type].time = val;
    this.updateShadowDom();
  }
  toggleStartCalender(){
    this.isEndCalenderVisible = false;
    this.isStartCalenderVisible = !this.isStartCalenderVisible;
  }
  toggleEndCalender(){
    this.isStartCalenderVisible = false;
    this.isEndCalenderVisible = !this.isEndCalenderVisible;
  }
  filterLocations(e) {
    if (!this.searchParams.cityLinkName) return;
    this.filteredLocation = this.locations[this.searchParams.cityLinkName].filter(loc => {
      return loc.name.toLowerCase().includes(e.currentTarget.value.toLowerCase());
    });
    this.updateShadowDom();
  }

  changeLocation(loc) {
    this.searchParams.locationName = loc.name;
    this.searchParams.lat = loc.lat;
    this.searchParams.lng = loc.lng;
    this.filteredLocation = [];
    this.updateShadowDom();
  }

  daysInMonth(type) {
    const monthYearIndex = this.searchParams[type].monthYearIndex;
    const selectMonthYear = this.monthsYears[monthYearIndex];
    return new Date(selectMonthYear.year, selectMonthYear.month, 0).getDate();
  }

  _get24HrTime(time12h) {
    const [time, meridiemStatus] = time12h.split(' ')
    let [hrs, minutes] = time.split(':')
    hrs = hrs == '12' ? '00' : hrs
    hrs = (meridiemStatus.toLowerCase() === 'pm') ? parseInt(hrs, 10) + 12 : parseInt(hrs, 10);
    hrs = hrs < 10 ? '0' + hrs : hrs;
    return `${hrs}:${minutes}`
  }

  _dateInPast(type) {
    const today = new Date();
    let date;
    if(type === 'starts'){
      date = new Date(`${this.startDate} ${this.startTime}`);
    }
    if(type === 'ends'){
      date = new Date(`${this.endDate} ${this.endTime}`);
    } 
    return today > date;
  }

  _isStartsGreaterPast() {
    const starts = new Date(`${this.startDate} ${this.startTime}`);
    const ends = new Date(`${this.endDate} ${this.endTime}`);
    return starts > ends;
  }
_isMinimumBookingDuration() {
  const starts = new Date(`${this.startDate} ${this.startTime}`);
  const ends = new Date(`${this.endDate} ${this.endTime}`);
  let hours = Math.abs(ends - starts) / 36e5;
  return hours < 4;
}
  _validateParams() {
    const params = this.searchParams;
    if (!params.cityLinkName) return 'emptyCity';
    if (!params.lat || !params.lng) return 'emptyLocation';
    if (this._dateInPast('starts')) return 'startInPast';
    if (this._dateInPast('ends')) return 'endInPast';
    if (this._isStartsGreaterPast()) return 'invalidDateRange';
    if(this._isMinimumBookingDuration()) return 'notMinimumBookingDuration';
    return 'noError';
  }

  searchCar() {
    this.selectedErrorMessage = this._validateParams();
    this.updateShadowDom();

    if (this.selectedErrorMessage != 'noError') return;
    
    let startDate = new Date(this.startDate);
    let endDate = new Date(this.endDate);
    let timeZoneOffset = startDate.getTimezoneOffset() * 60000;
    let ref = window.location.hostname.split('.').slice(1,2).join('')
    startDate = new Date(startDate.getTime() - timeZoneOffset).toISOString().slice(0,10);
    endDate = new Date(endDate.getTime() - timeZoneOffset).toISOString().slice(0,10);

    const startTime = this._get24HrTime(this.startTime);
    const endTime = this._get24HrTime(this.endTime);

    const url = `https://www.zoomcar.com/${this.searchParams.cityLinkName}/search/query?lat=${this.searchParams.lat}&lng=${this.searchParams.lng}&starts=${startDate} ${startTime}&ends=${endDate} ${endTime}&type=zoom_later&bracket=with_fuel&ref=${ref}`;
    window.open(url, '_blank');
  }

  _loadXMLDoc(request, callback) {
    const { url, method = 'GET', data = {} } = request;
    const urlParams = this._objToUrl(data);
    let xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        if (this.status == 200) {
          callback(null, this.responseText);
        } else {
          callback(this.responseText, null);
        }
      }
    };
    xmlhttp.open(method, `${request.url}?${urlParams}`, true);
    xmlhttp.send(method == 'POST' ? urlParams : undefined);
  }
  
  _objToUrl(obj) {
    return Object.keys(obj).map(k => `${k}=${obj[k]}`).join('&');
  }
  onOutSideClick(e) {
    this.closeCalendars(e);
    this.closeLocationList(e);
  }
  closeCalendars(e) {
    let validCalClick = ['zc-calendar', 'input-box', 'datetime', 'zc-calender hide']
    if(validCalClick.includes(e.target.className)) return;
    this.isStartCalenderVisible = false;
    this.isEndCalenderVisible = false;
  }
  closeLocationList(e) {
    if (e.target.className == 'area-text-input') return;
    this.filteredLocation = [];
    this.updateShadowDom();
  }
  _get12HrTime(time) {
    let t = time.toTimeString().slice(0, 5);
    let hrs, minutes;
    [hrs, minutes] = t.split(':');
    var h = hrs % 12 || 12;
    var ampm = (hrs < 12 || hrs === 24) ? "AM" : "PM";
    return `${h}:${minutes} ${ampm}`
  }
}

  window.customElements.define('zcui-wc-search-widget', ZcuiWcSearchWidget);
