// JavaScript functionality for The Beginner's Guitar Blueprint - Optimized for Personal Use

// --- AI Service Module ---
const AIService = {
    apiKey: "YOUR_GOOGLE_GEMINI_API_KEY_HERE", // Replace with your actual API key
    conversationHistory: [],

    // Schemas for structured AI responses
    chordDetailSchema: {
        type: "OBJECT",
        properties: {
            chord_name: { type: "STRING" },
            notes: { type: "ARRAY", items: { type: "STRING" } },
            difficulty: { type: "STRING" },
            description: { type: "STRING" },
            fingering: { type: "ARRAY", items: { type: "OBJECT", properties: { string: { type: "NUMBER" }, fret: { type: "NUMBER" } } } },
            tips: { type: "STRING" },
            common_progressions: { type: "ARRAY", items: { type: "STRING" } },
            musical_context: { type: "STRING" }
        }
    },
    chordSuggestionsSchema: {
        type: "ARRAY",
        items: {
            type: "OBJECT",
            properties: {
                chord_name: { type: "STRING" },
                root: { type: "STRING" },
                type: { type: "STRING" },
                reason: { type: "STRING" },
                difficulty: { type: "STRING" },
                emotional_quality: { type: "STRING" }
            }
        }
    },

    // Method to start a new conversation, clearing previous history
    startNewConversation: function() {
        this.conversationHistory = [];
        console.log("AI conversation history cleared.");
    },

    // The core method to interact with the Gemini AI
    generateResponse: async function(prompt, format = 'text') {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.apiKey}`;
        
        // Add the new user prompt to the history
        this.conversationHistory.push({
            role: "user",
            parts: [{ text: prompt }]
        });

        let retries = 0;
        const maxRetries = 5;
        let delay = 1000;

        while (retries < maxRetries) {
            try {
                const requestBody = {
                    contents: this.conversationHistory,
                    generationConfig: {}
                };

                // Add generation config based on the requested format
                if (format === 'json') {
                    requestBody.generationConfig.responseMimeType = "application/json";
                    requestBody.generationConfig.responseSchema = this.chordDetailSchema;
                } else if (format === 'suggestions') {
                    requestBody.generationConfig.responseMimeType = "application/json";
                    requestBody.generationConfig.responseSchema = this.chordSuggestionsSchema;
                } else {
                    requestBody.generationConfig = {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    };
                }

                const response = await fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(requestBody)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                        const aiResponse = data.candidates[0].content;
                        // Add AI response to history
                        this.conversationHistory.push(aiResponse);
                        return aiResponse.parts[0].text;
                    } else {
                        throw new Error('Invalid response format from Gemini API');
                    }
                } else if (response.status === 429) {
                    retries++;
                    console.warn(`API rate limit exceeded. Retrying in ${delay}ms...`);
                    await new Promise(res => setTimeout(res, delay));
                    delay *= 2;
                } else {
                    throw new Error(`API request failed: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                retries++;
                console.error(`Attempt ${retries} failed:`, error);
                await new Promise(res => setTimeout(res, delay));
                delay *= 2;
                if (retries === maxRetries) {
                    throw error; // Re-throw the error after final retry
                }
            }
        }
        throw new Error('AI request failed after multiple retries.');
    }
};

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeNavigation();
    initializeChordDiagrams();
    initializeSongFilter();
    initializeChordFinder();
    initializeMetronome();
    initializeGuitarTuner();
    initializeYouTubeTutors();
    initializeChordProgressions();
    
    // Set initial view
    const hash = window.location.hash || '#get-started';
    switchTab(hash);
    
    // Welcome message
    console.log('🎸 Guitar Learning App - AI-Powered & Ready!');
});

// Navigation System
function initializeNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentSections = document.querySelectorAll('.content-section');

    function switchTab(hash) {
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.hash === hash);
        });
        contentSections.forEach(section => {
            section.classList.toggle('hidden', section.id !== hash.substring(1));
        });
    }
    
    // Make switchTab globally available
    window.switchTab = switchTab;
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = e.currentTarget.hash;
            window.location.hash = hash;
        });
    });

    window.addEventListener('hashchange', () => {
        const hash = window.location.hash || '#get-started';
        switchTab(hash);
    });
}

