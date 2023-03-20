import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
const scaleNames = {
    c: 'Celsius',
    f: 'Fahrenheit'
  };
  
  function toCelsius(fahrenheit) {
    return (fahrenheit - 32) * 5 / 9;
  }
  
  function toFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
  }
  
  function tryConvert(temperature, convert) {
    const input = parseFloat(temperature);
    if (Number.isNaN(input)) {
      return '';
    }
    const output = convert(input);
    const rounded = Math.round(output * 1000) / 1000;
    return rounded.toString();
  }
  
  function BoilingVerdict(props) {
    if (props.celsius >= 100) {
      return <p>The water would boil.</p>;
    }
    return <p>The water would not boil.</p>;
  }
  
  class TemperatureInput extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
    }
  
    handleChange(e) {
      this.props.onTemperatureChange(e.target.value);
    }
  
    render() {
      const temperature = this.props.temperature;
      const scale = this.props.scale;
      return (
        <fieldset>
          <legend>Enter temperature in {scaleNames[scale]}:</legend>
          <input value={temperature}
                 onChange={this.handleChange} />
        </fieldset>
      );
    }
  }
  
  class Calculator extends React.Component {
    constructor(props) {
      super(props);
      this.handleCelsiusChange = this.handleCelsiusChange.bind(this);
      this.handleFahrenheitChange = this.handleFahrenheitChange.bind(this);
      this.state = {temperature: '', scale: 'c'};
    }
  
    handleCelsiusChange(temperature) {
      console.log(`handleCelsiusChange temperature: ${JSON.stringify({scale: 'c', temperature})}`);
      this.setState({scale: 'c', temperature});
    }
  
    handleFahrenheitChange(temperature) {
      this.setState({scale: 'f', temperature});
    }
  
    render() {
      const scale = this.state.scale;
      const temperature = this.state.temperature;
      const celsius = scale === 'f' ? tryConvert(temperature, m => (m - 32) * 5 / 9) : temperature;
      const fahrenheit = scale === 'c' ? tryConvert(temperature, m => (m * 9 / 5) + 32) : temperature;
  
      return (
        <div>
          <TemperatureInput
            scale="c"
            temperature={celsius}
            onTemperatureChange={this.handleCelsiusChange} />
          <TemperatureInput
            scale="f"
            temperature={fahrenheit}
            onTemperatureChange={this.handleFahrenheitChange} />
          <BoilingVerdict
            celsius={parseFloat(celsius)} />
        </div>
      );
    }
  }
  const Button = props => {
    const { kind, c, ...other } = props;
    const className = kind === "primary" ? "PrimaryButton" : "SecondaryButton";
    console.log(c);
    return <button className={className} {...other} />;
  };
  
  const App = () => {

    let tmp ;
    const count = [1,2,3];
    tmp = <div>
    {
      count.map((_, idx) => count.map((_, idx2) => <div>{idx * 3 + idx2}</div>))
    }
  </div>
  ;
    return (
      <div>
        <Button kind="primary" a="a" b="b" onClick={() => console.log("clicked!")}>
          Hello World!
        </Button>
        {tmp}
      </div>
    );
  };
  
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(<App />);
  