/**
 * Playfair Cipher Interactive Tool
 * Core logic for matrix generation, cryptographic transforms, and UI state management.
 */

let encryptTutorState = null;
let decryptTutorState = null;

// Navigation state management
function switchTab(tab) {
    document.getElementById('panel-encrypt').style.display = (tab === 'encrypt') ? 'block' : 'none';
    document.getElementById('panel-decrypt').style.display = (tab === 'decrypt') ? 'block' : 'none';
    document.getElementById('tab-btn-encrypt').classList.toggle('active', tab === 'encrypt');
    document.getElementById('tab-btn-decrypt').classList.toggle('active', tab === 'decrypt');

    // FIX: Tiny timeout ensures the panel is visible so the grid can calculate dimensions properly
    setTimeout(() => {
        if (tab === 'encrypt') updateGridEncrypt();
        if (tab === 'decrypt') updateGridDecrypt();
    }, 10);
}

// Matrix construction logic
function generateMatrix(keyword) {
    let kw = keyword.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let matrix = [];
    for (let c of kw) if (!matrix.includes(c)) matrix.push(c);
    let alpha = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    for (let c of alpha) if (!matrix.includes(c)) matrix.push(c);
    return matrix;
}

function renderGrid(matrix, gridId, noteId, kw) {
    const grid = document.getElementById(gridId);
    // Render matrix cells to DOM
    grid.innerHTML = matrix.map(c => {
        if (c === 'I') {
            return `<div class="grid-cell grid-cell-ij" data-char="I">I / J</div>`;
        }
        return `<div class="grid-cell" data-char="${c}">${c}</div>`;
    }).join('');
    
    // Generate technical explanation for UI display
    let upperKw = kw.toUpperCase();
    let cleanKw = upperKw.replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let unique = "";
    let duplicatesFound = [];

    // Identify character frequency and duplicates
    for (let c of cleanKw) {
        if (!unique.includes(c)) {
            unique += c;
        } else {
            if (!duplicatesFound.includes(c)) {
                duplicatesFound.push(c);
            }
        }
    }

    let explanation = `<strong>🤖 Tutor: Welcome to the Playfair Cipher!</strong><br><br>`;
    
    // Rule set explanation strings
    explanation += `1. <strong>The Pairing Rule:</strong> Most ciphers change one letter at a time. Playfair is special because it encrypts <strong>pairs of letters</strong> (digraphs). This is why we need a grid; we use the positions of two letters to find their secret partners.<br>`;

    explanation += `2. <strong>The 5x5 Rule:</strong> A Playfair grid has 25 cells, but the alphabet has 26 letters. To make it fit, <strong>'I' and 'J' share the same cell</strong>. We treat every 'J' as an 'I'.<br>`;

    if (upperKw !== cleanKw) {
        explanation += `3. <strong>Cleaning:</strong> I've simplified your keyword "${upperKw}" to <strong>"${cleanKw}"</strong> by removing spaces/symbols and applying the I/J rule.<br>`;
    } else {
        explanation += `3. <strong>Cleaning:</strong> "${upperKw}" is already clean! It has no spaces or 'J's to worry about.<br>`;
    }

    if (duplicatesFound.length > 0) {
        explanation += `4. <strong>Unique Letters:</strong> Each letter can only appear once in a grid. I found that <strong>${duplicatesFound.join(', ')}</strong> appeared more than once, so I kept only the first occurrence.<br>`;
        explanation += `   * We start our grid with: <strong>${unique}</strong>.<br>`;
    } else {
        explanation += `4. <strong>Unique Letters:</strong> "${cleanKw}" has no repeating letters, so we use the whole word to start the grid!<br>`;
    }

    explanation += `5. <strong>Filling the rest:</strong> We place <strong>${unique}</strong> into the first squares, then fill the remaining ${25 - unique.length} spots with the rest of the alphabet in order.<br><br>`;

    // Historical context (JFK Story)
    explanation += `
        <div style="margin-top: 15px; padding: 12px; background-color: #e0f2fe; border-left: 4px solid #3b82f6; border-radius: 4px; font-size: 0.95em; color: #1e3a8a;">
            <strong>🕵️‍♂️ Did You Know?</strong><br>
            Even though it was invented in 1854, the Playfair cipher was heavily used by Allied forces in World War II. It was perfect for frontline combat because it didn't require any bulky machines—just a pencil, paper, and a shared keyword. 
            <br><br>
            <em>Fun Fact:</em> When future US President John F. Kennedy's PT-109 boat was sunk in 1943, an Australian coastwatcher used the Playfair cipher to send the secret message that led to the rescue of JFK and his surviving crew!
        </div>
    `;

    document.getElementById(noteId).innerHTML = explanation;
}

