const cv = document.getElementById("gameCanvas"),
      c = cv.getContext("2d");
const tileSize = 52;
const spacing = 4;
const startX = 60;
const startY = 8;
const items = ["FOOD", "MOUSE", "BOX", "BALL"];
const itemDescriptions = {
    FOOD: "- FOOD:\n - The cat will follow the food if it is in a straight line and there are no walls in between.",
    MOUSE: "- MOUSE:\n - The mouse will always try to go to the furthest tile from the cat.\n - The cat will follow it once it sees it, if it is in a straight line with no walls in between.\n - There can only be ONE mouse at a time.",
    BOX: "- BOX:\n - The box has the same behavior as a wall\n - It can be used to redirect the mouse and cat.",
    BALL: "- BALL:\n - If a ball is two tiles away from the cat, it will jump to it; ignoring walls."
};
const levels = [
  {
    grid: [
      "IIIIIIIIIIIIIII",
      "IIIIIIIIIIIIIII",
      "MMMMMMMMMMMMMMM",
      "MIIIIIIIIIIII.F",
      "MMMMMMMMMMMMMMM",
      "IIIIIIIIIIIIIII",
      "IIIIIIIIIIIIIII"
    ],
    catStart: { row: 3, col: 1 },
    objects: [],
    itemCounts: { FOOD: 1, MOUSE: 0, BOX: 0, BALL: 0 },
    messages: [
            "- Goal: Bring the cat to the flag.\n- Start the game by pressing the 'GO!' button.",
            "- You can lure the cat to the flag by placing items.",
            "- The items are at the bottom of the screen.\n- You can place them by clicking once on the item, and then on a light green tile.",
            "- The cat will see the food if it is in a straight line and there are no walls in between."
        ],
    story: ["They hunt the black cat, believing it’s a witch’s manifestation. Guide it to the flag before they capture it."
    ],
	starThresholds: { gold: 5, silver: 10, bronze: 15 }	
  },
  {
    grid: ["MMMMMMMMMMMMMMM",
    "MIMIIIIIFIMIIIM",
    "MIMIMMMMMMMIIIM",
    "M.MIMIIIIIIIIIM",
    "M.MIMIIIIIIIIIM",
    "M.IIMIIIIIIIIIM",
    "MMMMMMMMMMMMMMM"],
    catStart: { row: 1, col: 1 },
    objects: [],
    itemCounts: { FOOD: 0, MOUSE: 1, BOX: 0, BALL: 0 },
    messages: ["- The mouse will try to evade the cat. \n- Once the cat sees the mouse, it will chase it."],
    story: [
	"You helped the cat escape once, but now they’re more cautious. Use the mouse to outmaneuver them and reach the flag again."
	],
	starThresholds: { gold: 8, silver: 12, bronze: 16 }
  },
  {
    grid: [
    "M.....MMMMMMMMM",
    "M.MMMMMMM....MM",
    "M.......MM.MMMM",
    "MMMMMM.MMM.MMMM",
    "M.............M",
    "MMMMMMMMMM.MMFM",
    "MMMMMMMM...MMMM"
  ],
    catStart: { row: 4, col: 1 },
    objects: [],
    itemCounts: { FOOD: 0, MOUSE: 1, BOX: 3, BALL: 0 },
    messages: ["- Place boxes to redirect the mouse.\n- The mouse will always try to go to the furthest tile from the cat."],
    story: [
	"They’ve learnt that the mouse tries to go to the furthest point from the cat, and modified the path. Redirect the mouse and lead the cat to the flag."
	],
	starThresholds: { gold: 8, silver: 12, bronze: 18 }
  },
  {
    grid: [
    "MMMMMMMMMMMMMMM",
    "M.M...........M",
    "MMMMMMMMMMMMMMM",
    "MM.IIIIIIIIII.M",
    "MMMMMMMMMMMMMMM",
    "MM.FMMMMMMMMMMM",
    "MMMMMMMMMMMMMMM"
  ],
    catStart: { row: 1, col: 1 },
    objects: [],
    itemCounts: { FOOD: 2, MOUSE: 0, BOX: 0, BALL: 3 },
    messages: ["If a ball is two tiles away from the cat, it will jump to it."],
    story: ["They now decided to corner the cat with walls, but thankfully, it can jump over those thanks to the balls."],
	starThresholds: { gold: 15, silver: 20, bronze: 30 }
  },
  {
    grid: [
    "MMMMMMMMMMMMMMM",
    "M.MI........MMM",
    "M.MIMM.MMMMMMMM",
    "M.MIMM.MMM.MMMM",
    "M.MMMM.MMM.M.MM",
    "M.M....MMMMM.MM",
    "MMMMMMMMF.II.MM"
  ],
    catStart: { row: 1, col: 1 },
    objects: [],
    itemCounts: { FOOD: 3, MOUSE: 1, BOX: 1, BALL: 4 },
	messages: ["The cat has an order of priority: The destination; then the balls, the mouse and lastly the food."],
    story: ["After guiding safely the cat many times, they decided to make the escape even more difficult, but the hunt is not over."],
	starThresholds: { gold: 18, silver: 22, bronze: 26 }
  },
  {
    grid: [
        "...............",
		"..MMMMMMMMMMMMM",
        "..MMMMMMMMMMMMM",
        "IMM..........M.",
        "I.MMM.......MM.",
        "I.M.MM......MM.",
        "I...MM......MMF"
    ],
    catStart: { row: 0, col: 0 },
    objects: [],
    itemCounts: { FOOD: 0, MOUSE: 2, BOX: 9, BALL: 3 },
    messages: ["There can only be a mouse at a time."],
    story: ["They try to confuse you with complex paths, but you have already saved the black cat many times."],
	starThresholds: { gold: 15, silver: 20, bronze: 25 }
	},
	{
    grid: [
        "FMMMMMMMMMMMMM.",
		".M.M.M...M.M.M.",
        "IMMMMM..IMMMMM.",
        "IMI.IM..IMI.IM.",
        "IM..IM..IM..IM.",
        "IM.MIM..IM.MIM.",
        "IM.MIM..IM.MIM."
    ],
    catStart: { row: 4, col: 14 },
    objects: [
		{ row: 2, col: 14, type: "MOUSE" },
		{ row: 1, col: 12, type: "BALL" },
		{ row: 1, col: 10, type: "BALL" },
		{ row: 3, col: 10, type: "BALL" },
		{ row: 5, col: 10, type: "BALL" },
		{ row: 1, col: 4, type: "BALL" },
		{ row: 1, col: 2, type: "BALL" },
		{ row: 3, col: 2, type: "BALL" },
		{ row: 5, col: 2, type: "BALL" }
	],
    itemCounts: { FOOD: 4, MOUSE: 3, BOX: 1, BALL: 8 },
    messages: ["The cat prefers certain balls to others.\n The order of preference is bottom, top, right, and left."],
    story: ["The hunt is arriving to an end soon, but the cat is stuck in some sort of maze; help it once again."],
	starThresholds: { gold: 35, silver: 40, bronze: 45 }
	},
	{
	grid: [
		"..IM.......MI..",
        ".IM.MIMMMIM.MI.",
        "IMIMIM...M.M.MI",
		"MIM.MIMIM.M.M.M",
        "IM.M.M..IM.MIMI",
        ".IMIMIMMMM.IMM.",
        "F.IMI.IMI.I.I.."],
	catStart: { row: 3, col: 11 },
	objects: [
		{ row: 3, col: 13, type: "BALL" },
		{ row: 3, col: 11, type: "BALL" },
		{ row: 3, col: 9, type: "BALL" },
		{ row: 3, col: 7, type: "BALL" },
		{ row: 1, col: 11, type: "BALL" },
		{ row: 5, col: 11, type: "BALL" },
		{ row: 2, col: 10, type: "BALL" },
		{ row: 4, col: 12, type: "BALL" },
		{ row: 2, col: 12, type: "BALL" },
		{ row: 4, col: 10, type: "BALL" },
		{ row: 3, col: 5, type: "BALL" },
		{ row: 3, col: 1, type: "BALL" },
		{ row: 1, col: 3, type: "BALL" },
		{ row: 5, col: 3, type: "BALL" },
		{ row: 2, col: 2, type: "BALL" },
		{ row: 4, col: 4, type: "BALL" },
		{ row: 2, col: 4, type: "BALL" },
		{ row: 4, col: 2, type: "BALL" },
		{ row: 1, col: 1, type: "BALL" },
		{ row: 2, col: 6, type: "BALL" },
		{ row: 4, col: 8, type: "BALL" },
		{ row: 4, col: 6, type: "FOOD" },
		{ row: 4, col: 0, type: "BALL" },
		{ row: 2, col: 14, type: "BALL" },
		{ row: 4, col: 14, type: "BALL" },
		{ row: 0, col: 1, type: "MOUSE" }
	],
	itemCounts: { FOOD: 2, MOUSE: 1, BOX: 2, BALL: 8 },
    messages: ["The cat is stuck between many balls; but its priorities didn't change."],
    story: ["You're almost there, but they decided to confuse you by placing many items too; show them who places item the best."],
	starThresholds: { gold: 42, silver: 46, bronze: 50 }
	},
	{
    grid: [
        "...I..III......",
        "..II.II.II.....",
        ".I..MM...MM....",
        "M.F.I.....II.IM",
        ".M..MM...MM.II.",
        ".M.MMII.II.II..",
        ".I....III..M..."
    ],
    catStart: { row: 0, col: 0 },
    objects: [],
    teleporters: [
        { row: 3, col: 5, destination: { row: 5, col: 13 } },
        { row: 3, col: 9, destination: { row: 6, col: 0 } },
		{ row: 5, col: 7, destination: { row: 0, col: 0 } },
        { row: 1, col: 7, destination: { row: 6, col: 14 } },
        { row: 3, col: 1, destination: { row: 3, col: 14 } },
        { row: 3, col: 3, destination: { row: 3, col: 1 } },
		{ row: 4, col: 2, destination: { row: 6, col: 14 } },
        { row: 2, col: 2, destination: { row: 6, col: 14 } },
		{ row: 0, col: 2, destination: { row: 0, col: 14 } },
        { row: 0, col: 12, destination: { row: 3, col: 7 } },
		{ row: 0, col: 10, destination: { row: 0, col: 14 } },
		{ row: 2, col: 0, destination: { row: 5, col: 2 } },
        { row: 2, col: 14, destination: { row: 4, col: 11 } },
		{ row: 4, col: 0, destination: { row: 6, col: 14 } },
        { row: 4, col: 14, destination: { row: 6, col: 14 } },
		{ row: 6, col: 2, destination: { row: 4, col: 11 } },
        { row: 6, col: 12, destination: { row: 6, col: 14 } }
    ],
    itemCounts: { FOOD: 3, MOUSE: 0, BOX: 0, BALL: 2 },
    messages: ["Use the teleporters to reach the flag!"],
    story: ["This is the final escape; they laid many teleporters to corner the cat; but through trial and error you will be able to save the cat for good."],
	starThresholds: { gold: 10, silver: 14, bronze: 20 }
	}
];
let currentLevel = 0;
let ac = new (window.AudioContext || window.webkitAudioContext)();
let inLevelMenu = false;
let maxLevel = parseInt(localStorage.getItem("maxLevel")) || 0;
let showStartMenu = maxLevel > 0 && currentLevel !== 0 && currentLevel < levels.length - 1;
let unlockedLevels = Array.from({ length: maxLevel + 1 }, (_, i) => i);
let catWait = 0;
let mouseMoveWait = 0;
let MOVE_DELAY = 30;
let selectedItem = null;
let placedObjects = [];
let grid = [];
let objects = [];
let cat = {};
let chasing = false;
let mouse = null;
let itemCounts = {};
let tutorialActive = false;
let tutorialMessages = [];
let infoActive = false;
let infoMessage = "";
let currentMessageIndex = 0;
let gameStarted = false;
let lastMoveDirection = { dr: 0, dc: 0 };
let teleporters = [];
let lastTeleporterUsed = null;
let musicPlaying = false;
let noteIndex = 0;
let melodyTimeout;
let levelStartTime = 0;
let levelTimes = JSON.parse(localStorage.getItem("levelTimes")) || Array(levels.length).fill(Infinity);
let levelStars = JSON.parse(localStorage.getItem("levelStars")) || Array(levels.length).fill(0);

