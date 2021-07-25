class GameHud{

    static topbarHeight = 150;

    constructor(scene){
        this.scene = scene;
        let gameSize = this.scene.scale.gameSize;
        
        

        this.topbar = this.scene.add.container();

        let barbg = this.scene.add.rexNinePatch(0, 0, gameSize.width * 1.5, GameHud.topbarHeight, "sheet1", "top_bar", [10, 12, 253, 10, 12], [16, 18, 87], {
            stretchMode: 0,
            getFrameNameCallback: undefined
        });
        
        
        this.topbar.add(barbg);
        this.topbar.setSize(barbg.width, barbg.height);
        this.progressValue = 0;        

        //this.topbar.alpha = 0.1;

        this.pb_track = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "semi_circle_pb_track");
        this.pb_track.setOrigin(0.5, 0);
        this.pb_track.x = 0;
        this.pb_track.y = this.topbar.height * 0.5 - this.pb_track.height - 15;
        //this.pb_track.tint = 0x2762ab;
        this.topbar.add(this.pb_track);


      
        

        let pcanvasStyle = "width: " + this.pb_track.width + "px; height: " + this.pb_track.height + "px;";

        let pdom = new Phaser.GameObjects.DOMElement(this.scene, this.pb_track.x, this.pb_track.y, "canvas", pcanvasStyle);
        pdom.setOrigin(0.5, 0);
        this.topbar.add(pdom);
        this.pcanvas = pdom.node;
        this.pcanvas.parentNode.style.pointerEvents = "none";
        this.pbarImage = document.getElementById("pbar");
               



        this.comboLabel = new Phaser.GameObjects.Text(this.scene,
            0, 
            -this.topbar.height * 0.5 + 20,
            "",
            {fontFamily: Config.FONT, fontSize: 30, color: '#ffffff', align: 'center'/*, fontStyle: "bold"*/ }
        ).setShadow(2, 2, "#333333", 2, false, true);



        this.comboLabel.setOrigin(0.5, 0);
        this.comboLabel.depth = 100;
        this.topbar.add(this.comboLabel);

        this.maxCombo = new Phaser.GameObjects.Text(this.scene,
            0, 
            this.pb_track.y,
            "",
            {fontFamily: Config.FONT, fontSize: 18, color: '#ffffff', align: 'center'}
        ).setShadow(2, 2, "#333333", 2, false, true);
        
        this.maxCombo.setOrigin(0.5, 0);
        this.topbar.add(this.maxCombo);

        this.coinMeter = new CoinMeter(this.scene);
        this.coinMeter.setCount(this.scene.hintController.getRemainingCoins());
        this.scene.add.existing(this.coinMeter);


        if(this.scene.sys.game.device.fullscreen.available){
            this.fullScreen = new SpriteButton(this.scene, 0, 0, "sheet1", "full_screen");
            this.fullScreen.setCallback(this.goFullScreen, this);
            this.scene.add.existing(this.fullScreen);
        }
        
        this.extraWordsButton = new ExtraWordsButton(this.scene);
        this.extraWordsButton.button.setCallback(this.openExtraWordsDialog, this);
        this.scene.add.existing(this.extraWordsButton);
        

        this.btnShuffle = new SpriteButton(this.scene, 0, 0, "sheet1", "shuffle", "shuffle").setOrigin(0.5);
        this.btnShuffle.setCallback(this.scene.dial.shuffle, this.scene.dial);
        this.scene.add.existing(this.btnShuffle);
        
        this.btnSingleHint = new SpriteButton(this.scene, 0, 0, "sheet1", "hint_empty_up", "hint_empty_down").setOrigin(1, 0);
        this.btnSingleHint.setCallback(this.scene.hintController.onSingleHintClick, this.scene.hintController);
        this.scene.add.existing(this.btnSingleHint);

        this.btnMultipleHint = new SpriteButton(this.scene, 0, 0, "sheet1", "multiple_hint_up", "multiple_hint_down").setOrigin(1, 1);
        this.btnMultipleHint.setCallback(this.scene.hintController.onMultipleHintClick, this.scene.hintController);
        this.scene.add.existing(this.btnMultipleHint);
        

        this.btnFingerHint = new SpriteButton(this.scene, 0, 0, "sheet1", "finger_hint_up", "finger_hint_down").setOrigin(0, 0);
        this.btnFingerHint.setCallback(this.scene.hintController.onFingerHintClick, this.scene.hintController);
        this.scene.add.existing(this.btnFingerHint);

        this.positionHud();

        /*scene.scale.on('enterfullscreen', function() {
            console.log("enter")
        });

        scene.scale.on('exitfullscreen', function() {
            console.log("exit")
        });*/
    }

    




    renderImage(ctx, image, x, y, width, height, angle, scaleX, scaleY){
        const centerX = width * 0.5;
        const centerY = height;

        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.scale(scaleX, scaleY);
        ctx.drawImage(image, -centerX, -centerY, width, height);
        ctx.restore();
    }






    positionHud(){
        let scale           = this.scene.gameScale;
        let marginLeft      = 25 * scale;
        let gameSize        = this.scene.scale.gameSize;
        let halfDial        = this.scene.dial.height * scale * 0.5;

 
        this.topbar.scale = scale;
        this.topbar.setPosition(gameSize.width * 0.5, this.topbar.height * scale * 0.5);

        if(this.fullScreen){
            this.fullScreen.scale = scale;
            this.fullScreen.x = gameSize.width * 0.15
            this.fullScreen.y = this.topbar.y - this.topbar.height * this.topbar.scale * 0.23;
        }
        
        
        this.coinMeter.scale = scale;
        this.coinMeter.x = gameSize.width - this.coinMeter.width * scale * 0.5 - marginLeft;
        this.coinMeter.y = this.topbar.y - this.topbar.height * this.topbar.scale * 0.2;
        
        
            
        this.btnShuffle.scale = scale;
        this.btnShuffle.setPosition(this.scene.dial.x, this.scene.dial.y);

        this.btnSingleHint.scale = scale;
        this.btnSingleHint.x = gameSize.width - marginLeft;
        this.btnSingleHint.y = this.scene.dial.y - halfDial;
        

        this.btnMultipleHint.scale = scale;
        this.btnMultipleHint.x = this.btnSingleHint.x;
        this.btnMultipleHint.y = this.scene.dial.y + halfDial;

        this.btnFingerHint.scale = scale;
        this.btnFingerHint.x = marginLeft;
        this.btnFingerHint.y = this.scene.dial.y - halfDial;

        this.extraWordsButton.scale = scale;
        let half = this.extraWordsButton.displayWidth * 0.5;
        this.extraWordsButton.x = marginLeft + half;
        this.extraWordsButton.y = this.btnMultipleHint.y - half;
    }




    setComboEarned(n){
        this.comboLabel.setText(Phaser.Utils.String.Format(Language.strings["combo_display"], [n]));
    }


    



    setSolvedComboCount(solved, total){
        this.maxCombo.setText(solved + "/" + total);
    }




    animateSemiCircle(value, callback){

        let object  = {value : this.progressValue};
        let ctx     = this.pcanvas.getContext('2d');

        this.scene.tweens.add({
            targets: object,
            value: value,
            duration: 1000,
            onUpdateScope: this,
            onUpdate:function(t, o){
                this.drawProgress(o.value * -Math.PI, ctx);
            },
            onCompleteScope: this.scene.gameController,
            onComplete      : callback
        })

        this.progressValue = value;
    }


    setSemiCircleValue(value){
        this.progressValue = value;
        this.drawProgress(value * -Math.PI, this.pcanvas.getContext('2d'));

    }
    



    drawProgress(value, ctx){
        this.renderImage(ctx, this.pbarImage, this.pcanvas.width/2, 0,  this.pcanvas.width, this.pcanvas.height, 0, 1, -1);
        ctx.globalCompositeOperation = 'source-in';
        this.renderImage(ctx, this.pbarImage, this.pcanvas.width/2, 0,  this.pcanvas.width, this.pcanvas.height, value, 1, 1);
        ctx.globalCompositeOperation = "source-over";
    }





    goFullScreen(){
        if (this.scene.scale.isFullscreen) {
            this.scene.scale.stopFullscreen();
            // On stop fulll screen
        } else {
            this.scene.scale.startFullscreen();
            // On start fulll screen
        }
    }




    openExtraWordsDialog(){
        if(!this.extraWordsDialog){
            this.extraWordsDialog = new ExtraWordsDialog(this.scene);
            this.scene.add.existing(this.extraWordsDialog);
        }

        this.extraWordsDialog.show();
    }




    openDictionaryDialog(words){
        
        if(!this.dictDialog){
            this.dictDialog = new DictionaryDialog(this.scene);
            this.scene.add.existing(this.dictDialog);
        }

        this.dictDialog.show(words);
    }


}