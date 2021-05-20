      // load elements
      const wrapper = document.querySelector(".at-wrap");
      const main = wrapper.querySelector(".at-main");

      // initialize alphatab
      const settings = {
        file: "./gpx/Happy-Birthday-To-You-easy.gpx",
        player: {
          enablePlayer: true,
          soundFont: "https://cdn.jsdelivr.net/npm/@coderline/alphatab@latest/dist/soundfont/sonivox.sf2",
          scrollElement: wrapper.querySelector('.at-viewport')
        },
      };
      const api = new alphaTab.AlphaTabApi(main, settings);

      // overlay logic
      const overlay = wrapper.querySelector(".at-overlay");
      api.renderStarted.on(() => {
        overlay.style.display = "flex";
      });
      api.renderFinished.on(() => {
        overlay.style.display = "none";
      });


      /** Controls **/
      api.scoreLoaded.on((score) => {
        wrapper.querySelector(".at-song-title").innerText = score.title;
      });

      const loop = wrapper.querySelector(".at-controls .at-loop");
      loop.onclick = () => {
        loop.classList.toggle("active");
        api.isLooping = loop.classList.contains("active");
      };

      // main player controls
      const playPause = wrapper.querySelector(
        ".at-controls .at-player-play-pause"
      );
      const stop = wrapper.querySelector(".at-controls .at-player-stop");
      playPause.onclick = (e) => {
        if (e.target.classList.contains("disabled")) {
          return;
        }
        api.playPause();
      };
      stop.onclick = (e) => {
        if (e.target.classList.contains("disabled")) {
          return;
        }
        api.stop();
      };
      api.playerReady.on(() => {
        playPause.classList.remove("disabled");
        stop.classList.remove("disabled");
      });
      api.playerStateChanged.on((e) => {
        const icon = playPause.querySelector("i.fas");
        if (e.state === alphaTab.synth.PlayerState.Playing) {
          icon.classList.remove("fa-play");
          icon.classList.add("fa-pause");
        } else {
          icon.classList.remove("fa-pause");
          icon.classList.add("fa-play");
        }
      });

      // song position
      function formatDuration(milliseconds) {
        let seconds = milliseconds / 1000;
        const minutes = (seconds / 60) | 0;
        seconds = (seconds - minutes * 60) | 0;
        return (
          String(minutes).padStart(2, "0") +
          ":" +
          String(seconds).padStart(2, "0")
        );
      }

      const songPosition = wrapper.querySelector(".at-song-position");
      let previousTime = -1;
      api.playerPositionChanged.on((e) => {
        // reduce number of UI updates to second changes.
        const currentSeconds = (e.currentTime / 1000) | 0;
        if (currentSeconds == previousTime) {
          return;
        }

        songPosition.innerText =
          formatDuration(e.currentTime) + " / " + formatDuration(e.endTime);
      });
      api.playedBeatChanged.on((beat) => {
        var txt = beat.lyrics[0];
        document.getElementById("lyrics").innerHTML += `${txt} ` + "  ";
        var img = document.getElementById("image");
        switch(beat.maxNote.string){
          case 4: {
            if(beat.maxNote.fret==0){
              img.setAttribute("src","/img/G3.png");
              break;
            }
            if(beat.maxNote.fret==2){
              img.setAttribute("src","/img/A3.png");
              break;
            }
          }
          case 5:{
            if(beat.maxNote.fret==1){
              img.setAttribute("src","/img/C4.png");
              break;
            }
           if(beat.maxNote.fret==0){
              img.setAttribute("src","/img/B3.png");
              break;
            }
            if(beat.maxNote.fret==3){
              img.setAttribute("src","/img/D4.png");
              break;
            }
          }
          case 6:{
            if(beat.maxNote.fret==3){
              img.setAttribute("src","/img/G4.png");
              break;
            }
            if(beat.maxNote.fret==0){
              img.setAttribute("src","/img/E4.png");
              break;
            }
              if(beat.maxNote.fret==1){
              img.setAttribute("src","/img/F4.png");
              break;
            }
          }
          default:{
            if(beat.maxNote.fret==0){
              img.setAttribute("src","/img/G3.png");
              break;
            }
          }
        }
        console.log(beat.maxNote.fret);
        console.log(beat.maxNote.string);
      });
//metronome

const counterSpan = document.getElementById('counter');
const andSpan = document.getElementById('and');

api.midiEventsPlayedFilter = [alphaTab.midi.MidiEventType.SystemExclusive2];

andSpan.style.display = 'none'; // hide 'and' at start
api.playerStateChanged.on(e => {
    // reset to 1 when stopped
    if(e.stopped) {
        counterSpan.innerText = 1;
        andSpan.style.display = 'none';
    }
});
api.midiEventsPlayed.on(e => {
    for (const midi of e.events) { // loop through all played events
        if (midi.isMetronome) { // if a metronome was played, update the UI
            counterSpan.innerText = midi.metronomeNumerator + 1;
            andSpan.style.display = 'none'; // hide 'and' on tick.
            // show "and" after half the metronome duration
            const andTime = (midi.metronomeDurationInMilliseconds / 2) / api.playbackSpeed;
            setTimeout(() => {
                andSpan.style.display = 'inline';
            }, andTime);
        }
    }
});
//change playback speed
var pbs = document.querySelector(".playback select");
pbs.onchange = () =>{
  api.playbackSpeed = pbs.value;
  api.updateSettings();
  api.render();
}
var vs = document.querySelector(".volume select");
vs.onchange = () =>{
  api.masterVolume = vs.value;
  api.updateSettings();
  api.render();
}