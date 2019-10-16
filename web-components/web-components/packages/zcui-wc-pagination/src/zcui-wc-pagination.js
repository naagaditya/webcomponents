import { html, render } from '../../../../lib/lit-extended.js';
import { repeat } from '../../../../lib/repeat.js';

class ZcuiWcPagination extends HTMLElement {
  static get observedAttributes() {
    return [
      'total-pages',
      'inital-selected-page',
      'goto-input',
      'theme-color'
    ];
  }

  constructor() {
    super(); 
    this.goBackPage = this.goBackPage.bind(this);
    this.goForwardPage = this.goForwardPage.bind(this);
    this.gotoPage = this.gotoPage.bind(this);
    this.setPageNumberToGo = this.setPageNumberToGo.bind(this);
    this.keyPressGoTo = this.keyPressGoTo.bind(this);
  }

  get htmlTemplate() {
    return html`
      <style>
        .zcui-wc-pagination {
          --theme-color: ${this.themeColor};
        }
      </style>
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
    if (oldVal !== newVal) {
      this.setProps();
      this.updateShadowDom();
    }
  }

  setProps() {
    const selectedPageAttributeVal = this.getAttribute('inital-selected-page');
    const newSelectedPage = selectedPageAttributeVal && parseInt(selectedPageAttributeVal) || 1;
    const totalPagesNewVal = parseInt(this.getAttribute('total-pages') || 0);
    this.gotoInput = this.getAttribute('goto-input') === 'true';
    this.themeColor = this.getAttribute('theme-color') || '#000';
    if (totalPagesNewVal !== this.totalPages) {
      this.totalPages = totalPagesNewVal;
      this.setPagesBlock();
    }
    if (this.selectedPage !== newSelectedPage) {
      this.selectedPage = newSelectedPage;
      this.pageFlip(this.selectedPage);
    }
  }

  connectedCallback() {
    this.createShadowDom();
  }

  selectPage(pageNumber) {
    return () => {
      this.pageFlip(pageNumber);
    }
  }
  setPagesBlock () {  
    if (this.totalPages <= 10) {
      this.firstBlockPages = Array.apply(null, { length: this.totalPages }).map((x, i) => i + 1);
      this.middleBlockPages = [];
      this.lastBlockPages = [];
      return;
    }

    const halfOfTotalPage = Math.ceil(this.totalPages / 2);
    this.firstBlockPages = [1, 2, 3];
    this.middleBlockPages = [halfOfTotalPage - 1, halfOfTotalPage, halfOfTotalPage + 1];
    this.lastBlockPages = [this.totalPages - 2, this.totalPages - 1, this.totalPages]; 

    if (this.currentPageLiesIn() === 'firstBlock') {
      if (this.selectedPage === 1) return;
      this.firstBlockPages = [this.selectedPage - 1, this.selectedPage, this.selectedPage + 1];
      // if differnce b/w last page of first block and first page of middle block is less than 4 merge both block
      if (this.middleBlockPages[0] - this.firstBlockPages[this.firstBlockPages.length - 1] < 4) {
        this.firstBlockPages.push(this.selectedPage + 2, this.selectedPage + 3, this.selectedPage + 4);
        this.middleBlockPages = [];
      }
      return;
    }

    if (this.currentPageLiesIn() === 'middleBlock') {
      this.middleBlockPages = [this.selectedPage - 1, this.selectedPage, this.selectedPage + 1];
      // if differnce b/w last page of middle block and first page of last block is less than 4 merge both block
      if (this.lastBlockPages[0] - this.middleBlockPages[this.middleBlockPages.length - 1] < 4) {
        this.middleBlockPages.push(this.selectedPage + 2, this.selectedPage + 3, this.selectedPage + 4);
        this.lastBlockPages = [];
      }
      return;
    }

    if (this.currentPageLiesIn() === 'lastBlock') {
      if (this.selectedPage === this.totalPages) return;
      this.lastBlockPages = [this.selectedPage - 1, this.selectedPage, this.selectedPage + 1];
      // if differnce b/w last page of middle block and first page of last block is less than 4 merge both block
      if (this.lastBlockPages[0] - this.middleBlockPages[this.middleBlockPages.length - 1] < 4) {
        this.lastBlockPages.push(this.selectedPage + 2, this.selectedPage + 3, this.selectedPage + 4);
        this.middleBlockPages = [];
      }
      return;
    }
    
  }

  goBackPage() {
    this.pageFlip(this.selectedPage - 1);
  }

  goForwardPage() {
    this.pageFlip(this.selectedPage + 1);
  }

  currentPageLiesIn() {
    if (this.selectedPage <= this.totalPages / 3) {
      return 'firstBlock';
    }
    if (this.selectedPage <= this.totalPages / 3 * 2) {
      return 'middleBlock';
    }
    return 'lastBlock'
  }

  setPageNumberToGo(e) {
    this.pageNumberToGo = parseInt(e.target.value);
  }

  gotoPage() {
    if (this.pageNumberToGo > this.totalPages || this.pageNumberToGo <= 0) {
      this.dispatchEvent(new CustomEvent('page-out-of-range', {
        bubbles: true,
        detail: {
          currentPage: this.pageNumberToGo
        }
      }));
      return;
    }
    if (!this.pageNumberToGo) return;
    this.pageFlip(this.pageNumberToGo);
  }
  keyPressGoTo(e) {
    if (e.keyCode === 13) {
      this.gotoPage();
    }
  }

  pageFlip(pageNumber) {
    this.selectedPage = pageNumber;
    this.setPagesBlock();
    this.updateShadowDom();
    this.dispatchEvent(new CustomEvent('page-flip', {
      detail: {
        currentPage: pageNumber
      },
      bubbles: true
    }));
  }
}

window.customElements.define('zcui-wc-pagination', ZcuiWcPagination);
