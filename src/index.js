// Obviously import phaser!
import Phaser from "phaser"
import PlayScene from './Scenes/PlayScene'

// ----------------------------------------------------------------------------------------------
// GAME OBJECTS AND GLOBALS ---------------------------------------------------------------------
// ----------------------------------------------------------------------------------------------

const WIDTH = 800
const HEIGHT = 600
const BIRD_POSITION = { x: WIDTH / 10, y: HEIGHT / 2 }

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPos: BIRD_POSITION
}

// Define properties of our config object
const config = {
  // WebGL JS API for graphics
  type: Phaser.AUTO,
  ...SHARED_CONFIG,

  // Define physics rules
  physics: {
    // Arcade physics plugin
    default: 'arcade',
    // Arcade physics unique properties
    arcade: {
      debug: true,
    }
  },

  scene: [new PlayScene(SHARED_CONFIG)]
}

new Phaser.Game(config)

// Here we will load assets, images, sounds, animations, sprites, etc...
function preload() {

}

// Define values, add assets to scene
function create() {

}