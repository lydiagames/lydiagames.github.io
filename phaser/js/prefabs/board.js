class Board extends Phaser.GameObjects.Container{

    

    constructor(scene){
        super(scene);

        this.bg = new Phaser.GameObjects. Image(scene, 0, 0,  "sheet1", "board");
        this.add(this.bg);
        this.setSize(this.bg.width, this.bg.height);

        this.gridWidth    = 602;
        this.gridHeight   = 480;

        this.marginTop    = 15;
        this.marginBottom = 47;

        this.boardTilesToAnimate = [];
        this.boardTilesToSelectRandomHint = [];

        this.boardTiles = new Phaser.Structs.Map();

        this.fingerHintSelectionModeActive = false;

        this.boardTilePool = this.scene.add.group({
            classType: BoardTile,
            runChildUpdate: false
        });



        //this.setInteractive();
        //boardTile.bg.setInteractive();
        //this.scene.input.on("gameobjectdown",   this.clickHandler,   this);


    }






    layout(){
        let solvedState   = GameData.level.boardModel.getSolvedState();
        let cellWidth     = this.computeCellSize();

        let contentHeight = cellWidth * GameData.level.boardModel.height;
        let halfHeight    =  (contentHeight * 0.5) - cellWidth * 0.5;

        let contentWidth  = cellWidth * GameData.level.boardModel.width;
        let halfWidth     = (contentWidth * 0.5) - cellWidth * 0.5;

        for(let x = 0; x < solvedState.length; x++){
            for(let y = 0; y < solvedState[x].length; y++){
                let cellData = solvedState[x][y];

                if(cellData != null){
                    let boardTile = this.boardTilePool.get();
                    boardTile.setActive(true);
                    boardTile.setVisible(true);
                    boardTile.setInteractive();
                    boardTile.setScale(cellWidth / boardTile.width);
                    
                    boardTile.construct(cellData, this);
                    boardTile.x = x * cellWidth - halfWidth;
                    boardTile.y = y * cellWidth - halfHeight - this.marginBottom + this.marginTop;

                    this.boardTiles.set(this.mergeInts(cellData.x, cellData.y), boardTile);
                    this.add(boardTile);
                    
                    //boardTile.setInteractive();
                    //boardTile.on("pointerdown",   this.clickHandler,   this);

                    if(cellData.state == Constants.TILE_STATE_SOLVED && boardTile.cellData.previewTile == null){
                        boardTile.setVisible(false);
                        let pt = Preview.newTile(cellData.letter, this.scene);
                        pt.setScale(boardTile.scale);
                        pt.setPosition(boardTile.x, boardTile.y);
                        this.add(pt);
                        boardTile.cellData.previewTile = pt;
                        pt.boardTile = boardTile;
                    }else if(cellData.state == Constants.TILE_STATE_REVEALED){
                        boardTile.revealLetter();
                    }
                }
            }
        }

    }






    computeCellSize(){
        let rows      = GameData.level.boardModel.height;
        let columns   = GameData.level.boardModel.width;

        let boxWidth  = (this.gridWidth / columns);
        let boxHeight = (this.gridHeight / rows);

        let boxSize;

        if (boxWidth >= boxHeight) {
            boxSize = this.gridHeight / rows;
        } else {
            boxSize = this.gridWidth / columns;
        }

        return Math.min(boxSize, this.gridWidth * 0.2);
    }





    



   





    findWordBoardTiles(word){
        let tiles = [];

        for(let i = 0; i < word.answer.length; i++){
            let x = 0;
            let y = 0;

            if(word.direction == Word.ACROSS){
                y = word.y;
                x = word.x + i;
            }

            if(word.direction == Word.DOWN){
                x = word.x;
                y = word.y + i;
            }

            let boardTile = this.getCellViewByXY(x, y);
            tiles.push(boardTile);
        }

        return tiles;
    }




    getCellViewByXY(x, y){
        let key = this.mergeInts(x, y);
        return this.boardTiles.get(key);
    }




    isBoardSolved(completely){
        let keys = this.boardTiles.keys();
        
        for(let i = 0; i < keys.length; i++){
            let boardTile = this.boardTiles.get(keys[i]);
            let state = boardTile.cellData.state;

            if(completely){
                if(state != Constants.TILE_STATE_SOLVED) return false;
            }else{
                if(state != Constants.TILE_STATE_SOLVED && state != Constants.TILE_STATE_REVEALED) return false;
            }
        }

        return true;
    }




    getRevealedCells(){
        this.boardTilesToAnimate.length = 0;

        let keys = this.boardTiles.keys();

        for(let i = 0; i < keys.length; i++){
            let boardTile = this.boardTiles.get(keys[i]);
            let state = boardTile.cellData.state;
            if(state == Constants.TILE_STATE_REVEALED) this.boardTilesToAnimate.push(boardTile);
        }

        return this.boardTilesToAnimate;
    }




    convertRevealedCellToSolved(){
        console.log("convertRevealedCellToSolved");
    }




    revealSingleRandomHint(){
        let randomBoardTile = this.getSingleRandomBoardTile();
        this.boardTilesToAnimate.length = 0;

        if(randomBoardTile != null){
            this.boardTilesToAnimate.push(randomBoardTile);
        }

        return this.boardTilesToAnimate;
    }




    getSingleRandomBoardTile(){
        let boardTiles = this.boardTilesToArray();

        if(boardTiles.length > 0) {
            let random = Phaser.Math.Between(0, boardTiles.length - 1);
            return boardTiles[random];
        }
        return null;
    }




    boardTilesToArray(){
        this.boardTilesToSelectRandomHint.length = 0;

        let keys = this.boardTiles.keys();

        for(let i = 0; i < keys.length; i++){
            let boardTile = this.boardTiles.get(keys[i]);
            let state = boardTile.cellData.state;
            if(state == Constants.TILE_STATE_DEFAULT) this.boardTilesToSelectRandomHint.push(boardTile);
        }

        return this.boardTilesToSelectRandomHint;
    }



    mergeInts(a, b){
        return (a << 8) | b;
    }




    clearContent(){
        this.freeBoardTiles();
        this.boardTiles.clear();
        this.boardTilesToAnimate.length = 0;
        this.boardTilesToSelectRandomHint.length = 0;
    }




    freeBoardTiles(){
        let keys = this.boardTiles.keys();
        for(let i = 0; i < keys.length; i++){
            let boardTile = this.boardTiles.get(keys[i]);
            this.remove(boardTile);
            boardTile.setActive(false);
            boardTile.setVisible(false);

            this.removePreviewTile(boardTile);
            boardTile.cellData = null;
        }
    }





    removePreviewTile(boardTile){
        if(boardTile.cellData.previewTile != null){
            this.remove(boardTile.cellData.previewTile);
            boardTile.cellData.previewTile.setActive(false);
            boardTile.cellData.previewTile.setVisible(false);
        }
    }




    selectMultipleCellsForHint(num){
        this.boardTilesToAnimate.length = 0;
        let boardTiles = this.boardTilesToArray();

        if(boardTiles.length > 0){
            Dial.shuffleArr(boardTiles);
            let count = Math.min(num, boardTiles.length);
            for(let i = 0; i < count; i++){
                this.boardTilesToAnimate.push(boardTiles[i]);
            }
        }

        return this.boardTilesToAnimate;
    }
    


  
    
    

}


