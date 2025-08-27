// Comprehensive Music Theory Database for Guitar
// Scales, progressions, and music theory data

const MUSIC_THEORY_DATABASE = {
  // Major and Minor Scales
  scales: {
    major: {
      name: "Major Scale",
      pattern: [2, 2, 1, 2, 2, 2, 1], // Semitone intervals
      modes: {
        ionian: { name: "Ionian (Major)", degrees: [1, 2, 3, 4, 5, 6, 7] },
        dorian: { name: "Dorian", degrees: [1, 2, 3, 4, 5, 6, 7] },
        phrygian: { name: "Phrygian", degrees: [1, 2, 3, 4, 5, 6, 7] },
        lydian: { name: "Lydian", degrees: [1, 2, 3, 4, 5, 6, 7] },
        mixolydian: { name: "Mixolydian", degrees: [1, 2, 3, 4, 5, 6, 7] },
        aeolian: { name: "Aeolian (Natural Minor)", degrees: [1, 2, 3, 4, 5, 6, 7] },
        locrian: { name: "Locrian", degrees: [1, 2, 3, 4, 5, 6, 7] }
      }
    },
    
    pentatonic: {
      major: {
        name: "Major Pentatonic",
        pattern: [2, 2, 3, 2, 3],
        degrees: [1, 2, 3, 5, 6],
        description: "Happy, uplifting sound - great for soloing"
      },
      minor: {
        name: "Minor Pentatonic",
        pattern: [3, 2, 2, 3, 2],
        degrees: [1, 3, 4, 5, 7],
        description: "Blues and rock staple - most popular scale"
      }
    },
    
    blues: {
      name: "Blues Scale",
      pattern: [3, 2, 1, 1, 3, 2],
      degrees: [1, 3, 4, 4.5, 5, 7],
      description: "Minor pentatonic with blue note"
    }
  },

  // Chord Progressions
  progressions: {
    popular: {
      "I-V-vi-IV": {
        name: "Pop Progression",
        roman: ["I", "V", "vi", "IV"],
        example_key_C: ["C", "G", "Am", "F"],
        songs: ["Let It Be", "Don't Stop Believin'", "Someone Like You"],
        description: "Most popular progression in modern music"
      },
      
      "vi-IV-I-V": {
        name: "Pop Punk Progression",
        roman: ["vi", "IV", "I", "V"],
        example_key_C: ["Am", "F", "C", "G"],
        songs: ["Complicated", "What's My Age Again"],
        description: "Common in pop-punk and emo"
      },
      
      "I-vi-IV-V": {
        name: "50s Progression",
        roman: ["I", "vi", "IV", "V"],
        example_key_C: ["C", "Am", "F", "G"],
        songs: ["Stand By Me", "Blue Moon"],
        description: "Classic doo-wop progression"
      }
    },
    
    jazz: {
      "ii-V-I": {
        name: "Jazz ii-V-I",
        roman: ["ii7", "V7", "Imaj7"],
        example_key_C: ["Dm7", "G7", "Cmaj7"],
        description: "Foundation of jazz harmony"
      },
      
      "I-vi7-ii7-V7": {
        name: "Rhythm Changes",
        roman: ["I", "vi7", "ii7", "V7"],
        example_key_C: ["C", "Am7", "Dm7", "G7"],
        description: "Based on 'I Got Rhythm'"
      }
    },
    
    blues: {
      "12-bar": {
        name: "12-Bar Blues",
        bars: [
          "I7", "I7", "I7", "I7",
          "IV7", "IV7", "I7", "I7", 
          "V7", "IV7", "I7", "V7"
        ],
        example_key_E: [
          "E7", "E7", "E7", "E7",
          "A7", "A7", "E7", "E7",
          "B7", "A7", "E7", "B7"
        ],
        description: "Standard blues form"
      }
    }
  },

  // Circle of Fifths
  circleOfFifths: {
    sharps: ["C", "G", "D", "A", "E", "B", "F#"],
    flats: ["C", "F", "Bb", "Eb", "Ab", "Db", "Gb"],
    relative_minors: {
      "C": "Am", "G": "Em", "D": "Bm", "A": "F#m", "E": "C#m", "B": "G#m", "F#": "D#m",
      "F": "Dm", "Bb": "Gm", "Eb": "Cm", "Ab": "Fm", "Db": "Bbm", "Gb": "Ebm"
    }
  },

  // Chord Functions
  chordFunctions: {
    major: {
      I: { name: "Tonic", function: "Stability", feeling: "Home" },
      ii: { name: "Supertonic", function: "Predominant", feeling: "Movement away" },
      iii: { name: "Mediant", function: "Tonic substitute", feeling: "Mild departure" },
      IV: { name: "Subdominant", function: "Predominant", feeling: "Away from home" },
      V: { name: "Dominant", function: "Dominant", feeling: "Tension, wants resolution" },
      vi: { name: "Submediant", function: "Tonic substitute", feeling: "Relative minor" },
      vii: { name: "Leading tone", function: "Dominant", feeling: "Strong pull to tonic" }
    }
  },

  // Guitar-specific fretboard patterns
  fretboardPatterns: {
    pentatonic_positions: {
      position1: {
        root_fret: 0, // Open position
        pattern: [
          { string: 6, frets: [0, 3] },
          { string: 5, frets: [0, 2] },
          { string: 4, frets: [0, 2] },
          { string: 3, frets: [0, 2] },
          { string: 2, frets: [0, 3] },
          { string: 1, frets: [0, 3] }
        ]
      },
      position2: {
        root_fret: 2,
        pattern: [
          { string: 6, frets: [2, 5] },
          { string: 5, frets: [2, 4] },
          { string: 4, frets: [2, 4] },
          { string: 3, frets: [2, 4] },
          { string: 2, frets: [3, 5] },
          { string: 1, frets: [2, 5] }
        ]
      }
    },
    
    chord_shapes: {
      caged: {
        C: { root_string: 5, barre_fret: null, shape: "C" },
        A: { root_string: 5, barre_fret: null, shape: "A" },
        G: { root_string: 6, barre_fret: null, shape: "G" },
        E: { root_string: 6, barre_fret: 1, shape: "E" },
        D: { root_string: 4, barre_fret: null, shape: "D" }
      }
    }
  },

  // Rhythm patterns
  rhythmPatterns: {
    strumming: {
      basic_down: {
        name: "Basic Down Strums",
        pattern: "D D D D",
        time_signature: "4/4",
        difficulty: "Beginner"
      },
      down_up: {
        name: "Down-Up Pattern",
        pattern: "D U D U",
        time_signature: "4/4", 
        difficulty: "Beginner"
      },
      folk: {
        name: "Folk Strum",
        pattern: "D D U D U",
        time_signature: "4/4",
        difficulty: "Intermediate"
      },
      rock: {
        name: "Rock Pattern",
        pattern: "D - D U - U D U",
        time_signature: "4/4",
        difficulty: "Intermediate"
      }
    }
  },

  // Common song keys for guitar
  guitarFriendlyKeys: {
    beginner: ["G", "C", "D", "Em", "Am"],
    intermediate: ["A", "E", "F", "Dm", "Bm"],
    advanced: ["B", "F#", "C#", "Db", "Ab"],
    capo_suggestions: {
      "Key of F": "Capo 1st fret, play in E",
      "Key of Bb": "Capo 3rd fret, play in G", 
      "Key of Eb": "Capo 3rd fret, play in C",
      "Key of Ab": "Capo 4th fret, play in E"
    }
  }
};

