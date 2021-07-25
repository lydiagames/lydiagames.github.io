class BoardModel{

    width;
    height;
    acrossWords = [];
    downWords   = [];
    solvedState;

    


    reset(){
        this.acrossWords.length     = 0;
        this.downWords.length       = 0;
        this.solvedState            = null;
    }



    getSolvedState(){
        if(this.solvedState != null) return this.solvedState;

        this.solvedState = [];

        for(let i = 0; i < this.width; i++){
            this.solvedState[i] = [];
        } 

        let tileMap = GameData.readTileStates();

        for(let x = 0; x < this.acrossWords.length; x++){
            let word = this.acrossWords[x];
            //let p    = this.height - word.y - 1;
            let p = word.y;
            for(let i = 0; i < word.answer.length; i++){
                
                let mergedPosition = ((word.x + i) << 8) | p;
                let state = Constants.TILE_STATE_DEFAULT;

                if(tileMap.has(mergedPosition)) state = tileMap.get(mergedPosition);
                let cellModel = new CellModel(word.answer.charAt(i), word.x + i, p, null, word, state);
                this.solvedState[word.x + i][p] = cellModel;
            }
        }



        for(let y = 0; y < this.downWords.length; y++){
            let word = this.downWords[y];

            for(let i = 0; i < word.answer.length; i++){
                //let p = this.height - (word.y - i) - 1;
                let  p = word.y + i;

                let mergedPosition = ((word.x) << 8) | (p);
                let state = Constants.TILE_STATE_DEFAULT;
                if(tileMap.has(mergedPosition)) state = tileMap.get(mergedPosition);
                
                if(this.solvedState[word.x][p] != null) {
                    this.solvedState[word.x][p].setDownWord(word);
                }else {
                    
                    let cellModel = new CellModel(word.answer.charAt(i), word.x, p, word, null, state);
                    this.solvedState[word.x][p] = cellModel;
                }
            }
        }

        return this.solvedState;

    }



    getAllWords(includeSolved){
        let words = [];

        for(let i = 0; i < this.acrossWords.length; i++){
            let word = this.acrossWords[i];
            if(includeSolved) {
                words.push(word);
            }else {
                if (!word.isSolved) {
                    words.push(word);
                }
            }
        }


        for(let i = 0; i < this.downWords.length; i++){
            let word = this.downWords[i];
            if(includeSolved) {
                words.push(word);
            }else {
                if (!word.isSolved) {
                    words.push(word);
                }
            }
        }

        return words;
    }

}



//////////////////////////////////////////////////////////////////////////////////



class Word{


    static DOWN   = "down";
    static ACROSS = "across"; 

    id;
    x;
    y;
    direction;
    isSolved = false;
    answer;
    error = false;
}




///////////////////////////////////////////////////////////////////////////////////


class Level{


    constructor(){
        this.reset();
    }



    reset(){
        if(this.boardModel == null) this.boardModel = new BoardModel();
        else this.boardModel.reset();

        this.index          = 0;
        this.letters        = null;
        this.comboCount     = 0;
        this.wordCount      = 0;
        this.isSolved       = false;
    }




    getWordCount(){
        if(this.wordCount == 0) this.wordCount = this.boardModel.getAllWords(true).length;
        return this.wordCount;
    }



}



///////////////////////////////////////////////////////////////////////////////


class CellModel{

    constructor(c, x, y, downWord, acrossWord, state){
        this.letter      = c;
        this.x           = x;
        this.y           = y;
        this.downWord    = downWord;
        this.acrossWord  = acrossWord;
        this.state       = state;
        this.previewTile = null;    
    }


    setDownWord(downWord){
        this.downWord = downWord;
    }
}