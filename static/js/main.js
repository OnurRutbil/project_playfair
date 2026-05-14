let encryptTutorState = null;
let decryptTutorState = null;

function switchTab(tab) {
    document.getElementById('panel-encrypt').style.display = (tab === 'encrypt') ? 'block' : 'none';
    document.getElementById('panel-decrypt').style.display = (tab === 'decrypt') ? 'block' : 'none';
    document.getElementById('tab-btn-encrypt').classList.toggle('active', tab === 'encrypt');
    document.getElementById('tab-btn-decrypt').classList.toggle('active', tab === 'decrypt');
    setTimeout(() => {
        if (tab === 'encrypt') updateGridEncrypt();
        if (tab === 'decrypt') updateGridDecrypt();
    }, 10);
}

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
    grid.innerHTML = matrix.map(c => {
        if (c === 'I') return `<div class="grid-cell grid-cell-ij" data-char="I">I / J</div>`;
        return `<div class="grid-cell" data-char="${c}">${c}</div>`;
    }).join('');

    let upperKw = kw.toUpperCase();
    let cleanKw = upperKw.replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let unique = "";
    let duplicatesFound = [];
    for (let c of cleanKw) {
        if (!unique.includes(c)) unique += c;
        else if (!duplicatesFound.includes(c)) duplicatesFound.push(c);
    }

    let explanation = `<strong>🤖 Tutor: Welcome to the Playfair Cipher!</strong><br><br>`;
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
    const kw = document.getElementById('keyword-encrypt').value || 'PLAYFAIR';
    renderGrid(generateMatrix(kw), 'cipher-grid-encrypt', 'grid-explanation-encrypt', kw);
}

function updateGridDecrypt() {
    const kw = document.getElementById('keyword-decrypt').value || 'PLAYFAIR';
    renderGrid(generateMatrix(kw), 'cipher-grid-decrypt', 'grid-explanation-decrypt', kw);
}

function loadSelectedExample(type) {
    const select = document.getElementById(`${type}-examples`);
    const val = select.value;
    const kwInput = document.getElementById(`keyword-${type}`);
    const msgInput = document.getElementById(type === 'encrypt' ? 'plaintext' : 'ciphertext');

    if (!val) {
        msgInput.value = "";
        return;
    }

    if (type === 'encrypt') {
        if (val === 'ex1') { kwInput.value = "PLAYFAIR"; msgInput.value = "HIDE THE GOLD IN THE TREE STUMP BEFORE THEY ARRIVE"; }
        else if (val === 'ex2') { kwInput.value = "SECURITY"; msgInput.value = "SEND ALL TROOPS TO THE NORTHERN FRONT AT DAWN DO NOT RETREAT"; }
        else if (val === 'ex3') { kwInput.value = "AIRCRAFT"; msgInput.value = "THE MISSILE WILL ARRIVE AT THE AIRPORT AT NOON TOMORROW"; }
        updateGridEncrypt();
    } else {
        if (val === 'ex1') { kwInput.value = "PLAYFAIR"; msgInput.value = "EB IM QM GH VR IR ON KG OD KU KN NZ EF"; }
        else if (val === 'ex2') { kwInput.value = "DISCOVERY"; msgInput.value = "ME LS XB RI YI YR XD VE YU"; }
        else if (val === 'ex3') { kwInput.value = "WILDERNESS"; msgInput.value = "BR BS IQ SA FD OG BA PZ"; }
        updateGridDecrypt();
    }
}

