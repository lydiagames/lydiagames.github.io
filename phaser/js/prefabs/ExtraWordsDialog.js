class ExtraWordsDialog extends Dialog{


    constructor(scene){
        super(scene);


        this.setTitleLabel(Language.strings["bonus_dialog_title"]);
        this.setCloseButton();


        this.quantity = new Phaser.GameObjects.Text(this.scene,
            0.5, 
            -160,
            " ",
            {fontFamily: Config.FONT, fontSize: 35, color: '#535353', align: 'center', fontStyle: "bold" }
        ).setOrigin(0.5, 1);
        this.content.add(this.quantity);


        this.progressbar = new Progressbar(this.scene);
        this.progressbar.y = this.quantity.y + this.quantity.height;
        this.content.add(this.progressbar);
        this.progressbar.init();
        this.progressbar.setValue(0.5);

        
        let labelWidth = this.content.width * 0.7;
        this.label = new Phaser.GameObjects.Text(this.scene,
            0.5, 
            this.progressbar.y + 60,
            " ",
            {fontFamily: Config.FONT, fontSize: 30, color: '#535353', align: 'center', fontStyle: "bold", wordWrap: { width: labelWidth}}
        ).setOrigin(0.5, 0);

        this.label.setFixedSize(labelWidth, 80);
        
        this.content.add(this.label);

        this.textArea();

        
    }




    textArea(){
    
        let bg = this.scene.add.rexNinePatch(0, this.label.y + this.label.height, this.content.width * 0.8, 270, "sheet1", "extra_words_bg", [15, 15, 15], [15, 15, 15], {
            stretchMode: 0,
            getFrameNameCallback: undefined
        });

        bg.setOrigin(0.5, 0);

        this.content.add(bg);

        let wordsWidth = bg.width * 0.95;

        this.words = new Phaser.GameObjects.Text(this.scene,
            bg.x, 
            bg.y + 5,
            " ",
            {fontFamily: Config.FONT, fontSize: 25, color: '#535353', align: 'left', fontStyle: "bold", wordWrap: {width:wordsWidth}}
        ).setOrigin(0.5, 0);
        this.words.setFixedSize(wordsWidth, bg.height);
        this.content.add(this.words);

    }



    updateData(){
        this.quantity.setText(GameData.getExtraWordsCount() + "/" + Config.NUMBER_OF_BONUS_WORDS_TO_FIND_FOR_REWARD);
        this.progressbar.setValue(GameData.getExtraWordsCount() / Config.NUMBER_OF_BONUS_WORDS_TO_FIND_FOR_REWARD);

        if(this.label.text != null) this.label.setText(Language.strings["bonus_dialog_text"]);


        let arr = GameData.getExtraWords();
        let comma = "";
        let text = "";

        for(let i = 0; i < arr.length; i++){
            text += comma;
            text += GameData.wordMap.get(arr[i])
            if(comma == "") comma = ", ";
            
        }

        this.words.setText(text);
    }




    show(){
        this.updateData();
        this.progressbar.alpha = 0;
        super.show();
    }



    onShowComplete(){
        this.scene.tweens.add({
            targets     : this.progressbar,
            alpha       : 1,
            duration    : 100
        });
    }



    hide(){
        this.scene.tweens.add({
            targets         : this.progressbar,
            alpha           : 0,
            duration        : 100,
            callbackScope   : this,
            onComplete      : function(){
                this.close();
            }
        });
    }


    close(){
        super.hide();
    }


}