function updateGridEncrypt() {
    const kw = document.getElementById('keyword-encrypt').value;
    renderGrid(generateMatrix(kw), 'cipher-grid-encrypt', 'grid-explanation-encrypt', kw);
}

function updateGridDecrypt() {
    const kw = document.getElementById('keyword-decrypt').value;
    renderGrid(generateMatrix(kw), 'cipher-grid-decrypt', 'grid-explanation-decrypt', kw);
}

// Preset data loading logic
function loadSelectedExample(type) {
    const select = document.getElementById(`${type}-examples`);
    const val = select.value;
    const kwInput = document.getElementById(`keyword-${type}`);
    const msgInput = document.getElementById(type === 'encrypt' ? 'plaintext' : 'ciphertext');

    if (!val) {
        kwInput.value = "";
        msgInput.value = "";
        return;
    }

    if (type === 'encrypt') {
        if (val === 'ex1') {
            kwInput.value = "PLAYFAIR";
            msgInput.value = "HIDE THE GOLD IN THE TREE STUMP BEFORE THEY ARRIVE";
        } else if (val === 'ex2') {
            kwInput.value = "SECURITY";
            msgInput.value = "SEND ALL TROOPS TO THE NORTHERN FRONT AT DAWN DO NOT RETREAT";
        } else if (val === 'ex3') {
            kwInput.value = "AIRCRAFT";
            msgInput.value = "THE MISSILE WILL ARRIVE AT THE AIRPORT AT NOON TOMORROW";
        }
        if (typeof updateGridEncrypt === "function") updateGridEncrypt();

    } else {
        if (val === 'ex1') {
            // Encrypting "HIDE THE GOLD IN THE TREE STUMP" with key PLAYFAIR
            kwInput.value = "PLAYFAIR";
            msgInput.value = "EB IM QM GH VR IR ON KG OD KU KN NZ EF";
        } else if (val === 'ex2') {
            kwInput.value = "DISCOVERY";
            msgInput.value = "ME LS XB RI YI YR XD VE YU";
        } else if (val === 'ex3') {
            kwInput.value = "WILDERNESS";
            msgInput.value = "BR BS IQ SA FD OG BA PZ";
        }
        if (typeof updateGridDecrypt === "function") updateGridDecrypt();
    }
}

