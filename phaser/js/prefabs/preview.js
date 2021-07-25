class Preview extends Phaser.GameObjects.Container{


    static previewTilePool;
    

    constructor(scene, x, y){
        super(scene, x, y);


        /*this.bg = scene.add.rexNinePatch(0, 0, 100, 100, "sheet1", "r_rect.png", [15, 15, 15], [15, 15, 15], {
            stretchMode: 0,
            getFrameNameCallback: undefined
        });

        this.add(this.bg);
        this.bg.resize(500, this.height);*/

        this.tiles         = [];
        this.y_positions   = null;
        this.previewHeight = 50;
        this.shaking = false;

        
        this.setSize(0, this.previewHeight);

        
        this.setmask();

    }


    





    setmask(){
        this.maskShape = this.scene.make.graphics();
        this.updateMask();
    }



    updateMask(){
        this.maskShape.fillStyle(0xff0000);
        this.maskShape.beginPath();
        let scale = this.scene.gameScale;
        this.maskShape.fillRect(0, 0, 600 * scale, this.height * scale);
        //this.add(this.maskShape);
        
        this.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.maskShape);
    }




    setColor(color){
   
    }





    static initTilePool(scene){
        Preview.previewTilePool = scene.add.group({
            classType: PreviewTile,
            runChildUpdate: false
        });
    }





    static newTile(c, scene){
        if(!Preview.previewTilePool) Preview.initTilePool(scene);
        let pt  = Preview.previewTilePool.get();
        pt.setActive(true);
        pt.setText(c);
        return pt;
    }



    

    addLetter(c){
        //this.scene.board.setVisible(false);
        let pt = Preview.newTile(c, this.scene);
        pt.setScale(this.previewHeight / pt.height);

        if(this.tiles.length > 0){
            let last = this.tiles[this.tiles.length - 1];
            pt.x = last.x + last.width * last.scale;
        }else{
            pt.x = 0;
            //this.maskShape.y = this.y;
        }

        this.tiles.push(pt);
        
        this.positionMask();


        pt.y = -pt.height * 0.5;

        
        if(!pt.parentContainer) this.add(pt);
        

        pt.alpha = 1;
        pt.setVisible(true);

        let time = 250;

        this.scene.tweens.add({
            targets     : pt,
            y           : this.height * 0.5,
            ease        : "Quart.easeOut",
            duration    : time,
        });


        
        
        if(this.tiles.length > 1){
            this.scene.tweens.add({
                targets     : this,
                x           : this.x - this.tiles[0].width * this.tiles[0].scale * 0.5,
                ease        : "Quart.easeOut",
                duration    : time,
            });
        }
        
    

    }




    positionMask(){
        let global = this.getWorldTransformMatrix();
        if(this.tiles.length == 1){
            this.maskShape.x = 0;
            this.maskShape.y = global.ty;
        }else{
            this.maskShape.x = global.tx- this.tiles[0].width * this.tiles[0].scale * global.scaleX;
        }
    }



    

    removeLetter(){
        if(this.tiles.length > 0){
            let last = this.tiles.pop();
            last.setActive(false);

            let time = 250;

            this.scene.tweens.add({
                targets         : last,
                y               : -this.height * 0.5 - last.height * 0.5,
                ease            : "Quart.easeOut",
                duration        : time,
                callbackScope   : this,
                onComplete      : function() {
                    this.remove(last)
                }
            });

            if(this.tiles.length > 0){
                this.scene.tweens.add({
                    targets     : this,
                    x           : this.x + this.tiles[0].width * this.tiles[0].scale * 0.5,
                    ease        : "Quart.easeOut",
                    duration    : time,
                });
            }
            
            
        }
    }





    reset(){//correct answer
        console.log("reset")
        this.scene.positionPreview();
        this.tiles.length = 0;
    }




    fadeOut(){//wrong answer
        console.log("fadeOut");
        let preview = this;

        for(let i = 0; i < this.tiles.length; i++){
            this.tiles[i].setActive(false);

            this.scene.tweens.add({
                targets  : this.tiles[i],
                alpha    : 0,
                duration : 100,
                onComplete: function(){
                    if(i == preview.tiles.length - 1){
                        preview.reset();
                        
                        for(let i = 0; i < preview.tiles.length; i++){
                            preview.tiles[i].setVisible(false);
                        }
                    }
                }
            });
        }

        
    }




    shakeout(){
        console.log("shakeout")
        let timeline = this.scene.tweens.createTimeline();

        let amount = 50;
        let x = this.x;

        timeline.add({
            targets     : this,
            x           : x - amount * 0.5,
            duration    : 100
        });

        timeline.add({
            targets     : this,
            x           : x + amount * 0.5,
            duration    : 100
        });

        timeline.add({
            targets     : this,
            x           : x - amount * 0.33,
            duration    : 70
        });

        timeline.add({
            targets     : this,
            x           : x + amount * 0.33,
            duration    : 70
        });

        timeline.add({
            targets     : this,
            x           : x - amount * 0.25,
            duration    : 40
        });

        timeline.add({
            targets     : this,
            x           : x + amount * 0.25,
            duration    : 40
        });

        timeline.add({
            targets         : this,
            x               : x,
            duration        : 20,
            callbackScope   : this,
            onComplete: function(){
                this.shaking = false;
                this.fadeOut();
            }
        });

        this.shaking = true;
        timeline.play();

        
    }




    update(){
        if(this.shaking){
            this.positionMask();
        }
    }




    clearContent(){
        for(let i = 0; i < this.tiles.length; i++){
            this.tiles[i].setActive(false);
            this.remove(this.tiles[i]);
            this.tiles[i].setVisible(false);
        }
        this.reset();
    }


}