// Song database with metadata
const SONG_DATABASE = {
  beginner: [
    {
      title: "Wonderwall",
      artist: "Oasis", 
      key: "G",
      chords: ["Em7", "G", "D", "A", "C"],
      capo: 2,
      difficulty: "Beginner",
      strumming: "D D U D U",
      bpm: 87,
      genre: "Rock"
    },
    {
      title: "Horse with No Name",
      artist: "America",
      key: "E", 
      chords: ["Em", "D6add9"],
      capo: 0,
      difficulty: "Beginner",
      strumming: "D D U D U",
      bpm: 122,
      genre: "Folk Rock"
    },
    {
      title: "Eleanor Rigby",
      artist: "The Beatles",
      key: "C",
      chords: ["C", "Em"],
      capo: 0,
      difficulty: "Beginner", 
      strumming: "D D D D",
      bpm: 136,
      genre: "Pop"
    }
  ],
  
  intermediate: [
    {
      title: "Hotel California",
      artist: "Eagles",
      key: "Bm",
      chords: ["Bm", "F#", "A", "E", "G", "D", "Em"],
      capo: 0,
      difficulty: "Intermediate",
      strumming: "D D U D U D U",
      bpm: 75,
      genre: "Rock"
    },
    {
      title: "Blackbird",
      artist: "The Beatles", 
      key: "G",
      chords: ["G", "Am", "C", "D", "Em", "F"],
      capo: 0,
      difficulty: "Intermediate",
      strumming: "Fingerpicking",
      bpm: 96,
      genre: "Folk"
    }
  ]
};

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { MUSIC_THEORY_DATABASE, SONG_DATABASE };
}
