import Pattern from './Pattern';

function dBFSToGain(dbfs) {
  return Math.pow(10, dbfs / 20);
}

export default class Sequencer {
  context = null;

  frame = 0;

  o = null;
  g = null;

  pause = false;
  nextEffectTime = 0;
  pattern = new Pattern();
  isPlaying = false;

  registerHandler = (timeHandler, indexHandler) => {
    this.timeHandler = timeHandler;
    this.indexHandler = indexHandler;
  };

  changeGain(value, rampTime) {

    const t = rampTime
      ? this.context.currentTime + rampTime
      : this.context.currentTime + .03;

    const v = parseFloat(value) || 0.01;

    // this.g.gain.value = v;
    this.g.gain.linearRampToValueAtTime(v, t);
    // this.g.gain.exponentialRampToValueAtTime(v, t);

  }

  startSequence() {
    if (this.pause) this.pause = false        
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
    this.g.gain.value = 0
    this.o.disconnect()
  }

  scheduler = () => {
    const time = this.frame / 60;
    this.timeHandler(time);
    if (this.nextEffectTime < time) {
      this.indexHandler(this.pattern.index);
      const nextEffect = this.pattern.getNext();      
      let gain = parseFloat(nextEffect.gain);
      let rampTime = parseFloat(nextEffect.rampTime);
      let length = parseFloat(nextEffect.length);

      gain = (!isNaN(gain) || gain !== 0) ? dBFSToGain(gain) : .01;
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