class PreviewTile extends Phaser.GameObjects.Container{
    


    constructor(scene){
        super(scene);

        this.bg = scene.add.image(0, 0, "sheet1", "preview_tile");
        this.add(this.bg);

        this.setSize(this.bg.width, this.bg.height);

        //this.text = new Phaser.GameObjects.BitmapText(scene, 0, 0, 'signika_dial', '').setOrigin(0.5, 0.55);
        //this.text.setFontSize(this.height * 0.9);
        this.text = new Phaser.GameObjects.Text(this.scene,
            0, 
            0,
            "",
            {fontFamily: Config.FONT, fontSize: 50, color: '#000', align: 'center', fontStyle: "bold" }
        ).setOrigin(0.5, 0.55)

        this.add(this.text);
        this.bg.setTint(0xf0f0f0);

        this.setInteractive();
        this.on("pointerup",   this.onMouseUp,   this);
      
    }



    onMouseUp(){
        
        if(!this.scene.board.fingerHintSelectionModeActive){
            for(let a in Config.AVAILABLE_LANGUAGES){
                if(Config.AVAILABLE_LANGUAGES[a].code == Language.getCode()){
                    this.showMeaning(this.boardTile.cellData);
                    return;
                }
            }
        }
    }



    showMeaning(cellModel){
        let downWord = cellModel.downWord;

        if(downWord != null && downWord.isSolved){
            this.scene.gameHud.openDictionaryDialog([downWord.answer]);
            return;
        }

        let acrossWord = cellModel.acrossWord;
        if(acrossWord != null && acrossWord.isSolved){
            this.scene.gameHud.openDictionaryDialog([acrossWord.answer]);
            return;
        }
    }



    setText(c){
        this.text.setText(c);
    }





    explodeParticles(){

        //let pm = this.scene.add.particles('sheet1');
        //let pm = new Phaser.GameObjects.Particles.ParticleEmitterManager(this.scene, "sheet1");
        let pm = this.scene.previewTileParticleManagerPool.get();// new PreviewTileParticleManager(this.scene);
        
        pm.setActive(true);
        this.scene.add.existing(pm);
        this.addAt(pm, 0);
        pm.setVisible(true);
        pm.explode();

    }

}



class PreviewTileParticleManager extends Phaser.GameObjects.Particles.ParticleEmitterManager{

    static count = 10;


    constructor(scene){
        super(scene, "sheet1");

        this.circle = new Phaser.Geom.Circle(0, 0, 150);

        this.emitter = this.createEmitter({
            frame       : 'flare_red',
            x           : 0,
            y           : 0,
            speed: { min: -400, max: 400 },
            angle: { min: 0, max: 360 },
            scale: { start: 1.0, end: 0.1 },
            acceleration: true,
            accelerationX: 100,
            accelerationY: 100,
            blendMode: 'SCREEN',
            lifespan: 1000,
            deathZone: { type: 'onLeave', source: this.circle },
         
        });

        this.emitter.onParticleDeath(function() {
            if(this.emitter.getAliveParticleCount() == 0){
                this.setActive(false);
                this.parentContainer.remove(this);
                this.setVisible(false);
            }
        }, this);

        this.emitter.reserve(PreviewTileParticleManager.count);
    }



    explode(){
        this.emitter.explode(PreviewTileParticleManager.count);
        
    }
}