let storyActive = false;
let storyMessages = [];
let currentStoryIndex = 0;

const melodyFreqs = [220, 247, 262, 294, 330, 392,
    220, 247, 262, 294, 330, 392,
    220, 247, 262, 294, 330, 392,
    262, 294, 330, 262, 294, 330, 440,
    110, 220, 110, 247, 110, 262, 110, 294, 110, 330, 110, 392,
    110, 220, 110, 247, 110, 262, 110, 294, 110, 330, 110, 392,
    110, 262, 110, 294, 110, 330, 110, 262, 110, 294, 110, 330, 110, 440,
    220, 247, 255, 294, 311, 392,
    220, 247, 262, 294, 330, 392,
    220, 247, 262, 287, 330, 392,
    262, 294, 311, 262, 294, 330, 440,
    110, 0, 220, 0, 110, 0, 247, 0,
    110, 0, 262, 0, 110, 0, 294, 0,
    110, 0, 330, 0, 110, 0, 392, 0,
    110, 0, 0, 0, 440, 0, 0, 0];
const melodyDurations = [0.5, 0.5, 1, 0.5, 0.5, 1,
    0.5, 0.5, 1, 0.5, 0.5, 1,
    0.5, 0.5, 1, 0.5, 0.5, 1,
    0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 2,
    0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 1,
    0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 0.5, 0.3, 1,
    0.3, 0.33, 0.3, 0.33, 0.3, 0.34, 0.3, 0.33, 0.3, 0.33, 0.3, 0.34, 0.3, 2,
    0.5, 0.5, 0.5, 0.5, 0.5, 1,
    0.5, 0.5, 1, 0.5, 0.5, 1,
    0.5, 0.5, 0.5, 0.5, 0.5, 1,
    0.33, 0.33, 0.34, 0.33, 0.33, 0.34, 2,
    1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5,
    1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5,
    1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 1.5, 0.5, 
    2, 0.5, 0.5, 0.5, 2, 0.5, 1, 1];
