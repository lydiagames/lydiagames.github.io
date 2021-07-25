const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

class DictionaryDialog extends Dialog{


    constructor(scene){
        super(scene);


        this.setTitleLabel(Language.strings["dict_dialog_title"]);
        this.setCloseButton();

        
        this.textArea();

    }

 
    

    textArea(){
    
        let bg = this.scene.add.rexNinePatch(0, -150, this.content.width * 0.65, 400, "sheet1", "extra_words_bg", [15, 15, 15], [15, 15, 15], {
            stretchMode: 0,
            getFrameNameCallback: undefined
        });
        this.bg = bg;

        bg.setOrigin(0.5, 0);

        this.content.add(bg);

        let wordsWidth = bg.width * 0.95;

        this.text = new Phaser.GameObjects.Text(this.scene,
            bg.x, 
            bg.y + 5,
            " ",
            {fontFamily: Config.FONT, fontSize: 28, color: '#535353', align: 'left', fontStyle: "bold", wordWrap: {width:wordsWidth}}
        ).setOrigin(0.5, 0);
        
        this.content.add(this.text);


        //this.text.setText("The sky above the port was the color of television, tuned to a dead channel. `It's not like I'm using,' Case heard someone say, as he shouldered his way through the crowd around the door of the Chat. Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray of glasses with draft Kirin. Ratz was tending bar, his prosthetic arm jerking monotonously as he filled a tray of glasses with draft Kirin. He saw Case and smiled, his teeth a webwork of East European steel and brown decay. A distant poor relative of the Duke D'Ascoyne plots to inherit the title by murdering the eight other heirs who stand ahead of him in the line of succession A distant poor relative of the Duke D'Ascoyne plots to inherit the title by murdering the eight other heirs who stand ahead of him in the line of succession A distant poor relative of the Duke D'Ascoyne plots to inherit the title by murdering the eight other heirs who stand ahead of him in the line of succession A distant poor relative of the Duke D'Ascoyne plots to inherit the title by murdering the eight other heirs who stand ahead of him in the line of succession");

        let graphics = this.scene.make.graphics();
        graphics.fillRect(0, 0, bg.width, bg.height);

        let global = bg.getWorldTransformMatrix();
        graphics.setPosition(global.tx - bg.width * 0.5, global.ty);

        let mask = new Phaser.Display.Masks.GeometryMask(this.scene, graphics);
        //this.text.setMask(mask);


        var zone = new Phaser.GameObjects.Zone(this.scene, bg.x, bg.y, bg.width, bg.height);
        zone.setOrigin(0).setInteractive();
        this.content.add(zone);
        zone.setPosition(bg.x - bg.width * 0.5, bg.y);

        


        zone.on('pointermove', function (pointer) {
            if (pointer.isDown){
               this.velocity = pointer.velocity.y * 0.1;
            }
        }, this);

    }

    


    update(){
        if(this.text.text.length){
            this.text.y += this.velocity;
            this.velocity *= 0.95;
            if(this.text.y > this.scrollTop) this.text.y = this.scrollTop;
            if(this.text.y < this.scrollBottom) this.text.y = this.scrollBottom;
        }
        
    }




    show(words){
        super.show();
        this.completedRequests = 0;
        this.accumulatedResponseString = "";
        this.words = words;
    }




    onShowComplete(){
        for(let i = 0; i < this.words.length; i++){
            console.log(this.words[i])
            this.sendRequest(this.words[i]);
        }
    }



    stripText(str){
        let regex = /(<([^>]+)>)/ig
        return str.replace(regex, "");
    }



    onDefinitionComplete(word, text){
        this.completedRequests++;
        this.accumulatedResponseString += word + "\n" + text + "\n\n";
        if(this.completedRequests == this.words.length) {
            this.text.setText(this.stripText(this.accumulatedResponseString));
            console.log(this.bg.x, this.bg.y)
            this.text.x         = this.bg.x;
            this.text.y         = this.bg.y + 5;
            this.scrollTop      = this.text.y;
            this.scrollBottom   = this.scrollTop - Math.max(this.text.height, this.bg.height) + this.bg.height - 10;
            this.velocity       = 0;
        }
    }


    

    sendRequest(word){
        let xmlhttp = new XMLHttpRequest();
        let url = "https://api.wordnik.com/v4/word.json/" + word.toLowerCase() + "/definitions?limit=10&includeRelated=false&useCanonical=false&includeTags=false&api_key=" + Config.WORDNIC_API_KEY;
        console.log(url);
        xmlhttp.open("GET", url, true);

     
        let that = this;
        xmlhttp.onreadystatechange = function() {
            if (xmlhttp.readyState == XMLHttpRequest.DONE) {
                if (xmlhttp.status == 200) {
                    that.parseResponse(word, xmlhttp.responseText)
                }else {
                    console.log("dictionary status: ", xmlhttp.status);
                    that.parseResponse(null);
                }
            }
        };
        xmlhttp.send();
    }




    parseResponse(word, text){
        let response;
        if(text == null) response = null;
        let jsonObject = JSON.parse(text);
        
        if(jsonObject["statusCode"]){
            if(jsonObject["message"]) response = jsonObject["message"];
            else if(jsonObject["error"]) response = jsonObject["error"];
            else response = jsonObject["statusCode"];
        }
        

        for(let i = 0; i < jsonObject.length; i++){
            if(jsonObject[i].text){
                response = jsonObject[i].text;
                break;
            }
        }
        console.log(word, response);
        this.onDefinitionComplete(word, response);
        
    }


}