// Essential Chords Data
const essentialChords = [
    { name: 'A', fingers: [{ string: 3, fret: 2 }, { string: 4, fret: 2 }, { string: 2, fret: 2 }] },
    { name: 'D', fingers: [{ string: 3, fret: 2 }, { string: 1, fret: 2 }, { string: 2, fret: 3 }] },
    { name: 'E', fingers: [{ string: 5, fret: 2 }, { string: 4, fret: 2 }, { string: 3, fret: 1 }] },
    { name: 'C', fingers: [{ string: 5, fret: 3 }, { string: 4, fret: 2 }, { string: 2, fret: 1 }] },
    { name: 'G', fingers: [{ string: 6, fret: 3 }, { string: 5, fret: 2 }, { string: 1, fret: 3 }] },
    { name: 'Am', fingers: [{ string: 4, fret: 2 }, { string: 3, fret: 2 }, { string: 2, fret: 1 }] },
    { name: 'Dm', fingers: [{ string: 3, fret: 2 }, { string: 2, fret: 3 }, { string: 1, fret: 1 }] },
    { name: 'Em', fingers: [{ string: 5, fret: 2 }, { string: 4, fret: 2 }] }
];

// Song Database
const songData = [
    { title: "Three Little Birds", artist: "Bob Marley", chords: ["A", "D", "E"] },
    { title: "Wild Thing", artist: "The Troggs", chords: ["A", "D", "E"] },
    { title: "Sweet Home Alabama", artist: "Lynyrd Skynyrd", chords: ["G", "C", "D"] },
    { title: "The Joker", artist: "Steve Miller Band", chords: ["G", "C", "D"] },
    { title: "Knockin' On Heaven's Door", artist: "Bob Dylan", chords: ["G", "D", "Am", "C"] },
    { title: "Stand By Me", artist: "Ben E. King", chords: ["G", "Em", "C", "D"] },
    { title: "Wonderwall", artist: "Oasis", chords: ["Em", "G", "D", "A"] },
    { title: "What I Got", artist: "Sublime", chords: ["A", "C", "G"] },
];

// YouTube Tutors Data
const tutors = [
    { name: "JustinGuitar", style: "Structured, graded, comprehensive.", playlistId: "PLP3kvqg_Ut85O11T56_oBq-2qyfja8NWe" },
    { name: "Marty Music", style: "Song-based, energetic, and fun.", playlistId: "PL595B42D6B0F9B404" },
    { name: "Andy Guitar", style: "Highly accessible and simplified.", playlistId: "PL-RYb_OMw7GfG6MS0WBO1v2qvtomUkZci" },
    { name: "GuitarLessons365Song", style: "Detailed, note-for-note song lessons.", playlistId: "PL-ryb_omw7GevT75Q7yC2Hj12V4w7N6S4" },
];

