
class GameHudScene extends Phaser.Scene{

    constructor(){
        super({key: "GameHudScene", active: false});

        this.prevScale = 1;
    }



    create(){
        //this.layer = this.add.container();

        

        this.scene.launch('GameScene');
        this.gameScene = this.scene.get('GameScene');
        
        
    }



    updateCamera(){
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;
        console.log("upd")

        //this.layer.width = width;
        //this.layer.height = height;

       // const camera = this.cameras.main;

        //camera.setViewport(0, 0, width, height);

        //this.layer.setPosition(width / 2, height / 2);

        console.log(this.children)
        this.layout();

        for(let i = 0; i < this.children.list.length; i++){
            let gameObject = this.children.list[i];
            gameObject.setScale(gameObject.scale * (1 / this.prevScale) * this.gameScene.getZoom());
        }
        this.prevScale = this.gameScene.getZoom();

        //this.layer.setScale(this.gameScene.getZoom());
        
        this.position();
    }


    resize(){
        this.updateCamera();
        
    }



    layout(){
        console.log(this.gameScene.dial)
        if(!this.btnShuffle){
            this.btnShuffle = new SpriteButton(this, 0, 0, "sheet1", "shuffle_up", "shuffle_down").setOrigin(0.5, 0.5);
            //this.btnShuffle.setCallback(this.scene.dial.shuffle, this.scene.dial);
            this.add.existing(this.btnShuffle);
        }
        
    }



    position(){

        this.sideMargin = 30 * this.gameScene.getZoom();
        let halfDial = this.gameScene.dial.height * 0.5;

        let global = this.gameScene.dial.getWorldTransformMatrix();
        //let local  = this.layer.getLocalPoint(global.tx, global.ty);

        console.log(this.btnShuffle.scale)
       
        this.btnShuffle.x = this.scale.gameSize.width * 0.5// this.gameScene.dial.x // this.scale.gameSize.width * 0.5;
        this.btnShuffle.y = this.gameScene.dial.y// + halfDial - this.btnShuffle.height;

  
    }

}