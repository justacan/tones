import React from "react";
import Sequencer from './lib/Sequencer';
import Sequence from './components/Sequence';

export default class App extends React.Component {
  state = {
    time: 0,
    sequences: [],
    isPlaying: false,
    index: -1
  };

  sequencer = new Sequencer();

  async componentDidMount() {

    const timeHandler = (time) => this.setState({time: time.toFixed(2)});
    const indexHandler = (index) => this.setState({index});

    this.sequencer.registerHandler(timeHandler, indexHandler);

    this.sequencer.pattern.registerChangeHandler((sequences) => {
      this.setState({ sequences });
    });

    const sequences = this.sequencer.pattern.get();
    if (sequences.length) this.setState({ sequences });

    document.addEventListener('keydown', (e) => {
      if (e.keyCode === 32) {
        e.preventDefault();
        (this.state.isPlaying) ? this.pause() : this.start()
      }

    })



  }

  start = () => {
    this.sequencer.startSequence();
    this.setState({isPlaying: this.sequencer.isPlaying})
  };

  pause = () => {
    this.sequencer.pauseSequence();
    this.setState({isPlaying: this.sequencer.isPlaying})
  };

  render() {
    const { sequencer } = this;
    const { pattern } = sequencer;

    
    const btnText = (this.state.isPlaying) ? 'Pause' : 'Start';
    const btnAction = (this.state.isPlaying) ? this.pause : this.start;

    return (
      <div className="container pt-1">
        <div className="row p-2 mb-1">
          <div className="col-3">
            <button type="button" className="btn btn-primary" onClick={btnAction}>{btnText}</button>
          </div>
          <div className="col-3 text-light" id="time">{this.state.time}</div>
        </div>
        {this.state.sequences.map((e, i) => {
          const light = (i === this.state.index);
          return <Sequence
            key={i} light={light}
            changeHandler={(changes) => pattern.edit(i, changes)} {...e}
            removeHandler={() => pattern.remove(i)}
            />
        })}
        <div className="col-3">
          <button type="button" className="btn btn-primary" onClick={() => pattern.add()}>Add</button>
        </div>
      </div>
    );
  }
}