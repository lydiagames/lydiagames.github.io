class Dialog extends Phaser.GameObjects.Container{

    constructor(scene){
        super(scene);
        this.modal = this.scene.make.graphics();
        this.modal.alpha = 0.8;
        this.add(this.modal);

        this.createContentBox();
        this.updateSize();
        this.setInteractive(new Phaser.Geom.Circle(0, 0, 3000), Phaser.Geom.Circle.Contains);
    }




    updateSize(){
        this.modal.fillStyle(0x000000);
        this.modal.beginPath();
        this.modal.fillRect(0, 0, this.scene.scale.gameSize.width, this.scene.scale.gameSize.height);
        this.modal.closePath();
        this.setSize(this.scene.scale.gameSize.width, this.scene.scale.gameSize.height);

        this.content.setScale(this.scene.gameScale);
        this.content.x = this.displayWidth * 0.5;
        this.content.y = this.displayHeight * 0.5;
        if(this.btnClose) this.positionClose();
    }



    createContentBox(){
        this.content = new Phaser.GameObjects.Container(this.scene);
        this.add(this.content);

        let bg = new Phaser.GameObjects.Image(this.scene, 0, 0, "sheet1", "dialog");
        this.content.add(bg);
        this.content.setSize(bg.width, bg.height);
    }



    setTitleLabel(text){
        this.title = new Phaser.GameObjects.Text(this.scene,
            0.5, 
            -this.content.displayHeight * 0.5 + 45,
            text,
            {fontFamily: Config.FONT, fontSize: 50, color: '#000', align: 'center', fontStyle: "bold" }
        ).setOrigin(0.5, 0.55);

        let maxWidth = this.content.width * 0.6;
        if(this.title.width > maxWidth) this.title.scale = maxWidth / this.title.width;



        this.content.add(this.title);
    }



    setCloseButton(){
        this.btnClose = new SpriteButton(
            this.scene, 
            this.content.width * 0.5 - 25, 
            -this.content.height * 0.33, 
            "sheet1", "dialog_close_up", "dialog_close_down"
        ).setOrigin(1, 0);

        this.btnClose.setCallback(this.hide, this);
        this.content.add(this.btnClose);
    }



    show(){
        this.scene.input.enabled = false;
        this.scene.dial.setEnabled(false);
        this.content.setScale(0);
        this.setVisible(true);
        this.setActive(true);

        this.scene.tweens.add({
            targets         : this.content,
            scale           : 1,
            duration        : 500,
            ease            : "Back.easeOut",
            callbackScope   : this,
            onComplete      : function(){
                this.scene.input.enabled = true;
                this.onShowComplete();
            }
        });
    }





    onShowComplete(){

    }





    hide(){
        this.scene.input.enabled = false;

        this.scene.tweens.add({
            targets         : this.content,
            scale           : 0,
            duration        : 500,
            ease            : "Back.easeIn",
            callbackScope   : this,
            onComplete      : function(){
                this.setVisible(false);
                this.setActive(false);
                this.scene.input.enabled = true;
                this.onHideComplete();
            }
        });
    }


    onHideComplete(){
        this.scene.dial.setEnabled(true);
    }

}