import React from "react";
import Sequencer from './lib/Sequencer';
// import Sequence from './components/Sequence';
import Pattern from './lib/Pattern';

const bpm = 60;
const bps = bpm / 60;
const sampleLength = 16;

console.log('bpm:', bpm);
console.log('bps:', bps);
console.log('sampleLength:', sampleLength);

function dBFSToGain(dbfs) {
  return Math.pow(10, dbfs / 20);
}


class Test {
  ctx = null;
  frame = 0;
  nextBeat = 0;
  indicatorIndex = 0;
  index = 0;
  seq = new Sequencer();

  pattern = [];

  setup() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    // ctx.scale(2,2);
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1;
    this.canvas = canvas;
    this.ctx = ctx;
    this.makePattern();
    canvas.addEventListener('click', (e) => this.onClick(e), false);
    this.seq.startSequence();
  }

  makePattern() {
    for (let i = 0; i < (sampleLength); i++) {
      const x = i * 60 + i;
      const y = 0;
      const w = 60;
      const h = 300;
      const level = -48;
      const levelIndicator = 300;
      const on = (i % 2 === 0);
      this.pattern.push({x, y, w, h, on, level, levelIndicator})
    }
  }

  onClick(e) {
    const rect = this.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const w = 1;
    const h = 1;
    const pos = {x,y};



    for (let p of this.pattern) {
      const rect1 = p;
      const rect2 = {x, y, w, h};
      if (rect1.x < rect2.x + rect2.w &&
        rect1.x + rect1.w > rect2.x &&
        rect1.y < rect2.y + rect2.h &&
        rect1.y + rect1.h > rect2.y) {
          p.on = !p.on;
          // 1 - (X/-48)
          const percent = (1 - (Math.floor(rect2.y) / rect1.h)) * 100;
          const max = 0;
          const min = -48;
          const val = (percent * (max - min) / 100) + min;
          console.log(percent, val)
          p.levelIndicator = rect2.y
          p.level = val;
        }
    }
  }

  sadf(index) {

    for (let i = 0; i < (sampleLength); i++) {
      const {x, y, w, h, on, levelIndicator} = this.pattern[i];

      this.ctx.strokeStyle = (i === index) ? 'red' : 'blue';
      this.ctx.fillStyle = (i === index) ? 'red' : 'blue';

      this.ctx.fillRect(x, levelIndicator, w, h - levelIndicator);
      this.ctx.strokeRect(x, y, w, h)
    }
  }

  getNext() {
    const next = this.pattern[this.index];
    this.index++;
    this.indicatorIndex = this.index - 1;
    if (this.index >= sampleLength) this.index = 0;
    return next;
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const time = this.frame / 60;


    if (this.nextBeat <= time) {
      this.nextBeat = time + (1 / bps);

      const p = this.getNext();
      // if (p.on) {
        this.seq.changeGain(dBFSToGain(p.level), .1)
      // }
    }

    this.sadf(this.indicatorIndex);
    this.frame = requestAnimationFrame(() => this.loop())
  }
}


export default class App extends React.Component {

  test = new Test();

  componentDidMount() {
    this.test.setup();
    this.test.loop();
  }

  render() {
    return (
      <div className="container pt-5">
        <div className="row" style={{height: "300px"}}>
          <div className="col-12 h-100">
            <canvas id="canvas" className="w-100 h-100" style={{background: 'black'}}/>
          </div>
        </div>
      </div>
    );
  }
}


// export default class App extends React.Component {
//   state = {
//     time: 0,
//     sequences: [],
//     isPlaying: false,
//     index: -1
//   };
//
//   sequencer = new Sequencer();
//
//   async componentDidMount() {
//
//     const timeHandler = (time) => this.setState({time: time.toFixed(2)});
//     const indexHandler = (index) => this.setState({index});
//
//     this.sequencer.registerHandler(timeHandler, indexHandler);
//
//     this.sequencer.pattern.registerChangeHandler((sequences) => {
//       this.setState({ sequences });
//     });
//
//     const sequences = this.sequencer.pattern.get();
//     if (sequences.length) this.setState({ sequences });
//
//     document.addEventListener('keydown', (e) => {
//       if (e.keyCode === 32) {
//         e.preventDefault();
//         (this.state.isPlaying) ? this.pause() : this.start()
//       }
//
//     })
//
//
//
//   }
//
//   start = () => {
//     this.sequencer.startSequence();
//     this.setState({isPlaying: this.sequencer.isPlaying})
//   };
//
//   pause = () => {
//     this.sequencer.pauseSequence();
//     this.setState({isPlaying: this.sequencer.isPlaying})
//   };
//
//   render() {
//     const { sequencer } = this;
//     const { pattern } = sequencer;
//
//
//     const btnText = (this.state.isPlaying) ? 'Pause' : 'Start';
//     const btnAction = (this.state.isPlaying) ? this.pause : this.start;
//
//     return (
//       <div className="container pt-1">
//         <div className="row p-2 mb-1">
//           <div className="col-3">
//             <button type="button" className="btn btn-primary" onClick={btnAction}>{btnText}</button>
//           </div>
//           <div className="col-3 text-light" id="time">{this.state.time}</div>
//         </div>
//         {this.state.sequences.map((e, i) => {
//           const light = (i === this.state.index);
//           return <Sequence
//             key={i} light={light}
//             changeHandler={(changes) => pattern.edit(i, changes)} {...e}
//             removeHandler={() => pattern.remove(i)}
//             />
//         })}
//         <div className="col-3">
//           <button type="button" className="btn btn-primary" onClick={() => pattern.add()}>Add</button>
//         </div>
//       </div>
//     );
//   }
// }