// Chord Diagram Drawing
function drawChordDiagram(canvas, chord) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const frets = 5;
    const strings = 6;
    const padding = 20;

    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 1;

    const stringSpacing = (w - 2 * padding) / (strings - 1);
    const fretSpacing = (h - 2 * padding) / frets;

    // Draw strings (vertical lines)
    for (let i = 0; i < strings; i++) {
        ctx.beginPath();
        ctx.moveTo(padding + i * stringSpacing, padding);
        ctx.lineTo(padding + i * stringSpacing, h - padding);
        ctx.stroke();
    }

    // Draw frets (horizontal lines)
    for (let i = 0; i <= frets; i++) {
        ctx.beginPath();
        ctx.moveTo(padding, padding + i * fretSpacing);
        ctx.lineTo(w - padding, padding + i * fretSpacing);
        ctx.stroke();
    }

    // Draw finger positions
    ctx.fillStyle = '#4A4A4A';
    if (chord.fingers) {
        chord.fingers.forEach(finger => {
            const x = padding + (strings - finger.string) * stringSpacing;
            const y = padding + (finger.fret - 0.5) * fretSpacing;
            ctx.beginPath();
            ctx.arc(x, y, 6, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
}

// Initialize Chord Diagrams
function initializeChordDiagrams() {
    const container = document.getElementById('chord-diagram-container');
    if (!container) return;
    
    essentialChords.forEach(chord => {
        const chordWrapper = document.createElement('div');
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 120;
        const name = document.createElement('p');
        name.textContent = chord.name;
        name.className = 'font-semibold mt-1';
        
        chordWrapper.appendChild(canvas);
        chordWrapper.appendChild(name);
        container.appendChild(chordWrapper);

        drawChordDiagram(canvas, chord);
    });
}

// Song Filter System
function initializeSongFilter() {
    const filterContainer = document.getElementById('chord-filter');
    const songList = document.getElementById('song-list');
    
    if (!filterContainer || !songList) return;

    // Create filter buttons
    const allChords = ['A', 'C', 'D', 'E', 'G', 'Am', 'Em', 'Dm'];
    allChords.forEach(chord => {
        const button = document.createElement('button');
        button.textContent = chord;
        button.dataset.chord = chord;
        button.className = 'px-3 py-1 rounded border border-gray-300 hover:bg-green-100 transition-colors';
        button.addEventListener('click', toggleChordFilter);
        filterContainer.appendChild(button);
    });

    function toggleChordFilter(e) {
        const button = e.target;
        const isActive = button.classList.contains('bg-green-600');
        
        if (isActive) {
            button.classList.remove('bg-green-600', 'text-white');
            button.classList.add('border-gray-300');
        } else {
            button.classList.add('bg-green-600', 'text-white');
            button.classList.remove('border-gray-300');
        }
        
        updateSongList();
    }

    function updateSongList() {
        const activeChords = Array.from(filterContainer.querySelectorAll('button.bg-green-600')).map(b => b.dataset.chord);
        const filteredSongs = songData.filter(song => {
            if (activeChords.length === 0) return true;
            return song.chords.every(chord => activeChords.includes(chord));
        });

        songList.innerHTML = '';
        filteredSongs.forEach(song => {
            const row = document.createElement('tr');
            row.className = 'border-b last:border-b-0';
            row.innerHTML = `
                <td class="p-2">${song.title}</td>
                <td class="p-2">${song.artist}</td>
                <td class="p-2">${song.chords.join(', ')}</td>
            `;
            songList.appendChild(row);
        });
    }

    // Initial population
    updateSongList();
}

// AI-Powered Chord Finder
function initializeChordFinder() {
    const rootButtons = document.querySelectorAll('.chord-root-btn');
    const typeButtons = document.querySelectorAll('.chord-type-btn');
    const chordNameDisplay = document.getElementById('selected-chord-name');
    const chordInfo = document.getElementById('chord-info');
    const canvas = document.getElementById('chord-finder-diagram');
    
    // AI Search elements
    const aiSearchInput = document.getElementById('ai-chord-search');
    const searchBtn = document.getElementById('search-chords-btn');
    const searchSpinner = document.getElementById('chord-search-spinner');
    const searchStatus = document.getElementById('chord-search-status');
    const aiResults = document.getElementById('ai-chord-results');
    const aiSuggestions = document.getElementById('ai-chord-suggestions');
    const quickSearchBtns = document.querySelectorAll('.quick-search-btn');
    const clearConversationBtn = document.getElementById('clear-conversation-btn');
    
    let selectedRoot = null;
    let selectedType = null;
    
    if (!rootButtons.length) return; // Exit if chord finder elements don't exist
    
    // Initialize AI search functionality
    initializeAISearch();
    
    // Root note selection
    rootButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            rootButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedRoot = btn.dataset.root;
            if (selectedType) {
                generateChordWithAI(selectedRoot, selectedType);
            }
        });
    });
    
    // Chord type selection
    typeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            typeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.dataset.type;
            if (selectedRoot) {
                generateChordWithAI(selectedRoot, selectedType);
            }
        });
    });
    
    function initializeAISearch() {
        // AI Search button
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = aiSearchInput?.value?.trim();
                if (query) {
                    performAIChordSearch(query);
                }
            });
        }
        
        // Enter key for search
        if (aiSearchInput) {
            aiSearchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = aiSearchInput.value.trim();
                    if (query) {
                        performAIChordSearch(query);
                    }
                }
            });
        }
        
        // Quick search buttons
        quickSearchBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const query = btn.dataset.query;
                if (aiSearchInput) aiSearchInput.value = query;
                performAIChordSearch(query);
            });
        });

        // Clear conversation button
        if (clearConversationBtn) {
            clearConversationBtn.addEventListener('click', () => {
                AIService.startNewConversation();
                updateConversationHistory();
                if (aiSearchInput) aiSearchInput.value = '';
                if (aiResults) aiResults.classList.add('hidden');
                if (searchStatus) searchStatus.textContent = '';
            });
        }
    }
    
    async function generateChordWithAI(root, type) {
        const chordName = type === 'major' ? root : `${root}${type}`;
        if (chordNameDisplay) chordNameDisplay.textContent = chordName;
        
        // Show loading state
        if (chordInfo) {
            chordInfo.innerHTML = `
                <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p class="text-gray-600">AI is generating chord information...</p>
                </div>
            `;
        }
        
        const prompt = `Generate detailed guitar chord information for ${chordName} chord. Return ONLY a JSON object with this exact format:
{
  "chord_name": "${chordName}",
  "notes": ["array", "of", "note", "names"],
  "difficulty": "Beginner/Intermediate/Advanced",
  "description": "Musical description and context",
  "fingering": [
    {"string": 6, "fret": 0},
    {"string": 5, "fret": 3}
  ],
  "tips": "Practice tips and technique advice",
  "common_progressions": ["chord1", "chord2", "chord3"],
  "musical_context": "When and how this chord is used"
}

For fingering, use string numbers 1-6 (1=high E, 6=low E) and fret numbers (0=open, 1-12=frets). Only include fretted notes, skip open strings that aren't played.`;

        try {
            // Start a new conversation for each direct chord generation
            AIService.startNewConversation();
            const response = await AIService.generateResponse(prompt, 'json');
            const chordData = JSON.parse(response);
            displayAIGeneratedChord(chordData);
            
        } catch (error) {
            console.error('AI chord generation error:', error);
            if (chordInfo) {
                chordInfo.innerHTML = `
                    <div class="text-center text-red-500">
                        <p>❌ Could not generate chord information</p>
                        <p class="text-sm mt-2">Please try again or select a different chord</p>
                    </div>
                `;
            }
        }
    }
    
    function displayAIGeneratedChord(chordData) {
        // Draw chord diagram if fingering is provided
        if (chordData.fingering && canvas) {
            const fingers = chordData.fingering.map(f => ({
                string: f.string,
                fret: f.fret
            }));
            drawChordDiagram(canvas, { name: chordData.chord_name, fingers });
        }
        
        // Display comprehensive chord information
        if (chordInfo) {
            chordInfo.innerHTML = `
                <h4 class="font-semibold mb-3 text-lg">${chordData.chord_name} Chord</h4>
                
                <div class="space-y-3">
                    <div>
                        <p class="text-sm font-medium text-gray-700">Difficulty:</p>
                        <span class="inline-block px-2 py-1 rounded text-xs font-semibold ${getDifficultyClass(chordData.difficulty)}">
                            ${chordData.difficulty}
                        </span>
                    </div>
                    
                    <div>
                        <p class="text-sm font-medium text-gray-700">Notes:</p>
                        <p class="text-sm text-gray-600">${chordData.notes ? chordData.notes.join(' - ') : 'Standard chord tones'}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm font-medium text-gray-700">Description:</p>
                        <p class="text-sm text-gray-600">${chordData.description}</p>
                    </div>
                    
                    <div>
                        <p class="text-sm font-medium text-gray-700">Musical Context:</p>
                        <p class="text-sm text-gray-600">${chordData.musical_context}</p>
                    </div>
                    
                    ${chordData.common_progressions ? `
                    <div>
                        <p class="text-sm font-medium text-gray-700">Common Progressions:</p>
                        <div class="flex flex-wrap gap-1 mt-1">
                            ${chordData.common_progressions.map(chord => 
                                `<span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">${chord}</span>`
                            ).join('')}
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="bg-green-50 p-3 rounded-lg">
                        <p class="text-sm font-medium text-green-800">💡 Practice Tips:</p>
                        <p class="text-sm text-green-700 mt-1">${chordData.tips}</p>
                    </div>
                </div>
            `;
        }
    }
    
    function getDifficultyClass(difficulty) {
        switch(difficulty) {
            case 'Beginner': return 'bg-green-100 text-green-800';
            case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
            case 'Advanced': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }
    
    async function performAIChordSearch(query) {
        if (!query) return;
        
        // Show loading state
        if (searchSpinner) searchSpinner.classList.remove('hidden');
        if (searchStatus) searchStatus.textContent = 'AI is searching for chords...';
        if (searchBtn) searchBtn.disabled = true;
        if (aiResults) aiResults.classList.add('hidden');
        
        const prompt = `Based on this guitar chord request: "${query}", suggest 4-6 specific guitar chords that match the request. Consider musical context, difficulty level, and emotional qualities.

Return ONLY a JSON array with this exact format:
[
  {
    "chord_name": "C",
    "root": "C",
    "type": "major",
    "reason": "Bright, happy sound perfect for pop songs",
    "difficulty": "Beginner",
    "emotional_quality": "Happy/uplifting"
  }
]

For chord types use: major, minor, 7, maj7, min7, sus4, sus2, dim
For difficulty use: Beginner, Intermediate, Advanced
Match the emotional request (happy=major chords, sad=minor chords, dreamy=maj7, bluesy=7th, etc.)`;

        try {
            const response = await AIService.generateResponse(prompt, 'suggestions');
            const suggestions = JSON.parse(response);
            displayAIChordSuggestions(suggestions);
            
        } catch (error) {
            console.error('AI chord search error:', error);
            if (searchStatus) {
                searchStatus.textContent = 'Search failed. Try manual selection below.';
                searchStatus.className = 'text-sm text-red-600';
            }
        } finally {
            if (searchSpinner) searchSpinner.classList.add('hidden');
            if (searchBtn) searchBtn.disabled = false;
            updateConversationHistory();
        }
    }

    function updateConversationHistory() {
        const historyLog = document.getElementById('ai-history-log');
        if (!historyLog) return;

        if (AIService.conversationHistory.length === 0) {
            historyLog.innerHTML = `<p class="text-xs text-gray-500 italic">Your conversation with the AI will appear here.</p>`;
            return;
        }

        historyLog.innerHTML = AIService.conversationHistory.map(entry => {
            if (entry.role === 'user') {
                return `<div class="text-right"><span class="bg-blue-100 text-blue-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">You</span><p class="text-sm inline-block bg-blue-100 rounded-md p-2 ml-8">${entry.parts[0].text.match(/"(.*?)"/)[1]}</p></div>`;
            } else if (entry.role === 'model') {
                return `<div class="text-left"><span class="bg-purple-100 text-purple-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded-full">AI</span><p class="text-sm inline-block bg-purple-100 rounded-md p-2 mr-8">I have found some suggestions for you.</p></div>`;
            }
            return '';
        }).join('');

        historyLog.scrollTop = historyLog.scrollHeight;
    }
    
    function displayAIChordSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            if (searchStatus) {
                searchStatus.textContent = 'No matching chords found. Try manual selection.';
                searchStatus.className = 'text-sm text-orange-600';
            }
            return;
        }
        
        // Clear previous suggestions
        if (aiSuggestions) aiSuggestions.innerHTML = '';
        
        // Display each suggestion
        suggestions.forEach((suggestion, index) => {
            const suggestionEl = document.createElement('div');
            suggestionEl.className = 'ai-chord-suggestion chord-search-result cursor-pointer hover:bg-purple-50 p-3 rounded-lg border border-purple-200 transition-colors';
            suggestionEl.style.animationDelay = `${index * 0.1}s`;
            
            suggestionEl.innerHTML = `
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <h6 class="font-bold text-lg text-purple-800">${suggestion.chord_name}</h6>
                        <p class="text-sm text-purple-600 mt-1">${suggestion.reason}</p>
                        <div class="flex gap-2 mt-2">
                            <span class="inline-block px-2 py-1 rounded text-xs ${getDifficultyClass(suggestion.difficulty)}">
                                ${suggestion.difficulty}
                            </span>
                            ${suggestion.emotional_quality ? `
                                <span class="inline-block px-2 py-1 rounded text-xs bg-purple-100 text-purple-700">
                                    ${suggestion.emotional_quality}
                                </span>
                            ` : ''}
                        </div>
                    </div>
                    <button class="select-ai-chord-btn bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm transition-colors ml-3"
                            data-root="${suggestion.root}" 
                            data-type="${suggestion.type}"
                            data-chord="${suggestion.chord_name}">
                        Select
                    </button>
                </div>
            `;
            
            // Add click handler for the entire suggestion
            suggestionEl.addEventListener('click', (e) => {
                selectAIChord(suggestion.root, suggestion.type, e);
            });
            
            if (aiSuggestions) aiSuggestions.appendChild(suggestionEl);
        });
        
        // Add click handlers for select buttons
        if (aiSuggestions) {
            aiSuggestions.querySelectorAll('.select-ai-chord-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    selectAIChord(btn.dataset.root, btn.dataset.type, e);
                });
            });
        }
        
        // Show results
        if (aiResults) aiResults.classList.remove('hidden');
        if (searchStatus) {
            searchStatus.textContent = `Found ${suggestions.length} chord suggestions`;
            searchStatus.className = 'text-sm text-green-600';
        }
    }
    
    function selectAIChord(root, type, event) {
        // Clear previous selections
        document.querySelectorAll('.ai-chord-suggestion').forEach(el => {
            el.classList.remove('bg-purple-100');
        });
        
        // Update manual selectors
        rootButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.root === root);
        });
        
        typeButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        
        // Update internal state and generate chord
        selectedRoot = root;
        selectedType = type;
        generateChordWithAI(root, type);
        
        // Highlight selected AI suggestion
        if (event && event.target) {
            const suggestion = event.target.closest('.ai-chord-suggestion');
            if (suggestion) suggestion.classList.add('bg-purple-100');
        }
    }
}

// Metronome System
class Metronome {
    constructor() {
        this.isPlaying = false;
        this.bpm = 120;
        this.timeSignature = '4/4';
        this.currentBeat = 0;
        this.audioContext = null;
        this.intervalId = null;
        this.beatInterval = (60 / this.bpm) * 1000;
    }

    async initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    createBeep(frequency = 800, duration = 100) {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration / 1000);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration / 1000);
    }

    async start() {
        await this.initAudio();
        this.isPlaying = true;
        this.currentBeat = 0;
        this.beatInterval = (60 / this.bpm) * 1000;
        
        this.intervalId = setInterval(() => {
            this.playBeat();
            this.updateVisualBeat();
        }, this.beatInterval);
        
        this.playBeat();
        this.updateVisualBeat();
    }

    stop() {
        this.isPlaying = false;
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
        this.currentBeat = 0;
        this.updateVisualBeat();
    }

    playBeat() {
        const beatsPerMeasure = parseInt(this.timeSignature.split('/')[0]);
        const isDownbeat = this.currentBeat === 0;
        const frequency = isDownbeat ? 1000 : 800;
        
        this.createBeep(frequency, 100);
        this.currentBeat = (this.currentBeat + 1) % beatsPerMeasure;
    }

    updateVisualBeat() {
        const beatsPerMeasure = parseInt(this.timeSignature.split('/')[0]);
        const beatIndicators = document.querySelectorAll('.beat-indicator');
        
        beatIndicators.forEach((indicator, index) => {
            if (index < beatsPerMeasure) {
                indicator.style.display = 'block';
                indicator.classList.toggle('active', index === this.currentBeat);
            } else {
                indicator.style.display = 'none';
            }
        });
    }

    setBPM(newBpm) {
        this.bpm = Math.max(40, Math.min(200, newBpm));
        if (this.isPlaying) {
            this.stop();
            this.start();
        }
    }

    setTimeSignature(newSignature) {
        this.timeSignature = newSignature;
        this.currentBeat = 0;
        this.updateVisualBeat();
    }
}

function initializeMetronome() {
    const metronome = new Metronome();
    const playPauseBtn = document.getElementById('metronome-play-pause');
    const bpmSlider = document.getElementById('bpm-slider');
    const bpmDisplay = document.getElementById('bpm-display');
    const timeSignatureSelect = document.getElementById('time-signature');
    
    if (!playPauseBtn) return;

    // Play/Pause button
    playPauseBtn.addEventListener('click', async () => {
        if (metronome.isPlaying) {
            metronome.stop();
            playPauseBtn.innerHTML = '<span class="text-2xl">▶️</span> Start';
            playPauseBtn.classList.remove('bg-red-600', 'hover:bg-red-700');
            playPauseBtn.classList.add('bg-green-600', 'hover:bg-green-700');
        } else {
            await metronome.start();
            playPauseBtn.innerHTML = '<span class="text-2xl">⏸️</span> Stop';
            playPauseBtn.classList.remove('bg-green-600', 'hover:bg-green-700');
            playPauseBtn.classList.add('bg-red-600', 'hover:bg-red-700');
        }
    });

    // BPM slider
    if (bpmSlider && bpmDisplay) {
        bpmSlider.addEventListener('input', (e) => {
            const bpm = parseInt(e.target.value);
            metronome.setBPM(bpm);
            bpmDisplay.textContent = bpm;
        });
    }

    // Time signature
    if (timeSignatureSelect) {
        timeSignatureSelect.addEventListener('change', (e) => {
            metronome.setTimeSignature(e.target.value);
        });
    }
}

// Guitar Tuner System
class GuitarTuner {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.isListening = false;
        this.animationId = null;
        
        // Standard tuning frequencies (Hz)
        this.targetFrequencies = {
            6: 82.41,  // E2
            5: 110.00, // A2
            4: 146.83, // D3
            3: 196.00, // G3
            2: 246.94, // B3
            1: 329.63  // E4
        };
        
        this.stringNames = {
            6: 'E (Low)',
            5: 'A',
            4: 'D',
            3: 'G',
            2: 'B',
            1: 'E (High)'
        };
    }

    async startListening() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.analyser = this.audioContext.createAnalyser();
            this.microphone = this.audioContext.createMediaStreamSource(stream);
            
            this.analyser.fftSize = 4096;
            this.microphone.connect(this.analyser);
            this.dataArray = new Float32Array(this.analyser.frequencyBinCount);
            
            this.isListening = true;
            this.updateTuner();
            
        } catch (error) {
            console.error('Microphone access denied:', error);
            this.showTunerError('Microphone access required for tuning');
        }
    }

    stopListening() {
        this.isListening = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
    }

    updateTuner() {
        if (!this.isListening) return;
        
        this.analyser.getFloatTimeDomainData(this.dataArray);
        const frequency = this.detectPitch(this.dataArray, this.audioContext.sampleRate);
        
        if (frequency > 0) {
            this.displayTuningInfo(frequency);
        }
        
        this.animationId = requestAnimationFrame(() => this.updateTuner());
    }

    detectPitch(buffer, sampleRate) {
        // Auto-correlation pitch detection
        const bufferSize = buffer.length;
        let bestOffset = -1;
        let bestCorrelation = 0;
        let rms = 0;
        
        // Calculate RMS
        for (let i = 0; i < bufferSize; i++) {
            rms += buffer[i] * buffer[i];
        }
        rms = Math.sqrt(rms / bufferSize);
        
        if (rms < 0.01) return -1; // Too quiet
        
        let lastCorrelation = 1;
        for (let offset = 1; offset < bufferSize / 2; offset++) {
            let correlation = 0;
            
            for (let i = 0; i < bufferSize - offset; i++) {
                correlation += Math.abs(buffer[i] - buffer[i + offset]);
            }
            correlation = 1 - (correlation / (bufferSize - offset));
            
            if (correlation > 0.9 && correlation > lastCorrelation) {
                bestCorrelation = correlation;
                bestOffset = offset;
            }
            lastCorrelation = correlation;
        }
        
        if (bestCorrelation > 0.9) {
            return sampleRate / bestOffset;
        }
        return -1;
    }

    displayTuningInfo(frequency) {
        const stringInfo = this.findClosestString(frequency);
        const tunerDisplay = document.getElementById('tuner-display');
        const tunerNeedle = document.getElementById('tuner-needle');
        
        if (!tunerDisplay) return;
        
        tunerDisplay.innerHTML = `
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-2">${stringInfo.string}</h3>
                <p class="text-lg mb-2">${frequency.toFixed(1)} Hz</p>
                <p class="text-sm ${stringInfo.status === 'perfect' ? 'text-green-600' : 
                                   stringInfo.status === 'close' ? 'text-yellow-600' : 'text-red-600'}">
                    ${stringInfo.message}
                </p>
            </div>
        `;
        
        // Update needle position
        if (tunerNeedle) {
            const cents = this.frequencyToCents(frequency, stringInfo.targetFreq);
            const maxCents = 50; // ±50 cents range
            const position = Math.max(-1, Math.min(1, cents / maxCents));
            tunerNeedle.style.transform = `translateX(${position * 100}px) rotate(${position * 45}deg)`;
        }
    }

    findClosestString(frequency) {
        let closestString = 1;
        let smallestDiff = Infinity;
        
        for (const [string, targetFreq] of Object.entries(this.targetFrequencies)) {
            const diff = Math.abs(frequency - targetFreq);
            if (diff < smallestDiff) {
                smallestDiff = diff;
                closestString = parseInt(string);
            }
        }
        
        const targetFreq = this.targetFrequencies[closestString];
        const cents = this.frequencyToCents(frequency, targetFreq);
        
        let status, message;
        if (Math.abs(cents) < 5) {
            status = 'perfect';
            message = '🎯 Perfect!';
        } else if (Math.abs(cents) < 20) {
            status = 'close';
            message = cents > 0 ? '⬇️ Slightly high' : '⬆️ Slightly low';
        } else {
            status = 'off';
            message = cents > 0 ? '⬇️⬇️ Too high' : '⬆️⬆️ Too low';
        }
        
        return {
            string: this.stringNames[closestString],
            targetFreq,
            status,
            message
        };
    }

    frequencyToCents(frequency, targetFrequency) {
        return 1200 * Math.log2(frequency / targetFrequency);
    }

    showTunerError(message) {
        const tunerDisplay = document.getElementById('tuner-display');
        if (tunerDisplay) {
            tunerDisplay.innerHTML = `
                <div class="text-center text-red-600">
                    <p>❌ ${message}</p>
                </div>
            `;
        }
    }
}

function initializeGuitarTuner() {
    const tuner = new GuitarTuner();
    const startBtn = document.getElementById('tuner-start');
    const stopBtn = document.getElementById('tuner-stop');
    
    if (startBtn) {
        startBtn.addEventListener('click', async () => {
            await tuner.startListening();
            startBtn.classList.add('hidden');
            if (stopBtn) stopBtn.classList.remove('hidden');
        });
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', () => {
            tuner.stopListening();
            stopBtn.classList.add('hidden');
            if (startBtn) startBtn.classList.remove('hidden');
            
            const tunerDisplay = document.getElementById('tuner-display');
            if (tunerDisplay) {
                tunerDisplay.innerHTML = '<p class="text-gray-500">Click "Start Tuning" to begin</p>';
            }
        });
    }
}

// YouTube Tutors
function initializeYouTubeTutors() {
    const tutorContainer = document.getElementById('tutor-cards');
    if (!tutorContainer) return;
    
    tutors.forEach(tutor => {
        const card = document.createElement('div');
        card.className = 'content-card p-6 hover:shadow-lg transition-shadow';
        card.innerHTML = `
            <h3 class="text-xl font-semibold mb-2 text-blue-600">${tutor.name}</h3>
            <p class="text-gray-600 mb-4">${tutor.style}</p>
            <a href="https://www.youtube.com/playlist?list=${tutor.playlistId}" 
               target="_blank" 
               class="inline-block bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition-colors">
                🎥 Watch Lessons
            </a>
        `;
        tutorContainer.appendChild(card);
    });
}

// Chord Progressions
function initializeChordProgressions() {
    const generateBtn = document.getElementById('generate-progression-btn');
    const progressionDisplay = document.getElementById('progression-output');
    
    if (!generateBtn) return;
    
    generateBtn.addEventListener('click', async () => {
        const prompt = document.getElementById('progression-prompt')?.value || 'Generate a basic chord progression';
        
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        if (progressionDisplay) {
            progressionDisplay.innerHTML = `
                <div class="text-center">
                    <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                    <p class="text-gray-600">AI is creating your chord progression...</p>
                </div>
            `;
        }
        
        try {
            // Start a new conversation for each progression generation
            AIService.startNewConversation();
            const response = await AIService.generateResponse(
                `Create a guitar chord progression based on: "${prompt}". Return the progression as a simple text format with chord names and timing.`
            );
            
            if (progressionDisplay) {
                progressionDisplay.innerHTML = `
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-semibold mb-2">Your AI-Generated Progression:</h4>
                        <pre class="whitespace-pre-wrap text-sm">${response}</pre>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Progression generation error:', error);
            if (progressionDisplay) {
                progressionDisplay.innerHTML = `
                    <div class="text-red-500 text-center">
                        <p>❌ Could not generate progression</p>
                        <p class="text-sm mt-2">Please try again</p>
                    </div>
                `;
            }
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Progression';
        }
    });
}

// Utility Functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm transition-all duration-300 ${
        type === 'success' ? 'bg-green-100 border border-green-400 text-green-800' :
        type === 'error' ? 'bg-red-100 border border-red-400 text-red-800' :
        'bg-blue-100 border border-blue-400 text-blue-800'
    }`;
    
    notification.innerHTML = `
        <div class="flex items-start">
            <div class="flex-shrink-0">
                ${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}
            </div>
            <div class="ml-3">
                <p class="text-sm">${message}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-auto text-lg leading-none hover:opacity-70">
                ×
            </button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Error Handler
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// Console Welcome Message
console.log(`
🎸 Guitar Learning App Loaded Successfully!
🤖 AI-Powered Features: Ready
🎵 All Components: Initialized
🚀 Ready for your guitar journey!
`);
