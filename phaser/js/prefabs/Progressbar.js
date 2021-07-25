class Progressbar extends Phaser.GameObjects.Container{

    constructor(scene){
        super(scene);
    }


    init(){
        let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "progress_bg");
        this.width = bg.width;
        this.height = bg.height;
        this.add(bg);

        this.track = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "progress_fill");
        this.track.y = -3;
        this.add(this.track);

        this.maskShape = this.scene.make.graphics();
        this.maskShape.fillStyle(0xff0000);
        this.maskShape.beginPath();
        this.maskShape.fillRect(0, 0, this.track.width, this.track.height + 50);
        //this.scene.add.existing(this.maskShape);

        this.track.mask = new Phaser.Display.Masks.GeometryMask(this.scene, this.maskShape);
        
        this.tipX = 0;

        
        this.positionMask();
    }



    positionMask(){
        let flipVal = (1 / this.scene.gameScale);
        this.maskShape.x = this.parentContainer.x + this.x / flipVal - (this.track.width  * 0.5) / flipVal ;
        this.maskShape.y = this.parentContainer.y  + this.y / flipVal - (this.track.height * 0.5) / flipVal - 20 ;
        this.positionParticles();
    }



    particulate(){
        this.particles = this.scene.add.particles('sheet1');
        this.add(this.particles)

        let emitter = this.particles.createEmitter({
            frame       : 'flare_yellow',
            x           : this.tipX,
            y           : { min: -this.track.height  * 0.5, max: this.track.height * 0.5 - 2 },
            lifespan    : 1250,
            speedX      : { min: 0, max: -100 },
            scale       : { start: 0.2, end: 0.0},
            quantity    : 1,
            frequency   : 400,
            blendMode   : 'ADD'
        });



        emitter.onParticleDeath(function (particle) {
            emitter.setPosition(this.tipX, particle.y);
        }, this);
    }



    setValue(value, p){
        this.maskShape.scaleX = value * this.scene.gameScale;
        this.positionParticles();
        if(p && value > 0) this.particulate();
    }


    positionParticles(){
        this.tipX = (this.track.x - this.track.width * 0.5) + this.track.width * this.maskShape.scaleX * (1 / this.scene.gameScale);
    }





}