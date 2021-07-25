class ComboController{

    constructor(scene){
        this.scene = scene;

        this.tempComboReward = 0;
        this.step = 1;
        this.dialEffectRunning = false;
        this.particleSpeed = 2000;

        this.feedbackList = Language.strings["feedbacks"].split(",");
        

        this.colors = [
            "#4169e1",//royal
            "#228b22",//forest
            "#ffa500",//orange
            "#b22222",//firebrick
            "#ff341c",//scarlet
            "#ee82ee",//violet
            "#008080",//teal
            "#6b8e23",//olive
            "#8b4513",//brown
            "#ff69b4",//pink
            "#7f7f7f",//gray
        ];
    }


    newLevel(){
        Dial.shuffleArr(this.feedbackList);
        Dial.shuffleArr(this.scene.comboController.colors);
        this.fbIndex = 0;
    }



    getColor(){
        let index = this.step % this.colors.length;
        return this.colors[index];
    }



    getFeedbackText(){
        let temp = this.feedbackList[this.fbIndex];
        this.fbIndex++;
        this.fbIndex %= this.feedbackList.length;
        return temp;
    }



    animateDialEffect(color){
        this.scene.createDialAnimationEffect();

        this.scene.dialEffect2.tint =  this.scene.dialEffect1.tint = color;
        //console.log("this.dialEffectRunning", this.dialEffectRunning);
        this.particulateDial(color);
        if(this.dialEffectRunning) return;
        this.dialEffectRunning = true;

        
       
   
        this.scene.dialEffect1.scaleX = this.scene.gameScale;
        this.scene.dialEffect1.scaleY = this.scene.gameScale - 0.07;
        this.scene.dialEffect1.alpha  = 0; 
        this.scene.dialEffect1.setVisible(true);
        this.scene.dialEffect1.setActive(true);
        
        this.scene.dialEffect2.scaleX = this.scene.gameScale - 0.07;
        this.scene.dialEffect2.scaleY = this.scene.gameScale;
        
        this.scene.dialEffect2.setVisible(true);
        this.scene.dialEffect2.setActive(true);

        this.scene.tweens.add({
            targets         : [this.scene.dialEffect1, this.scene.dialEffect2],
            alpha           : 1,
            duration        : 300,
            callbackScope   : this,
            onComplete      : function(){
                this.animateDialEffect_1();
                this.animateDialEffect_2();
            }
        });
        
    }






    animateDialEffect_1(){

        this.scene.dialEffect1.scaleTween = this.scene.tweens.add({
            targets: this.scene.dialEffect1,
            scaleX: this.scene.gameScale - 0.07,
            scaleY: this.scene.gameScale,
            duration: Phaser.Math.Between(1500, 2000),
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });
        
            
        this.scene.dialEffect1.angleTween = this.scene.tweens.add({
            targets     : this.scene.dialEffect1,
            angle       : "-=360",
            duration    : Phaser.Math.Between(10000, 12000),
            repeat      : -1
        });

    }





    animateDialEffect_2(){

        this.scene.dialEffect2.scaleTween = this.scene.tweens.add({
            targets: this.scene.dialEffect2,
            scaleX: this.scene.gameScale,
            scaleY: this.scene.gameScale - 0.07,
            duration: Phaser.Math.Between(1500, 2000),
            ease: "Sine.easeInOut",
            yoyo: true,
            repeat: -1
        });


        this.scene.dialEffect2.angleTween = this.scene.tweens.add({
            targets     : this.scene.dialEffect2,
            angle       : "+=360",
            duration    : Phaser.Math.Between(10000, 12000),
            repeat      : -1
        });

    }




    particulateDial(color){
        
        if(!this.particles){
            this.particles = this.scene.add.particles('sheet1');
            this.particles.setDepth(this.scene.dial.depth - 3);
            this.emitters = [];
            
            for(let i = 0; i < 10; i++){
                let emitter = this.particles.createEmitter({
                    delay: Math.random() * 800,
                    //alpha: { start: 1.0, end: 0.0},
                    scale: { start: this.scene.gameScale, end: 0.3},
                    quantity: 1,
                    //tint: this.lightenColor(color),
                    blendMode: 'ADD'
                });
    
                this.positionEmitter(emitter);
                this.emitters.push(emitter);
            }
        }

        //color = this.lightenColor(color);

        console.log("step", this.step);
        for(let i = 0; i < this.emitters.length; i++){
            let emitter = this.emitters[i];

            if(!emitter.visible){
                emitter.active = true;
                emitter.setVisible(true);
                emitter.start();
            }

            emitter.onParticleDeath(function () {
                this.positionEmitter(emitter);
                //if(emitter.tint.propertyValue != color) emitter.setTint(color);
            }, this);
            
            if(this.step == 1){
                emitter.setFrequency(500);
                emitter.setFrame("flare_blue");
                emitter.setSpeed((Math.random() * 75) + 75);
                emitter.setLifespan(this.particleSpeed);
            }else if(this.step == 2){
                emitter.setFrequency(400);
                emitter.setSpeed((Math.random() * 100) + 100);
                emitter.setLifespan(this.particleSpeed * 0.75);
            }else if(this.step == 3){
                emitter.setFrequency(300);
                emitter.setSpeed((Math.random() * 125) + 125);
                emitter.setLifespan(this.particleSpeed * 0.60);
            }else if(this.step == 4){
                emitter.setFrequency(200);
                emitter.setSpeed((Math.random() * 150) + 150);
                emitter.setLifespan(this.particleSpeed * 0.5);
            }else if(this.step == 5){
                emitter.setFrequency(150);
                emitter.setSpeed((Math.random() * 175) + 175);
                emitter.setLifespan(this.particleSpeed * 0.4285);
            }else if(this.step == 6){
                emitter.setFrequency(100);
                emitter.setSpeed((Math.random() * 200) + 200);
                emitter.setLifespan(this.particleSpeed * 0.375);
            }else if(this.step == 7){
                emitter.setFrequency(50);
            }else if(this.step == 8){
                emitter.setFrequency(35);
            }else if(this.step == 9){
                emitter.setFrequency(30);
            }else if(this.step == 10){
                emitter.setFrequency(25);
            }else if(this.step == 11){
                emitter.setFrequency(20);
            }else if(this.step == 12){
                emitter.setFrequency(15);
            }else if(this.step == 13){
                emitter.setFrequency(10);
            }

            if(this.step >= 2) emitter.setFrame(["flare_blue", "flare_green", "flare_red"]);
            else if(this.step >= 4) emitter.setFrame(["flare_blue", "flare_green", "flare_red", "flare_white"]);
        }
        
        this.step++;

    }



    lightenColor(color){
        let r = (color >> 16) & 0xFF;
        let g = (color >> 8)  & 0xFF;
        let b = color & 0xFF;

        let amount =  0.5;

        r = Math.min(255, r + 255 * amount);
        g = Math.min(255, g + 255 * amount);
        b = Math.min(255, b + 255 * amount);

        return Phaser.Display.Color.RGBToString(r, g, b, 255, "#");
    }


    positionEmitter(emitter){
        let radius = this.scene.dial.width * 0.5 - 20;
        let radians = Math.random() * (Math.PI * 2);
        let angle = Phaser.Math.RadToDeg(radians);
        emitter.setPosition(this.scene.dial.x + radius * Math.cos(radians), this.scene.dial.y + radius * Math.sin(radians));
        emitter.setEmitterAngle(angle);
    }



    stop(){
        this.step = 1;
        this.particulateDial(this.getColor());
        for(let i = 0; this.emitters && i < this.emitters.length; i++){
            this.emitters[i].stop();
            this.emitters[i].active = false;
            this.emitters[i].setVisible(false);
        }

        this.scene.time.delayedCall(1000, function(){
            for(let i = 0; i < this.emitters.length; i++){
                
            }
        }, [], this);

      



        if(this.scene.dialEffect1 && this.scene.dialEffect1.visible){
            this.scene.tweens.add({
                targets         : [this.scene.dialEffect1, this.scene.dialEffect2],
                alpha           : 0,
                duration        : 300,
                callbackScope   : this,
                onComplete      : function(){
                    this.scene.dialEffect1.scaleTween.stop();
                    this.scene.dialEffect1.angleTween.stop();
                    this.scene.dialEffect1.setVisible(false);
                    this.scene.dialEffect1.setActive(false);
    
                    this.scene.dialEffect2.scaleTween.stop();
                    this.scene.dialEffect2.angleTween.stop();
                    this.scene.dialEffect2.setVisible(false);
                    this.scene.dialEffect2.setActive(false);
                }
            });
        }
        

        

    }




    resetCombo(callback){
        this.stop();
        GameData.level.comboCount = 0;
        GameData.saveComboCount(0);
        this.dialEffectRunning = false;
        this.lastColor = 0;
        this.step = 1;
        if(callback) callback.call(this.scene.gameController);        
    }



    resumeCombo(){

        let comboCount = GameData.getComboCount();

        if(comboCount > 0) {
            console.log(this.scene.gameController)
            GameData.level.comboCount = comboCount;
            this.scene.gameController.setTempComboCount(comboCount);
            comboCount--;//display combo amount is actually one less
            if(comboCount > 0) {
                this.step = comboCount;
                this.animateDialEffect(this.getColor());
            }
        }

        this.scene.gameController.setComboAnimatedWordCount(GameData.getSolvedWords());
        this.tempComboReward = GameData.getComboReward();
    }




    getComboShakeAmount(comboCount){
        switch (comboCount){
            case 2: return 0.007;
            case 3: return 0.0075;
            case 4: return 0.008;
            case 5: return 0.0085;
            case 6: return 0.009;
            default: return 0.0095;

        }

    }





    showComboFeedback(){
        
        if(!this.feedbackTxt){
            this.feedbackTxt = this.scene.add.text(
                this.scene.scale.gameSize.width * 0.5, 
                this.scene.scale.gameSize.height * 0.55, 
                "", 
                { fontFamily: /*Config.FONT*/"Luckiest Guy", fontStyle: "bold" }
            );
            this.feedbackTxt.setOrigin(0.5);
            
        }else{
            this.feedbackTxt.setVisible(true);
            this.feedbackTxt.setActive(true);
        }
    
        this.feedbackTxt.scale = 0;
        

        let cstr = this.getColor();
        let hex = Phaser.Display.Color.HexStringToColor(cstr).color;
        this.feedbackTxt.setColor(cstr);

        this.feedbackTxt.setText(this.getFeedbackText());
        this.feedbackTxt.setStroke(this.lightenColor(hex), 20 * this.scene.gameScale);
        this.feedbackTxt.setFontSize(50 * this.scene.gameScale);
        this.feedbackTxt.setShadow(1, 2, "#333333", 2 * this.scene.gameScale, true, true);
        this.feedbackTxt.setShadowBlur(0)
        
        let timeline = this.scene.tweens.createTimeline();

        timeline.add({
            targets: this.feedbackTxt,
            scale: 1,
            duration: 500,
            ease: "Back.easeOut",
        });

        timeline.add({
            targets         : this.feedbackTxt,
            alpha           : 0,
            duration        : 100,
            delay           : 500,
            callbackScope   : this,
            onComplete      : function(){
                this.feedbackTxt.setVisible(false);
                this.feedbackTxt.setActive(false);
                this.feedbackTxt.alpha = 1;
            }
        });


        timeline.play();

    }






    blastSmoke(){
        if(!this.smoke) {
            this.smoke = new Phaser.GameObjects.Image(this.scene, this.scene.dial.x, this.scene.dial.y, "sheet1", "smoke").setScale(0.7);
            this.scene.add.existing(this.smoke);
        }

        this.smoke.setPosition(this.scene.dial.x, this.scene.dial.y);
        this.smoke.scale = 0.5;
        this.smoke.angle = Math.random() * 360;
        this.smoke.alpha = 0.7;
        this.smoke.setActive(true);
        this.smoke.setVisible(true);

        let timeline = this.scene.tweens.createTimeline();

        timeline.add({
            targets: this.smoke,
            scale: 1.5,
            duration: 350,
            ease: "Cubic.easeOut"
        });



        timeline.play();


        this.scene.tweens.add({
            targets: this.smoke,
            alpha: 0,
            y: this.smoke.y - 200,
            duration: 900,
            delay: 200,
            callbackScope: this,
            onComplete: function(){
                this.smoke.setActive(false);
                this.smoke.setVisible(false);
            }
        });
    }



    shakeCamera(){
        if(!this.cameraShaker) this.cameraShaker = new Shaker();
        this.cameraShaker.startShaking(GameData.level.comboCount + this.getComboShakeAmount(GameData.level.comboCount) * this.scene.scale.gameSize.width);
    }

}






