import * as ReactDOM from "react-dom";
import React from "react";

export default class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = { page: props.page || 0, data: props.data || "" };
  }
  
  componentDidMount() {
    window.onpopstate = this.syncStateWithURL;
    // In case the page was loaded with url params
    this.syncStateWithURL();
  }
  
  componentWillUnmount() {
    // I'm  not 100% sure this will work, considering we didn't call addEventListener
    window.removeEventListener('popstate', this.syncStateWithURL);
  }
  
  // If we want to get URL parameters from client instead of server
  getURLPageParam = () => {
    const url = new URL(window.location.href);
    
    // Get page number from URL
    let page = 1;
    if (url.searchParams.get("page")) {
      page = Number(url.searchParams.get("page"));
    }
    return page
  }
  
  syncStateWithURL = async () => {
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
  };
  
  incrementURLParam = async () => {
    let newPage = this.state.page + 1;
    const data = await this.getData(newPage);
    
    this.setState({page:newPage, data}, () =>{
      window.history.pushState({ page: newPage }, "", `?page=${newPage}`);
    })
  };
  
  decrementURLParam = async () => {
    let newPage = Math.max(0, this.state.page - 1);
    const data = await this.getData(newPage);
    this.setState({page:newPage, data}, () =>{
      window.history.pushState({ page: newPage }, "", `?page=${newPage}`);
    })
  };
  
  goBack() {
    window.history.back();
  }
  
  getData = async (page) => {
    //Call an api on the server to get data
    let query = `/api/data?page=${page}`;
    
    const response = await fetch(query, {
      method: "GET",
    });
    if(!response.ok) {
      console.error("Failed API call");
      return;
    }
    const result = await response.json();
    
    return result;
  }
  
  render() {
    const dataToDisplay = this.state.data && this.state.data.length
      && this.state.data.map(datum => (<div key={datum.id}>{datum.name}</div>));
    return (
      <div>
        <h1>Testing integration between Flask and React</h1>
        <div>
          Load prev/next page data (API call)
          <button onClick={this.decrementURLParam}>Prev</button>
          <button onClick={this.incrementURLParam}>Next</button>
        </div>
        <div>
          Navigate to prev/next page (reloads the page)
          <a href={`?page=${Math.max(0, this.state.page - 1)}`}>Prev page (link)</a>
          <a href={`?page=${this.state.page+1}`}>Next page (link)</a>
        </div>
        <button onClick={this.goBack}>= browser back button)</button>
        <p>Current page: {this.state.page}</p>
        <p>Data: {dataToDisplay}</p>
      </div>
    );
  }
}
  
  
  document.addEventListener("DOMContentLoaded", () => {
    const domContainer = document.querySelector("#react-container");
    const propsElement = document.getElementById("react-props");
    let reactProps;
    try {
      reactProps = JSON.parse(propsElement.innerHTML);
    } catch (err) {
      // Show error to the user and ask to reload page
    }
    ReactDOM.render(
      <App {...reactProps}/>,
      domContainer
      );
    });