//////////////////////////////////////////////////////////////////////////////////


class BoardTile extends Phaser.GameObjects.Container{

    constructor(scene){
        super(scene);

        this.bg = new Phaser.GameObjects.Image(scene, 0, 0,  "sheet1", "board_tile");
        this.add(this.bg);
        this.setSize(this.bg.width, this.bg.height);
        this.txt = null;

        this.setInteractive();
        this.on("pointerup",   this.onMouseUp,   this);
        this.indicateTweenRunning = false;
    }



    construct(cellData, board){
        this.cellData = cellData;
        this.board = board;
        
    }



    onMouseUp(){
        let board = this.parentContainer;
        if(board.fingerHintSelectionModeActive){
            let state = this.cellData.state;


            if(state == Constants.TILE_STATE_SOLVED || state == Constants.TILE_STATE_REVEALED) {
                this.indicateLetterWasSolvedBefore();
                return;
            }

            if(state != Constants.TILE_STATE_DEFAULT) return;

            this.scene.input.enabled = false;
            board.boardTilesToAnimate.length = 0;
            board.boardTilesToAnimate.push(this);
            board.fingerHintSelectionModeActive = false;
            this.bg.setFrame("board_tile_selected");

            let callback = function(){
                this.scene.input.enabled = false;
                this.scene.hintController.animateHint(board.boardTilesToAnimate, this.scene.gameHud.btnFingerHint);
            }

            this.scene.hintController.closeBoardOverlayAndAnimateHint(callback);
        }
    }




    indicateLetterWasSolvedBefore(){
        if(this.indicateTweenRunning) return;

        this.indicateTweenRunning = true;
        let timeline = this.scene.tweens.createTimeline();

        timeline.add({
            targets     : this,
            angle       : "-=10",
            duration    : 100
        });

        timeline.add({
            targets     : this,
            angle       : "+=20",
            duration    : 200
        });

        timeline.add({
            targets     : this,
            angle       : "-=20",
            duration    : 200
        });

        timeline.add({
            targets     : this,
            angle       : "+=20",
            duration    : 200
        });

        timeline.add({
            targets         : this,
            angle           : "-=10",
            duration        : 100,
            callbackScope   : this,
            onComplete: function(){
                this.indicateTweenRunning = false;
            }
        });

        timeline.play();

     
    }




    revealLetter(){
        if(this.txt == null){
            this.txt = new Phaser.GameObjects.Text(this.scene,
                0, 
                0,
                " ",
                {fontFamily: Config.FONT, fontSize: 50, color: '#999', align: 'center', fontStyle: "bold" }
            ).setOrigin(0.5, 0.55)


            this.add(this.txt);
        }
        
        this.txt.setText(this.cellData.letter);

        if(this.bg.frame != "board_tile") this.bg.setFrame("board_tile");
    }





    revealAnim(callback, boardTiles){
        let timeline = this.scene.tweens.createTimeline();

        let scale = this.scale;

        timeline.add({
            targets: this,
            scale: scale * 1.5,
            duration: 200
        });

        timeline.add({
            targets: this,
            scale: scale,
            duration: 100
        });

        if(callback != null) timeline.setCallback('onComplete', callback, [boardTiles], this.scene.hintController);

        timeline.play();
    }



    



}