/******************************js for the title ****************************** */
function playAudio() {
  document.getElementById("bgm").play();
}
function animateText(element) {
  let iteration = 0;
  let interval;
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  clearInterval(interval);

  interval = setInterval(() => {
    element.innerText = element.innerText
      .split("")
      .map((letter, index) => {
        if (index < iteration) {
          return element.dataset.value[index];
        }
        return letters[Math.floor(Math.random() * 26)];
      })
      .join("");

    if (iteration >= element.dataset.value.length) {
      clearInterval(interval);
    }

    iteration += 1 / 3;
  }, 23);
}

function startAnimationOnLoad() {
  const h1Element = document.querySelector("h1");
  animateText(h1Element);
}

function startAnimationOnMouseover(event) {
  animateText(event.target);
}

// Use window.onload to ensure the script runs after the entire page has loaded
window.onload = startAnimationOnLoad;

const h1Element = document.querySelector("h1");
h1Element.onmouseover = startAnimationOnMouseover;
/******************************VUE CODE ****************************** */

function randomAttack(max, min) {
  return Math.floor(Math.random() * (max - min)) + min;
}

const app = Vue.createApp({
  data() {
    return {
      playerHealth: 100,
      monsterHealth: 100,
      currentRound: 0,
      winner: null,
      logMessage: [],
    };
  },
  watch: {
    playerHealth(value) {
      if (value <= 0 && this.monsterHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "monster";
      }
    },
    monsterHealth(value) {
      if (value <= 0 && this.playerHealth <= 0) {
        this.winner = "draw";
      } else if (value <= 0) {
        this.winner = "player";
      }
    },
  },
  computed: {
    playerHealthBar() {
      if (this.playerHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.playerHealth + "%" };
    },
    monsterHealthBar() {
      if (this.monsterHealth < 0) {
        return { width: "0%" };
      }
      return { width: this.monsterHealth + "%" };
    },
    specialAtkDis() {
      return this.currentRound % 3 !== 0;
    },
  },
  methods: {
    startOver() {
      this.playerHealth = 100;
      this.monsterHealth = 100;
      this.currentRound = 0;
      this.winner = null;
      this.logMessage = [];
    },
    playerAttack() {
      this.currentRound++;
      const attackValue = randomAttack(12, 5);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.monsterAttack();
    },
    monsterAttack() {
      const attackValue = randomAttack(15, 8);
      this.playerHealth -= attackValue;
      this.addLogMessage("monster", "attack", attackValue);
    },
    specialAttack() {
      this.currentRound++;
      const attackValue = randomAttack(20, 10);
      this.monsterHealth -= attackValue;
      this.addLogMessage("player", "attack", attackValue);
      this.monsterAttack();
    },
    healPlayer() {
      this.currentRound++;
      const heal = randomAttack(25, 10);
      if (this.playerHealth + heal > 100) {
        this.playerHealth = 100;
      } else {
        this.playerHealth += heal;
      }
      this.addLogMessage("player", "heal", heal);
      this.monsterAttack();
    },
    surrenderPlayer() {
      this.winner = "monster";
    },
    addLogMessage(who, what, value) {
      this.logMessage.unshift({
        actionBy: who,
        actionType: what,
        actionValue: value,
      });
    },
  },
});

app.mount("#game");