const musicGain = ac.createGain();
const sfxGain = ac.createGain();
musicGain.connect(ac.destination);
sfxGain.connect(ac.destination);

cv.addEventListener("click", () => {
    if (ac.state === "suspended") {
        ac.resume().then(() => {
            if (!musicPlaying) {
                startMusic();
            }
        });
    }
}, { once: true });

function loadLevel(levelIndex) {
    const lvl = levels[levelIndex];
    grid = lvl.grid.map(r => r.split(""));
    cat = { ...lvl.catStart };
    itemCounts = { ...lvl.itemCounts };
    objects = Array.from({ length: grid.length }, () => Array(grid[0].length).fill(null));
	teleporters = lvl.teleporters || [];
    chasing = false;
	selectedItem = null;
    if (lvl.messages && lvl.messages.length > 0) {
        tutorialMessages = lvl.messages;
        currentMessageIndex = 0;
        tutorialActive = true;
        gameStarted = false;
    } else {
        tutorialActive = false;
        gameStarted = false;
    }

    // NEW: Initialize story messages for the level
    if (lvl.story && lvl.story.length > 0) {
        storyMessages = lvl.story;
        currentStoryIndex = 0;
        storyActive = false; // Only becomes true after tutorials finish
    } else {
        storyMessages = [];
        currentStoryIndex = 0;
        storyActive = false;
    }

    if (lvl.objects) {
        for (const obj of lvl.objects) {
            objects[obj.row][obj.col] =
                obj.type === "FOOD" ? "D" :
                obj.type === "MOUSE" ? "O" :
                obj.type === "BOX" ? "X" : "B";
        }
    }
    mouse = null;
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[0].length; c++) {
            if (objects[r][c] === "O") {
                mouse = { row: r, col: c };
                break;
            }
        }
    }
    levelStartTime = Date.now();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const paragraphs = text.split('\n');
    let currentY = y;
    for (let paragraph of paragraphs) {
        let words = paragraph.split(' ');
        let line = '';
        for (let n = 0; n < words.length; n++) {
            let testLine = line + words[n] + ' ';
            let metrics = ctx.measureText(testLine);
            let testWidth = metrics.width;
            if (testWidth > maxWidth && n > 0) {
                ctx.fillText(line.trim(), x, currentY);
                line = words[n] + ' ';
                currentY += lineHeight;
            } else {
                line = testLine;
            }
        }
        ctx.fillText(line.trim(), x, currentY);
        currentY += lineHeight;
    }
}

function drawTutorialMessage() {
    if (!tutorialActive) return;
    c.fillStyle = "rgba(0,0,0,0.7)";
    c.fillRect(50, 100, 800, 200);
    c.fillStyle = "white";
    c.font = "18px sans-serif";
    c.textAlign = "left";
    c.textBaseline = "top";
    c.fillText(`Message ${currentMessageIndex + 1}/${tutorialMessages.length}`, 70, 105);
    c.font = "20px sans-serif";
    const maxWidth = 760;
    const lineHeight = 28;
    wrapText(c, tutorialMessages[currentMessageIndex], 70, 135, maxWidth, lineHeight);
    c.fillStyle = "yellow";
    c.font = "18px sans-serif";
    c.textAlign = "right";
    c.fillText("Click to continue...", 830, 270);
}

// NEW: Story message drawing (different background color)
function drawStoryMessage() {
    if (!storyActive) return;
    c.fillStyle = "rgba(30, 30, 80, 0.85)"; // distinct bluish tone
    c.fillRect(50, 100, 800, 200);
    c.fillStyle = "white";
    c.font = "18px sans-serif";
    c.textAlign = "left";
    c.textBaseline = "top";
    c.fillText(`Story ${currentStoryIndex + 1}/${storyMessages.length}`, 70, 105);
    c.font = "20px sans-serif";
    const maxWidth = 760;
    const lineHeight = 28;
    wrapText(c, storyMessages[currentStoryIndex], 70, 135, maxWidth, lineHeight);
    c.fillStyle = "yellow";
    c.font = "18px sans-serif";
    c.textAlign = "right";
    c.fillText("Click to continue...", 830, 270);
}

function drawCat(row, col) {
    const x = startX + col * (tileSize + spacing);
    const y = startY + row * (tileSize + spacing);
    const cx = x + tileSize / 2;
    const cy = y + tileSize / 2;
    c.fillStyle = "black";
    c.beginPath();
    c.fillRect(x+10, y+10, tileSize - 20, tileSize - 20);
    c.fill();
    c.beginPath();
    c.moveTo(x + 10, y + 10);
    c.lineTo(x + 15, y + 2);
    c.lineTo(x + 20, y + 10);
    c.closePath();
    c.fill();
    c.beginPath();
    c.moveTo(x + 32, y + 10);
    c.lineTo(x + 37, y + 2);
    c.lineTo(x + 42, y + 10);
    c.closePath();
    c.fill();
    c.beginPath();
    if (lastMoveDirection.dc < 0) {
		c.fillRect(x + tileSize - 10, cy+8, 8, 4);
        c.fillRect(x + tileSize - 6, cy+8, 4, -20);
    } else if (lastMoveDirection.dc > 0) {
        c.fillRect(x+2, cy+8, 8, 4);
        c.fillRect(x+2, cy+8, 4, -20);
    } else {
        c.fillRect(x+2, cy+8, 8, 4);
        c.fillRect(x+2, cy+8, 4, -20);
    }
    c.fill();
    c.fillStyle = "white";
    c.beginPath();
    c.fillRect(cx - 10, cy - 7, 4, 10);
    c.fillRect(cx + 6, cy - 7, 4, 10);
    c.fill();
    c.fillStyle = "pink";
    c.beginPath();
    c.fillRect(cx - 6, cy + 8, 12, 4);
    c.fill();
}

function drawMouse() {
    if (!mouse) return;
    const x = startX + mouse.col * (tileSize + spacing);
    const y = startY + mouse.row * (tileSize + spacing);
    drawItem("O", x, y, tileSize);
}