function initializeStepMode(type) {
    const isEnc = type === 'encrypt';
    const kwInput = document.getElementById(`keyword-${type}`);
    const exampleSelect = document.getElementById(`${type}-examples`);
    const messageBox = document.getElementById(isEnc ? 'plaintext' : 'ciphertext');

    const kw = kwInput.value;
    const rawTxt = messageBox.value;
    const txt = rawTxt.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');

    if (!kw || !txt) {
        alert("Please enter both a Keyword and a Message first!");
        return;
    }

    kwInput.disabled = true;
    exampleSelect.disabled = true;
    messageBox.disabled = true;

    document.getElementById(isEnc ? 'grid-explanation-encrypt' : 'grid-explanation-decrypt').classList.add('hidden');
    document.getElementById(`tutor-left-${type}`).style.display = 'block';

    const copyBtns = document.getElementById(`copy-btns-${type}`);
    if (copyBtns) copyBtns.classList.add('hidden');

    let pTxt = "";
    let xPositions = {};

    if (isEnc) {
        let explanation = "<strong>🤖 Tutor: Let's prepare your text!</strong><br><br>";
        explanation += "Playfair is like a map; it needs two different locations to find a result. Here is how I'm pairing your letters:<br>";
        let i = 0;
        let doublesCount = 0;
        let paddingAdded = false;

        while (i < txt.length) {
            let a = txt[i];
            let b = txt[i + 1];
            pTxt += a;
            if (b && a === b) {
                xPositions[pTxt.length] = `double-letter: "${a}${a}" → "${a}X" + "${a}…"`;
                pTxt += 'X';
                doublesCount++;
                explanation += `- <strong>The Double Letter Rule:</strong> I found <strong>${a}${b}</strong>. In Playfair, we can't encrypt two identical letters together because they occupy the exact same spot on the grid, which breaks our rules of movement! I've inserted an <strong>'X'</strong> as a 'wedge' to separate them into <strong>${a}X</strong>.<br>`;
                i++;
            } else if (b) {
                pTxt += b;
                i += 2;
            } else {
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
        pTxt = txt;
        document.getElementById('tutor-pair-note-decrypt').innerHTML = "<strong>🤖 Tutor:</strong> Ciphertext is already in pairs. Let's start the decryption geometry!";
    }

    const state = {
        matrix: generateMatrix(kw),
        pairs: pTxt.match(/.{1,2}/g),
        index: 0,
        res: "",
        xPositions: isEnc ? xPositions : {}
    };

    if (isEnc) encryptTutorState = state; else decryptTutorState = state;

    updatePreparedTextHighlight(type);
    document.getElementById(`${type}-output`).innerText = "...";
    const pairNote = document.getElementById(`tutor-pair-note-${type}`);
    if (pairNote) pairNote.innerHTML = "Ready! Click 'Process Next Pair'.";
}

function cleanDecryptedText(text) {
    let cleaned = text.replace(/([A-Z])X\1/g, '$1$1');
    cleaned = cleaned.replace(/X$/, '');
    return cleaned;
}

// Pure computation of a pair's cipher result — no DOM side effects
function computePairResult(matrix, pair, type) {
    const getC = (char) => { let idx = matrix.indexOf(char); return { r: Math.floor(idx / 5), c: idx % 5 }; };
    const p1 = getC(pair[0]);
    const p2 = getC(pair[1]);
    const shift = type === 'encrypt' ? 1 : -1;
    let r1, r2;
    if (p1.r === p2.r) {
        r1 = matrix[p1.r * 5 + (p1.c + shift + 5) % 5];
        r2 = matrix[p2.r * 5 + (p2.c + shift + 5) % 5];
    } else if (p1.c === p2.c) {
        r1 = matrix[((p1.r + shift + 5) % 5) * 5 + p1.c];
        r2 = matrix[((p2.r + shift + 5) % 5) * 5 + p2.c];
    } else {
        r1 = matrix[p1.r * 5 + p2.c];
        r2 = matrix[p2.r * 5 + p1.c];
    }
    return { r1, r2 };
}

// Recompute state.res from scratch up to state.index
function recomputeResult(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;
    state.res = "";
    for (let i = 0; i < state.index; i++) {
        const { r1, r2 } = computePairResult(state.matrix, state.pairs[i], type);
        state.res += r1 + r2;
    }
}

// Refresh the output box from current state (handles both partial and complete results)
function refreshOutputDisplay(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;
    const outputEl = document.getElementById(`${type}-output`);
    if (state.res === "") { outputEl.innerText = "..."; return; }
    const rawFormatted = state.res.match(/.{1,2}/g).join(' ');
    if (type === 'decrypt' && state.index >= state.pairs.length) {
        const cleaned = cleanDecryptedText(state.res);
        const cleanedFormatted = (cleaned.match(/.{1,2}/g) || [cleaned]).join(' ');
        outputEl.innerHTML = `<div>${rawFormatted}</div>` +
            `<div class="cleaned-output-note"><strong>✓ Cleaned:</strong> ${cleanedFormatted}` +
            `<em> (X separators &amp; padding removed)</em></div>`;
    } else {
        outputEl.innerText = rawFormatted;
    }
}

function updateCopyButtons(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    const div = document.getElementById(`copy-btns-${type}`);
    if (!div) return;
    if (state && state.res && state.res.length > 0) div.classList.remove('hidden');
    else div.classList.add('hidden');
}

function clearGridHighlights(type) {
    document.getElementById(type === 'encrypt' ? 'cipher-grid-encrypt' : 'cipher-grid-decrypt')
        .querySelectorAll('.grid-cell').forEach(c => c.classList.remove('active-in', 'active-out'));
    document.getElementById(`arrow-canvas-${type}`).querySelectorAll('.arrow-line').forEach(l => l.remove());
}

// Go back one pair — or open the tutorial if already at the start
function goBackPair(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;

    if (state.index === 0) { openModal(); return; }

    state.index--;
    recomputeResult(type);
    refreshOutputDisplay(type);
    updatePreparedTextHighlight(type);
    updateCopyButtons(type);
    clearGridHighlights(type);

    if (state.index > 0) {
        const prev = state.pairs[state.index - 1];
        const { r1, r2 } = computePairResult(state.matrix, prev, type);
        highlightGrid(type, prev[0], prev[1], r1, r2);
    }

    const pairNote = document.getElementById(`tutor-pair-note-${type}`);
    if (state.index === 0) {
        if (type === 'encrypt') {
            const prepNote = document.getElementById('tutor-text-prep-note');
            if (prepNote) prepNote.classList.remove('hidden');
        }
        if (pairNote) pairNote.innerHTML = "Ready! Click 'Process Next Pair'.";
    } else {
        const cur = state.pairs[state.index];
        if (pairNote) pairNote.innerHTML = `<strong>🤖 Tutor:</strong> Went back! Next to process: <strong>'${cur}'</strong>.`;
    }
}

// Jump to any earlier pair by clicking it in the prepared-text display
function jumpToPair(type, pairIndex) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;

    state.index = pairIndex;
    recomputeResult(type);
    refreshOutputDisplay(type);
    updatePreparedTextHighlight(type);
    updateCopyButtons(type);
    clearGridHighlights(type);

    if (pairIndex > 0) {
        const prev = state.pairs[pairIndex - 1];
        const { r1, r2 } = computePairResult(state.matrix, prev, type);
        highlightGrid(type, prev[0], prev[1], r1, r2);
    }

    const pairNote = document.getElementById(`tutor-pair-note-${type}`);
    if (pairIndex === 0) {
        if (type === 'encrypt') {
            const prepNote = document.getElementById('tutor-text-prep-note');
            if (prepNote) prepNote.classList.remove('hidden');
        }
        if (pairNote) pairNote.innerHTML = "Ready! Click 'Process Next Pair'.";
    } else {
        const cur = state.pairs[pairIndex];
        if (pairNote) pairNote.innerHTML = `<strong>🤖 Tutor:</strong> Jumped back! Next to process: <strong>'${cur}'</strong>. Click 'Process Next Pair' to continue.`;
    }
}

function processPairTutor(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;

    const prepNote = document.getElementById('tutor-text-prep-note');
    if (prepNote) prepNote.classList.add('hidden');

    if (state.index >= state.pairs.length) {
        document.getElementById(`tutor-pair-note-${type}`).innerHTML = "<strong>🤖 Tutor:</strong> We've reached the end! Great work.";
        updateCopyButtons(type);
        return;
    }

    const pair = state.pairs[state.index];
    const m = state.matrix;
    const { r1, r2 } = computePairResult(m, pair, type);

    const getC = (char) => { let idx = m.indexOf(char); return { r: Math.floor(idx / 5), c: idx % 5 }; };
    const p1 = getC(pair[0]);
    const p2 = getC(pair[1]);

    let ruleTitle, ruleDesc;
    if (p1.r === p2.r) {
        ruleTitle = "The Row Shift Rule";
        ruleDesc = `Both letters are in the same horizontal row. <br>We slide each letter one space to the <strong>${type === 'encrypt' ? 'RIGHT' : 'LEFT'}</strong>. If a letter is at the edge, it wraps around to the start of the row.`;
    } else if (p1.c === p2.c) {
        ruleTitle = "The Column Shift Rule";
        ruleDesc = `Both letters are in the same vertical column. <br>We slide each letter one space <strong>${type === 'encrypt' ? 'DOWN' : 'UP'}</strong>. If a letter is at the edge, it wraps around to the top/bottom.`;
    } else {
        ruleTitle = "The Rectangle (Corner Swap) Rule";
        ruleDesc = `<strong>'${pair[0]}'</strong> and <strong>'${pair[1]}'</strong> form a rectangle.<br>
                    1. Look at <strong>'${pair[0]}'</strong>. Move across its row to the column of the other letter to find <strong>'${r1}'</strong>.<br>
                    2. Look at <strong>'${pair[1]}'</strong>. Move across its row to the column of the first letter to find <strong>'${r2}'</strong>.`;
    }

    highlightGrid(type, pair[0], pair[1], r1, r2);
    state.res += (r1 + r2);
    state.index++;

    refreshOutputDisplay(type);
    updatePreparedTextHighlight(type);
    updateCopyButtons(type);

    document.getElementById(`tutor-pair-note-${type}`).innerHTML = `
        <strong>🤖 Tutor: Processing '${pair}'</strong><br>
        <span style="color: #d35400;"><strong>Rule:</strong> ${ruleTitle}</span><br>
        ${ruleDesc}<br><br>
        <strong>Result:</strong> ${pair} becomes <strong>${r1}${r2}</strong>.
    `;
}

function copyResult(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state || !state.res) return;

    const text = type === 'decrypt'
        ? cleanDecryptedText(state.res)
        : state.res.match(/.{1,2}/g).join(' ');

    navigator.clipboard.writeText(text).then(() => {
        showCopyToast('Copied to clipboard!');
    }).catch(() => {
        const el = document.createElement('textarea');
        el.value = text; document.body.appendChild(el); el.select();
        document.execCommand('copy'); document.body.removeChild(el);
        showCopyToast('Copied to clipboard!');
    });
}

