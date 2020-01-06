
let playbackButton
let isPlaying = false
let playbackLabels = {
  false: 'Start',
  true: 'Stop'
}

let brownNoise
let isBrownPlaying = false
let brownNoiseButton

let pulse
let pulseLength = 100
let pulseFreq = 20
let pulseAmp = 0.2

let noiseX = 0
let noiseStep = 0.02

// sliders
let minFrequency
let maxFrequency

function preload(){
}


function setup(){
  // UI
  /// frequencies
  minFrequency = createSlider(20, 200, 20)
  minFrequency.changed(frequencyRangeChanged)
  minFrequency.parent(select('#minfreq'))

  maxFrequency = createSlider(40, 100, 60)
  maxFrequency.changed(frequencyRangeChanged)
  maxFrequency.parent(select('#maxfreq'))

  frequencyRangeChanged()


  /// playback
  playbackButton = createButton(playbackLabels[isPlaying])
  playbackButton.mousePressed(switchPlaybackState)

  // pulse
  pulse = new p5.Pulse()
  changePulse()

  // brown noise
  brownNoise = new p5.Noise('brown')
  brownNoiseButton = createButton('Brown ON/OFF')
  brownNoiseButton.mousePressed(switchBrown)

  let brownFilter = new p5.LowPass()
  brownFilter.freq(1000)
  brownFilter.res(10)
  brownNoise.disconnect()
  brownNoise.connect(brownFilter)
}

function frequencyRangeChanged(){
  let minValue = minFrequency.value()
  let maxValue = maxFrequency.value()
  if (minValue > maxValue) {
    minFrequency.value(maxFrequency.value())
    minValue = maxValue
  }

  select('#minfreqvalue').html(minValue)
  select('#maxfreqvalue').html(maxValue)
}

function switchPlaybackState(){
  isPlaying = !isPlaying
  playbackButton.html(playbackLabels[isPlaying])

  if (isPlaying) {
      changePulse()
      pulse.start()
  } else {
    pulse.stop()
  }
}

function changePulse(){
  if (!isPlaying) {
    return
  }

  let noiseVal = noise(noiseX)
  noiseX = noiseX + noiseStep

  pulseFreq = minFrequency.value() + (maxFrequency.value() - minFrequency.value()) * noiseVal

  pulse.amp(pulseAmp)
  pulse.freq(pulseFreq)
  // pulse.width(1)

  select('#curfreqvalue').html(pulseFreq)

  setTimeout(changePulse, pulseLength)
}

function switchBrown(){
  isBrownPlaying = !isBrownPlaying
  if (isBrownPlaying) {
    brownNoise.amp(0.5)
    brownNoise.start()
  } else {
    brownNoise.stop()
  }
}