function drawItem(tile, x, y, tileSize) {
    if (tile === "D") {
		c.strokeStyle = "black";
		c.beginPath();
		c.ellipse(x + tileSize/2 - 4, y + tileSize/2, tileSize/4, tileSize/5, 0, 0, Math.PI * 2);
		c.stroke();
		c.beginPath();
		c.moveTo(x + tileSize/2 + 15, y + tileSize/2 + 6);
		c.lineTo(x + tileSize/2, y + tileSize/2 - 2);
		c.closePath();
		c.stroke();
		c.beginPath();
		c.lineTo(x + tileSize/2 + 15, y + tileSize/2 - 6);
		c.closePath();
		c.stroke();
		c.beginPath();
		c.moveTo(x + tileSize/2 - 4, y + 17);
		c.lineTo(x + tileSize/2, y + 10);
		c.lineTo(x + tileSize/2 + 2, y + 17);
		c.closePath();
		c.stroke();
		c.fillStyle = "#1a8bbc";
		c.beginPath();
		c.ellipse(x + tileSize/2 - 4, y + tileSize/2, tileSize/4, tileSize/5, 0, 0, Math.PI * 2);
		c.fill();
		c.beginPath();
		c.moveTo(x + tileSize/2 + 15, y + tileSize/2 + 6);
		c.lineTo(x + tileSize/2, y + tileSize/2 - 2);
		c.lineTo(x + tileSize/2 + 15, y + tileSize/2 - 6);
		c.closePath();
		c.fill();
		c.beginPath();
		c.moveTo(x + tileSize/2 - 4, y + 17);
		c.lineTo(x + tileSize/2, y + 10);
		c.lineTo(x + tileSize/2 + 2, y + 17);
		c.closePath();
		c.fill();
		c.fillStyle = "black";
		c.beginPath();
		c.arc(x + tileSize/2 - 10, y + tileSize/2 - 2, 1.5, 0, Math.PI * 2);
		c.fill();
		c.lineWidth = 1;
		c.beginPath();
		c.arc(x + tileSize/2 - 12, y + tileSize/2 + 3, 1.5, 0, Math.PI, true);
		c.stroke();
    } else if (tile === "O") {
        const cx = x + tileSize / 2;
        const cy = y + tileSize / 2;
		c.strokeStyle = "black";
		c.beginPath();
        c.arc(cx, cy, 14, 0, Math.PI * 2);
        c.stroke();
        c.beginPath();
        c.arc(cx - 10, cy - 10, 6, 0, Math.PI * 2);
        c.arc(cx + 10, cy - 10, 6, 0, Math.PI * 2);
        c.stroke();
        c.fillStyle = "rgba(220,220,220,1)";
        c.beginPath();
        c.arc(cx, cy, 14, 0, Math.PI * 2);
        c.fill();
        c.beginPath();
        c.arc(cx - 10, cy - 10, 6, 0, Math.PI * 2);
        c.arc(cx + 10, cy - 10, 6, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "black";
        c.beginPath();
        c.arc(cx - 5, cy - 3, 2, 0, Math.PI * 2);
        c.arc(cx + 5, cy - 3, 2, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "black";
        c.lineWidth = 1;
        c.beginPath();
        c.moveTo(cx - 4, cy + 2);
        c.lineTo(cx - 12, cy + 6);
        c.moveTo(cx - 4, cy + 4);
        c.lineTo(cx - 12, cy + 10);
        c.moveTo(cx + 4, cy + 2);
        c.lineTo(cx + 12, cy + 6);
        c.moveTo(cx + 4, cy + 4);
        c.lineTo(cx + 12, cy + 10);
        c.stroke();
    } else if (tile === "B") {
        c.fillStyle = '#cc050c';
        c.beginPath();
        c.arc(x + tileSize / 2, y + tileSize / 2, 14, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "#cc050c";
        c.stroke();
    } else if (tile === "X") {
        c.fillStyle = '#cfa854';
        c.fillRect(x + 4, y + 4, tileSize - 8, tileSize - 8);
        c.strokeStyle = "black";
        c.strokeRect(x + 4, y + 4, tileSize - 8, tileSize - 8);
        c.beginPath();
        c.moveTo(x + 4, y + tileSize/2);
        c.lineTo(x + tileSize - 4, y + tileSize/2);
        c.moveTo(x + tileSize/2, y + 4);
        c.lineTo(x + tileSize/2, y + tileSize - 4);
        c.strokeStyle = "#654321";
        c.stroke();
    }
}

function drawTeleporters() {
    for (const tp of teleporters) {
        const x = startX + tp.col * (tileSize + spacing);
        const y = startY + tp.row * (tileSize + spacing);
        const cx = x + tileSize / 2;
        const cy = y + tileSize / 2;
        const r = tileSize / 3;
        const gradient = c.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
        gradient.addColorStop(0, "rgba(200, 100, 255, 0.8)");
        gradient.addColorStop(1, "rgba(100, 0, 150, 0.9)");
        c.fillStyle = gradient;
        c.beginPath();
        c.arc(cx, cy, r, 0, Math.PI * 2);
        c.fill();
        c.strokeStyle = "white";
        c.lineWidth = 2;
        c.beginPath();
        for (let angle = 0; angle < Math.PI * 2 * 2; angle += 0.2) {
            const spiralR = (r * angle) / (Math.PI * 4);
            const px = cx + Math.cos(angle) * spiralR;
            const py = cy + Math.sin(angle) * spiralR;
            if (angle === 0) {
                c.moveTo(px, py);
            } else {
                c.lineTo(px, py);
            }
        }
        c.stroke();
    }
}

function drawGrid(rows, cols) {
    const defaultStroke = "fff";
    c.lineWidth = 2;
    for (let r = 0; r < rows; r++) {
        for (let col = 0; col < cols; col++) {
            const tile = grid[r][col];
            const x = startX + col * (tileSize + spacing);
            const y = startY + r * (tileSize + spacing);
            c.fillStyle = "#92c487";
            c.fillRect(x, y, tileSize, tileSize);
            c.strokeStyle = "#fff";
            c.strokeRect(x, y, tileSize, tileSize);
            if (tile === "I") {
                c.fillStyle = "#5b8452";
                c.fillRect(x, y, tileSize, tileSize);
                c.strokeStyle = "#fff";
                c.strokeRect(x, y, tileSize, tileSize);
            }
            if (tile === "M") {
				c.fillStyle = "black";
				c.strokeStyle = "black";
				const hasLeft = col > 0 && grid[r][col-1] === 'M';
				const hasRight = col < cols-1 && grid[r][col+1] === 'M';
				const hasTop = r > 0 && grid[r-1][col] === 'M';
				const hasBottom = r < rows-1 && grid[r+1][col] === 'M';
				const hasTopLeft = hasTop && hasLeft && grid[r-1][col-1] === 'M';
				const hasTopRight = hasTop && hasRight && grid[r-1][col+1] === 'M';
				const hasBottomLeft = hasBottom && hasLeft && grid[r+1][col-1] === 'M';
				const hasBottomRight = hasBottom && hasRight && grid[r+1][col+1] === 'M';
				const overlap = 2;
				let drawX = x;
				let drawY = y;
				let drawWidth = tileSize;
				let drawHeight = tileSize;
				if (hasLeft) {
					drawX -= overlap;
					drawWidth += overlap;
				}
				if (hasRight) {
					drawWidth += overlap;
				}
				if (hasTop) {
					drawY -= overlap;
					drawHeight += overlap;
				}
				if (hasBottom) {
					drawHeight += overlap;
				}
				c.fillRect(drawX, drawY, drawWidth, drawHeight);
				if (!hasTopLeft && hasTop && hasLeft) {
					c.fillStyle = "#D3D3D3";
					c.fillRect(x - spacing, y - spacing, spacing, spacing);
				}
				if (!hasTopRight && hasTop && hasRight) {
					c.fillStyle = "#D3D3D3";
					c.fillRect(x + tileSize, y - spacing, spacing, spacing);
				}
				if (!hasBottomLeft && hasBottom && hasLeft) {
					c.fillStyle = "#D3D3D3";
					c.fillRect(x - spacing, y + tileSize, spacing, spacing);
				}
				if (!hasBottomRight && hasBottom && hasRight) {
					c.fillStyle = "#D3D3D3";
					c.fillRect(x + tileSize, y + tileSize, spacing, spacing);
				}
			} else if (tile === "F") {
				c.fillStyle = "#5b8452";
				c.fillRect(x, y, tileSize, tileSize);
				c.fillStyle = "black";
				c.fillRect(x + 7, y+10, 3, 40);
				c.fillStyle = "red";
				for (let i = 0; i < 8; i++) {
					for (let j = 0; j < 5; j++) {
						if ((i+j)%2 === 0) {
							c.fillStyle = "white";
						} else {
							c.fillStyle = "black";
						}
						c.fillRect(x+10+4*i, y+10+4*j, 4, 4);
					}
				}
            }
            if (objects[r][col]) {
                drawItem(objects[r][col], x, y, tileSize);
            }
        }
    }
}

function drawSlots() {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        let sx = 20 + 190 * i, sy = 420;
        const slotWidth = 180;
        const slotHeight = 100;
        c.beginPath();
        c.fillStyle = (selectedItem === item) ? "#AAAAAA" : "#C3C3C3";
        c.roundRect(sx, sy, slotWidth, slotHeight, 10);
        c.fill();
        c.fillStyle = "#000";
        c.font = "20px sans-serif";
        c.textAlign = "center";
        c.textBaseline = "middle";
        c.fillText(item, sx + slotWidth / 2, sy + 30);
        c.fillStyle = "red";
        c.beginPath();
        c.arc(sx + slotWidth - 30, sy + 30, 20, 0, Math.PI * 2);
        c.fill();
        c.fillStyle = "white";
        c.font = "16px sans-serif";
        c.fillText(itemCounts[item], sx + slotWidth - 30, sy + 30);
        let tileChar = item === "FOOD" ? "D" : item === "MOUSE" ? "O" : item === "BOX" ? "X" : "B";
        drawItem(tileChar, sx + 90, sy + 60, 40);
		c.fillStyle = "#3A8DFF";
		c.beginPath();
		c.arc(sx + 20, sy + 30, 15, 0, Math.PI * 2);
		c.fill();
		c.fillStyle = "white";
		c.font = "16px sans-serif";
		c.textAlign = "center";
		c.textBaseline = "middle";
		c.fillText("i", sx + 20, sy + 30);
    }
}

function drawInfoMessage() {
    if (!infoActive) return;
    c.fillStyle = "rgba(0,0,0,0.7)";
    c.fillRect(100, 120, 700, 180);
    c.fillStyle = "white";
    c.font = "20px sans-serif";
    c.textAlign = "left";
    c.textBaseline = "top";
    wrapText(c, infoMessage, 120, 140, 660, 26);
    c.fillStyle = "yellow";
    c.font = "18px sans-serif";
    c.textAlign = "right";
    c.fillText("Click to close...", 780, 270);
}

function showLevelMenu() {
    inLevelMenu = true;
    c.fillStyle = "rgba(0,0,0,0.8)";
    c.fillRect(100, 100, 700, 300);
    c.fillStyle = "white";
    c.font = "24px sans-serif";
    c.textAlign = "center";
    c.fillText("Level finished!", 450, 140);
    c.fillStyle = "#4CAF50";
    c.fillRect(250, 180, 150, 50);
    c.fillStyle = "white";
    c.fillText("Play again", 325, 210);
    if (currentLevel + 1 < levels.length) {
        c.fillStyle = "#2196F3";
        c.fillRect(420, 180, 150, 50);
        c.fillStyle = "white";
        c.fillText("Next level", 495, 210);
    }
    c.font = "18px sans-serif";
    c.textAlign = "left";
    for (let i = 0; i < levels.length; i++) {
        c.fillStyle = unlockedLevels.includes(i) ? "#4CAF50" : "#757575";
        c.fillRect(120 + (i * 60), 320, 40, 40);
        c.fillStyle = "white";
        c.fillText(i + 1, 135 + (i * 60), 345);
    }
	const bigStarSize = 20;
	const bigStarX = 400;
	const bigStarY = 275;
	for (let i = 0; i < levelStars[currentLevel]; i++) {
		c.fillStyle = "gold";
		c.save();
		c.translate(bigStarX + i * 40, bigStarY);
		drawStar(c, 0, 0, bigStarSize);
		c.restore();
	}
    for (let i = 0; i < levels.length; i++) {
		if (unlockedLevels.includes(i)) {
			for (let s = 0; s < levelStars[i]; s++) {
				c.fillStyle = "gold";
				c.save();
				c.translate(130 + (i * 60) + s * 10, 330);
				drawStar(c, 0, 0, 5);
				c.restore();
			}
		}
	}
}

function drawStartMenu() {
    c.fillStyle = "rgba(0,0,0,0.8)";
    c.fillRect(200, 150, 500, 200);
    c.fillStyle = "white";
    c.font = "24px sans-serif";
    c.textAlign = "center";
    c.fillText("Welcome to the game!", 450, 190);
    c.font = "18px sans-serif";
    c.fillText("Would you like to load your progression?", 450, 230);
    c.fillStyle = "#4CAF50";
    c.fillRect(300, 260, 100, 40);
    c.fillStyle = "white";
    c.fillText("Yes", 350, 285);
    c.fillStyle = "#f44336";
    c.fillRect(400, 260, 100, 40);
    c.fillStyle = "white";
    c.fillText("No", 450, 285);
}

function drawGoButton() {
    const gx = 20 + 190 * items.length;
    const gy = 430;
    const gSize = 40;
    c.fillStyle = "#AAAAAA";
    c.fillRect(gx, gy, gSize, gSize);
    c.fillStyle = "white";
    c.font = "20px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("GO!", gx + gSize / 2, gy + gSize / 2);
}

function drawResetButton() {
    const rx = 20 + 190 * items.length + 40 + 10;
    const ry = 430;
    const rSize = 40;
    c.fillStyle = "#AAAAAA";
    c.fillRect(rx, ry, rSize, rSize);
    c.fillStyle = "white";
    c.font = "24px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("↻", rx + rSize / 2, ry + rSize / 2);
}

function drawCancelButton() {
    const cx = 20 + 190 * items.length + 40 + 10 + 50;
    const cy = 430;
    const cSize = 40;
    c.fillStyle = "#AAAAAA";
    c.fillRect(cx, cy, cSize, cSize);
    c.fillStyle = "white";
    c.font = "20px sans-serif";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText("✕", cx + cSize / 2, cy + cSize / 2);
}

function drawStar(c, x, y, size) {
    c.beginPath();
    const outerRadius = size;
    const innerRadius = size * 0.4;
    for (let i = 0; i < 10; i++) {
        const angle = (i * Math.PI / 5) - (Math.PI / 2);
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const px = x + Math.cos(angle) * radius;
        const py = y + Math.sin(angle) * radius;
        if (i === 0) {
            c.moveTo(px, py);
        } else {
            c.lineTo(px, py);
        }
    }
    c.closePath();
    c.fill();
}

function drawStars(x, y, stars, size = 8) {
    for (let i = 0; i < stars; i++) {
        c.fillStyle = "gold";
        c.save();
        c.translate(x + i * 33, y);
        drawStar(c, 0, 0, size);
        c.restore();
    }
}


function cancelLastPlacement() {
    if (placedObjects.length === 0 || gameStarted) return;
    const lastObject = placedObjects.pop();
    const { row, col, type } = lastObject;
    if (objects[row][col] === "O") {
        mouse = null;
    }
    objects[row][col] = null;
    itemCounts[type]++;
}

function draw() {
    c.clearRect(0, 0, cv.width, cv.height);
	if (showStartMenu) {
        drawStartMenu();
        return;
    }
    drawGrid(7, 15);
	drawTeleporters();
    if (mouse) drawMouse();
    drawCat(cat.row, cat.col);
	c.strokeStyle = "#AAAAAA";
    c.beginPath();
    c.moveTo(40, 410);
    c.lineTo(920, 410);
    c.stroke();
    drawSlots();
    drawGoButton();
    drawResetButton();
	drawCancelButton();

    // Overlay order: tutorial > story > info
    if (tutorialActive) drawTutorialMessage();
    else if (storyActive) drawStoryMessage();
	if (infoActive) drawInfoMessage();
	if(inLevelMenu) showLevelMenu();
    if (gameStarted && !inLevelMenu) {
		const elapsedTime = Math.floor((Date.now() - levelStartTime) / 1000);
		c.fillStyle = "white";
		c.font = "16px sans-serif";
		c.textAlign = "left";
		c.fillText(`Time: ${elapsedTime}s`, 20, 400);
		const stars = calculateStars(elapsedTime, currentLevel);
		const starX = 20 + 190 * items.length + 50;
		const starY = 495;
		drawStars(starX, starY, stars, 16);
	}

}

function calculateStars(time, levelIndex = currentLevel) {
    const thresholds = levels[levelIndex].starThresholds;
    if (time <= thresholds.gold) return 3;
    if (time <= thresholds.silver) return 2;
    if (time <= thresholds.bronze) return 1;
    return 0;
}


function playNote(freq=440, duration=0.2, type="square") {
    try {
        let o = ac.createOscillator();
        let g = ac.createGain();
        o.type = type;
        o.frequency.value = freq;
        o.connect(g);
        g.connect(sfxGain);
        g.gain.setValueAtTime(0, ac.currentTime);
        g.gain.linearRampToValueAtTime(0.05, ac.currentTime + 0.01);
        g.gain.linearRampToValueAtTime(0.05, ac.currentTime + 0.01);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + duration);
        o.start(ac.currentTime);
        o.stop(ac.currentTime + duration);
    } catch (e) {
        console.error("Error playing note:", e);
    }
}

function playNextNote() {
    if (!musicPlaying) return;
    let freq = melodyFreqs[noteIndex];
    let dur = melodyDurations[noteIndex];
    let o = ac.createOscillator();
    let g = ac.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.1, ac.currentTime + 0.05);
    g.gain.linearRampToValueAtTime(0.0, ac.currentTime + dur);
    o.connect(g);
    g.connect(musicGain);
    o.start();
    o.stop(ac.currentTime + dur + 0.1);
    noteIndex = (noteIndex + 1) % melodyFreqs.length;
    melodyTimeout = setTimeout(playNextNote, dur * 1000);
}

