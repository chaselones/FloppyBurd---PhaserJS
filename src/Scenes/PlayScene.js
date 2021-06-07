import Phaser from 'phaser'

const PIPE_COUNT = 6
const BIRD_GRAVITY = 400
const PIPE_VELOCITY = 200
const FLAP_VELOCITY = 300

class PlayScene extends Phaser.Scene {
    constructor(config) {
        super('PlayScene')
        this.config = config

        this.bird = null
        this.pipes = null
        this.pipeGapRange = [100, 300]

        this.pipeSpacingRange = [400, 600]

        // Define range for top pipe Y position
        this.topPipePosYRange = [30, config.height - 30]
    }

    //-----------------------------------------------------------------------
    //  LIFE CYCLE METHODS --------------------------------------------------
    //-----------------------------------------------------------------------

    preload() {

        this.load.image('sky', 'assets/sky.png')
        this.load.image('bird', 'assets/bird.png')
        this.load.image('pipe', 'assets/pipe.png')
    }

    create() {
        this.createBG()
        this.createBird()
        this.createPipes()
        this.createColliders()
        this.handleInput()
    }

    update() {
        this.checkBoundaries()
        this.recyclePipes()
    }

    //-----------------------------------------------------------------------
    // GAME METHODS ---------------------------------------------------------
    //-----------------------------------------------------------------------

    createBG() {
        // Background image added to center of canvas with width and height config props, then set the origin to the center of the image
        this.add.image(0, 0, 'sky').setOrigin(0, 0)
    }

    createBird() {
        // Add bird as an instantiated sprite (with physics) to the scene at 1/10 of the width, and 1/2 of the height
        this.bird = this.physics.add.sprite(this.config.startPos.x, this.config.startPos.y, 'bird').setOrigin(0)

        // BIRD GRAVITY
        this.bird.body.gravity.y = BIRD_GRAVITY

        // Set collider to world boundaries for bird
        this.bird.setCollideWorldBounds(true)
    }

    createPipes() {
        // Define pipes as a group
        this.pipes = this.physics.add.group();

        for (let i = 0; i < PIPE_COUNT; i++) {
            // Upper pipe first because the position of the lower pipe is dependeng upon the position of the upper pipe
            const upperPipe = this.pipes
                .create(0, 0, 'pipe')
                .setImmovable()
                .setOrigin(0, 1)

            const lowerPipe = this.pipes
                .create(0, 0, 'pipe')
                .setImmovable()
                .setOrigin(0, 0)

            this.placePipes(upperPipe, lowerPipe)
        }
        this.pipes.setVelocityX(-PIPE_VELOCITY)
    }

    // Colliders
    createColliders() {
        this.physics.add.collider(this.pipes, this.bird, this.gameOver, null, this)
    }


    // Inputs
    handleInput() {
        this.input.on('pointerdown', this.FLAP, this)
        this.input.keyboard.on('keydown_SPACE', this.FLAP, this)
    }

    // Bird ground boundary
    checkBoundaries() {
        if (this.bird.getBounds().bottom >= this.config.height || this.bird.y <= 0 - this.bird.height) {
            this.gameOver();
        }
    }

    placePipes(top, bottom) {
        const rightMostX = this.getRightMostPipe()
        // Vertical Spacing
        const pipeGap = Phaser.Math.Between(...this.pipeGapRange)

        //Horizontal spacing
        const pipeSpacing = Phaser.Math.Between(...this.pipeSpacingRange)

        // Define value to position the top pipe dynamically, considering the scene and the pipeGap
        const topPipePosY = Phaser.Math.Between(this.topPipePosYRange[0], this.topPipePosYRange[1] - pipeGap)

        //Positioning pipes
        top.x = rightMostX + pipeSpacing
        top.y = topPipePosY

        bottom.x = top.x
        bottom.y = top.y + pipeGap
    }

    // Get right most pipe, to position next pipes
    getRightMostPipe() {
        let rightMostX = 0
        this.pipes.getChildren().forEach((pipe) => {
            rightMostX = Math.max(pipe.x, rightMostX)
        })

        return rightMostX
    }

    // Recycle and reposition pipes
    recyclePipes() {
        const tempPipes = []
        this.pipes.getChildren().forEach(pipe => {
            if (pipe.getBounds().right < 0) {
                //recycle the pipe
                tempPipes.push(pipe)
                if (tempPipes.length === 2) {
                    this.placePipes(...tempPipes)
                }
            }
        })
    }

    // THIS IS WHERE ALL THE MAGIC LIES
    FLAP() {
        console.log("FLAPPING")
        this.bird.body.velocity.y += -FLAP_VELOCITY
    }

    // To reset the player position and velocity
    resetPlayer() {
        this.bird.x = this.config.startPos.x
        this.bird.y = this.config.startPos.y
        this.bird.body.velocity.y = 0
    }

    // THIS IS WHERE THE MAGIC DIES
    gameOver() {
        this.physics.pause()
        this.bird.setTint(0xEE4824)
        // this.resetPlayer()

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart()
            },
            loop: false
        })
    }
}

export default PlayScene