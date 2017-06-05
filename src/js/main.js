// 获取输入值，并且计算
var result = $("result"),
    formula = $("formula"),
    deg = $("deg"),
    color = "rgb(0, 204, 102)",
    cal = new Calculator(result, formula, deg, color);

$("basicTools").addEventListener("click", function(event) {
    var enterText = event.target.innerText;
    cal.calculate(enterText);
    shrinkShows(cal.returnThisNum());
});

$("sienceKeys").addEventListener("click", function(event) {
    var enterText = event.target.innerText;
    cal.calculate(enterText);
    shrinkShows(cal.returnThisNum());
});

$("basicKeys").addEventListener("click", function(event) {
    var enterText = event.target.innerText;
    cal.calculate(enterText);
    shrinkShows(cal.returnThisNum());
});

// 计算器点击事件
$("sience").addEventListener("click", function(){
    $("basic").style.backgroundColor = "#CCCCFF";
    $("sience").style.backgroundColor = "#669966";
    $("sienceKeys").style.display = "flex";
    $("basicKeys").className = "sienceBasicKeys";
    $("change_DR").style.display = "block";
});

$("rad").addEventListener("click", trigonometricFun.bind(null, $("deg"), $("rad")));

$("deg").addEventListener("click", trigonometricFun.bind(null, $("rad"), $("deg")));

$("basic").addEventListener("click", function(){
    $("sience").style.backgroundColor = "#CCCCFF";
    $("basic").style.backgroundColor = "#669966";
    $("sienceKeys").style.display = "none";
    $("basicKeys").className = "basicKeys";
    $("change_DR").style.display = 'none';
});

function $(id) {
    return document.getElementById(id);
}

function trigonometricFun(element1, element2) {
    if (element1.style.backgroundColor = "#00CC66") {
        element1.style.backgroundColor = "#CCCCFF";
    }
    element2.style.backgroundColor = "#00CC66"; 
}

//输入内容自适应input宽度
function shrinkShows(str) {
    if (str.length <= 15) {
        $("result").style.fontSize = "30px";
    } else if ((str.length > 15) && (str.length <= 18)) {
        $("result").style.fontSize = "25px";
    } else if ((str.length > 18) && (str.length <= 23)) {
        $("result").style.fontSize = "20px";
    } else if ((str.length > 23) && (str.length <= 50)) {
        $("result").style.fontSize = "15px";
    } else {
        $("result").style.fontSize = "20px";
    }
}