function startMusic() {
	if (musicPlaying || ac.state !== "running") return;
    musicPlaying = true;    musicPlaying = true;
    noteIndex = 0;
    playNextNote();
}

function stopMusic() {
    musicPlaying = false;
    clearTimeout(melodyTimeout);
}

function sfxItem() {
    [150, 350].forEach((f, i) => {
        setTimeout(() => {
            playNote(f, 0.15);
        }, i * 150);
    });
}

function sfxJump() {
    ["sawtooth", "triangle"].forEach((type, i) => {
        let o = ac.createOscillator();
        let g = ac.createGain();
        o.type = type;
        o.frequency.setValueAtTime(800, ac.currentTime);
        o.frequency.exponentialRampToValueAtTime(300, ac.currentTime + 0.25);
        g.gain.setValueAtTime(0, ac.currentTime);
        g.gain.linearRampToValueAtTime(0.05 + i * 0.1, ac.currentTime + 0.01);
        g.gain.linearRampToValueAtTime(0, ac.currentTime + 0.25);
        o.connect(g);
        g.connect(sfxGain);
        o.start(ac.currentTime);
        o.stop(ac.currentTime + 0.25);
    });
}

function sfxTeleport() {
    let o = ac.createOscillator();
    let g = ac.createGain();
    o.type = "triangle";
    o.frequency.setValueAtTime(1500, ac.currentTime);
    o.frequency.exponentialRampToValueAtTime(150, ac.currentTime + 0.4);
    let lfo = ac.createOscillator();
    let lfoGain = ac.createGain();
    lfo.frequency.value = 25;
    lfoGain.gain.value = 80;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);
    g.gain.setValueAtTime(0, ac.currentTime);
    g.gain.linearRampToValueAtTime(0.15, ac.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.4);
    o.connect(g);
    g.connect(sfxGain);
    o.start(ac.currentTime);
    o.stop(ac.currentTime + 0.4);
    lfo.start(ac.currentTime);
    lfo.stop(ac.currentTime + 0.4);
    let sparkle = ac.createOscillator();
    let sg = ac.createGain();
    sparkle.type = "sine";
    sparkle.frequency.setValueAtTime(2000, ac.currentTime);
    sg.gain.setValueAtTime(0.3, ac.currentTime);
    sg.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
    sparkle.connect(sg);
    sg.connect(sfxGain);
    sparkle.start(ac.currentTime);
    sparkle.stop(ac.currentTime + 0.15);
}

