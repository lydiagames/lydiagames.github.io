
class PreloadScene extends Phaser.Scene{

    constructor(){
        super({key: "PreloadScene", active: true});
    }


    init(){

    }


    preload(){
        this.createLoadingBar();
        
        this.load.plugin('rexninepatchplugin', 'js/libs/rexninepatchplugin.min.js', true);
        this.load.plugin('rexcircularprogressplugin', 'js/libs/rexcircularprogressplugin.min.js', true);
        this.load.plugin('rexwebfontloaderplugin', 'js/libs/rexwebfontloaderplugin.min.js', true);
        
        this.load.multiatlas("sheet1", "assets/textures/sheet1.json?r="+Math.random(), "assets/textures");
        this.load.bitmapFont('signika_dial', 'assets/fonts/signika_dial_0.png', 'assets/fonts/signika_dial.fnt');

        this.load.json("strings", "assets/data/" + Language.getCode() + "/strings.json");


        

    }



    create(){
        this.scene.start("GameScene");
    }



    createLoadingBar(){

    }

}


