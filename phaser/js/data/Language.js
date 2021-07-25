class Language{

    static KEY_SELECTED_LANGUAGE = "KEY_SELECTED_LANGUAGE";

    static strings = null;

    static getCode(){
        return "en";
    }




    static setNewLanguage(code, scene){
        Language.code = code;

        localStorage.setItem(Language.KEY_SELECTED_LANGUAGE, code);

        GameData.readWords(scene);
        GameData.readVulgarWords(scene);

        Language.strings = scene.cache.json.get('strings');
        
    }




}



