function handlePlay(event) {
    noteTime = 0.0;
    startTime = context.currentTime + 0.005;
    rhythmIndex = 0;
    schedule();
}

function handleStop(event) {
  clearTimeout(timeoutId);
}


function schedule() {
  var currentTime = context.currentTime;

  // The sequence starts at startTime, so normalize currentTime so that it's 0 at the start of the sequence.
  currentTime -= startTime;

  while (noteTime < currentTime + 0.200) {
    var contextPlayTime = noteTime + startTime;

    //Insert playing notes here

    //Insert draw stuff here

    advanceNote();

  }
  timeoutId = setTimeout("schedule()", 0);
}

function advanceNote() {
    // Setting tempo to 60 BPM just for now
    const tempo = 60.0;
    const secondsPerBeat = 60.0 / tempo;

    rhythmIndex++;
    if (rhythmIndex == LOOP_LENGTH) {
        rhythmIndex = 0;
    }

    //0.25 because each square is a 16th note
    noteTime += 0.25 * secondsPerBeat;
}