// História inicial
const storyText = `Hear me, oh traveler, the words that I will narrate to you with spirit and sorrow, concerning four fearless warriors, whose names have not been lost in the hearts of men, but are whispered in every corner of the lands ravaged by darkness. In a world where nightmares, tales, and stories have become reality, these brave knights took upon themselves a noble mission: to protect the weak, alleviate the suffering of the afflicted, and eradicate the evils that afflict the unfortunate.`;

// Áreas do jogo
const areas = [
  {
    name: "village",
    enemies: [],
    description:
      "The village of Alrond is silent, filled with an air of despair on the shores of the Shadowy Forest.",
  },
  {
    name: "Forest - Route 1",
    enemies: ["Slime", "Little Spider", "Alive Dead", "Appearance", "Shadow"],
    description: "A damp and slippery trail, full of webs and mud.",
  },
  {
    name: "Forest - Route 2",
    enemies: [
      "Alive Dead",
      "Appearance",
      "Shadow",
      "Spirit of the Villager",
      "Giant Spider",
    ],
    description:
      "Shadows move between the trees, a scent of death hangs in the air.",
  },
  {
    name: "Forest - Route 3",
    enemies: [
      "Shadow",
      "Spirit of the Villager",
      "Giant Spider",
      "Dog of Death",
      "Witch",
    ],
    description:
      "Whispering voices echo, as if the dead are telling their stories..",
  },
  {
    name: "Fourest - Route 4",
    enemies: ["Giant Spider", "Dog of the Death", "Witch", "Slime", "Alive Dead"],
    description: "The ground trembles with heavy footsteps and deep growls.",
  },
  {
    name: "The House of the Crooked Man",
    enemies: ["Croocke Man"],
    description:
      "The heart of the Dark Forest, where the Crooked Man waits with a frozen smile..",
  },
];

// Grupo inicial
const party = [
  {
    name: "Vitor",
    class: "Barbarian",
    hp: 136,
    maxHp: 136,
    attack: 20,
    abilities: [{ name: "Brutal Coup", damage: 30 }],
  },
  {
    name: "Lyra",
    class: "Rogue",
    hp: 72,
    maxHp: 72,
    attack: 15,
    abilities: [{ name: "Stealth Attack", damage: 25 }],
  },
  {
    name: "Elaine",
    class: "Wizard",
    hp: 56,
    maxHp: 56,
    attack: 10,
    mana: 100,
    abilities: [{ name: "explosion", damage: 40, manaCost: 20 }],
  },
  {
    name: "Jorin",
    class: "Cleric",
    hp: 94,
    maxHp: 94,
    attack: 10,
    mana: 80,
    abilities: [{ name: "Divine Healing", heal: 30, manaCost: 15 }],
  },
];

// Variáveis do jogo
let currentAreaIndex = 0;
let specialWeapons = [];
const totalSpecialWeapons = 4;
let currentEnemy = null;

// Animação da história
document.getElementById("start-button").addEventListener("click", () => {
  document.getElementById("welcome-screen").classList.add("hidden");
  document.getElementById("story-screen").classList.remove("hidden");
  typeWriter(storyText, 0);
});

function typeWriter(text, i) {
  const storyTextElement = document.getElementById("story-text");
  if (i < text.length) {
    storyTextElement.innerHTML += text.charAt(i);
    setTimeout(() => typeWriter(text, i + 1), 50);
  } else {
    setTimeout(() => {
      document.getElementById("continue-button").classList.remove("hidden");
    }, 1000);
  }
  document.getElementById("continue-button").classList.remove("hidden");
}

document.getElementById("continue-button").addEventListener("click", () => {
  document.getElementById("story-screen").classList.add("hidden");
  document.getElementById("class-selection").classList.remove("hidden");
});

