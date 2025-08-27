// Comprehensive Guitar Tuning Database
// Based on equal temperament tuning (A4 = 440Hz)

const TUNING_DATABASE = {
  // Standard tuning frequencies (Hz)
  standard: {
    name: "Standard (E-A-D-G-B-E)",
    strings: [
      { number: 1, note: "E4", frequency: 329.628, name: "High E" },
      { number: 2, note: "B3", frequency: 246.942, name: "B" },
      { number: 3, note: "G3", frequency: 195.998, name: "G" },
      { number: 4, note: "D3", frequency: 146.832, name: "D" },
      { number: 5, note: "A2", frequency: 110.000, name: "A" },
      { number: 6, note: "E2", frequency: 82.407, name: "Low E" }
    ]
  },

  // Alternative tunings
  dropD: {
    name: "Drop D (D-A-D-G-B-E)",
    strings: [
      { number: 1, note: "E4", frequency: 329.628, name: "High E" },
      { number: 2, note: "B3", frequency: 246.942, name: "B" },
      { number: 3, note: "G3", frequency: 195.998, name: "G" },
      { number: 4, note: "D3", frequency: 146.832, name: "D" },
      { number: 5, note: "A2", frequency: 110.000, name: "A" },
      { number: 6, note: "D2", frequency: 73.416, name: "Low D" }
    ]
  },

  halfStepDown: {
    name: "Half Step Down (Eb-Ab-Db-Gb-Bb-Eb)",
    strings: [
      { number: 1, note: "Eb4", frequency: 311.127, name: "High Eb" },
      { number: 2, note: "Bb3", frequency: 233.082, name: "Bb" },
      { number: 3, note: "Gb3", frequency: 184.997, name: "Gb" },
      { number: 4, note: "Db3", frequency: 138.591, name: "Db" },
      { number: 5, note: "Ab2", frequency: 103.826, name: "Ab" },
      { number: 6, note: "Eb2", frequency: 77.782, name: "Low Eb" }
    ]
  },

  openG: {
    name: "Open G (D-G-D-G-B-D)",
    strings: [
      { number: 1, note: "D4", frequency: 293.665, name: "High D" },
      { number: 2, note: "B3", frequency: 246.942, name: "B" },
      { number: 3, note: "G3", frequency: 195.998, name: "G" },
      { number: 4, note: "D3", frequency: 146.832, name: "D" },
      { number: 5, note: "G2", frequency: 97.999, name: "G" },
      { number: 6, note: "D2", frequency: 73.416, name: "Low D" }
    ]
  },

  openD: {
    name: "Open D (D-A-D-F#-A-D)",
    strings: [
      { number: 1, note: "D4", frequency: 293.665, name: "High D" },
      { number: 2, note: "A3", frequency: 220.000, name: "A" },
      { number: 3, note: "F#3", frequency: 184.997, name: "F#" },
      { number: 4, note: "D3", frequency: 146.832, name: "D" },
      { number: 5, note: "A2", frequency: 110.000, name: "A" },
      { number: 6, note: "D2", frequency: 73.416, name: "Low D" }
    ]
  },

  DADGAD: {
    name: "DADGAD (D-A-D-G-A-D)",
    strings: [
      { number: 1, note: "D4", frequency: 293.665, name: "High D" },
      { number: 2, note: "A3", frequency: 220.000, name: "A" },
      { number: 3, note: "G3", frequency: 195.998, name: "G" },
      { number: 4, note: "D3", frequency: 146.832, name: "D" },
      { number: 5, note: "A2", frequency: 110.000, name: "A" },
      { number: 6, note: "D2", frequency: 73.416, name: "Low D" }
    ]
  }
};

// Complete chromatic note frequencies (4th octave as reference)
const NOTE_FREQUENCIES = {
  // Octave 2
  "C2": 65.406, "C#2": 69.296, "Db2": 69.296, "D2": 73.416, "D#2": 77.782, "Eb2": 77.782,
  "E2": 82.407, "F2": 87.307, "F#2": 92.499, "Gb2": 92.499, "G2": 97.999, "G#2": 103.826, "Ab2": 103.826,
  "A2": 110.000, "A#2": 116.541, "Bb2": 116.541, "B2": 123.471,

  // Octave 3
  "C3": 130.813, "C#3": 138.591, "Db3": 138.591, "D3": 146.832, "D#3": 155.563, "Eb3": 155.563,
  "E3": 164.814, "F3": 174.614, "F#3": 184.997, "Gb3": 184.997, "G3": 195.998, "G#3": 207.652, "Ab3": 207.652,
  "A3": 220.000, "A#3": 233.082, "Bb3": 233.082, "B3": 246.942,

  // Octave 4
  "C4": 261.626, "C#4": 277.183, "Db4": 277.183, "D4": 293.665, "D#4": 311.127, "Eb4": 311.127,
  "E4": 329.628, "F4": 349.228, "F#4": 369.994, "Gb4": 369.994, "G4": 391.995, "G#4": 415.305, "Ab4": 415.305,
  "A4": 440.000, "A#4": 466.164, "Bb4": 466.164, "B4": 493.883,

  // Octave 5
  "C5": 523.251, "C#5": 554.365, "Db5": 554.365, "D5": 587.330, "D#5": 622.254, "Eb5": 622.254,
  "E5": 659.255, "F5": 698.456, "F#5": 739.989, "Gb5": 739.989, "G5": 783.991, "G#5": 830.609, "Ab5": 830.609,
  "A5": 880.000, "A#5": 932.328, "Bb5": 932.328, "B5": 987.767
};

