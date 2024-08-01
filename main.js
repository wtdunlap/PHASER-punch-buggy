import "./style.css";
import Phaser from "phaser";

const gameStartDiv = document.querySelector("#gameStartDiv");
const gameStartBtn = document.querySelector("#gameStartBtn");
const gameEndDiv = document.querySelector("#gameEndDiv");

const sizes = {
    width: 800,
    height: 600,
};

class GameScene extends Phaser.Scene {
    constructor() {
        super("scene-game");
        // array of objects
        this.chosenCar = [];

        // text and score
        this.wins = 0;
        this.losses = 0;
        this.textScore;

        // utlity
        this.timeline;
        this.workingArray;
        this.toggle;
    }

    preload() {
        // preload images to reduce loading later
        this.load.image("yellow", "/assets/yellow.png");
        this.load.image("red", "/assets/red.png");
        this.load.image("grey", "/assets/grey.png");
        this.load.image("window", "/assets/window.png");
    }

    create() {
        // pause the game until start button is pressed
        // this.scene.pause("scene-game");

        this.texScore = this.add.text(10, 10, "wins: 0\nlosses: 0", {
            font: "25px Arial",
            fill: "#000000",
        }).setDepth(11);
        this.add
            .image(-425, -60, "window")
            .setOrigin(0, 0)
            .setScale(1.5)
            .setDepth(10);

        // setup timeline for repeat use
        const timeline = this.add.timeline([
            {
                at: 1000,
                run: () => {
                    this.buildCarsforTimeline(this.carSelect());
                    this.physics.moveTo(
                        this.chosenCar[0],
                        -1000,
                        275,
                        Phaser.Math.Between(450, 750)
                    );
                    console.log(this.chosenCar[0].texture.key);
                },
            },
            {
                at: 3000,
                run: () => {
                    this.physics.moveTo(
                        this.chosenCar[1],
                        -1000,
                        275,
                        Phaser.Math.Between(450, 750)
                    );
                    console.log(this.chosenCar[1].texture.key);
                },
            },
            {
                at: 5000,
                run: () => {
                    this.physics.moveTo(
                        this.chosenCar[2],
                        -1000,
                        275,
                        Phaser.Math.Between(450, 750)
                    );
                    console.log(this.chosenCar[2].texture.key);
                },
            },
            {
                at: 5500,
                run: () => {
                    console.log("end loop");
                },
            },
        ]);

        // save timeline
        this.timeline = timeline;

        // setup input
        // toggle to true on pointer down then check
        // to see if car is in given range on x axis
        // then check to see if the car is yellow
        // then increment winning if yellow else
        // losing
        this.input.on("pointerdown", () => {
            this.toggle = true;
            if (this.toggle) {
                if (this.chosenCar[0].x >= 400 && this.chosenCar[0].x <= 700) {
                    if (this.chosenCar[0].texture.key === "yellow") {
                        this.wins = this.wins + 1;
                        this.texScore.setText(`wins: ${this.wins}\nlosses: ${this.losses}`);
                        this.toggle = false;
                    } else {
                        this.losses = this.losses + 1;
                        this.texScore.setText(`wins: ${this.wins}\nlosses: ${this.losses}`);
                        this.toggle = false;
                    }
                }
                if (this.chosenCar[1].x >= 400 && this.chosenCar[1].x <= 700) {
                    if (this.chosenCar[1].texture.key === "yellow") {
                        this.wins = this.wins + 1;
                        this.texScore.setText(`wins: ${this.wins}\nlosses: ${this.losses}`);
                        this.toggle = false;
                    } else {
                        this.losses = this.losses + 1;
                        this.texScore.setText(`wins: ${this.wins}\nlosses: ${this.losses}`);
                        this.toggle = false;
                    }
                }
                if (this.chosenCar[2].x >= 400 && this.chosenCar[2].x <= 700) {
                    if (this.chosenCar[2].texture.key === "yellow") {
                        this.wins = this.wins + 1;
                        this.texScore.setText(`wins: ${this.wins}\nlosses: ${this.losses}`);
                        this.toggle = false;
                    } else {
                        this.losses = this.losses + 1;
                        this.texScore.setText(`wins: ${this.wins}\nlosses: ${this.losses}`);
                        this.toggle = false;
                    }
                }
            } else {
                this.toggle = false;
            }
        });
    }

    // runs every step
    update() {
        if (this.losses >= 3) {
            console.log("loss");
            this.timeline.stop();
        }

        // keeps the loop running
        if (!this.timeline.isPlaying()) {
            this.timeline.play();
        }
    }

    // this mixes the different potential values
    // represented as arrays so that premade cars
    // can be generated on the fly instead of
    // trying to prebuild everything
    carSelect() {
        // function to shuffle arrays
        const shuffle = (array) => {
            return array.sort(() => Math.random() - 0.5);
        };
        // build arrays for layer speed and order
        const layerArray = [2, 3, 4];
        const shuffledLayer = shuffle(layerArray);
        // build car array from random layers
        const carArray = [
            {
                color: "yellow",
                layer: shuffledLayer[0],
            },
            { color: "red", layer: shuffledLayer[1] },
            { color: "grey", layer: shuffledLayer[2] },
        ];
        // build shuffled array from shuffled array
        const shuffledCar = shuffle(carArray);

        // returns randomly ordered array of objects
        return shuffledCar;
    }

    // this takes the shuffled values from above and
    // turns them into sprites with attributes set
    // based on
    buildCarsforTimeline(shuffledCar) {
        const workingArray = shuffledCar;

        for (let i = 0; i < workingArray.length; i++) {
            this.chosenCar[i] = this.physics.add
                .image(
                    Phaser.Math.Between(1200, 1700),
                    275,
                    `${workingArray[i].color}`
                )
                .setOrigin(0.5, 0.5)
                .setScale(2.45)
                .setDepth(workingArray[i].layer);
        }
    }
}

const config = {
    type: Phaser.CANVAS,
    width: sizes.width,
    height: sizes.height,
    backgroundColor: "#a4e3f4",
    canvas: gameCanvas,
    physics: {
        default: "arcade",
        arcade: {
            gravity: { x: 0 },
            debug: false,
        },
    },
    scene: [GameScene],
};

const game = new Phaser.Game(config);

// event listener for first start. UI currently disabled
gameStartBtn.addEventListener("click", () => {
    gameStartDiv.style.display = "none";
    game.scene.resume("scene-game");
});
