// import { html, render } from "../../libs/lithtmles5.js";
// var _lithtmles = require("../../libs/lithtmles5.js");

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _templateObject = _taggedTemplateLiteral(['\n      <div>Hello ', '!</div>'], ['\n      <div>Hello ', '!</div>']);

function _taggedTemplateLiteral(strings, raw) { return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var WcMultiselect = function (_HTMLElement) {
  _inherits(WcMultiselect, _HTMLElement);

  function WcMultiselect() {
    _classCallCheck(this, WcMultiselect);

    var _this = _possibleConstructorReturn(this, (WcMultiselect.__proto__ || Object.getPrototypeOf(WcMultiselect)).call(this));

    _this.template = function (name) {
      return html(_templateObject, name);
    };
    return _this;
  }

  _createClass(WcMultiselect, [{
    key: 'connectedCallback',
    value: function connectedCallback() {
      render(helloTemplate('Steve'), document.body);
    }
  }]);
  
  return WcMultiselect;
}(HTMLElement);

window.customElements.define(WcMultiselect, 'wc-multiselect');