// Note names for pitch detection
const CHROMATIC_NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Tuning tolerance settings
const TUNING_SETTINGS = {
  // Cents tolerance for "in tune" status
  inTuneTolerance: 5,
  
  // Frequency range for guitar (Hz)
  minFrequency: 50,
  maxFrequency: 800,
  
  // Sample rate for audio analysis
  sampleRate: 44100,
  
  // FFT size for pitch detection
  fftSize: 2048
};

// Guitar string gauge references (for educational purposes)
const STRING_GAUGES = {
  extraLight: {
    name: "Extra Light (.009-.042)",
    strings: [
      { number: 1, gauge: ".009", tension: "Light" },
      { number: 2, gauge: ".011", tension: "Light" },
      { number: 3, gauge: ".016", tension: "Light" },
      { number: 4, gauge: ".024", tension: "Light" },
      { number: 5, gauge: ".032", tension: "Light" },
      { number: 6, gauge: ".042", tension: "Light" }
    ]
  },
  light: {
    name: "Light (.010-.046)",
    strings: [
      { number: 1, gauge: ".010", tension: "Medium" },
      { number: 2, gauge: ".013", tension: "Medium" },
      { number: 3, gauge: ".017", tension: "Medium" },
      { number: 4, gauge: ".026", tension: "Medium" },
      { number: 5, gauge: ".036", tension: "Medium" },
      { number: 6, gauge: ".046", tension: "Medium" }
    ]
  },
  medium: {
    name: "Medium (.011-.049)",
    strings: [
      { number: 1, gauge: ".011", tension: "High" },
      { number: 2, gauge: ".014", tension: "High" },
      { number: 3, gauge: ".018", tension: "High" },
      { number: 4, gauge: ".028", tension: "High" },
      { number: 5, gauge: ".038", tension: "High" },
      { number: 6, gauge: ".049", tension: "High" }
    ]
  }
};

// Advanced pitch detection algorithms
const PITCH_DETECTION = {
  // Autocorrelation method for more accurate pitch detection
  autocorrelation: function(buffer, sampleRate) {
    const SIZE = buffer.length;
    const rms = Math.sqrt(buffer.reduce((sum, val) => sum + val * val, 0) / SIZE);
    
    if (rms < 0.01) return -1; // Too quiet
    
    let r1 = 0, r2 = SIZE - 1, threshold = 0.2;
    for (let i = 0; i < SIZE / 2; i++) {
      if (Math.abs(buffer[i]) < threshold) { r1 = i; break; }
    }
    for (let i = 1; i < SIZE / 2; i++) {
      if (Math.abs(buffer[SIZE - i]) < threshold) { r2 = SIZE - i; break; }
    }
    
    buffer = buffer.slice(r1, r2);
    const c = new Array(SIZE).fill(0);
    
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i];
      }
    }
    
    let d = 0;
    while (c[d] > c[d + 1]) d++;
    
    let maxval = -1, maxpos = -1;
    for (let i = d; i < SIZE; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    
    let T0 = maxpos;
    
    // Interpolation for sub-sample accuracy
    const x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    const a = (x1 - 2 * x2 + x3) / 2;
    const b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);
    
    return sampleRate / T0;
  },

  // FFT-based pitch detection as fallback
  fftPitch: function(dataArray, sampleRate) {
    let maxIndex = 0;
    let maxValue = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }
    
    const nyquist = sampleRate / 2;
    return (maxIndex * nyquist) / dataArray.length;
  }
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { 
    TUNING_DATABASE, 
    NOTE_FREQUENCIES, 
    CHROMATIC_NOTES, 
    TUNING_SETTINGS, 
    STRING_GAUGES, 
    PITCH_DETECTION 
  };
}
