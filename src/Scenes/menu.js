class menu extends Phaser.Scene {
    constructor (){
        super("menuScene");
    }

    create() {
        this.add.text(20,20, "Rocket Patrol Menu"); //create text on this scene at 20,20
        this.scene.start("playScene"); //immediately jumps to game scene
    }
}