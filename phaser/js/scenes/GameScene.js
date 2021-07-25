





class GameScene extends Phaser.Scene{


    

    constructor(){
        super({key: "GameScene", active: false});
    }


    preload(){
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);
        this.load.rexWebFont({
            google: {
                families: [Config.FONT, "Luckiest Guy"]
            }
        });

    }



    create(){
        const width = this.scale.gameSize.width;
        const height = this.scale.gameSize.height;

        this.parent = new Phaser.Structs.Size(width, height);

        //this.gameHudScene = this.scene.get('GameHudScene');
        //this.layer = this.add.container();

        this.updateCamera();
        this.scale.on('resize', this.resize, this);
        this.startGame();

        this.previewTileParticleManagerPool = this.add.group({
            classType: PreviewTileParticleManager,
            runChildUpdate: false,
            createCallback: function () {
                //console.log('Created');
            },
            removeCallback: function () {
                //console.log('Removed');
            }
        });




        this.fps = this.add.text(0, 0, "Menu").setColor("#fff");
        this.fps.depth = 100;
        this.fps.setFontSize(40)
     
    }



    


    updateCamera(){

        let targetRatio = this.parent.height / this.parent.width;
        let sourceRatio = this.game.config.height / this.game.config.width;
        this.gameScale =  targetRatio > sourceRatio ? this.parent.width / this.game.config.width : this.parent.height / this.game.config.height;
      
        //this.viewportX = Math.ceil((this.parent.width - this.sourceWidth * scale) * 0.5);
       // this.viewportY = Math.ceil((this.parent.height - this.sourceHeight * scale) * 0.5);

       /*camera.zoom = scale;

        this.layer.width = this.sourceWidth;
        this.layer.height = this.sourceHeight;
        this.layer.setScale(scale);
        this.layer.x = (this.scale.gameSize.width - this.layer.width * scale) * 0.5;
        this.layer.y = (this.scale.gameSize.height - this.layer.height * scale) * 0.5;*/
 
   

        /*if(!this.graphics){
            var graphics = this.add.graphics();
            this.layer.add(graphics)
    
            graphics.fillStyle(0x00ff00, 1);
            graphics.fillRect(0, 0, this.layer.width, this.layer.height);
            this.graphics = graphics;
        }*/
        

    }


   


    resize(gameSize, baseSize, displaySize, resolution){
        const width = gameSize.width;
        const height = gameSize.height;

        this.parent.setSize(width, height);
        this.updateCamera();
        this.position();
    }



    startGame(){
        Language.setNewLanguage("en", this);

        this.hintController = new HintController(this);
        this.gameController = new GameController(this);
        this.comboController = new ComboController(this);

        this.gameController.createLevel();
    }




    createLevelContent(){
        
        this.createBoard();
        this.createPreview();
        this.createDial();
        this.position();
        


    
        if(!this.gameHud) this.gameHud = new GameHud(this);
        this.gameHud.positionHud();


        this.comboController.resumeCombo();

        this.board.setVisible(true);
        this.dial.setVisible(true);
        this.preview.setVisible(true);

        this.gameHud.setComboEarned(Math.max(0, GameData.getComboReward()));
        let wordCountMinusOne = GameData.level.getWordCount() - 1;

        let savedCombo = GameData.getComboCount() - 1;
        this.gameHud.setSolvedComboCount(Math.max(0, savedCombo), wordCountMinusOne);
        
        if(savedCombo > 0){
            this.gameHud.setSemiCircleValue(savedCombo / wordCountMinusOne);
        }

        //this.showComboFeedback();
        
    }


    createPreview(){
        if(!this.preview){
            this.preview = new Preview(this);

            this.gameController.preview = this.preview;
            this.add.existing(this.preview);
            
        }

        //this.preview.setDepth(this.board.depth + 1);
    }


    createBoard(){
        if(!this.board){
            //this.board = new Phaser.GameObjects.Image(this, 0, 0, "sheet1", "dial");// new Board(this);
            this.board = new Board(this);
            this.add.existing(this.board);
        }
        this.board.layout();

    }



    createDial(){
        if(!this.dial){
            this.dial = new Dial(this);
            this.dial.gameController = this.gameController;
            this.add.existing(this.dial);
            
        }
        //this.dial.setDepth(this.board.depth + 4);
        this.dial.setLetters(GameData.level.letters);
    }



    position(){

        let notchEnd = GameHud.topbarHeight * this.gameScale;

        this.board.scale = this.dial.scale = this.preview.scale = this.gameScale;


        let totalHeight = this.scale.gameSize.height - notchEnd;
        let availableHeight = totalHeight - this.board.height * this.board.scale - this.dial.height * this.dial.scale;
        let space = availableHeight / 3;


        this.board.x = this.scale.gameSize.width * 0.5;
        this.board.y = notchEnd + this.board.height * this.board.scale * 0.5 + space;

        this.positionPreview();

       
        this.dial.x = this.board.x;
        this.dial.y = this.board.y + this.board.height * this.board.scale * 0.5 + space + this.dial.height * this.dial.scale * 0.5;
    
        

        if(this.dialEffect1) this.positionDialEffectRings();
        if(this.gameHud) this.gameHud.positionHud();
        if(this.levelEnd) {
            this.positionLevelEnd();
            this.levelEnd.onResize();
            
        }
    }



    positionPreview(){  
        this.preview.x = this.board.x;
        this.preview.y = this.board.y + this.board.height * this.board.scale * 0.5 - this.preview.height * this.preview.scale - 30 * this.gameScale;
    }




    



    update(time, delta){
        if(this.preview) this.preview.update();
        if(this.fps) this.fps.setText(game.loop.actualFps.toFixed(2));

        if(this.comboController.cameraShaker && this.comboController.cameraShaker.isShaking){
            let shake = this.comboController.cameraShaker.getNewShakePosition();
            this.cameras.main.setPosition(shake.x, shake.y);
        }

        if(this.gameHud && this.gameHud.dictDialog && this.gameHud.dictDialog.visible){
            this.gameHud.dictDialog.update();
        }

    }




    createDialAnimationEffect(){
        if(!this.dialEffect1){
            this.dialEffect1 = new Phaser.GameObjects.Image(this, 0, 0, "sheet1", "dial_effect");
            this.dialEffect1.alpha  = 0; 
            this.add.existing(this.dialEffect1);
            this.dialEffect1.setDepth(this.dial.depth - 2);
            
            //this.dialEffect1.setVisible(false);

            this.dialEffect2 = new Phaser.GameObjects.Image(this, 0, 0, "sheet1", "dial_effect");
            this.dialEffect2.alpha  = 0;
            this.add.existing(this.dialEffect2);
            this.dialEffect2.setDepth(this.dial.depth - 1);
            //this.dialEffect2.setDepth(this.dial.depth - 1);
            
            //this.dialEffect2.setVisible(false);
            this.positionDialEffectRings();


        }
    }




    positionDialEffectRings(){
        //this.dialEffect1.scale = this.dialEffect2.scale = this.gameScale;
        this.dialEffect1.setPosition(this.dial.x, this.dial.y);
        this.dialEffect2.setPosition(this.dial.x, this.dial.y);
    }




    comboShaderAnim(callback, rewardToIncrement){
        //callback(this.gameController);
        this.comboController.tempComboReward += rewardToIncrement;
        GameData.saveComboReward(this.comboController.tempComboReward);
        this.gameHud.setComboEarned(this.comboController.tempComboReward);
        this.gameHud.setSolvedComboCount(rewardToIncrement, GameData.level.getWordCount() - 1);
        this.gameHud.animateSemiCircle(rewardToIncrement / (GameData.level.getWordCount() - 1), callback);

        //this.cameras.main.shake(300, 0.01)
    }




    




    




    levelFinished(){
        console.log("show level end");
        this.destroyLevel();
    }




    destroyLevel(){
        this.board.clearContent();
        this.dial.clearContent();
        this.preview.clearContent();

        this.board.setVisible(false);
        this.dial.setVisible(false);
        this.preview.setVisible(false);

        this.comboController.resetCombo();
        

        if(this.levelEnd == null){
            this.levelEnd = new LevelEnd(this);
            this.add.existing(this.levelEnd);
            this.levelEnd.setDepth(this.gameHud.topbar.depth - 1);
        }else{
            this.levelEnd.setActive(true);
            this.levelEnd.setVisible(true);
        }

        
        this.positionLevelEnd();
        this.levelEnd.start();
        
    }



    positionLevelEnd(){
        this.levelEnd.scale = this.gameScale;
        this.levelEnd.x = (this.scale.gameSize.width - this.levelEnd.width * this.levelEnd.scaleX) * 0.5;
        this.levelEnd.y = (this.scale.gameSize.height - this.levelEnd.height * this.levelEnd.scaleY) * 0.5;
        console.log("aa")
    }




    showToast(str){
        if(!this.toast){
            this.toast = new Toast(this);
            this.add.existing(this.toast);
            this.toast.setDepth(300);
            this.toast.alpha = 0;
        }

        this.toast.x = 0// (this.scale.gameSize.width - this.toast.width) * 0.5;
        this.toast.y = this.scale.gameSize.height * 0.5;
        
        this.toast.setActive(true);
        this.toast.setVisible(true);
        this.toast.show(str);

    }
}






