

const defaultPattern = [
    {frequency: 440, length: 1, gain: -12, rampTime: .5}
  ];

// const defaultPatter = new Array(90).fill(0).map(e =>
//   [{"frequency":"600","length":".2","gain":"-12","rampTime":"0"},{"frequency":"1200","length":".1","gain":"-48","rampTime":"0"}]
// ).flat();
  
  export default class Pattern {
    constructor(values) {
        const storage = JSON.parse(localStorage.getItem('values'));
        this.values = values || storage || [...defaultPattern];
        // this.values = defaultPattern;
        this.changeHandler = null;
        this.index = 0;
        this.length = 0;
    }

    save() {
      localStorage.setItem('values', JSON.stringify(this.values));
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
      // if (this.index === 0) this.length = this.values.length;
      const next = this.values[this.index];      
      this.index++;
      if (this.index >= this.values.length) this.index = 0;
      return next;
    }
  
    edit(index, changes) {
      this.values[index] = changes;
      this.changeEvent();
      this.save()
    }
  
    add(changes) {
      this.values.push(changes || {frequency: 440, length: 1, gain: -12, rampTime: .5});
      this.changeEvent();
      this.save()
    }
  
    remove(index) {
      this.values.splice(index, 1);
      this.changeEvent();
      this.save()
    }
  
  }