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
    const url = `https://www.zoomcar.com/${this.searchParams.city.toLowerCase()}/search/query?lat=12.9718915&lng=77.6411545&starts=${selectStartsMonthYear.year}-${selectStartsMonthYear.month}-${this.searchParams.starts.date} ${this._get24HrTime(this.searchParams.starts.time)}&ends=${selectEndsMonthYear.year}-${selectEndsMonthYear.month}-${this.searchParams.ends.date} ${window.encodeURIComponent(this._get24HrTime(this.searchParams.ends.time))}&type=zoom_later&bracket=with_fuel`;
    window.open(url, '_blank');
  }
}

  window.customElements.define('zcui-wc-search-widget', ZcuiWcSearchWidget);
