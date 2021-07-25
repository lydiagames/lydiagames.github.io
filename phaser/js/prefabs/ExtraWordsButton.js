class ExtraWordsButton extends Phaser.GameObjects.Container{

    

    constructor(scene){
        super(scene);


        this.button = new SpriteButton(scene, 0, 0, "sheet1", "extra_words_up", "extra_words_down");
        this.setSize(this.button.width, this.button.height);
        this.add(this.button);


        let perc = GameData.getExtraWordsCount() / Config.NUMBER_OF_BONUS_WORDS_TO_FIND_FOR_REWARD;
        

        this.circularProgress = scene.add.rexCircularProgress(-2, -2, this.width * 0.5, 0xffffff, perc, {
            trackColor: undefined,
            centerColor: undefined,
            thickness: 0.1,
            startAngle: Phaser.Math.DegToRad(270),
            anticlockwise: false,
        
            easeValue: {
                duration: 0,
                ease: 'Linear'
            }
        });

        this.add(this.circularProgress);
    }




    growAndShrink(callback, context){

        let scale = this.scene.gameHud.extraWordsButton.scale;

        this.scene.tweens.add({
            targets     : this,
            scale       : scale - 0.15,
            duration    : 40,
            callbackScope: this,
            onComplete:function(){
                this.scene.gameHud.extraWordsButton.scale = scale;
                if(callback) callback.call(context);
            }
        });

    }




    shakeout(){
        let timeline = this.scene.tweens.createTimeline();

        let amount = 30;
        let y = this.y;

        timeline.add({
            targets     : this,
            y           : y - amount * 0.5,
            duration    : 100
        });

        timeline.add({
            targets     : this,
            y           : y + amount * 0.5,
            duration    : 100
        });

        timeline.add({
            targets     : this,
            y           : y - amount * 0.33,
            duration    : 70
        });

        timeline.add({
            targets     : this,
            y           : y + amount * 0.33,
            duration    : 70
        });

        timeline.add({
            targets     : this,
            y           : y - amount * 0.25,
            duration    : 40
        });

        timeline.add({
            targets     : this,
            y           : y + amount * 0.25,
            duration    : 40
        });

        timeline.add({
            targets         : this,
            y               : y,
            duration        : 20,
            callbackScope   : this,
            onComplete: function(){
                this.animating = false;
            }
        });

        this.animating = true;
        timeline.play();

        
    }




    animateMileStone(){
        if(!this.bonus_glow){
            this.bonus_glow = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "bonus_glow");
            this.bonus_glow.alpha = 0;
            this.add(this.bonus_glow);
        }else{
            this.bonus_glow.setActive(true);
            this.bonus_glow.setVisible(true);
        }
        

        let timeline = this.scene.tweens.createTimeline();

        timeline.add({
            targets         : this.bonus_glow,
            alpha           : 1,
            duration        : 500,
            ease            : "Cubic.easeInOut",
            callbackScope   : this,
            onComplete      : this.sparkle
        });

        timeline.add({
            targets         : this.bonus_glow,
            alpha           : 0,
            scale           : 3,
            duration        : 500,
            ease            : "Cubic.easeIn",
            callbackScope   : this,
            onComplete      : function(){
                this.bonus_glow.setActive(false);
                this.bonus_glow.setVisible(false);
                this.bonus_glow.scale = 1;
            } 
        });

        timeline.play();
    }




    sparkle(){
        if(!this.particles){
            this.particles = this.scene.add.particles('sheet1');
            this.addAt(this.particles, 0);
        }
        
    

        let radius = this.width * 0.5;

        
        for(let i = 0; i < 20; i++){
            let radians = Math.random() * (Math.PI * 2);
            var angle = Phaser.Math.RadToDeg(radians);

            this.emitter = this.particles.createEmitter({
                frame       : 'star_white',
                x           : radius * Math.cos(radians),
                y           : radius * Math.sin(radians),
                angle       : angle,
                delay       : Math.random() * 50,
                scale       : { min: 0.4, max: 0.6 },
                speed       : { min: 150, max: 300 },
                lifespan    : 500,
                blendMode   : 'ADD'
            });
            
            this.emitter.explode(1);
        }

        this.coinAnim();
    }



    coinAnim(){
        if(!this.rewardCoinsArr) {
            this.rewardCoinsArr = [];

            for(let i = 0; i < Config.NUMBER_OF_COINS_GIVEN_AS_BONUS_WORDS_REWARD; i++){
                let coin = new Phaser.GameObjects.Image(this.scene, this.x, this.y, "sheet1", "coin_small");
                coin.scale = this.scene.gameScale;
                this.scene.add.existing(coin);
                this.rewardCoinsArr.push(coin);
            }
        }else{
            for(let i = 0; i < Config.NUMBER_OF_COINS_GIVEN_AS_BONUS_WORDS_REWARD; i++){
                let coin = this.rewardCoinsArr[i];
                coin.setVisible(true);
                coin.setActive(true);
                coin.setPosition(this.x, this.y);
            }
        }


        if(!this.smallParticles){
            this.smallParticles = this.scene.add.particles('sheet1');
        }


        let global   = this.scene.gameHud.coinMeter.coin.getWorldTransformMatrix();
        let duration = 600;
        let delay    = 100;

        for(let i = 0; i < this.rewardCoinsArr.length; i++){

            let coin = this.rewardCoinsArr[i];

            this.scene.tweens.add({
                targets         : coin,
                x               : global.tx,
                y               : global.ty,
                delay           : i * delay,
                duration        : duration,
                ease            : "Sine.easeIn",
                callbackScope   : this,
                onStart         : function(){
                    this.setSmallSparkles(coin);
                },
                onComplete      : function(){
                    coin.setVisible(false);
                    coin.setActive(false);
                    coin.emitter.stop();
                    
                    if(i == 0) this.scene.gameHud.coinMeter.particulate(duration * this.rewardCoinsArr.length);
                    if(i == this.rewardCoinsArr.length - 1) {
                        this.stopSmallParticles();
                        this.scene.gameHud.coinMeter.stopParticles();
                        this.incrementCoins();
                    }
                }
            });
        }

        this.scene.tweens.add({
            targets     : this.circularProgress,
            value       : 0,
            duration    : duration + this.rewardCoinsArr.length * delay
        });
    }



    setSmallSparkles(coin){
        if(!coin.emitter){
            coin.emitter = this.smallParticles.createEmitter({
                frame       : 'star_small',
                speed       : 50,
                quantity    : 1,
                frequency   : 50
            });
        
            coin.emitter.startFollow(coin);
        }else{
            if(!this.smallParticles.active){
                this.smallParticles.setVisible(true);
                this.smallParticles.setActive(true);
            }
            
            coin.emitter.start();
        }
    }



    stopSmallParticles(){
        this.scene.time.delayedCall(1000, function(){
            this.smallParticles.setVisible(false);
            this.smallParticles.setActive(false);
        }, [], this);
    }





    incrementCoinsWithAnimation(){
        let targetValue = this.scene.hintController.getRemainingCoins() + Config.NUMBER_OF_COINS_GIVEN_AS_BONUS_WORDS_REWARD;

        this.scene.tweens.addCounter({
            from            : this.scene.hintController.getRemainingCoins(),
            to              : targetValue,
            duration        : 1000,
            callbackScope   : this,
            onUpdate        : function (tween, progress) {
                let newCount = Math.floor(progress.value);
                if(newCount != this.scene.gameHud.coinMeter.count){
                    this.scene.gameHud.coinMeter.setCount(newCount);
                }
            },
            onComplete      : function(){
                this.scene.hintController.setCoinCount(targetValue);
                this.scene.input.enabled = true;
            }
        });
    }

}