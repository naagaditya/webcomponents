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
        .zcui-wc-pagination{display:flex;align-items:center;justify-content:center}.zcui-wc-pagination .arrow{cursor:pointer;height:10px;width:10px;border:solid 2px var(--theme-color);transform:rotate(45deg);display:inline-block}.zcui-wc-pagination .arrow.left{border-top:none;border-right:none}.zcui-wc-pagination .arrow.right{border-left:none;border-bottom:none}.zcui-wc-pagination .arrow.disabled{pointer-events:none}.zcui-wc-pagination .arrow.fade{opacity:.25}.zcui-wc-pagination .page{margin:1px;min-width:25px;display:flex;align-items:center;justify-content:center;font-size:17px;color:var(--theme-color);cursor:pointer;padding:5px}.zcui-wc-pagination .page.selected{color:#fff;border-radius:5px;background:var(--theme-color)}.zcui-wc-pagination .page.disabled{pointer-events:none}.zcui-wc-pagination .page.fade{opacity:.25}.zcui-wc-pagination .goto-page{margin-left:40px;border:solid 1px var(--theme-color);height:30px;width:90px;border-radius:4px;position:relative;display:flex;align-items:center}.zcui-wc-pagination .goto-page .title-text{position:absolute;top:-9px;font-size:13px;background:#fff;margin-left:7px;color:var(--theme-color)}.zcui-wc-pagination .goto-page input[type="number"]{border:none;height:90%;width:70%;outline:none;font-size:15px;padding:0 5px}.zcui-wc-pagination .goto-page input[type=number]::-webkit-inner-spin-button,.zcui-wc-pagination .goto-page input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none;-moz-appearance:none;appearance:none;margin:0}

      </style>
      ${this.totalPages > 1 ? html`
<div class="zcui-wc-pagination">
  <div
    class$="${this.selectedPage===1 ? 'arrow left disabled fade' : 'arrow left'}"
    on-click=${this.goBackPage}>
  </div>
  ${repeat(this.firstBlockPages, page => html`
  <div
    class$="${this.selectedPage===page ? 'page selected' : 'page'}"
    on-click=${this.selectPage(page)}>
    ${page}
  </div>
  `)}
  ${this.middleBlockPages.length ? html`<div class="page disabled">...</div>` : ''}
  ${repeat(this.middleBlockPages, page => html`
  <div
    class$="${this.selectedPage===page ? 'page selected' : 'page'}"
    on-click=${this.selectPage(page)}>
    ${page}
  </div>
  `)}
  ${this.lastBlockPages.length ? html`<div class="page disabled">...</div>` : ''}
  ${repeat(this.lastBlockPages, page => html`
  <div
    class$="${this.selectedPage===page ? 'page selected' : 'page'}"
    on-click=${this.selectPage(page)}>
    ${page}
  </div>
  `)}
  <div
    class$="${this.selectedPage===this.totalPages ? 'arrow right disabled fade' : 'arrow right'}"
    on-click=${this.goForwardPage}>
  </div>
  ${this.gotoInput ? html`
    <div class="goto-page">
      <div class="title-text">Go to page</div>
      <input type="number" on-input=${this.setPageNumberToGo} on-keypress=${this.keyPressGoTo}>
      <div class="arrow right" on-click=${this.gotoPage}>
      </div>
    </div>
  ` : ''}
</div>
`: ''}
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