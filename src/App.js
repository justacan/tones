import React from "react";

const defaultPattern = [
  {length: .1, gain: .3, rampTime: .1},
  {length: .1, gain: 1, rampTime: .1},
];

class Pattern {
  constructor(values) {
      this.values = values || [...defaultPattern];
      this.changeHandler = null;
      this.index = 0;
      this.length = 0;
  }

  registerChangeHandler(changeHandler) {
    this.changeHandler = changeHandler;
  }

  changeEvent() {
    if (!this.changeHandler) return false;
    this.changeHandler(this.values);
  }

  get() {
    return this.values
  }

  getNext() {
    if (this.index === 0) this.length = this.values.length;
    const next = this.values[this.index];
    console.log(this.index, JSON.stringify(this.values));
    this.index++;
    if (this.index >= this.length) this.index = 0;
    return next;
  }

  edit(index, changes) {
    this.values[index] = changes;
    this.changeEvent();
  }

  add(changes) {
    this.values.push(changes || {length: 1, gain: .5, rampTime: .2});
    this.changeEvent();
  }

  remove(index) {
    this.values.splice(index, 1);
    this.changeEvent();
  }

}

class Osc {
  context = null;

  frame = 0;

  o = null;
  g = null;

  pause = false;
  nextEffectTime = 0;
  pattern = new Pattern();
  isPlaying = false;

  registerHandler = (handler) => {
    this.handler = handler;
  };

  changeGain(value, rampTime) {

    const t = rampTime
    ? this.context.currentTime + rampTime
    : this.context.currentTime + .03;

    const v = parseFloat(value) || 0.01;

    // this.g.gain.value = v;
    // this.g.gain.linearRampToValueAtTime(v, t)
    this.g.gain.exponentialRampToValueAtTime(v, t);

  }

  start() {
    if (!this.pattern.values.length || this.isPlaying) return false;
    if (!this.context) this.context = new AudioContext();
    this.isPlaying = true;
    this.pause = false;
    this.play();
    this.scheduler();
  };

  pauseSequence() {
    this.pause = true;
    this.isPlaying = false;
  }

  scheduler = () => {
    const time = this.frame / 60;

    if (this.nextEffectTime < time) {
      const nextEffect = this.pattern.getNext();

      let gain = parseFloat(nextEffect.gain);
      let rampTime = parseFloat(nextEffect.rampTime);
      let length = parseFloat(nextEffect.length);

      gain = (!isNaN(gain) || gain !== 0 ) ? gain : .01;
      rampTime = (!isNaN(rampTime)) ? rampTime : 0;
      length = (!isNaN(length)) ? length : 0;


      this.changeGain(gain, rampTime);
      this.nextEffectTime = time + parseFloat(length);

    }

    if (!this.pause) {
      this.frame = requestAnimationFrame(() => this.scheduler())
    }

  };

  play() {
    const o = this.context.createOscillator();
    const g = this.context.createGain();
    o.frequency.value = 440;
    o.connect(g);
    g.connect(this.context.destination);
    o.start(this.context.currentTime);
    this.o = o;
    this.g = g;
  }

}

class Sequence extends React.Component {

  state = {
    length: this.props.length,
    gain: this.props.gain,
    rampTime: this.props.rampTime
  };

  changeHandler = (id, value) => {
    const newValue = value.replace(/[^.0-9]/, '');
    this.setState(state => {
      state[id] = newValue;
      this.props.changeHandler(state);
      return state;
    });
  };

  render() {
    return (
      <div className="row mb-2 p-2 bg-info">

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="frequency">Frequency</span>
            </div>
            <input type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
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
             type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm"/>
          </div>
        </div>

        <div className="col-3">
          <div className="input-group input-group-sm">
            <div className="input-group-prepend">
              <span className="input-group-text" id="rampTime">RampTime</span>
            </div>
            <input onChange={(e) => this.changeHandler('rampTime', e.target.value)} value={this.state.rampTime}
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
    sequences: []
  };

  Osc = new Osc();

  async componentDidMount() {

    this.Osc.registerHandler((value) => this.setState({value}));

    this.Osc.pattern.registerChangeHandler((sequences) => {
      this.setState({sequences});
    });

    const sequences = this.Osc.pattern.get();
    if (sequences.length) this.setState({sequences});
  }

  play = () => {
    this.Osc.start();
  };

  render() {
    const {Osc} = this;
    const {pattern} = Osc;

    return (
      <div className="container pt-1">
        <div className="row p-2 mb-1">
          <div className="col-3">
            <button type="button" className="btn btn-primary" onClick={this.play}>Primary</button>
          </div>
        </div>
        {this.state.sequences.map((e, i) => <Sequence key={i} changeHandler={(changes) => pattern.edit(i, changes)} {...e}/>)}
        <div className="col-3">
            <button type="button" className="btn btn-primary" onClick={() => pattern.add()}>Add</button>
          </div>
      </div>
    );
  }
}