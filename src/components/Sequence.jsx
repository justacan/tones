import React from "react";

export default class Sequence extends React.Component {

  state = {
    frequency: this.props.frequency,
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
    const color = (this.props.light) ? 'bg-primary' : 'bg-info';
    return (
      <div className={`row mb-2 p-2 ${color}`}>

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="frequency">Frequency</span>
            </div>
            <input onChange={(e) => this.changeHandler('frequency', e.target.value)} value={this.state.frequency}
              type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
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

        <div className="col-2">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="rampTime">RampTime</span>
            </div>
            <input onChange={(e) => this.changeHandler('rampTime', e.target.value)} value={this.state.rampTime}
              type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" />
          </div>
        </div>

        <div className="col-1">
          <button type="button" className="btn btn-danger btn-sm" onClick={this.props.removeHandler}>Remove</button>
        </div>

      </div>
    );
  }
}