class play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    //preloads assets so we can use them in game
    preload() { 
        this.load.image('stars', 'assets/stars.png');
        this.load.image('galaxy', 'assets/galaxy.png');
        this.load.image('rocket', 'assets/rocket.png');
        this.load.image('spaceship', 'assets/ship.png'); 
        // load spritesheet
        this.load.spritesheet('explosion', 'assets/explosion.png', {frameWidth: 200, frameHeight: 200, startFrame: 0, endFrame: 2});
    }

    create() {
        //tile sprite wants five parameters: x-position, y-position, width, height, and a key string that tells us which image to use
        //this.galaxy = this.add.tileSprite(0, 0, 640, 480, 'galaxy').setOrigin(0,0);
        this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0,0);
        //green ui bg - add and rectangle come from phaser framework
        //parameters: ?, ?, width, height, color
        //Im guessing the first two parameters are the starting position as in where to draw the rectangle
        //default origin is the middle of rectangle, we want the upper left corner
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0,0); 

        // add spaceships (x3)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding * 2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);

        //white borders 
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        
        //add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);

        //define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        //animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 2, first: 0}),
            frameRate: 3
        });
    }

    update() {
        this.stars.tilePositionX -= 2;
        this.p1Rocket.update();
        this.ship01.update();
        this.ship02.update();
        this.ship03.update();

        // check collisions: needs to update every frame so it goes here
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        //if two rectangles overlap, return true
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            }
            else {
                return false;
            }
    }
    //this is called correctly but animation is not playing
    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });       
      }

}