class Shaker{


    constructor(){
        this.currentPosition = new Phaser.Math.Vector2(0, 0);
    }
    
    init(shakeRadius){
        this.originalX = 0;
        this.originalY = 0;
        this.originalShakeRadius = shakeRadius;
        this.offsetX = 0;
        this.offsetY = 0;
        this.currentPosition.x = 0;
        this.currentPosition.y = 0;
        this.reset();
    }


    reset(){
        this.shakeRadius = this.originalShakeRadius;
        this.isShaking = false;
        this.seedRandomAngle();
        this.currentPosition.x = this.originalX;
        this.currentPosition.y = this.originalY;
    }



    seedRandomAngle(){
        this.randomAngle = Math.random() * 6.283185;
    }



    startShaking(shakeRadius){
        this.init(shakeRadius);
        this.isShaking = true;
    }



    getNewShakePosition(){
        this.computeCameraOffset();
        this.computeCurrentPosition();
        this.diminishShake();
        return this.currentPosition;
    }



    computeCameraOffset(){
        this.offsetX =  Math.cos(this.randomAngle) * this.shakeRadius;
        this.offsetY =  Math.sin(this.randomAngle) * this.shakeRadius;
    }




    computeCurrentPosition(){
        this.currentPosition.x = this.originalX + this.offsetX;
        this.currentPosition.y = this.originalY + this.offsetY;
    }



    diminishShake(){
        if(this.shakeRadius < 2.0){
            this.reset();
            return;
        }

        this.isShaking = true;
        this.shakeRadius *= .9;
        this.randomAngle = Math.random() * 360 + 1;
    }
}