// Escolha dos nomes
document.getElementById("confirm-names").addEventListener("click", () => {
  party[0].name = document.getElementById("barbaro-name").value || "Vitor";
  party[1].name = document.getElementById("ladino-name").value || "Lyra";
  party[2].name = document.getElementById("mago-name").value || "Elaine";
  party[3].name = document.getElementById("clerigo-name").value || "Jorin";
  document.getElementById("class-selection").classList.add("hidden");
  document.getElementById("game-container").classList.remove("hidden");
  document.getElementById("enemy-stats").classList.remove("hidden");
  document.getElementById("choices").classList.remove("hidden");
  document.getElementById("combat-log").classList.remove("hidden");
  startGame();
});

// Início do jogo
function startGame() {
  const body = document.querySelector("body");
  body.style.height = "100%";
  updateMap();
  updatePartyStats();
  updateChoices();
}

function updateMap() {
  document.getElementById(
    "map"
  ).innerHTML = `<h3>You are in the ${areas[currentAreaIndex].name}.</h3><p>${areas[currentAreaIndex].description}</p>`;
}

function updatePartyStats() {
  let stats = "<h3>Group</h3>";
  let icons = [
    "dwarf_3819495.png",
    "magician_5816350.png",
    "wizard_2436871.png",
    "man_preaching-religion-christian-1024.webp",
  ];
  let i = 0;

  party.forEach((member) => {
      stats += `<p><img src='../images/${icons[i++]}' width='30' /> ${
        member.name
      } (${member.class}): HP ${member.hp}/${member.maxHp}${
        member.mana ? `, Mana ${member.mana}` : ""
      }</p>`;
  });
  stats += `<p>Special Weapons: ${specialWeapons.length}/${totalSpecialWeapons}</p>`;
  document.getElementById("party-stats").innerHTML = stats;
}

function updateChoices() {
  const choicesDiv = document.getElementById("choices");
  if (currentAreaIndex === 0) {
    choicesDiv.innerHTML = `<button onclick="goToNextArea()">Go to the next area</button>`;
  } else if (currentAreaIndex < 5) {
    choicesDiv.innerHTML = `
        <button onclick="fight()">Fight</button>
        <button onclick="tryToFlee()">Try to Escape</button>
        `;
  } else {
    choicesDiv.innerHTML = `<button onclick="fight()">Facing the Crooked Man</button>`;
  }
}

// Lógica das ações
function goToNextArea() {
  currentAreaIndex++;
  if (currentAreaIndex < areas.length) {
    updateMap();
    updateChoices();
  }
}

function tryToFlee() {
  if (Math.random() < 0.5) {
    log("You managed to escape!");
    goToNextArea();
  } else {
    log("You failed to escape and are forced to fight!");
    fight();
  }
}

function fight() {
  const enemies = areas[currentAreaIndex].enemies;
  const enemyName = enemies[Math.floor(Math.random() * enemies.length)];
  currentEnemy = createEnemy(enemyName);
  updateEnemyStats();
  combatTurn();
}

function createEnemy(name) {
  const audio = document.querySelector("#source");
  switch (name) {
    case "Slime":
      return { name: "Slime", hp: 30, maxHp: 30, attack: 10 };
    case "Little Spider":
      return { name: "Little Spider", hp: 20, maxHp: 20, attack: 15 };
    case "Alive Dead":
      return { name: "Alive Dead", hp: 40, maxHp: 40, attack: 12 };
    case "Appearance":
      return { name: "Appearance", hp: 25, maxHp: 25, attack: 18 };
    case "Shadow":
      return { name: "Shadow", hp: 35, maxHp: 35, attack: 15 };
    case "Spirit of the Villager":
      return { name: "Spirit of the Villager", hp: 30, maxHp: 30, attack: 14 };
    case "Giant Spider":
      return { name: "Giant Spider", hp: 50, maxHp: 50, attack: 20 };
    case "Dog of Death":
      return { name: "Dog of Death", hp: 45, maxHp: 45, attack: 22 };
    case "Witch":
      return { name: "Witch", hp: 40, maxHp: 40, attack: 18 };
    case "Crooked Man":
      return {
        name: "Crooked Man",
        hp: 240,
        maxHp: 240,
        attack: 25,
        special: true,
      };
    default:
      return { name: "Unknown Enemy", hp: 50, maxHp: 50, attack: 20 };
  }
}

