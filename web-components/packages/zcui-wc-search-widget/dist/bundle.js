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
    this._getDefaultTime = this._getDefaultTime.bind(this);
    this._getDefaultDate = this._getDefaultDate.bind(this);

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
        .zcui-wc-search-widget{position:relative;display:flex;padding:15px;font-size:16px;flex-direction:column;font-family:Arial, Helvetica, sans-serif;background-image:url("https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/bg.svg");background-size:contain;margin:auto;text-align:left;min-height:333px}.zcui-wc-search-widget .background-overlay{position:absolute;width:100%;top:0;left:0;bottom:0;right:0;background-color:rgba(255,255,255,0.52);z-index:0}.zcui-wc-search-widget .error{color:#d0021b;text-align:center;margin:10px;z-index:1}.zcui-wc-search-widget header{z-index:1;display:flex;margin:0 auto}.zcui-wc-search-widget header .logo-container{padding-right:15px;margin:10px 0}.zcui-wc-search-widget header .logo{width:127px}.zcui-wc-search-widget header .title{padding:10px 0px 20px 15px;border-left:1px solid #cecece;width:160px}.zcui-wc-search-widget label{letter-spacing:0.5px;margin:20px 10px 0}.zcui-wc-search-widget .search-input{z-index:1;display:flex;flex-wrap:wrap;padding:10px 0;align-items:baseline}.zcui-wc-search-widget .search-input .input-box{border:solid 2px #8ABD50;margin:7px 10px 0px;display:flex;color:#595656;background:#fff;letter-spacing:.5px;border-radius:2px}.zcui-wc-search-widget .search-input .input-box.error-border{border-color:#d0021b}.zcui-wc-search-widget .search-input .input-box.button{border:none}.zcui-wc-search-widget .search-input .input-box .city{flex:1;border-right:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .city span{flex:1}.zcui-wc-search-widget .search-input .input-box .area{flex:2;position:relative}.zcui-wc-search-widget .search-input .input-box .area input{width:100%;border:none;outline:none;font-size:16px;padding:0 10px}.zcui-wc-search-widget .search-input .input-box .area .location-list{box-shadow:0 2px 4px 0 rgba(0,0,0,0.5);height:230px;overflow:scroll;position:absolute;top:45px;width:100%;left:0;background:#fff;border:solid 1px #cecece;z-index:9}.zcui-wc-search-widget .search-input .input-box .area .location-list div{border-bottom:solid 1px #cecece;padding:15px;cursor:pointer}.zcui-wc-search-widget .search-input .input-box .date{width:21%}.zcui-wc-search-widget .search-input .input-box .month{width:45%;border-right:solid 1px #8ABD50;border-left:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .time{width:34%}.zcui-wc-search-widget .search-input .input-box select{opacity:0;position:absolute;top:0;left:0;bottom:0;right:0;width:100%;height:100%}.zcui-wc-search-widget .search-input .input-box .input{position:relative;padding:12px 9px;display:flex;align-items:center;justify-content:space-between}.zcui-wc-search-widget .search-input .input-wrapper{display:flex;flex-direction:column;flex:1}.zcui-wc-search-widget .search-input .input-wrapper .datetime{margin:12px}.zcui-wc-search-widget .search-input .input-wrapper #start-calendar,.zcui-wc-search-widget .search-input .input-wrapper #end-calendar{margin-left:11px}.zcui-wc-search-widget .date-time{display:flex;flex-wrap:wrap;justify-content:space-between;flex:2}.zcui-wc-search-widget .date-time .input-wrapper{min-width:256px}.zcui-wc-search-widget button{font-size:16px;padding:11px;max-width:420px;border-radius:2.2px;background-color:#6fbe45;box-shadow:1px 1px 7px 0 rgba(186,185,185,0.5);color:#fff;text-transform:uppercase;margin:auto;outline:none}.zcui-wc-search-widget .hide{display:none}

      </style>
      <div class="zcui-wc-search-widget" on-click=${this.closeLocationList}>
  <div class="background-overlay"></div>
  <header>
    <div class="logo-container">
      <img alt="logo" src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/logo.svg" class="logo"/>
    </div>
    <i class="title">
       Enjoy Self Drive Cars Starting <b>Rs 60/Hr*</b>
    </i>
    
  </header>
  <div class="error">${this.errorMessages[this.selectedErrorMessage]}</div>
  <div class="error">${this.apiErrorMsg}</div>
  <div class="search-input">
    <div class="input-wrapper">
      <label>Pick-up & Drop-off location</label>
      <div class$="${this.pickupErrors.includes(this.selectedErrorMessage) ? 'input-box error-border' : 'input-box'}">
        <div class="input city">
          <span>
            ${this.searchParams.cityName ? this.searchParams.cityName : 'Select City'}
          </span>
          <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
          <select on-change=${this.changeCity}>
            <option>${this.cities.length ? '' : 'Please wait'}</option>
             ${repeat( this.cities,
              city => html`
              <option selected="${city.link_name==this.searchParams.cityLinkName ? 'selected' : ''}" value="${city.link_name}">${city.name}</option>
            ` )}
          </select>
        </div>
        <div class="input area">
          <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/location.svg" alt="">
          <input class="area-text-input" type="text" placeholder="Area" on-click=${this.filterLocations} on-keyup=${this.filterLocations} value=${this.searchParams.locationName}>
          <div class$="${this.filteredLocation.length ? 'location-list' : 'hide'}">
            ${repeat(this.filteredLocation, loc => html`
              <div on-click=${e => {this.changeLocation(loc)}}>${loc.name}</div>
            `)}
          </div>
        </div>
      </div>
    </div>
    <div class="date-time">

      <div class="input-wrapper">
        <label>Start Date & Time</label>
        <div 
        on-click=${this.toggleStartCalender}
        class$="${this.startsErrors.includes(this.selectedErrorMessage) ? 'input-box error-border' : 'input-box'}" >
          <p class="datetime"> ${this.formatDate(this.startDate)} - ${this.startTime} </p>
        </div>
        <zc-calendar
        class$="${this.isStartCalenderVisible ? '' : 'hide'}"
        id="start-calendar"
        visible-months="6" 
        min-time="00:00" 
        max-time="23:30"
        selected-date$='${this.startDate}'
        selected-time$='${this.startTime}'
        min-date="08/01/2018"
        max-date="10/15/2019"
        on-datetime-change=${(data) => this.handleStartDateTimeChange(data)}
        ></zc-calendar>
      </div>

      <div class="input-wrapper">
        <label>End Date & Time</label>
        <div
        on-click=${this.toggleEndCalender}
        class$="${this.endsErrors.includes(this.selectedErrorMessage) ? 'input-box error-border' : 'input-box'}">
            <p class="datetime"> ${this.formatDate(this.endDate)} - ${this.endTime} </p>
        </div>
        <zc-calendar
        class$="${this.isEndCalenderVisible ? '' : 'hide'}"
        id="end-calendar"
        visible-months="6" 
        min-time$="${this.startTime}" 
        max-time="23:30"
        selected-date$="${this.endDate}"
        selected-time$="${this.endTime}"
        min-date$="${this.startDate}"
        max-date="10/15/2018"
        on-datetime-change=${(data) => this.handleEndDateTimeChange(data)}
        ></zc-calendar>
      </div>
    </div>
    <div>
      <label for=""></label>
      <div class="input-box button"><button on-click=${this.searchCar}> Search Car</button></div>
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
  _getDefaultTime(type) {
    let defaultTime = '00:00';
    switch(type) {
      case "start":
        // start time logic will come here;
        defaultTime = '08:00';
        break;
      case "end":
        // end time logic will come here;
        defaultTime = '10:00';
        break
      default:
        console.error('Invalid defualt time type');
    }
    return defaultTime
  }
  _getDefaultDate(type) {
    let defaultDate = '08/05/2018';
    switch(type) {
      case "start":
        // start date logic will come here;
        defaultDate = '08/15/2018';
        break;
      case "end":
        // end date logic will come here;
        defaultDate = '08/25/2018';
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

  _get24HrTime(time) {
    const timeArr = time.split(' ');
    return timeArr[1] == 'PM' ? `${parseInt(timeArr[0].split(':')[0]) + 12}:${timeArr[0].split(':')[1]}` : timeArr[0];
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
    const startsMonthYearIndex = this.searchParams.starts.monthYearIndex;
    const selectStartsMonthYear = this.monthsYears[startsMonthYearIndex];
    const endsMonthYearIndex = this.searchParams.ends.monthYearIndex;
    const selectEndsMonthYear = this.monthsYears[endsMonthYearIndex];
    const url = `https://www.zoomcar.com/${this.searchParams.cityLinkName}/search/query?lat=${this.searchParams.lat}&lng=${this.searchParams.lng}&starts=${selectStartsMonthYear.year}-${selectStartsMonthYear.month}-${this.searchParams.starts.date} ${this._get24HrTime(this.searchParams.starts.time)}&ends=${selectEndsMonthYear.year}-${selectEndsMonthYear.month}-${this.searchParams.ends.date} ${window.encodeURIComponent(this._get24HrTime(this.searchParams.ends.time))}&type=zoom_later&bracket=with_fuel&ref=${window.location.hostname}`;
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