function sfxStep() {
    playNote(800, 0.1, "triangle");
}

function sfxWin() {
    [440, 660, 880].forEach((f, i) => {
        setTimeout(() => {
            playNote(f, 0.15);
        }, i * 150);
    });
}

cv.addEventListener("click", (e) => {
	if (showStartMenu) {
        const rect = cv.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (x >= 300 && x <= 400 && y >= 260 && y <= 300) {
            const savedLevel = parseInt(localStorage.getItem("currentLevel")) || 0;
            currentLevel = savedLevel;
            loadLevel(currentLevel);
            showStartMenu = false;
            draw();
        } else if (x >= 400 && x <= 500 && y >= 260 && y <= 300) {
            showStartMenu = false;
            loadLevel(currentLevel);
            draw();
        }
        return;
    }
	if (inLevelMenu) {
		const rect = cv.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		if (x >= 250 && x <= 400 && y >= 180 && y <= 230) {
			inLevelMenu = false;
			loadLevel(currentLevel);
		} else if (currentLevel + 1 < levels.length && x >= 420 && x <= 570 && y >= 180 && y <= 230) {
			inLevelMenu = false;
			currentLevel++;
			loadLevel(currentLevel);
		} else {
			for (let i = 0; i < levels.length; i++) {
				if (x >= 120 + (i * 60) && x <= 160 + (i * 60) && y >= 320 && y <= 360) {
					if (unlockedLevels.includes(i)) {
						inLevelMenu = false;
						currentLevel = i;
						loadLevel(currentLevel);
						break;
					}
				}
			}
		}
		return;
	}
    if (tutorialActive) {
        currentMessageIndex++;
        if (currentMessageIndex >= tutorialMessages.length) {
            tutorialActive = false;
            // If there is a story, show it now; otherwise, start the level
            if (storyMessages.length > 0) {
                storyActive = true;
                gameStarted = false;
            } else {
                gameStarted = false; // Wait for GO! or user interactions
            }
        }
        return;
    } else if (storyActive) {
        currentStoryIndex++;
        if (currentStoryIndex >= storyMessages.length) {
            storyActive = false;
            gameStarted = false; // remain paused until player presses GO!
        }
        return;
    } else if (infoActive) {
		infoActive = false;
		draw();
		return;
	} else {
        const rect = cv.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        if (y > 420 && y < 520) {
			const slotIndex = Math.floor((x - 20) / 190);
			const slotX = 20 + slotIndex * 180;
			if (slotIndex >= 0 && slotIndex < items.length) {
				const sx = 20 + 190 * slotIndex;
				const sy = 420;
				const dx = x - (sx + 20);
				const dy = y - (sy + 30);
				if (Math.sqrt(dx*dx + dy*dy) <= 15) {
					const item = items[slotIndex];
					infoMessage = itemDescriptions[item];
					infoActive = true;
					draw();
					return;
				} else if (slotIndex >= 0 && slotIndex < items.length && x >= slotX && x <= slotX + 200) {
					selectedItem = items[slotIndex];
					draw();
				}
			}
        } else if (y < 410 && selectedItem && itemCounts[selectedItem] > 0) {
            const col = Math.floor((x - startX) / (tileSize + spacing));
            const row = Math.floor((y - startY) / (tileSize + spacing));
            if (row >= 0 && row < 7 && col >= 0 && col < 15) {
				if (!objects[row][col] && grid[row][col] !== "M" && grid[row][col] !== "F" && grid[row][col] !== "I" && !(row === cat.row && col === cat.col) && !teleporters.some(tp => tp.row === row && tp.col === col)) {
                    if (selectedItem === "MOUSE") {
						if (mouse === null) {
							objects[row][col] = "O";
							mouse = { row, col };
							itemCounts[selectedItem]--;
							sfxItem();
							placedObjects.push({row: row, col: col, type: selectedItem});
						}
					} else {
						objects[row][col] = selectedItem === "FOOD" ? "D" :
											selectedItem === "BOX" ? "X" :
											selectedItem === "BALL" ? "B" : null;
						itemCounts[selectedItem]--;
						sfxItem();
						placedObjects.push({row: row, col: col, type: selectedItem});
					}
                    draw();
                }
            }
        }
        const rx = 20 + 190 * items.length + 40 + 10;
        const ry = 430;
        const rSize = 40;
        if (x >= rx && x <= rx + rSize && y >= ry && y <= ry + rSize) {
            loadLevel(currentLevel);
            return;
        }
        const gx = 20 + 190 * items.length;
        const gy = 430;
        const gSize = 40;
        if (x >= gx && x <= gx + gSize && y >= gy && y <= gy + gSize) {
            gameStarted = true;
			levelStartTime = Date.now();
        }
		const cx = 20 + 190 * items.length + 40 + 10 + 50;
		const cy = 430;
		const cSize = 40;
		if (x >= cx && x <= cx + cSize && y >= cy && y <= cy + cSize) {
			cancelLastPlacement();
			draw();
		}
    }
});