// Initialization for step-by-step walkthrough mode
function initializeStepMode(type) {
    const isEnc = type === 'encrypt';
    
    // Retrieve DOM elements for state locking
    const kwInput = document.getElementById(`keyword-${type}`);
    const exampleSelect = document.getElementById(`${type}-examples`);
    const messageBox = document.getElementById(isEnc ? 'plaintext' : 'ciphertext');
    
    const kw = kwInput.value;
    const rawTxt = messageBox.value;
    
    // Sanitize input: Uppercase, filter non-alpha, merge J/I
    const txt = rawTxt.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    
    // Prevent execution on empty inputs
    if (!kw || !txt) {
        alert("Please enter both a Keyword and a Message first!");
        return;
    }

    // Lock inputs to maintain consistency during processing
    kwInput.disabled = true;
    exampleSelect.disabled = true;
    messageBox.disabled = true;

    // UI transition: update visibility of instruction panels
    const gridExplId = isEnc ? 'grid-explanation-encrypt' : 'grid-explanation-decrypt';
    document.getElementById(gridExplId).classList.add('hidden');
    
    document.getElementById(`tutor-left-${type}`).style.display = 'block';
    
    let pTxt = "";
    let explanation = "<strong>🤖 Tutor: Let's prepare your text!</strong><br><br>";
    explanation += "Playfair is like a map; it needs two different locations to find a result. Here is how I'm pairing your letters:<br>";

    // Digraph preparation and padding logic
    let xPositions = {}; // charIndex in pTxt → reason string
    if (isEnc) {
        let i = 0;
        let doublesCount = 0;
        let paddingAdded = false;

        while (i < txt.length) {
            let a = txt[i];
            let b = txt[i + 1];
            pTxt += a;

            // Handle identical adjacent characters (Double Letter Rule)
            if (b && a === b) {
                xPositions[pTxt.length] = `double-letter: "${a}${a}" → "${a}X" + "${a}…"`;
                pTxt += 'X';
                doublesCount++;
                explanation += `- <strong>The Double Letter Rule:</strong> I found <strong>${a}${b}</strong>. In Playfair, we can't encrypt two identical letters together because they occupy the exact same spot on the grid, which breaks our rules of movement! I've inserted an <strong>'X'</strong> as a 'wedge' to separate them into <strong>${a}X</strong>.<br>`;
                i++;
            }
            // Handle standard digraphs
            else if (b) {
                pTxt += b;
                i += 2;
            }
            // Handle terminal character padding
            else {
                xPositions[pTxt.length] = `padding: "${a}" was the last letter, needs a partner`;
                pTxt += 'X';
                paddingAdded = true;
                explanation += `- <strong>The Padding Rule:</strong> Your message ended with a lonely <strong>${a}</strong>. Because the grid requires pairs to function, I added an <strong>'X'</strong> as a partner so we have a complete pair for the grid.<br>`;
                i++;
            }
        }

        if (doublesCount === 0 && !paddingAdded) {
            explanation += "- <strong>Perfect Pairs:</strong> Your message didn't have any double letters or odd lengths, so no 'X' fillers were needed!<br>";
        }

        const prepNote = document.getElementById('tutor-text-prep-note');
        prepNote.innerHTML = explanation;
        prepNote.classList.remove('hidden');
    } else {
        // Decryption initialization
        pTxt = txt;
        document.getElementById('tutor-pair-note-decrypt').innerHTML = "<strong>🤖 Tutor:</strong> Ciphertext is already in pairs. Let's start the decryption geometry!";
    }
    
    // Initialize procedural state object
    let state = {
        matrix: generateMatrix(kw),
        pairs: pTxt.match(/.{1,2}/g),
        index: 0,
        res: "",
        xPositions: isEnc ? xPositions : {}
    };
    
    if (isEnc) encryptTutorState = state; else decryptTutorState = state;
    
    // Synchronize visual highlights
    updatePreparedTextHighlight(type);
    
    // Reset output display
    document.getElementById(`${type}-output`).innerText = "...";
    const pairNote = document.getElementById(`tutor-pair-note-${type}`);
    if (pairNote) pairNote.innerHTML = "Ready! Click 'Process Next Pair'.";
}

// Remove X separators and padding inserted during encryption
function cleanDecryptedText(text) {
    let cleaned = text.replace(/([A-Z])X\1/g, '$1$1'); // X between identical letters was a separator
    cleaned = cleaned.replace(/X$/, '');                // trailing X was padding
    return cleaned;
}

