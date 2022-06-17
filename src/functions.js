
function myRandomId() {
    const dateNow = Date.now();
    const rndmNumb = Math.floor(Math.random() * 1000000000);
    const rndmSum = dateNow + '_' + rndmNumb;
    return (rndmSum);
}
//----------------------------
function saveLocalStorage(data) {
    localStorage.setItem('localStorage_AMPLIFIER', JSON.stringify(data));
    // console.log('Был сохранен myLocalStorage');
    // console.log(JSON.stringify(data));

}
//----------------------------
function loadLocalStorage() {
    var qqq = localStorage.getItem('localStorage_AMPLIFIER');
    // console.log('Был запущен loadLocalStorage');

    try {
        // console.log('Был прочитан JSON.parse');
        // console.log(JSON.parse(qqq));
        return (JSON.parse(qqq));
    }
    catch (error) {
        return [];
    }

}
//---------------------------------
export { myRandomId, saveLocalStorage, loadLocalStorage };
