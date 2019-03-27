import React from "react";

function dBFSToGain(dbfs) {
  return Math.pow(10, dbfs / 20);
}

class Osc {
  context = null;
  index = 0;
  frame = 0;
  delta = 0;
  pause = false;
  g = null;
  nextEffectTime = 0;
  pattern = [];

  registerHandler = (handler) => {
    this.handler = handler;
  };

  changePattern(pattern) {
    this.pattern = pattern;
  }

  changeGain(value, rampTime) {
    const t = this.context.currentTime + rampTime;
    this.g.gain.value = value;
    // this.g.gain.linearRampToValueAtTime(value, t)
    // this.g.gain.exponentialRampToValueAtTime(value || 0, t || .03)

  }

  start() {

    const time = this.frame / 60;

    if (this.nextEffectTime < time) {
      const nextEffect = this.pattern[this.index];
      // console.log("change:", time - this.nextEffectTime)
      this.changeGain(nextEffect.gain, nextEffect.rampTime);
      this.nextEffectTime = time + nextEffect.length;
      this.index++;
      if (this.index >= this.pattern.length) this.index = 0;
    }

    this.handler(this.frame);
    if (!this.pause) {
      this.frame = requestAnimationFrame(() => this.start())
    }
  };

  toggleStart() {
    this.play();
    // this.pause = !this.pause;
    // if (!this.pause) {
    this.start();
    // }
  };

  scheduler = () => {


  };

  play() {
    if (!this.context) this.context = new AudioContext();
    const o = this.context.createOscillator();
    const g = this.context.createGain();
    console.log(">>", g.gain.maxValue, g.gain.minValue, g.gain.defaultValue);
    o.frequency.value = 440;
    o.connect(g);
    g.connect(this.context.destination);
    o.start(this.context.currentTime);
    this.o = o;
    this.g = g;
  }

}

class Sequence extends React.Component {
  changeHandler = (id, value) => {
    const newValues = {
      gain: this.props.gain,
      length: this.props.length
    };
    newValues[id] = parseFloat(value) || 0.0;
    this.props.changeHandler(newValues);
  };
  render() {
    console.log(this.props)
    return (
      <div className="row mb-2 p-2 bg-info">

        <div className="col-4">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="frequency">Frequency</span>
            </div>
            <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
          </div>
        </div>

        <div className="col-4">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="gain">Gain</span>
            </div>
            <input type="text" className="form-control"
              aria-label="Small" aria-describedby="inputGroup-sizing-sm"
              onChange={(e) => this.changeHandler('gain', e.target.value)} value={this.props.gain}
              />
          </div>
        </div>

        <div className="col-4">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="length">Length</span>
            </div>
            <input onChange={(e) => this.changeHandler('length', e.target.value)} value={this.props.length}
             type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
          </div>
        </div>
      </div>
    );
  }
}

export default class App extends React.Component {

  state = {
    value: 0,
    sequences: [
      {gain: dBFSToGain(-12), length: .2, rampTime: 0},
      {gain: dBFSToGain(-16), length: .2, rampTime: 0},
      {gain: dBFSToGain(-18), length: .2, rampTime: 0},
      // {frequency: 440, length: 10},
      // {frequency: 440, length: 5},
      // {frequency: 440, length: 1}
    ]
  };
  Osc = new Osc();

  async componentDidMount() {
    this.Osc.registerHandler((value) => this.setState({value}))
  }

  play = () => {
    this.Osc.changePattern(this.state.sequences);
    this.Osc.toggleStart();
  };

  modSequence = (index, changes) => {
    this.setState(state => {
      state.sequences[index] = changes;
      this.Osc.changePattern(state.sequences);
      return state;
    });
  };

  render() {
    return (
      <div className="container pt-1">
        <div className="row p-2 mb-1">
          <div className="col-3">
            <button type="button" className="btn btn-primary" onClick={this.play}>Primary</button>
          </div>
        </div>
        {this.state.sequences.map((e, i) => <Sequence key={i} changeHandler={(changes) => this.modSequence(i, changes)} {...e}/>)}
      </div>
    );
  }
}