// Procedural logic for individual digraph transforms
function processPairTutor(type) {
    let state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;

    // UI Cleanup: transition from preparation to processing
    const prepNote = document.getElementById('tutor-text-prep-note');
    if (prepNote) {
        prepNote.classList.add('hidden');
    }

    // Verify processing completion
    if (state.index >= state.pairs.length) {
        document.getElementById(`tutor-pair-note-${type}`).innerHTML = "<strong>🤖 Tutor:</strong> We've reached the end! Great work.";
        return;
    }

    // Update active pair highlight
    updatePreparedTextHighlight(type);

    const pair = state.pairs[state.index];
    const m = state.matrix;
    
    // Character coordinate lookup helper
    const getC = (char) => {
        let idx = m.indexOf(char);
        return { r: Math.floor(idx / 5), c: idx % 5 };
    };

    const p1 = getC(pair[0]);
    const p2 = getC(pair[1]);
    
    // Determine shift direction based on mode
    const shift = type === 'encrypt' ? 1 : -1;

    let r1, r2, ruleTitle, ruleDesc;

    // Apply geometric transformation rules
    if (p1.r === p2.r) {
        // Linear shift: Same Row
        ruleTitle = "The Row Shift Rule";
        r1 = m[p1.r * 5 + (p1.c + shift + 5) % 5];
        r2 = m[p2.r * 5 + (p2.c + shift + 5) % 5];
        ruleDesc = `Both letters are in the same horizontal row. <br>
                    We slide each letter one space to the <strong>${type === 'encrypt' ? 'RIGHT' : 'LEFT'}</strong>. 
                    If a letter is at the edge, it wraps around to the start of the row.`;
    } 
    else if (p1.c === p2.c) {
        // Linear shift: Same Column
        ruleTitle = "The Column Shift Rule";
        r1 = m[((p1.r + shift + 5) % 5) * 5 + p1.c];
        r2 = m[((p2.r + shift + 5) % 5) * 5 + p2.c];
        ruleDesc = `Both letters are in the same vertical column. <br>
                    We slide each letter one space <strong>${type === 'encrypt' ? 'DOWN' : 'UP'}</strong>. 
                    If a letter is at the edge, it wraps around to the top/bottom.`;
    } 
    else {
        // Rectangle transform: Corner Swap
        ruleTitle = "The Rectangle (Corner Swap) Rule";
        
        r1 = m[p1.r * 5 + p2.c];
        r2 = m[p2.r * 5 + p1.c];
        
        ruleDesc = `<strong>'${pair[0]}'</strong> and <strong>'${pair[1]}'</strong> form a rectangle.<br>
                    1. Look at <strong>'${pair[0]}'</strong>. Move across its row to the column of the other letter to find <strong>'${r1}'</strong>.<br>
                    2. Look at <strong>'${pair[1]}'</strong>. Move across its row to the column of the first letter to find <strong>'${r2}'</strong>.`;
    }

    // Grid cell visualization
    highlightGrid(type, pair[0], pair[1], r1, r2);

    // Persist transformation result and advance state
    state.res += (r1 + r2);
    state.index++;

    // Refresh UI output
    const rawFormatted = state.res.match(/.{1,2}/g).join(' ');
    if (type === 'decrypt' && state.index >= state.pairs.length) {
        const cleaned = cleanDecryptedText(state.res);
        const cleanedFormatted = (cleaned.match(/.{1,2}/g) || [cleaned]).join(' ');
        document.getElementById('decrypt-output').innerHTML =
            `<div>${rawFormatted}</div>` +
            `<div class="cleaned-output-note">` +
            `<strong>✓ Cleaned:</strong> ${cleanedFormatted}` +
            `<em> (X separators &amp; padding removed)</em></div>`;
    } else {
        document.getElementById(`${type}-output`).innerText = rawFormatted;
    }
    
    document.getElementById(`tutor-pair-note-${type}`).innerHTML = `
        <strong>🤖 Tutor: Processing '${pair}'</strong><br>
        <span style="color: #d35400;"><strong>Rule:</strong> ${ruleTitle}</span><br>
        ${ruleDesc}<br><br>
        <strong>Result:</strong> ${pair} becomes <strong>${r1}${r2}</strong>.
    `;
}

// Mathematical function to draw SVG arrows with a "clearance" offset
function drawArrow(type, startChar, endChar) {
    const grid = document.getElementById(`cipher-grid-${type}`);
    const canvas = document.getElementById(`arrow-canvas-${type}`);
    const startCell = grid.querySelector(`[data-char="${startChar}"]`);
    const endCell = grid.querySelector(`[data-char="${endChar}"]`);

    if (!startCell || !endCell || !canvas) return;

    const gridRect = grid.getBoundingClientRect();
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();

    // Initial center points
    const x1 = startRect.left - gridRect.left + (startRect.width / 2);
    const y1 = startRect.top - gridRect.top + (startRect.height / 2);
    const x2 = endRect.left - gridRect.left + (endRect.width / 2);
    const y2 = endRect.top - gridRect.top + (endRect.height / 2);

    // Calculate angle and offset to keep the center of the cell clear
    const dx = x2 - x1;
    const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const backOff = 18; // Pixels to pull back from the center to see the letter

    const nx1 = x1 + Math.cos(angle) * backOff;
    const ny1 = y1 + Math.sin(angle) * backOff;
    const nx2 = x2 - Math.cos(angle) * (backOff + 5); // Slightly more back-off for the arrowhead
    const ny2 = y2 - Math.sin(angle) * (backOff + 5);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", nx1); 
    line.setAttribute("y1", ny1);
    line.setAttribute("x2", nx2); 
    line.setAttribute("y2", ny2);
    line.setAttribute("class", "arrow-line");
    line.setAttribute("marker-end", `url(#${type === 'encrypt' ? 'arrowhead' : 'arrowhead-dec'})`);

    canvas.appendChild(line);
}

