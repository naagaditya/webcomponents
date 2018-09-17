import { html, render } from 'https://unpkg.com/lit-html@0.10.2/lib/lit-extended.js';
import { repeat } from 'https://unpkg.com/lit-html@0.10.2/lib/repeat.js';

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
    
    this.cities = [];
    this._loadXMLDoc({
      method: 'GET',
      url: 'https://api.zoomcar.com/v4/cities',
      data: {
        platform: 'web'
      }
    }, (err, data) => {
      setTimeout(() => {
        
        this.cities = JSON.parse(data).cities;
        this.updateShadowDom();
      }, 10000);
    });

    this.locations = { 
      'Bangalore': [{
        name: 'domlur',
        lat: 12.9718915,
        lng: 77.6411545
      }, {
          name: 'indiranagar',
          lat: 12.9718915,
          lng: 77.6411545
        },
      {
        name: 'koramangala',
        lat: 12.9279232,
        lng: 77.6271078
      }],
      'Pune':[],
      'Delhi':[],
      'Lucknow':[],
      'Hydrabad':[],
      'Patna': []
    }
    this.filteredLocation = [];

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


    this.searchParams = {
      starts: {},
      ends: {}

    };

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
        .zcui-wc-search-widget{display:flex;padding:20px;font-size:12px;flex-direction:column;font-family:Arial, Helvetica, sans-serif;background-image:url("https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/bg.svg");background-size:contain;max-width:1000px;margin:auto}.zcui-wc-search-widget .error{color:#d0021b;text-align:center;margin:10px;font-size:13px}.zcui-wc-search-widget header{display:flex;margin:auto}.zcui-wc-search-widget header .logo-container{padding:0 20px;margin:10px 0;border-right:solid 1px #cecece}.zcui-wc-search-widget header .logo{width:127px}.zcui-wc-search-widget header .title{padding:10px 20px;font-size:13px;width:125px}.zcui-wc-search-widget label{letter-spacing:.5px;font-size:13px;margin:0 10px}.zcui-wc-search-widget .search-input{display:flex;margin-top:10px;flex-direction:column;padding:10px 0}.zcui-wc-search-widget .search-input .input-box{border:solid 1px #8ABD50;margin:7px 10px 20px;display:flex;color:#595656;background:#fff;letter-spacing:.5px}.zcui-wc-search-widget .search-input .input-box.error-border{border-color:#d0021b}.zcui-wc-search-widget .search-input .input-box .city{flex:1;border-right:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .city span{flex:1;padding:0 10px}.zcui-wc-search-widget .search-input .input-box .area{flex:1;position:relative}.zcui-wc-search-widget .search-input .input-box .area input{width:100%;border:none;outline:none;font-size:13px}.zcui-wc-search-widget .search-input .input-box .area .location-list{position:absolute;top:45px;width:100%;left:0;background:#fff;border:solid 1px #cecece;z-index:9}.zcui-wc-search-widget .search-input .input-box .area .location-list div{border-bottom:solid 1px #000;padding:15px;cursor:pointer}.zcui-wc-search-widget .search-input .input-box .date{width:21%}.zcui-wc-search-widget .search-input .input-box .month{width:45%;border-right:solid 1px #8ABD50;border-left:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .time{width:34%}.zcui-wc-search-widget .search-input .input-box select{opacity:0;position:absolute;top:0;left:0;bottom:0;right:0;width:100%;height:100%}.zcui-wc-search-widget .search-input .input-box .input{position:relative;padding:12px 9px;display:flex;align-items:center;justify-content:space-between}.zcui-wc-search-widget .search-input .input-wrapper{display:flex;flex-direction:column}.zcui-wc-search-widget .date-time{display:flex;flex-wrap:wrap;justify-content:space-between}.zcui-wc-search-widget .date-time .input-wrapper{min-width:256px;flex:1}.zcui-wc-search-widget button{font-size:12px;font-weight:bold;padding:14px;width:100%;max-width:420px;border-radius:2.2px;background-color:#6fbe45;box-shadow:1px 1px 7px 0 rgba(186,185,185,0.5);color:#fff;text-transform:uppercase;margin:auto;outline:none}.zcui-wc-search-widget .hide{display:none}

      </style>
      <div class="zcui-wc-search-widget">
  <header>
    <div class="logo-container">
      <img alt="logo" src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/logo.svg" class="logo"/>
    </div>
    <i class="title">
       Enjoy Self Drive Cars Starting <b>Rs 60/Hr*</b>
    </i>
    
  </header>
  <div class="error">${this.errorMessages[this.selectedErrorMessage]}</div>
  <div class="search-input">
    <div class="input-wrapper">
      <label>Pick-up Location</label>
      <div class$="${this.pickupErrors.includes(this.selectedErrorMessage) ? 'input-box error-border' : 'input-box'}">
        <div class="input city">
          <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/location.svg" alt="">
          <span>
            ${this.searchParams.city ? this.searchParams.city : 'Select City'}
          </span>
          <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
          <select on-change=${this.changeCity}>
            <option>${this.cities.length ? '' : 'Please wait'}</option>
             ${repeat( this.cities,
              city => html`
              <option value="${city.name}">${city.name}</option>
            ` )}
          </select>
        </div>
        <div class="input area">
          <input type="text" placeholder="Starting Point" on-keyup=${this.filterLocations} value=${this.searchParams.locationName}>
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
        <div class$="${this.startsErrors.includes(this.selectedErrorMessage) ? 'input-box error-border' : 'input-box'}">
          <div class="input date">
            <span>${this.searchParams.starts.date ? this.searchParams.starts.date : 'Date'}</span>
            <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
            <select on-change=${e => { this.changeDate(e.currentTarget.value, 'starts')}}>
              <option></option>
              ${repeat( Array.apply(null, {length: 31}).map((x,i)=> i+1), day => html`
              <option value="${day}">${day}</option>
              ` )}
            </select>
          </div>
          <div class="input month">
            <span>
              ${this.searchParams.starts.monthYearIndex ?
                this.monthsYears[this.searchParams.starts.monthYearIndex].displayName :
                'Month'
              }
            </span>
            <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
            <select on-change=${e => { this.changeMonth(e.currentTarget.value, 'starts')}}>
              <option></option>
              ${repeat(this.monthsYears, (month, i) => html`
              <option value=${i}>${month.displayName}</option>
              `)}
            </select>
          </div>
          <div class="input time">
            <span>${this.searchParams.starts.time ? this.searchParams.starts.time : 'Time'}</span>
            <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
            <select on-change=${e => { this.changeTime(e.currentTarget.value, 'starts')}}>
              <option></option>
              ${repeat(this.timeList, time => html `
              <option value=${time}>${time}</option>
              `)}
            </select>
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <label>End Date & Time</label>
        <div class$="${this.endsErrors.includes(this.selectedErrorMessage) ? 'input-box error-border' : 'input-box'}">
          <div class="input date">
            <span>${this.searchParams.ends.date ? this.searchParams.ends.date : 'Date'}</span>
            <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
            <select on-change=${e => { this.changeDate(e.currentTarget.value, 'ends')}}>
              <option></option>
              ${repeat( Array.apply(null, {length: 31}).map((x,i)=> i+1), day => html`
              <option value="${day}">${day}</option>
              ` )}
            </select>
          </div>
          <div class="input month">
            <span>
              ${this.searchParams.ends.monthYearIndex ? this.monthsYears[this.searchParams.ends.monthYearIndex].displayName :
                'Month' }
            </span>
            <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
            <select on-change=${e => { this.changeMonth(e.currentTarget.value, 'ends')}}>
              <option></option>
              ${repeat(this.monthsYears, (month, i) => html`
              <option value=${i}>${month.displayName}</option>
              `)}
            </select>
          </div>
          <div class="input time">
            <span>${this.searchParams.ends.time ? this.searchParams.ends.time : 'Time'}</span>
            <img src="https://s3.ap-south-1.amazonaws.com/zcui-web-components/images/arrow.svg" alt="">
            <select on-change=${e => { this.changeTime(e.currentTarget.value, 'ends')}}>
              <option></option>
              ${repeat(this.timeList, time => html `
              <option value=${time}>${time}</option>
              `)}
            </select>
          </div>
        </div>
      </div>
    </div>
    <button on-click=${this.searchCar}> Search Car</button>
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
    this.createShadowDom();
  }

  changeCity(e) {
    this.searchParams.city = e.currentTarget.value;
    delete this.searchParams.lat;
    delete this.searchParams.lng;
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

  filterLocations(e) {
    this.filteredLocation = this.locations[this.searchParams.city].filter(loc => {
      return loc.name.includes(e.currentTarget.value);
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
    if (!params.city) return 1;
    if (!params.lat || !params.lng) return 2;
    if (!params.starts.date) return 3;
    if (!params.starts.monthYearIndex) return 4;
    if (!params.starts.time) return 5;
    if (!params.ends.date) return 6;
    if (!params.ends.monthYearIndex) return 7;
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
    const url = `https://www.zoomcar.com/${this.searchParams.city.toLowerCase()}/search/query?lat=${this.searchParams.lat}&lng=${this.searchParams.lng}&starts=${selectStartsMonthYear.year}-${selectStartsMonthYear.month}-${this.searchParams.starts.date} ${this._get24HrTime(this.searchParams.starts.time)}&ends=${selectEndsMonthYear.year}-${selectEndsMonthYear.month}-${this.searchParams.ends.date} ${window.encodeURIComponent(this._get24HrTime(this.searchParams.ends.time))}&type=zoom_later&bracket=with_fuel`;
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
}

  window.customElements.define('zcui-wc-search-widget', ZcuiWcSearchWidget);