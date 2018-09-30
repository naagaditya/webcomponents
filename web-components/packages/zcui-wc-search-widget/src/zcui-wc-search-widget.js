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

    // index 0 means no error
    this.errorMessages = [
      '',
      'Please select city',
      'Please select starting point',
      'Please select start date',
      'Please select start month',
      'Please select start time',
      'Please select end date',
      'Please select end month',
      'Please select end time',
      'Starts Can\'t be in past',
      'ends Can\'t be in past',
      'Wrong start date selected',
      'Wrong end date selected',
      'Start date cannot be greater than end date'
    ];
    this.pickupErrors = [1,2];
    this.startsErrors = [3,4,5,9,11,13];
    this.endsErrors = [6,7,8,10,12,13];
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
    let formattedDate = ' '
    if(isNaN(dt.getTime())) return formattedDate ;
    formattedDate = dt.toLocaleString('en-GB', {weekday: 'short', month: 'short' , day: 'numeric'});
    let addComma = arr => [arr[0]+',', ...arr.slice(1)].join(' ')
    return addComma(formattedDate.split(' '))
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
        // start time logic will come here;
        
        defaultTime = this._roundTimeHalfHour(new Date()).toLocaleString('en-US',{hourCycle:"h12", hour:'2-digit', minute:'2-digit'});
        break;
      case "end":
        let endTime = new Date();
        endTime.setHours(endTime.getHours() + 4);
        defaultTime = this._roundTimeHalfHour(endTime).toLocaleString('en-US',{hourCycle:"h12", hour:'2-digit', minute:'2-digit'});
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
    return `${hrs}:${minutes}`
  }

  _dateInPast(type) {
    const monthYearIndex = this.searchParams[type].monthYearIndex;
    const selectMonthYear = this.monthsYears[monthYearIndex];
    const date = new Date(`${selectMonthYear.month}-${this.searchParams[type].date}-${selectMonthYear.year} ${this.searchParams[type].time}`);
    const today = new Date();
    return today > date;
  }

  _isStartsGreaterPast() {
    const startsMonthYearIndex = this.searchParams.starts.monthYearIndex;
    const selectStartsMonthYear = this.monthsYears[startsMonthYearIndex];
    const endsMonthYearIndex = this.searchParams.ends.monthYearIndex;
    const selectEndsMonthYear = this.monthsYears[endsMonthYearIndex];
    const starts = new Date(`${selectStartsMonthYear.month}-${this.searchParams.starts.date}-${selectStartsMonthYear.year} ${this.searchParams.starts.time}`);
    const ends = new Date(`${selectEndsMonthYear.month}-${this.searchParams.ends.date}-${selectEndsMonthYear.year} ${this.searchParams.ends.time}`);
    return starts > ends;
  }
  _validateParams() {
    const params = this.searchParams;
    if (!params.cityLinkName) return 1;
    if (!params.lat || !params.lng) return 2;
    if (!params.starts.date) return 3;
    if (!params.starts.monthYearIndex && params.starts.monthYearIndex!=0) return 4;
    if (!params.starts.time) return 5;
    if (!params.ends.date) return 6;
    if (!params.ends.monthYearIndex && params.ends.monthYearIndex != 0) return 7;
    if (!params.ends.time) return 8;
    if (this._dateInPast('starts')) return 9;
    if (this._dateInPast('ends')) return 10;
    if (parseInt(params.starts.date) > this.daysInMonth('starts')) return 11;
    if (parseInt(params.ends.date) > this.daysInMonth('ends')) return 12;
    if (this._isStartsGreaterPast()) return 13;
  }

  searchCar() {
    this.selectedErrorMessage = this._validateParams();
    this.updateShadowDom();
    if (this.selectedErrorMessage) return;

    // const startsMonthYearIndex = this.searchParams.starts.monthYearIndex;
    // const selectStartsMonthYear = this.monthsYears[startsMonthYearIndex];
    // const endsMonthYearIndex = this.searchParams.ends.monthYearIndex;
    // const selectEndsMonthYear = this.monthsYears[endsMonthYearIndex];

    const startDate = new Date(this.startDate).toLocaleString('en-GB', {year:"numeric", month:"2-digit", day:"numeric"}).split('/').reverse().join('-')
    const endDate = new Date(this.endDate).toLocaleString('en-GB', {year:"numeric", month:"2-digit", day:"numeric"}).split('/').reverse().join('-')
    const startTime = this._get24HrTime(this.startTime)
    const endTime = this._get24HrTime(this.endTime)

    const url = `https://www.zoomcar.com/${this.searchParams.cityLinkName}/search/query?lat=${this.searchParams.lat}&lng=${this.searchParams.lng}&starts=${startDate} ${startTime}&ends=${endDate} ${endTime}&type=zoom_later&bracket=with_fuel&ref=${window.location.hostname}`;
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
  _get12HrTime(date) {
    return date.getHours() > 12 ? `${date.getHours() - 12}:00 PM` : `${date.getHours()}:00 AM`;
  }
}

  window.customElements.define('zcui-wc-search-widget', ZcuiWcSearchWidget);