// CSS class management for grid highlighting and drawing arrows
function highlightGrid(type, in1, in2, out1, out2) {
    const gridId = type === 'encrypt' ? 'cipher-grid-encrypt' : 'cipher-grid-decrypt';
    const grid = document.getElementById(gridId);
    const canvas = document.getElementById(`arrow-canvas-${type}`);
    
    // Clear existing highlight states
    const cells = grid.querySelectorAll('.grid-cell');
    cells.forEach(c => c.classList.remove('active-in', 'active-out'));

    // Clear existing arrows from previous step
    canvas.querySelectorAll('.arrow-line').forEach(line => line.remove());

    // Apply active input and output styles
    grid.querySelector(`[data-char="${in1}"]`).classList.add('active-in');
    grid.querySelector(`[data-char="${in2}"]`).classList.add('active-in');
    grid.querySelector(`[data-char="${out1}"]`).classList.add('active-out');
    grid.querySelector(`[data-char="${out2}"]`).classList.add('active-out');

    // Draw the new directional arrows
    drawArrow(type, in1, out1);
    drawArrow(type, in2, out2);
}

// Procedural text visualization logic
function updatePreparedTextHighlight(type) {
    let state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;

    const displayBox = document.getElementById(`prepared-text-${type}`);
    const xPos = state.xPositions || {};

    const renderChar = (ch, charIdx) => {
        if (xPos[charIdx] !== undefined) {
            return `<span class="x-badge" title="Inserted X — ${xPos[charIdx]}">X</span>`;
        }
        return ch;
    };

    const renderPairHTML = (pair, pairIdx) => {
        const base = pairIdx * 2;
        return renderChar(pair[0], base) + (pair[1] ? renderChar(pair[1], base + 1) : '');
    };

    // Map processed, active, and pending digraphs to visual states
    const highlightedHTML = state.pairs.map((pair, i) => {
        const pairHTML = renderPairHTML(pair, i);
        if (i < state.index) {
            return `<span class="processed-pair">${pairHTML}</span>`;
        } else if (i === state.index) {
            return `<span class="current-pair">${pairHTML}</span>`;
        } else {
            return pairHTML;
        }
    }).join(' ');

    displayBox.innerHTML = highlightedHTML;
}

// UI and state reset logic
function resetTutor(type) {
    const isEnc = type === 'encrypt';
    
    const kwInput = document.getElementById(`keyword-${type}`);
    const exampleSelect = document.getElementById(`${type}-examples`);
    const messageBox = document.getElementById(isEnc ? 'plaintext' : 'ciphertext');

    // Restore input accessibility
    kwInput.disabled = false;
    exampleSelect.disabled = false;
    messageBox.disabled = false;
    
    // Clear UI content
    messageBox.value = "";
    kwInput.value = "";          
    exampleSelect.value = "";   
    document.getElementById(`${type}-output`).innerText = "...";
    document.getElementById(`prepared-text-${type}`).innerText = "...";
    
    const pairNote = document.getElementById(`tutor-pair-note-${type}`);
    if (pairNote) pairNote.innerHTML = "";
    
    const prepNote = document.getElementById('tutor-text-prep-note');
    if (isEnc && prepNote) {
        prepNote.innerHTML = "";
        prepNote.classList.add('hidden');
    }
    
    // Restore initial visibility states
    document.getElementById(`tutor-left-${type}`).style.display = 'none';
    const gridExplId = isEnc ? 'grid-explanation-encrypt' : 'grid-explanation-decrypt';
    document.getElementById(gridExplId).classList.remove('hidden');

    // Nullify session state
    if (isEnc) {
        encryptTutorState = null;
    } else {
        decryptTutorState = null;
    }
    
    // Reset grid visualization
    const gridId = isEnc ? 'cipher-grid-encrypt' : 'cipher-grid-decrypt';
    const cells = document.getElementById(gridId).querySelectorAll('.grid-cell');
    cells.forEach(c => c.classList.remove('active-in', 'active-out'));

    console.log(`🤖 Tutor: ${type} mode reset successfully!`);

    // Clear arrows
    document.getElementById(`arrow-canvas-${type}`).innerHTML = document.getElementById(`arrow-canvas-${type}`).innerHTML.replace(/<line.*<\/line>/g, '');
}