function moveCat() {
	if (mouse === null) {
		chasing = false;
	}
    if (!chasing) {
        chasing = findVisibleMouse(cat.row, cat.col);
    }
    if (catWait > 0) {
        catWait--;
        return;
    }
	if (lastTeleporterUsed && (lastTeleporterUsed.row !== cat.row || lastTeleporterUsed.col !== cat.col)) {
		lastTeleporterUsed = null;
	}
	for (const tp of teleporters) {
        if (cat.row === tp.row && cat.col === tp.col) {
			if (!(cat.row === tp.destination.row && cat.col === tp.destination.col) && !(lastTeleporterUsed && lastTeleporterUsed.row === tp.row && lastTeleporterUsed.col === tp.col)) {
				cat.row = tp.destination.row;
                cat.col = tp.destination.col;
				sfxTeleport();
                catWait = MOVE_DELAY;
				lastTeleporterUsed = tp.destination;
                return;
            }
        }
    }
    const dirs = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    for (let [dr, dc] of dirs) {
        const r = cat.row + dr;
        const c = cat.col + dc;
        if (r >= 0 && r < 7 && c >= 0 && c < 15) {
            if (grid[r][c] === "F") {
                cat.row = r;
                cat.col = c;
				sfxWin();
                const elapsedTime = Math.floor((Date.now() - levelStartTime) / 1000);
				const stars = calculateStars(elapsedTime, currentLevel);
				if (stars > levelStars[currentLevel]) {
					levelStars[currentLevel] = stars;
					localStorage.setItem("levelStars", JSON.stringify(levelStars));
				}
				if (elapsedTime < levelTimes[currentLevel]) {
					levelTimes[currentLevel] = elapsedTime;
					localStorage.setItem("levelTimes", JSON.stringify(levelTimes));
				}
				gameStarted = false;
				loadNextLevel();
				return;
            }
        }
    }
    const jumpDirs = [
        [2, 0], [-2, 0], [0, 2], [0, -2]
    ];
    for (let [dr, dc] of jumpDirs) {
        const r = cat.row + dr;
        const c = cat.col + dc;
        if (r >= 0 && r < 7 && c >= 0 && c < 15) {
            if (objects[r][c] === "B") {
                cat.row = r;
                cat.col = c;
                objects[r][c] = null;
                catWait = 60;
				sfxJump();
                return;
            }
        }
    }
    if (mouse && chasing) {
        const path = findPath(cat.row, cat.col, mouse.row, mouse.col);
        if (path && path.length > 0) {
            const nextStep = path[0];
            lastMoveDirection = { dr: nextStep.row - cat.row, dc: nextStep.col - cat.col };
            cat.row = nextStep.row;
            cat.col = nextStep.col;
			sfxStep();
            catWait = MOVE_DELAY;
            if (cat.row === mouse.row && cat.col === mouse.col) {
                objects[mouse.row][mouse.col] = null;
                mouse = null;
            }
            return;
        }
    }
    const foodTarget = findVisibleFood(cat.row, cat.col);
    if (foodTarget) {
        const [fr, fc] = foodTarget;
        lastMoveDirection = { dr: fr - cat.row, dc: fc - cat.col };
        if (fr !== cat.row) cat.row += Math.sign(fr - cat.row);
        else if (fc !== cat.col) cat.col += Math.sign(fc - cat.col);
        if (fr === cat.row && fc === cat.col) objects[fr][fc] = null;
		sfxStep();
        catWait = Math.floor(Math.random() * 30 + 10);
		return;
    }
	const adjacentTeleporters = teleporters.filter(tp =>
        (Math.abs(tp.row - cat.row) + Math.abs(tp.col - cat.col)) === 1
    );
    if (adjacentTeleporters.length > 0) {
        const tp = adjacentTeleporters[0];
        lastMoveDirection = { dr: tp.row - cat.row, dc: tp.col - cat.col };
        cat.row = tp.row;
        cat.col = tp.col;
        catWait = MOVE_DELAY;
        return;
    }
}

