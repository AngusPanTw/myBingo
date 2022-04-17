$(function () {
    var range = (start, stop, step = 1) => Array(Math.ceil((stop - start) / step)).fill(start).map((x, y) => x + y * step)
    var compTable = []  // 參考bingoArray
    var userTable = []  // 參考bingoArray
    var compTable2 = [] // 電腦數字array
    var userTable2 = [] // 玩家數字array
    var openNum = []    // 放已翻開的數字
    var openNumLength = 0
    var inTheGame = 0   // 代表遊戲進行中(1)  /  還沒開始(0)  /  分出勝負或平手(99)
    var score = { computer: 0, player: 0 }  // 分數累計到3就結束
    $('.compNum').each(function () { this.innerText = '' })
    $('.PlayerNum').each(function () { this.innerText = '' })

    // var bingoArray = [
    //     [1, 2, 3, 4, 5],
    //     [6, 7, 8, 9, 10],
    //     [11, 12, 13, 14, 15],
    //     [16, 17, 18, 19, 20],
    //     [21, 22, 23, 24, 25],
    //     [1, 6, 11, 16, 21],
    //     [2, 7, 12, 17, 22],
    //     [3, 8, 13, 18, 23],
    //     [4, 9, 14, 19, 24],
    //     [5, 10, 15, 20, 25],
    //     [1, 7, 13, 19, 25],
    //     [5, 9, 13, 17, 21]
    // ]

    let reset = () => {
        compTable = []
        userTable = []
        compTable2 = []
        userTable2 = []
        openNum = []
        openNumLength = 0
        score = { computer: 0, player: 0 }
        $('.compNum').css('background-image', '')
        $('.PlayerNum').css('background-image', '')
        $('.compNum').each(function () { this.innerText = '' })
        $('.PlayerNum').each(function () { this.innerText = '' })
        playerChoiceNumVal.innerText = ''
        compChoiceVal.innerText = ''
        noOpenNum.innerText = ''
    }

    let genRandomList = function () {   // 產生array[1, 2, ... , 24, 25] 且以隨機排列的方式return出來
        var totalNumList = range(1, 26);
        var oriListLen = totalNumList.length;
        var result = []
        for (var i = 0; totalNumList.length > 0; i++) {
            var temp = Math.floor(Math.random() * oriListLen)
            result.push(totalNumList[temp]);
            totalNumList.splice(temp, 1);
            oriListLen -= 1;
        }
        return result
    }

    let genRanTable = function (x) {
        var temp = genRandomList();
        $(x).each(function () {
            this.innerText = temp[0];
            temp.splice(0, 1);
        })
    }

    function bingoList(array1, array2) {    // 把array中所有可以連成線的可能放到array2
        array2.push(array1.slice(0, 5), array1.slice(5, 10), array1.slice(10, 15), array1.slice(15, 20), array1.slice(20))
        for (var i = 0; i < 5; i++) { array2.push([array1[i], array1[i + 5], array1[i + 10], array1[i + 15], array1[i + 20]]) }
        array2.push([array1[0], array1[6], array1[12], array1[18], array1[24]])
        array2.push([array1[4], array1[8], array1[12], array1[16], array1[20]])
        return array2
    }

    function playWinList() {                      // 電腦/玩家獲勝的數字列表
        bingoList(compTable2, compTable)
        bingoList(userTable2, userTable)
    }

    function remainNum() {  // 還有那些數字還沒被打開
        var noOpen = range(1, 26)
        openNum.forEach(function (x) {
            if (noOpen.includes(x) == true) { noOpen.splice(noOpen.indexOf(x), 1) }
        })
        noOpenNum.innerText = '還沒被打開的數字有' + noOpen.join(' | ')
    }

    let checkUserKinIn = () => {        // // 玩家鍵入的字串數字化 & 判斷是否是1~25,否跳出警告字樣
        var a = Number(playerChoiceNum.value)
        if (inTheGame == 1) {
            if (isNaN(a) == false) {
                if (openNum.includes(a) != true) {
                    if (0 < a & a < 26) {
                        playerChoiceNum.value = ''
                        openNum.push(a)
                        remainNum()
                        playerChoiceNumVal.innerText = a
                        openNumLength++
                        var c = userTable2.indexOf(a) + 1
                        var d = compTable2.indexOf(a) + 1
                        $(`#play${c}`).css('background-image', 'url("./img/5.jpg")').text(a)
                        $(`#comp${d}`).css('background-image', 'url("./img/5.jpg")').text(a)
                        setTimeout(checkWin, 20)
                    }
                    else { alert('請輸入1~25之間的數字') }
                }
                else alert(`${a}已經翻開過囉`)
            }
            else { alert(`${playerChoiceNum.value}不是數字`) }
        }
        else if (inTheGame == 99) { alert('遊戲結束囉 請重新產生賓果表') }
        else alert('請先產生賓果表再進行遊戲')
        playerChoiceNum.value = ''
    }

    let checkWin = () => {  // 把連城一條線的人計入score裏頭
        compTable.forEach(function (x) {
            temp = []
            x.forEach(function (y) {
                if (openNum.includes(y) == true) { temp.push(true) }
                if (temp.length == x.length) { compTable[(compTable.indexOf(x))] = ['已被取出']; score.computer += 1 }
            })
        })
        userTable.forEach(function (x) {
            temp2 = []
            x.forEach(function (y) {
                if (openNum.includes(y) == true) { temp2.push(true) }
                if (temp2.length == x.length) { userTable[(userTable.indexOf(x))] = ['已被取出']; score.player += 1 }
            })
        })
        if (score.computer == 3 & score.player != 3) { alert('電腦贏了，遊戲結束'); inTheGame = 99; genTable.value = '重新開始'}
        if (score.player == 3 & score.computer != 3) { alert('你贏了，遊戲結束'); inTheGame = 99; genTable.value = '重新開始' }
        if (score.player == 3 & score.computer == 3) { alert('平手!!!'); inTheGame = 99; genTable.value = '重新開始' }
    }

    $('#genTable').click(function () {      // 點擊(id=#restart)按鈕產生新的玩家電腦賓果表,並且把幾個array歸零
        console.log(compTable2 + '\n' + userTable2)
        if (inTheGame == 0 | inTheGame == 99) {
            reset()
            inTheGame = 1
            genTable.value = '放棄這一局'
            compTable2 = genRandomList()
            userTable2 = genRandomList()
            console.log(compTable2)
            console.log(userTable2)
            playWinList()                   // 從.compNum / .PlayerNum中讀出所有可以連成線的五個值,塞進userTable,compTable中用來比對
        }
        else {
            if (confirm('還沒分出勝負,確定放棄這場嗎？')) {
                genTable.value = '點我產生賓果表'
                alert('請再按一次按鈕更換新的賓果表');
                inTheGame = 0;
                reset()
            }
            else alert('繼續遊戲')
        }
    })

    $('#confirm').click(function () {       // 確認 檢查輸入的數字  -> 加入到放"已打開的數字"列表中
        var openlength = openNumLength
        checkUserKinIn()
        setTimeout(compChoieeDelay, 1000)  // 翻開玩家的牌後,等待一秒後換電腦翻開他的選擇
        function compChoieeDelay() {
            if (score.computer != 3 & score.player != 3) {
                if (openlength < openNumLength) {// 玩家翻開一張牌才翻開電腦的牌
                    var temp = genRandomList()[0]
                    while (openNum.indexOf(temp) != -1) { //如果電腦選到已經翻開的牌就繼續重找一個
                        temp = genRandomList()[0]
                        if (openNum.length == 25) break
                    }
                    openNum.push(temp);
                    compChoiceVal.innerText = temp;
                    remainNum()
                    var a = userTable2.indexOf(temp) + 1
                    var b = compTable2.indexOf(temp) + 1
                    $(`#play${a}`).css('background-image', 'url("./img/5.jpg")').text(temp)
                    $(`#comp${b}`).css('background-image', 'url("./img/5.jpg")').text(temp)
                    setTimeout(checkWin, 20)
                }
            }
        }
    })
})
