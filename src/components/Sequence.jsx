import React from "react";

export default class Sequence extends React.Component {

  state = {
    length: this.props.length,
    gain: this.props.gain,
    rampTime: this.props.rampTime
  };

  changeHandler = (id, value) => {
    const newValue = value.replace(/[^-.0-9]/, '');
    this.setState(state => {
      state[id] = newValue;
      this.props.changeHandler(state);
      return state;
    });
  };

  render() {
    const color = (this.props.light) ? 'bg-primary' : 'bg-info'
    console.log(color)
    return (
      <div className={`row mb-2 p-2 ${color}`}>

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="frequency">Frequency</span>
            </div>
            <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
          </div>
        </div>

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="gain">Gain</span>
            </div>
            <input type="text" className="form-control"
              aria-label="Small" aria-describedby="inputGroup-sizing-sm"
              onChange={(e) => this.changeHandler('gain', e.target.value)} value={this.state.gain}
            />
          </div>
        </div>

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="length">Length</span>
            </div>
            <input onChange={(e) => this.changeHandler('length', e.target.value)} value={this.state.length}
              type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
          </div>
        </div>

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="rampTime">RampTime</span>
            </div>
            <input onChange={(e) => this.changeHandler('rampTime', e.target.value)} value={this.state.rampTime}
              type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
          </div>
        </div>

      </div>
    );
  }
}