function moveMouse() {
    if (!mouse) return;
    if (mouseMoveWait > 0) {
        mouseMoveWait--;
        return;
    }
    const accessibleCells = [];
    const visited = new Set();
    const queue = [[mouse.row, mouse.col]];
    const key = (r, c) => `${r},${c}`;
    while (queue.length > 0) {
        const [r, c] = queue.shift();
        if (r < 0 || r >= grid.length || c < 0 || c >= grid[0].length) continue;
        if (grid[r][c] === "M" || objects[r][c] === "X") continue;
        if (r === cat.row && c === cat.col) continue;
        if (visited.has(key(r, c))) continue;
        visited.add(key(r, c));
        accessibleCells.push([r, c]);
        queue.push([r - 1, c]);
        queue.push([r + 1, c]);
        queue.push([r, c - 1]);
        queue.push([r, c + 1]);
    }
    if (accessibleCells.length === 0) return;
    const distancesToCat = accessibleCells.map(([r, c]) => {
        const path = findPath(r, c, cat.row, cat.col);
        return { cell: [r, c], distance: path ? path.length : Infinity };
    });
    distancesToCat.sort((a, b) => b.distance - a.distance);
    const targetCell = distancesToCat[0].cell;
    const avoid = new Set([`${cat.row},${cat.col}`]);
    const pathToTarget = findPath(mouse.row, mouse.col, targetCell[0], targetCell[1], avoid);
    if (pathToTarget && pathToTarget.length > 0) {
        if (objects[mouse.row][mouse.col] === "O") {
            objects[mouse.row][mouse.col] = null;
        }
        const nextStep = pathToTarget[0];
        mouse.row = nextStep.row;
        mouse.col = nextStep.col;
    }
    mouseMoveWait = MOVE_DELAY;
}

function findVisibleFood(row, col) {
    const dirs = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    for (let [dr, dc] of dirs) {
        let r = row, c = col;
        while (true) {
            r += dr;
            c += dc;
            if (r < 0 || r >= 7 || c < 0 || c >= 15) break;
            if (grid[r][c] === "M" || objects[r][c] === "X") break;
            if (objects[r][c] === "D") return [r, c];
        }
    }
    return null;
}

function findVisibleMouse(row, col) {
    const dirs = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    for (let [dr, dc] of dirs) {
        let r = row, c = col;
        while (true) {
            r += dr;
            c += dc;
            if (r < 0 || r >= 7 || c < 0 || c >= 15) break;
            if (grid[r][c] === "M" || objects[r][c] === "X") break;
            if (mouse && r === mouse.row && c === mouse.col) return [r, c];
        }
    }
    return null;
}

function findPath(startRow, startCol, targetRow, targetCol, avoidCells = new Set()) {
    const rows = grid.length;
    const cols = grid[0].length;
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [];
    const parent = {};
    const key = (r, c) => `${r},${c}`;
    queue.push({ row: startRow, col: startCol });
    visited[startRow][startCol] = true;
    while (queue.length > 0) {
        const current = queue.shift();
        if (current.row === targetRow && current.col === targetCol) {
            const path = [];
            let step = { row: targetRow, col: targetCol };
            while (step.row !== startRow || step.col !== startCol) {
                path.unshift(step);
                step = parent[`${step.row},${step.col}`];
            }
            return path;
        }
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]];
        for (let [dr, dc] of dirs) {
            const nr = current.row + dr;
            const nc = current.col + dc;
            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && !visited[nr][nc] && grid[nr][nc] !== "M" && objects[nr][nc] !== "X" && !avoidCells.has(key(nr, nc))) {
                visited[nr][nc] = true;
                parent[`${nr},${nc}`] = { row: current.row, col: current.col };
                queue.push({ row: nr, col: nc });
            }
        }
    }
    return null;
}

function loadNextLevel() {
    if (!unlockedLevels.includes(currentLevel + 1)) {
        unlockedLevels.push(currentLevel + 1);
    }
    if (currentLevel + 1 > maxLevel) {
        maxLevel = currentLevel + 1;
        localStorage.setItem("maxLevel", maxLevel);
    }
	localStorage.setItem("currentLevel", currentLevel + 1);
    showLevelMenu();
}

loadLevel(currentLevel);

function gameLoop() {
    draw();
    if (!inLevelMenu && gameStarted) {
        moveCat();
        moveMouse();
        if (mouse && cat.row === mouse.row && cat.col === mouse.col) {
            objects[mouse.row][mouse.col] = null;
            mouse = null;
        }
    }
    requestAnimationFrame(gameLoop);
}

gameLoop();