function copyAndSendToOther(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state || !state.res) return;

    const otherType = type === 'encrypt' ? 'decrypt' : 'encrypt';
    const currentKw = document.getElementById(`keyword-${type}`).value;

    const textToSend = type === 'encrypt'
        ? state.res.match(/.{1,2}/g).join(' ')
        : cleanDecryptedText(state.res);

    navigator.clipboard.writeText(textToSend).catch(() => {});

    // Reset other tab if a session is running there
    const otherState = otherType === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (otherState) resetTutor(otherType);

    document.getElementById(`keyword-${otherType}`).value = currentKw;
    document.getElementById(otherType === 'encrypt' ? 'plaintext' : 'ciphertext').value = textToSend;

    if (otherType === 'encrypt') updateGridEncrypt(); else updateGridDecrypt();

    switchTab(otherType);
    showCopyToast('Copied & switched tabs!');
}

function showCopyToast(msg) {
    const toast = document.getElementById('copy-toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
}

function drawArrow(type, startChar, endChar) {
    const grid = document.getElementById(`cipher-grid-${type}`);
    const canvas = document.getElementById(`arrow-canvas-${type}`);
    const startCell = grid.querySelector(`[data-char="${startChar}"]`);
    const endCell = grid.querySelector(`[data-char="${endChar}"]`);
    if (!startCell || !endCell || !canvas) return;

    const gridRect = grid.getBoundingClientRect();
    const startRect = startCell.getBoundingClientRect();
    const endRect = endCell.getBoundingClientRect();
    const x1 = startRect.left - gridRect.left + (startRect.width / 2);
    const y1 = startRect.top - gridRect.top + (startRect.height / 2);
    const x2 = endRect.left - gridRect.left + (endRect.width / 2);
    const y2 = endRect.top - gridRect.top + (endRect.height / 2);
    const dx = x2 - x1; const dy = y2 - y1;
    const angle = Math.atan2(dy, dx);
    const backOff = 18;
    const nx1 = x1 + Math.cos(angle) * backOff;
    const ny1 = y1 + Math.sin(angle) * backOff;
    const nx2 = x2 - Math.cos(angle) * (backOff + 5);
    const ny2 = y2 - Math.sin(angle) * (backOff + 5);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", nx1); line.setAttribute("y1", ny1);
    line.setAttribute("x2", nx2); line.setAttribute("y2", ny2);
    line.setAttribute("class", "arrow-line");
    line.setAttribute("marker-end", `url(#${type === 'encrypt' ? 'arrowhead' : 'arrowhead-dec'})`);
    canvas.appendChild(line);
}

function highlightGrid(type, in1, in2, out1, out2) {
    const grid = document.getElementById(type === 'encrypt' ? 'cipher-grid-encrypt' : 'cipher-grid-decrypt');
    const canvas = document.getElementById(`arrow-canvas-${type}`);
    grid.querySelectorAll('.grid-cell').forEach(c => c.classList.remove('active-in', 'active-out'));
    canvas.querySelectorAll('.arrow-line').forEach(line => line.remove());
    grid.querySelector(`[data-char="${in1}"]`).classList.add('active-in');
    grid.querySelector(`[data-char="${in2}"]`).classList.add('active-in');
    grid.querySelector(`[data-char="${out1}"]`).classList.add('active-out');
    grid.querySelector(`[data-char="${out2}"]`).classList.add('active-out');
    drawArrow(type, in1, out1);
    drawArrow(type, in2, out2);
}

function updatePreparedTextHighlight(type) {
    const state = type === 'encrypt' ? encryptTutorState : decryptTutorState;
    if (!state) return;

    const displayBox = document.getElementById(`prepared-text-${type}`);
    const xPos = state.xPositions || {};

    const renderChar = (ch, charIdx) => {
        if (xPos[charIdx] !== undefined)
            return `<span class="x-badge" title="Inserted X — ${xPos[charIdx]}">X</span>`;
        return ch;
    };

    const renderPairHTML = (pair, pairIdx) => {
        const base = pairIdx * 2;
        return renderChar(pair[0], base) + (pair[1] ? renderChar(pair[1], base + 1) : '');
    };

    displayBox.innerHTML = state.pairs.map((pair, i) => {
        const pairHTML = renderPairHTML(pair, i);
        if (i < state.index) {
            // Processed pairs are clickable — user can jump back to any of them
            return `<span class="processed-pair clickable-pair" onclick="jumpToPair('${type}', ${i})" title="Click to go back to this pair">${pairHTML}</span>`;
        } else if (i === state.index) {
            return `<span class="current-pair">${pairHTML}</span>`;
        } else {
            return pairHTML;
        }
    }).join(' ');
}

function resetTutor(type) {
    const isEnc = type === 'encrypt';
    const kwInput = document.getElementById(`keyword-${type}`);
    const exampleSelect = document.getElementById(`${type}-examples`);
    const messageBox = document.getElementById(isEnc ? 'plaintext' : 'ciphertext');

    kwInput.disabled = false;
    exampleSelect.disabled = false;
    messageBox.disabled = false;

    // Keep the keyword the user had — only clear the message
    messageBox.value = "";
    exampleSelect.value = "";
    document.getElementById(`${type}-output`).innerText = "...";
    document.getElementById(`prepared-text-${type}`).innerText = "...";

    const pairNote = document.getElementById(`tutor-pair-note-${type}`);
    if (pairNote) pairNote.innerHTML = "";

    if (isEnc) {
        const prepNote = document.getElementById('tutor-text-prep-note');
        if (prepNote) { prepNote.innerHTML = ""; prepNote.classList.add('hidden'); }
    }

    const copyBtns = document.getElementById(`copy-btns-${type}`);
    if (copyBtns) copyBtns.classList.add('hidden');

    document.getElementById(`tutor-left-${type}`).style.display = 'none';
    document.getElementById(isEnc ? 'grid-explanation-encrypt' : 'grid-explanation-decrypt').classList.remove('hidden');

    if (isEnc) encryptTutorState = null; else decryptTutorState = null;

    clearGridHighlights(type);
}

function clearDropdown(type) {
    document.getElementById(`${type}-examples`).value = "";
}

window.onload = () => {
    updateGridEncrypt();
    updateGridDecrypt();
    openModal();
};

function openModal() {
    document.getElementById('help-modal').classList.remove('hidden');
    window.tourCompleted = false;
}

function closeModal() {
    document.getElementById('help-modal').classList.add('hidden');
    if (!window.tourCompleted) {
        startTour();
        window.tourCompleted = true;
    }
}

window.addEventListener('click', (e) => {
    if (e.target === document.getElementById('help-modal')) closeModal();
});

let currentTourStep = 0;
const tourSteps = [
    { targetId: 'keyword-encrypt', text: "🎯 <strong>Step 1: The Keyword</strong><br>Pick a word to shape your secret grid! You can type a new one or just leave it as 'PLAYFAIR'.", position: 'bottom' },
    { targetId: 'plaintext', text: "✍️ <strong>Step 2: The Message</strong><br>Type or paste your own secret text here, or choose from the 'Quick Examples' above.", position: 'bottom' },
    { targetId: 'start-btn-encrypt', text: "🚀 <strong>Step 3: Begin!</strong><br>Click here when you are ready. I will walk you through the encryption step-by-step.", position: 'top' }
];

function startTour() {
    document.getElementById('tour-overlay').classList.remove('hidden');
    document.getElementById('tour-tooltip').classList.remove('hidden');
    currentTourStep = 0;
    switchTab('encrypt');
    showTourStep();
}

function showTourStep() {
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    if (currentTourStep >= tourSteps.length) { endTour(); return; }

    const step = tourSteps[currentTourStep];
    const target = document.getElementById(step.targetId);
    const tooltip = document.getElementById('tour-tooltip');
    const arrow = document.getElementById('tour-arrow');

    target.classList.add('tour-highlight');
    document.getElementById('tour-text').innerHTML = step.text;

    const rect = target.getBoundingClientRect();
    const scrollY = window.scrollY || window.pageYOffset;
    const scrollX = window.scrollX || window.pageXOffset;

    if (step.position === 'bottom') {
        tooltip.style.top = (rect.bottom + scrollY + 15) + "px";
        tooltip.style.left = (rect.left + scrollX + (rect.width / 2) - 150) + "px";
        arrow.className = 'tour-arrow bottom';
    } else {
        tooltip.style.top = (rect.top + scrollY - tooltip.offsetHeight - 15) + "px";
        tooltip.style.left = (rect.left + scrollX + (rect.width / 2) - 150) + "px";
        arrow.className = 'tour-arrow top';
    }

    document.getElementById('tour-next-btn').innerText = currentTourStep === tourSteps.length - 1 ? "Finish" : "Next ➔";
}

function nextTourStep() { currentTourStep++; showTourStep(); }

function endTour() {
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
    document.getElementById('tour-overlay').classList.add('hidden');
    document.getElementById('tour-tooltip').classList.add('hidden');
}
