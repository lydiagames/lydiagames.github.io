class SpriteButton extends Phaser.GameObjects.Sprite{
    constructor(scene, x, y, sheetKey, upKey, downKey) {
        super(scene, x, y, sheetKey, upKey);
        this.downKey = downKey;
        this.upKey = upKey;
        this.setInteractive({ useHandCursor: true });
        this.setStates();
    }



    setCallback(callback, callbackContext){
        this.callback = callback;
        this.callbackContext = callbackContext
    }


    setStates(){
        this.on('pointerup', this.onRelease, this).on('pointerdown', this.onPress, this).on('pointerout', this.releaseAction, this);

    }


    onPress(){
        if(this.downKey != null){
            this.setFrame(this.downKey);
        }else{
            this.tint = 0xdadada;
        }
    }


    onRelease(){
        this.releaseAction();
        if(this.callback) this.callback.call(this.callbackContext);
    }





    releaseAction(){
        if(this.downKey != null){
            this.setFrame(this.upKey);
        }else{
            this.tint = 0xFFFFFF;
        }
    }

}

