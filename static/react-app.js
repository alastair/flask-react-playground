"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var ReactDOM = _interopRequireWildcard(require("react-dom"));

var _react = _interopRequireDefault(require("react"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class App extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "getURLPageParam", () => {
      const url = new URL(window.location.href); // Get page number from URL

      let page = 1;

      if (url.searchParams.get("page")) {
        page = Number(url.searchParams.get("page"));
      }

      return page;
    });

    _defineProperty(this, "syncStateWithURL", async () => {
      try {
        const page = this.getURLPageParam();
        const data = await this.getData(page);
        this.setState({
          data,
          page
        });
      } catch (error) {
        console.error(error);
      }
    });

    _defineProperty(this, "incrementURLParam", async () => {
      let newPage = this.state.page + 1;
      const data = await this.getData(newPage);
      this.setState({
        page: newPage,
        data
      }, () => {
        window.history.pushState({
          page: newPage
        }, "", `?page=${newPage}`);
      });
    });

    _defineProperty(this, "decrementURLParam", async () => {
      let newPage = Math.max(0, this.state.page - 1);
      const data = await this.getData(newPage);
      this.setState({
        page: newPage,
        data
      }, () => {
        window.history.pushState({
          page: newPage
        }, "", `?page=${newPage}`);
      });
    });

    _defineProperty(this, "getData", async page => {
      //Call an api on the server to get data
      let query = `/api/data/${page}`;
      const response = await fetch(query, {
        method: "GET"
      });
      const result = await response.json();
      return result;
    });

    this.state = {
      page: props.page || 0,
      data: props.data || ""
    };
  }

  componentDidMount() {
    window.onpopstate = this.syncStateWithURL; // In case the page was loaded with url params

    this.syncStateWithURL();
  }

  componentWillUnmount() {
    // I'm  not 100% sure this will work, considering we didn't call addEventListener
    window.removeEventListener('popstate', this.syncStateWithURL);
  } // If we want to get URL parameters from client instead of server


  goBack() {
    window.history.back();
  }

  render() {
    return /*#__PURE__*/_react.default.createElement("div", null, /*#__PURE__*/_react.default.createElement("h1", null, "Testing integration between Flask and React"), /*#__PURE__*/_react.default.createElement("div", null, "Load prev/next page data (API call)", /*#__PURE__*/_react.default.createElement("button", {
      onClick: this.decrementURLParam
    }, "Prev"), /*#__PURE__*/_react.default.createElement("button", {
      onClick: this.incrementURLParam
    }, "Next")), /*#__PURE__*/_react.default.createElement("div", null, "Navigate to prev/next page (reloads the page)", /*#__PURE__*/_react.default.createElement("a", {
      href: `/?page=${Math.max(0, this.state.page - 1)}`
    }, "Prev page (link)"), /*#__PURE__*/_react.default.createElement("a", {
      href: `/?page=${this.state.page + 1}`
    }, "Next page (link)")), /*#__PURE__*/_react.default.createElement("button", {
      onClick: this.goBack
    }, "= browser back button)"), /*#__PURE__*/_react.default.createElement("p", null, "Current page: ", this.state.page), /*#__PURE__*/_react.default.createElement("p", null, "Data: ", this.state.data));
  }

}

exports.default = App;
document.addEventListener("DOMContentLoaded", () => {
  const domContainer = document.querySelector("#react-container");
  const propsElement = document.getElementById("react-props");
  let reactProps;

  try {
    reactProps = JSON.parse(propsElement.innerHTML);
  } catch (err) {// Show error to the user and ask to reload page
  }

  ReactDOM.render( /*#__PURE__*/_react.default.createElement(App, reactProps), domContainer);
});