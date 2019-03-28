function dBFSToGain(dbfs) {
  return Math.pow(10, dbfs / 20);
}

const defaultPattern = [
    {length: .1, gain: -12, rampTime: .1},
    {length: .1, gain: -48, rampTime: .1},
  ];
  
  export default class Pattern {
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