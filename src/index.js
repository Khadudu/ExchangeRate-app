import React, { Component } from "react";
import ReactDOM from "react-dom";
import { Button } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.currencies = [
      "AUD",
      "CAD",
      "CHF",
      "CNY",
      "INR",
      "USD",
      "EUR",
      "GBP",
      "JPY",
      "NZD"
    ];
    this.state = {
      base: "USD",
      other: "EUR",
      value: 0,
      converted: 0
    };

    this.cached = {};
  }
  render() {
    return (
      <div>
        <div className>
          <select
            onChange={this.makeSelection}
            name="base"
            value={this.state.base}
          >
            {this.currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input value={this.state.value} onChange={this.changevalue} />
        </div>
        <div>
          <select
            onChange={this.makeSelection}
            name="other"
            value={this.state.other}
          >
            {this.currencies.map(currency => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
          <input
            disabled={true}
            value={
              this.state.converted === null
                ? "calculating..."
                : this.state.converted
            }
          />
        </div>
      </div>
    );
  }

  makeSelection = event => {
    this.setState(
      {
        [event.target.name]: event.target.value
      },
      this.recalculate
    );
  };

  changevalue = event => {
    this.setState(
      {
        value: event.target.value,
        converted: null
      },
      this.recalculate
    );
  };

  recalculate = () => {
    const value = parseFloat(this.state.value);
    if (isNaN(value)) {
      return;
    }
    if (
      this.cached[this.state.base] !== undefined &&
      Date.now() - this.cached[this.state.base].timestamp < 1000 * 60
    ) {
      this.setState({
        converted: this.cached[this.state.base].rates[this.state.other] * value
      });
    }
    fetch(`https://api.exchangeratesapi.io/latest?base=${this.state.base}`)
      .then(responce => responce.json())
      .then(data => {
        this.cached[this.state.base] = {
          rates: data.rates,
          timestamp: Date.now()
        };
        this.setState({
          converted: data.rates[this.state.other] * value
        });
      });
  };
}

export default App;

ReactDOM.render(<App />, document.getElementById("root"));