/*class GameScene extends Phaser.Scene{


    GAME_WIDTH = 720;
    GAME_HEIGHT = 1280;

    constructor(){
        super({key: "GameScene", active: false});

        this.board = null;
        this.levelEnd = null;
    }


    init(){

    }


    preload(){

    }



    create(){

        Language.setNewLanguage("en", this);


        this.spriteGroup = this.add.group({
			
		});

        this.imagePool = this.add.group({
            classType: Phaser.GameObjects.Image,
            runChildUpdate: false,
            createCallback: function () {
                console.log('Created image');
            },
            removeCallback: function () {
                console.log('Removed image');
            }
        });


        this.previewTileParticleManagerPool = this.add.group({
            classType: PreviewTileParticleManager,
            runChildUpdate: false,
            createCallback: function () {
                //console.log('Created');
            },
            removeCallback: function () {
                //console.log('Removed');
            }
        });


        this.hintController = new HintController(this);
        this.gameController = new GameController(this);
        this.comboController = new ComboController(this);
        
        
        

        this.scale.on('resize', this.resize, this);
        this.position(this.scale);

        this.gameController.createLevel();

        this.fps = this.add.text(0, 0, "Menu").setColor("#000");
        this.fps.depth = 100;
        this.fps.setFontSize(40)
        

    }


    update(time, delta){

        if(this.preview != null) this.preview.update();

        if(this.fps) this.fps.setText(game.loop.actualFps.toFixed(2));


        
    }





    resize (gameSize, baseSize, displaySize, resolution){
        this.position(gameSize)
    }



    position(gameSize){
        if(this.board != null) this.positionBoard();
        if(this.dial != null) this.positionDial();
        if(this.preview != null) this.positionPreview();
        
    }





    createLevelContent(){
        this.createPreview();
        this.createBoard();
        this.createDial();
        this.preview.setDepth(this.board.depth + 1);
        this.position(this.scale.gameSize);

        this.createHud();
        this.gameHud.positionHud();
        this.comboController.resumeCombo();

        this.board.setVisible(true);
        this.dial.setVisible(true);
        this.preview.setVisible(true);

        this.gameHud.setComboEarned(Math.max(0, GameData.getComboReward()));
        let wordCountMinusOne = GameData.level.getWordCount() - 1;

        let savedCombo = GameData.getComboCount() - 1;
        this.gameHud.setSolvedComboCount(Math.max(0, savedCombo), wordCountMinusOne);
        if(savedCombo > 0){
            this.gameHud.setSemiCircleValue(savedCombo / wordCountMinusOne);
        }

        
    }




    createDial(){
        if(this.dial == null){
            this.dial = new Dial(this);
            this.dial.gameController = this.gameController;
            this.add.existing(this.dial);
            this.dial.setDepth(this.board.depth + 4);
        }

        this.dial.setLetters(GameData.level.letters);
    }




    positionDial(){
        this.dial.x = this.scale.gameSize.width * 0.5;
        this.dial.y = this.scale.gameSize.height * 0.84;
    }




    createDialAnimationEffect(){
        if(!this.dialEffect1){
            this.dialEffect1 = new Phaser.GameObjects.Image(this, 0, 0, "sheet1", "dial_effect");
            this.dialEffect1.alpha  = 0; 
            this.add.existing(this.dialEffect1);
            this.dialEffect1.setDepth(this.dial.depth - 2);
            this.dialEffect1.setPosition(this.dial.x, this.dial.y);
            //this.dialEffect1.setVisible(false);

            this.dialEffect2 = new Phaser.GameObjects.Image(this, 0, 0, "sheet1", "dial_effect");
            this.dialEffect2.alpha  = 0;
            this.add.existing(this.dialEffect2);
            this.dialEffect2.setDepth(this.dial.depth - 1);
            this.dialEffect2.setPosition(this.dial.x, this.dial.y);
            //this.dialEffect2.setVisible(false);

            
            
        }
    }




    createPreview(){
        if(this.preview == null){
            this.preview = new Preview(this);

            this.gameController.preview = this.preview;
            this.add.existing(this.preview);
        }

       
    }





    positionPreview(){
        
        this.preview.x = this.dial.x;
        this.preview.y = this.board.y + this.board.height * 0.5 - this.preview.height - 30;
    }




    createBoard(){
        if(this.board == null){
            this.board = new Board(this);
            this.add.existing(this.board);
        }

        this.board.layout();

    }





    positionBoard(){
        this.board.x = this.scale.gameSize.width * 0.5;
        this.board.y = this.scale.gameSize.height * 0.4;
    }





    createHud(){
        if(!this.gameHud) this.gameHud = new GameHud(this);
    }



    comboShaderAnim(callback, rewardToIncrement){
        //callback(this.gameController);

    

        this.comboController.tempComboReward += rewardToIncrement;
        GameData.saveComboReward(this.comboController.tempComboReward);
        this.gameHud.setComboEarned(this.comboController.tempComboReward);
        this.gameHud.setSolvedComboCount(rewardToIncrement, GameData.level.getWordCount() - 1);
        this.gameHud.animateSemiCircle(rewardToIncrement / (GameData.level.getWordCount() - 1), callback);
    }




    showComboFeedback(){

    }





    levelFinished(){
        console.log("show level end");
        this.destroyLevel();
    }




    destroyLevel(){
        
        this.board.clearContent();
        this.dial.clearContent();
        this.preview.clearContent();

        this.board.setVisible(false);
        this.dial.setVisible(false);
        this.preview.setVisible(false);

        this.comboController.resetCombo();


        if(this.levelEnd == null){
            this.levelEnd = new LevelEnd(this);
            this.add.existing(this.levelEnd);
            this.levelEnd.setDepth(this.gameHud.topBar.depth - 1);
        }else{
            this.levelEnd.setActive(true);
            this.levelEnd.setVisible(true);
        }
        
        this.levelEnd.start();
    }



    debug(gameobject){
        let render = this.add.graphics();
        gameobject.parentContainer.add(render);
   
        
        render.lineStyle(3, 0xffff37);
        render.strokeRect(gameobject.x - gameobject.width * 0.5, gameobject.y - gameobject.height * 0.5, gameobject.width * gameobject.scaleX, gameobject.height * gameobject.scaleY);
    }

}*/