function clearDropdown(type) {
    document.getElementById(`${type}-examples`).value = "";
}

// Global initialization on page load
window.onload = () => { 
    updateGridEncrypt(); 
    updateGridDecrypt(); 
    openModal(); 
};

// Modal interface logic
function openModal() {
    document.getElementById('help-modal').classList.remove('hidden');
    window.tourCompleted = false; 
}

function closeModal() {
    document.getElementById('help-modal').classList.add('hidden');
    
    // Trigger onboarding tour on first modal closure
    if (!window.tourCompleted) {
        startTour();
        window.tourCompleted = true; 
    }
}

// Modal backdrop click-to-close listener
window.addEventListener('click', (e) => {
    const modal = document.getElementById('help-modal');
    if (e.target === modal) {
        closeModal();
    }
});

// Guided Onboarding logic
let currentTourStep = 0;
const tourSteps = [
    { 
        targetId: 'keyword-encrypt', 
        text: "🎯 <strong>Step 1: The Keyword</strong><br>Pick a word to shape your secret grid! You can type a new one or just leave it as 'PLAYFAIR'.",
        position: 'bottom'
    },
    { 
        targetId: 'plaintext', 
        text: "✍️ <strong>Step 2: The Message</strong><br>Type or paste your own secret text here, or choose from the 'Quick Examples' above.",
        position: 'bottom'
    },
    { 
        targetId: 'start-btn-encrypt', 
        text: "🚀 <strong>Step 3: Begin!</strong><br>Click here when you are ready. I will walk you through the encryption step-by-step.",
        position: 'top'
    }
];

function startTour() {
    document.getElementById('tour-overlay').classList.remove('hidden');
    document.getElementById('tour-tooltip').classList.remove('hidden');
    currentTourStep = 0;
    
    // Default to encryption tab for tour context
    switchTab('encrypt');
    showTourStep();
}

function showTourStep() {
    // Clear existing highlights
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    
    if (currentTourStep >= tourSteps.length) {
        endTour();
        return;
    }

    const step = tourSteps[currentTourStep];
    const target = document.getElementById(step.targetId);
    const tooltip = document.getElementById('tour-tooltip');
    const arrow = document.getElementById('tour-arrow');
    
    target.classList.add('tour-highlight');
    document.getElementById('tour-text').innerHTML = step.text;
    
    // Tooltip coordinate calculation
    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    if (step.position === 'bottom') {
        tooltip.style.top = (rect.bottom + scrollY + 15) + "px";
        tooltip.style.left = (rect.left + scrollX + (rect.width/2) - 150) + "px"; 
        arrow.className = 'tour-arrow bottom';
    } else if (step.position === 'top') {
        tooltip.style.top = (rect.top + scrollY - tooltip.offsetHeight - 15) + "px";
        tooltip.style.left = (rect.left + scrollX + (rect.width/2) - 150) + "px";
        arrow.className = 'tour-arrow top';
    }

    // Toggle button label on terminal step
    if (currentTourStep === tourSteps.length - 1) {
        document.getElementById('tour-next-btn').innerText = "Finish";
    } else {
        document.getElementById('tour-next-btn').innerText = "Next ➔";
    }
}

function nextTourStep() {
    currentTourStep++;
    showTourStep();
}

function endTour() {
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    document.getElementById('tour-overlay').classList.add('hidden');
    document.getElementById('tour-tooltip').classList.add('hidden');
}