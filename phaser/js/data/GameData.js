class GameData{

    static KEY_WORDS_CACHE              = "KEY_WORDS_CACHE";
    static KEY_VULGAR_CACHE             = "KEY_VULGAR_CACHE";
    static KEY_LEVEL_CACHE              = "KEY_LEVEL_CACHE";
    static KEY_SAVED_SOLVED_WORDS       = "KEY_SAVED_SOLVED_WORDS";
    static KEY_TILE_STATE               = "KEY_TILE_STATE";
    static KEY_LAST_INCOMPLETE_LEVEL    = "KEY_LAST_INCOMPLETE_LEVEL";
    static KEY_ACCUMULATED_COMBO_COUNT  = "KEY_ACCUMULATED_COMBO_COUNT";
    static KEY_COMBO_COUNT              = "KEY_COMBO_COUNT";
    static KEY_COMBO_REWARD             = "KEY_COMBO_REWARD";
    static KEY_EXTRA_WORDS              = "KEY_EXTRA_WORDS";
    static KEY_EXTRA_WORD_COUNT         = "KEY_EXTRA_WORD_COUNT";
    static level                        = null;
    static wordMap;



    static readWords(scene){

        if(GameData.wordMap == null) GameData.wordMap = new Phaser.Structs.Map();
        else GameData.wordMap.clear();

        let fileName = "assets/data/" + "en" + "/words.txt";

        scene.load.text(GameData.KEY_WORDS_CACHE, fileName);
        scene.load.once('complete', function(){
            let words = scene.cache.text.get(GameData.KEY_WORDS_CACHE);
            let split = words.split(":");

            for(let i = 0; i < split.length; i += 2){
                GameData.wordMap.set(split[i], split[i + 1]);
            }
        });
        scene.load.start();
    }



    static readVulgarWords(scene){
        let fileName = "assets/data/" + Language.getCode() + "/vulgar.txt";

        scene.load.text(GameData.KEY_VULGAR_CACHE, fileName);
        scene.load.once('complete', function(){
            let words = scene.cache.text.get(GameData.KEY_VULGAR_CACHE);
            GameData.vulgarWords = new Phaser.Structs.Set(words.split(","));
        });
    }



    static isVulgarWord(word){
        return GameData.vulgarWords.contains(word);
    }




    static findFirstIncompleteLevel(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_LAST_INCOMPLETE_LEVEL);
        return parseInt(localStorage.getItem(key)) || 0;
    }





    static updateFirstIncompleteLevelIndex(index){
        let key = GameData.getLocaleAwareKey(GameData.KEY_LAST_INCOMPLETE_LEVEL);
        localStorage.setItem(key, index);
    }





    static getLevelByIndex(index, scene, gameController, callback){

        if(GameData.level == null) GameData.level = new Level();
        else GameData.level.reset();

        GameData.level.index = index;
        
        let fileName = "assets/data/" + "en" + "/levels/" + index;

        scene.load.json(GameData.KEY_LEVEL_CACHE, fileName);
        scene.load.once('complete', function(){
            GameData.parseLevelData(scene.cache.json.get(GameData.KEY_LEVEL_CACHE), gameController, callback);
            scene.cache.json.remove(GameData.KEY_LEVEL_CACHE);
        });
        scene.load.start(); 

    }





    static parseLevelData(data, gameController, callback){

        let o       = data["o"];
        let split   = o.split(",");

        GameData.level.boardModel.width  = parseInt(split[0]);
        GameData.level.boardModel.height = parseInt(split[1]);

        let solvedWords = GameData.getSolvedWords();

        GameData.jsonToWords(GameData.level.boardModel.acrossWords, data["a"], Word.ACROSS, solvedWords);
        GameData.jsonToWords(GameData.level.boardModel.downWords,   data["d"], Word.DOWN,   solvedWords);   

        GameData.level.letters = split[2].split("");
        Dial.shuffleArr(GameData.level.letters)
        callback.call(gameController);   
    }





    static getSolvedWords(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_SAVED_SOLVED_WORDS);
        let arr = GameData.readJsonArrayFromLocalStorage(key);
        let set = new Phaser.Structs.Set();

        for(let i = 0; i < arr.length; i++){
            set.set(arr[i]);
        }

        return set;
    }





    static jsonToWords(target, words, direction, solvedWords){
        for(let i = 0; i < words.length; i++){
            let word = new Word();

            let split = words[i].split(",");

            word.id         = parseInt(split[0]);
            word.answer     = GameData.wordMap.get(word.id);
            console.log(word.answer);
            word.x          = parseInt(split[1]);
            word.y          = parseInt(GameData.level.boardModel.height - split[2] - 1);
            word.isSolved   = solvedWords.contains(word.id);
            word.direction  = direction;
            target.push(word);
        }
    }





    static readTileStates(){
        let key     = GameData.getLocaleAwareKey(GameData.KEY_TILE_STATE);
        let object  = GameData.readJsonMapFromLocalStorage(key);
        let map     = new Phaser.Structs.Map();

        for(let a in object){
            map.set(a, object[a]);
        }

        return map;

    }





    static getLocaleAwareKey(key){
        return key + "_" + Language.getCode();
    }




    static saveComboCount(count){
        let key = GameData.getLocaleAwareKey(GameData.KEY_COMBO_COUNT);
        localStorage.setItem(key, count);
    }



    static getComboCount(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_COMBO_COUNT);
        return parseInt(localStorage.getItem(key)) || 0;
    }



    static saveComboReward(count){
        let key = GameData.getLocaleAwareKey(GameData.KEY_COMBO_REWARD);
        localStorage.setItem(key, count);
    }



    static getComboReward(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_COMBO_REWARD);
        return parseInt(localStorage.getItem(key)) || 0;
    }



    static getAccumulatedComboCount(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_ACCUMULATED_COMBO_COUNT);
        return parseInt(localStorage.getItem(key)) || 0;
    }



    static saveAccumulatedComboCount(count){
        let key = GameData.getLocaleAwareKey(GameData.KEY_ACCUMULATED_COMBO_COUNT);
        localStorage.setItem(key, count);
    }




    static saveSolvedWord(id){
        let key = GameData.getLocaleAwareKey(GameData.KEY_SAVED_SOLVED_WORDS);
        let arr = GameData.readJsonArrayFromLocalStorage(key);
        arr.push(id);
        localStorage.setItem(key, JSON.stringify(arr));
    }




    static clearSavedSolvedWordsJson(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_SAVED_SOLVED_WORDS);
        localStorage.setItem(key, "[]");
    }




    static saveTileState(x, y, type){
        let key     = GameData.getLocaleAwareKey(GameData.KEY_TILE_STATE);
        let object  = GameData.readJsonMapFromLocalStorage(key);
        let k       = (x << 8) | y;
        object[k]   = type;
        localStorage.setItem(key, JSON.stringify(object));
    }




    static clearTileStates(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_TILE_STATE);
        localStorage.setItem(key, "{}");
    }




    static readJsonArrayFromLocalStorage(key){
        let json = localStorage.getItem(key) || "[]";
        return JSON.parse(json);
    }




    static readJsonMapFromLocalStorage(key){
        let json = localStorage.getItem(key) || "{}";
        return JSON.parse(json);
    }




    static insertWordToExtraJson(word){
        let a = 0, b = 0;
        let wordId = GameData.isExtraWord(word);
        
        if(wordId > 0){
            a = 1;
            let exists = GameData.doesWordExistInExtraJson(wordId);
            if(!exists){
                b = 1;
                GameData.addWordToExtraJson(wordId);
            }else{
                b = 0;
            }
        }

        return (a << 8) | b;
    }



    static addWordToExtraJson(wordId){
        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORDS);
        let arr = GameData.readJsonArrayFromLocalStorage(key);
        arr.push(Number(wordId));
        localStorage.setItem(key, JSON.stringify(arr));
    }



    static getExtraWords(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORDS);
        return GameData.readJsonArrayFromLocalStorage(key);
    }




    static isExtraWord(word){
        let keys = GameData.wordMap.keys();

        for(let i = 0; i < keys.length; i++){
            let value = GameData.wordMap.get(keys[i])
            if(word == value) return keys[i];
        }

        return 0;
    }




    static doesWordExistInExtraJson(wordId){
        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORDS);
        let arr = GameData.readJsonArrayFromLocalStorage(key);

        for(let i = 0; i < arr.length; i++){
            if(wordId == arr[i]) return true;
        }

        return false;
    }




    static incrementFoundBonusWordCount(){
        let count = GameData.getExtraWordsCount();
        count++;

        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORD_COUNT);
        localStorage.setItem(key, count);
    }




    static getExtraWordsCount(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORD_COUNT);
        return parseInt(localStorage.getItem(key)) || 0;
    }



    static resetExtraWordsCount(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORD_COUNT);
        localStorage.setItem(key, 0);
    }



    static clearExtraWords(){
        let key = GameData.getLocaleAwareKey(GameData.KEY_EXTRA_WORDS);
        localStorage.removeItem(key);
    }

}