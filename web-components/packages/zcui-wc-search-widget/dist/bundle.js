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
    
    this.cities = ['Bangalore', 'Pune', 'Delhi', 'Lucknow', 'Hydrabad', 'Patna'];

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
      city: 'Bangalore',
      lat: 12.9718915,
      lng: 77.6411545,
      starts: {
        date: today.getDate(),
        monthYearIndex: 0,
        time: '12:30 PM'
      },
      ends: {
        date: today.getDate(),
        monthYearIndex: 0,
        time: '12:30 PM'
      }

    };
  }

  get htmlTemplate() {
    return html`
      <style>
        .zcui-wc-search-widget{display:flex;padding:20px;font-size:12px;flex-direction:column;font-family:Arial, Helvetica, sans-serif;background-image:url("../img/bg.svg");background-size:contain;max-width:1000px}.zcui-wc-search-widget header{display:flex;margin:auto}.zcui-wc-search-widget header .logo-container{padding:0 20px;margin:10px 0;border-right:solid 1px #cecece}.zcui-wc-search-widget header .logo{width:127px}.zcui-wc-search-widget header .title{padding:10px 20px;font-size:13px;width:125px}.zcui-wc-search-widget label{letter-spacing:.5px;font-size:13px;margin:0 10px}.zcui-wc-search-widget .search-input{display:flex;margin-top:10px;flex-direction:column;padding:10px 0}.zcui-wc-search-widget .search-input .input-box{border:solid 1px #8ABD50;margin:7px 10px 20px;display:flex;color:#595656;background:#fff;letter-spacing:.5px}.zcui-wc-search-widget .search-input .input-box .city{flex:1;border-right:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .city span{flex:1;padding:0 10px}.zcui-wc-search-widget .search-input .input-box .area{flex:1}.zcui-wc-search-widget .search-input .input-box .date{width:21%}.zcui-wc-search-widget .search-input .input-box .month{width:45%;border-right:solid 1px #8ABD50;border-left:solid 1px #8ABD50}.zcui-wc-search-widget .search-input .input-box .time{width:34%}.zcui-wc-search-widget .search-input .input-box select{opacity:0;position:absolute;top:0;left:0;bottom:0;right:0;width:100%;height:100%}.zcui-wc-search-widget .search-input .input-box .input{position:relative;padding:12px 9px;display:flex;align-items:center;justify-content:space-between}.zcui-wc-search-widget .search-input .input-wrapper{display:flex;flex-direction:column}.zcui-wc-search-widget .date-time{display:flex;flex-wrap:wrap;justify-content:space-between}.zcui-wc-search-widget .date-time .input-wrapper{min-width:256px;flex:1}.zcui-wc-search-widget button{font-size:12px;font-weight:bold;padding:14px;width:100%;max-width:420px;border-radius:2.2px;background-color:#6fbe45;box-shadow:1px 1px 7px 0 rgba(186,185,185,0.5);color:#fff;text-transform:uppercase;margin:auto}

      </style>
      <div class="zcui-wc-search-widget">
  <header>
    <div class="logo-container">
      <img alt="logo" src="../img/logo.svg" class="logo"/>
    </div>
    <i class="title">
       Enjoy Self Drive Cars Starting <b>Rs 60/Hr*</b>
    </i>
    
  </header>
  <div class="search-input">
    <div class="input-wrapper">
      <label>Pick-up Location</label>
      <div class="input-box">
        <div class="input city">
          <img src="../img/location.svg" alt="">
          <span>${this.searchParams.city}</span>
          <img src="../img/arrow.svg" alt="">
          <select on-change=${this.changeCity}>
             ${repeat( this.cities,
              city => html`
              <option value="${city}">${city}</option>
            ` )}
          </select>
        </div>
        <div class="input area">
          <input type="text" placeholder="Starting Point">
        </div>
      </div>
    </div>
    <div class="date-time">

      <div class="input-wrapper">
        <label>Start Date & Time</label>
        <div class="input-box">
          <div class="input date">
            <span>${this.searchParams.starts.date}</span>
            <img src="../img/arrow.svg" alt="">
            <select on-change=${e => { this.changeDate(e.currentTarget.value, 'starts')}}>
              ${repeat( Array.apply(null, {length: 31}).map((x,i)=> i+1), day => html`
              <option value="${day}">${day}</option>
              ` )}
            </select>
          </div>
          <div class="input month">
            <span>${this.monthsYears[this.searchParams.starts.monthYearIndex].displayName}</span>
            <img src="../img/arrow.svg" alt="">
            <select on-change=${e => { this.changeMonth(e.currentTarget.value, 'starts')}}>
              ${repeat(this.monthsYears, (month, i) => html`
              <option value=${i}>${month.displayName}</option>
              `)}
            </select>
          </div>
          <div class="input time">
            <span>${this.searchParams.starts.time}</span>
            <img src="../img/arrow.svg" alt="">
            <select on-change=${e => { this.changeTime(e.currentTarget.value, 'starts')}}>
              ${repeat(this.timeList, time => html `
              <option value=${time}>${time}</option>
              `)}
            </select>
          </div>
        </div>
      </div>

      <div class="input-wrapper">
        <label>End Date & Time</label>
        <div class="input-box">
          <div class="input date">
            <span>${this.searchParams.ends.date}</span>
            <img src="../img/arrow.svg" alt="">
            <select on-change=${e => { this.changeDate(e.currentTarget.value, 'ends')}}>
              ${repeat( Array.apply(null, {length: 31}).map((x,i)=> i+1), day => html`
              <option value="${day}">${day}</option>
              ` )}
            </select>
          </div>
          <div class="input month">
            <span>${this.monthsYears[this.searchParams.ends.monthYearIndex].displayName}</span>
            <img src="../img/arrow.svg" alt="">
            <select on-change=${e => { this.changeMonth(e.currentTarget.value, 'ends')}}>
              ${repeat(this.monthsYears, (month, i) => html`
              <option value=${i}>${month.displayName}</option>
              `)}
            </select>
          </div>
          <div class="input time">
            <span>${this.searchParams.ends.time}</span>
            <img src="../img/arrow.svg" alt="">
            <select on-change=${e => { this.changeTime(e.currentTarget.value, 'ends')}}>
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
  
  daysInMonth(mon, year) {
    return new Date(year, month, 0).getDate();
  }

  _get24HrTime(time) {
    const timeArr = time.split(' ');
    return timeArr[1] == 'PM' ? `${parseInt(timeArr[0].split(':')[0]) + 12}:${timeArr[0].split(':')[1]}` : timeArr[0];
  }

  searchCar () {
    const startsMonthYearIndex = this.searchParams.starts.monthYearIndex;
    const selectStartsMonthYear = this.monthsYears[startsMonthYearIndex];
    const endsMonthYearIndex = this.searchParams.ends.monthYearIndex;
    const selectEndsMonthYear = this.monthsYears[endsMonthYearIndex];
    const url = `https://www.zoomcar.com/${this.searchParams.city.toLowerCase()}/search/query?
      lat=12.9718915&lng=77.6411545&starts=${selectStartsMonthYear.year}-${selectStartsMonthYear.month}-${this.searchParams.starts.date} ${this._get24HrTime(this.searchParams.starts.time)}&ends=${selectEndsMonthYear.year}-${selectEndsMonthYear.month}-${this.searchParams.ends.date} ${window.encodeURIComponent(this._get24HrTime(this.searchParams.ends.time))}&type=zoom_later&bracket=with_fuel`;
    window.open(url, '_blank');
  }
}

  window.customElements.define('zcui-wc-search-widget', ZcuiWcSearchWidget);