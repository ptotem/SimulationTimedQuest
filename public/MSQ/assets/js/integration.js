function getImg(str){
    return defaultImages.path+defaultImages[str]
//    if(parent.getImageInGame(parent.currentIntegratedGame,str) === 403)
//        return defaultImages.path+defaultImages[str]
//    else
//        return parent.getImageInGame(parent.currentIntegratedGame,str)
}

function getText(str){
    return defaultText[str]
//    if(parent.getTextInGame(parent.currentIntegratedGame,str) === 403)
//        return defaultText[str]
//    else
//        return parent.getTextInGame(parent.currentIntegratedGame,str)
}

window.getImg= getImg;
window.getText = getText;

//this is the object which contains path for default text and images
defaultImages = {}
defaultImages.path = "assets/img/"
defaultImages["msq-background"] = "background.png";



defaultText = {};
defaultText["msq-instructions"] = "Section II - Multiple Response Questions<br /><br />Instructions:<br />1. There are 5 questions in this section<br />2. Each question carries 1 mark<br />3. All questions are compulsory<br />4. You have 35 minutes to complete Section I & II. After 35 minutes, you will be automatically directed to Section III";
defaultText["msq-gamecomplete"] = "Your scores have been submitted. <br /> Now move on to the next section.";

window.defaultImages = defaultImages;