function updateEnemyStats() {
  document.getElementById(
    "enemy-stats"
  ).innerHTML = `<h3>Enemy: </h3><p>${currentEnemy.name}: HP ${currentEnemy.hp}/${currentEnemy.maxHp}</p>`;
  if(currentEnemy.name == "Crooked Man") {
    console.log("Ola")
    audio.setAtribute("src","./sounds/Dark Forest (Ambience music) [gEyuH_nRUcE].m4a");
  }
}

function combatTurn() {
  let choices = "<h3>Choose an action</h3>";
  party.forEach((member, index) => {
    if (member.hp > 0) {
      choices += `<button onclick="attack(${index})">${member.name}: Attack</button>`;
      choices += `<button onclick="useAbility(${index})">${member.abilities[0].name}</button><br>`;
    }
  });
  document.getElementById("choices").innerHTML = choices;


  // Turno do inimigo
  if (currentEnemy.hp > 0) {
    const target = party.find((m) => m.hp > 0);
    if (target) {
      const damage = currentEnemy.attack;
      target.hp = Math.max(0, target.hp - damage);
      log(`${currentEnemy.name} attack ${target.name} for ${damage} of damage!`);
      updatePartyStats();
      if (party.every((m) => m.hp <= 0)) endGame(false);
    }
  }
}

function attack(index) {
  const member = party[index];
  const damage = member.attack;
  currentEnemy.hp = Math.max(0, currentEnemy.hp - damage);
  log(`${member.name} attack ${currentEnemy.name} for ${damage} of damage!`);
  updateEnemyStats();
  if (currentEnemy.hp <= 0) endCombat();
  else combatTurn();
}

function useAbility(index) {
  const member = party[index];
  const ability = member.abilities[0];
  if (ability.damage) {
    const damage = ability.damage;
    currentEnemy.hp = Math.max(0, currentEnemy.hp - damage);
    log(
      `${member.name} use ${ability.name} and make ${damage} of damage in ${currentEnemy.name}!`
    );
    updateEnemyStats();
  } else if (ability.heal) {
    const target = party.find((m) => m.hp > 0 && m.hp < m.maxHp);
    if (target) {
      target.hp = Math.min(target.maxHp, target.hp + ability.heal);
      member.mana -= ability.manaCost;
      log(
        `${member.name} use ${ability.name} and treatment ${target.name} for ${ability.heal} HP!`
      );
      updatePartyStats();
    }
  }
  if (currentEnemy.hp <= 0) endCombat();
  else combatTurn();
}

function endCombat() {
  log(`${currentEnemy.name} was defeated!`);
  if (currentAreaIndex < 5) checkForSpecialWeapon();
  document.getElementById("enemy-stats").innerHTML = "<h3>Enemy:</h3>";
  document.getElementById(
    "choices"
  ).innerHTML = `<button onclick="goToNextArea()">Move to the next area</button>`;
  let combatLog = document.querySelector("#combat-log");
  combatLog.innerHTML = "<h3>Combat - Logs</h3>";
}

function checkForSpecialWeapon() {
  if (specialWeapons.length < totalSpecialWeapons && Math.random() < 0.25) {
    specialWeapons.push(`Special Weapons ${specialWeapons.length + 1}`);
    log("You found a Special Weapon!");
    updatePartyStats();
  }
}

function endGame(victory) {
  const logDiv = document.getElementById("combat-log");
  if (victory && currentAreaIndex === 5) {
    const winChance = specialWeapons.length >= 3 ? 0.6 : 0.2;
    if (Math.random() < winChance) {
      logDiv.innerHTML +=
        "<p>You defeated the Crooked Man and restored peace in Alrond!</p>";
    } else {
      logDiv.innerHTML +=
        "<p>You fought bravely, but the Crooked Man prevailed...</p>";
    }
  } else if (!victory) {
    logDiv.innerHTML += "<p>The group was defeated...</p>";
  }
  document.getElementById("choices").innerHTML = "";
}

function log(message) {
  const logDiv = document.getElementById("combat-log");
  logDiv.innerHTML += `<p>${message}</p>`;
  logDiv.scrollTop = logDiv.scrollHeight;
}
