class CoinMeter extends Phaser.GameObjects.Container{

    constructor(scene){
        super(scene);

        this.bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "coin_meter_bg");
        this.add(this.bg);

        this.width = this.bg.width;
        

        this.coin = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "coin_meter_coin");
        this.coin.x = -this.width * 0.5;
        this.add(this.coin);

        this.height = this.coin.height;


        this.label = new Phaser.GameObjects.Text(this.scene,
            this.width * 0.05, 
            0,
            "",
            {fontFamily: Config.FONT, fontSize: 30, color: '#584f30', align: 'center', fontStyle: "bold" }
        ).setOrigin(0.45, 0.56);

        this.label.x = this.width * 0.05;
        this.add(this.label);

    }



    setCount(n){
        this.label.setText(n);
        let maxWidth = (this.bg.width * 0.55);
        
        if(this.label.width * this.label.scale > maxWidth){
            this.label.setScale(maxWidth / this.label.width * this.label.scale);
        }
    }




    particulate(){
        if(!this.particles){
            this.particles = this.scene.add.particles('sheet1');
            this.addAt(this.particles, 1);
            this.emitters = [];

            let radius = 15;
            let x = this.width * 0.5;
            
            for(let i = 0; i < 50; i++){
                let radians = Math.random() * (Math.PI * 2);
                var angle = Phaser.Math.RadToDeg(radians);
    
                let emitter = this.particles.createEmitter({
                    frame       : 'star_small',
                    x           : radius * Math.cos(radians) - x,
                    y           : radius * Math.sin(radians),
                    angle       : angle,
                    delay       : Math.random() * 500,
                    scale       : {start: 1.0, end: 0.2},
                    speed       : {min: 100, max: 200},
                    lifespan    : 500,
                    quantity    : 1,
                    frequency   : 300
                });

                this.emitters.push(emitter);
                
                //this.emitter.explode(1);
            }
        }else{
            this.particles.setVisible(true);
            this.particles.setActive(true);
            for(let i = 0; i < this.emitters.length; i++){
                this.emitters[i].start();
            }
        }
        

        

    
    }




    stopParticles(){
        console.log("dur dur")
        if(this.emitters){
            for(let i = 0; i < this.emitters.length; i++){
                this.emitters[i].stop();
            }

            this.scene.time.delayedCall(1000, function(){
                this.particles.setVisible(false);
                this.particles.setActive(false);
            }, [], this);
        }
    }


}