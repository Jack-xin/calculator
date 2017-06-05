;(function() {
    // 模块内的全局变量
    var π = Math.PI,
        patPow = /\^/,
        patOther = new RegExp("\\π|\\.|\\)"),
        patSinceOperate = new RegExp("sin|cos|tan|√");

    // 定义构造函数Calculator，内部接收计算器输入框元素，输出框元素，deg模式元素，以及deg元素的背景颜色
    function Calculator(enterBar, outputBar, deg, color) {
        this.num = "";                    //this.num存储输入到enterBar内的运算表达式
        this.express = "";                //this.express存储输出到outputBar内的运算表达式
        this.enterBar = enterBar;
        this.outputBar = outputBar;
        this.deg = deg;
        this.color = color;
    }

    //定义构造函数内的方法
    Calculator.prototype = {

        // calculate方法：使用switch将输入的字符全部存储到this.num中，使其成为运算表达式
        calculate: function(ag1) {

            switch (ag1) {
                case "1":
                case "2":
                case "3":
                case "4":
                case "5":
                case "6":
                case "7":
                case "8":
                case "9":
                case "+":
                case "-":
                case "×":
                case "÷":
                case "π":
                case "%":
                    this.num += String(ag1);
                    break;

                case "0":
                    this.checkZero.call(this);          //调用checkZero函数，正确输入0
                    break;

                case "=":
                    this.equal.call(this);
                    break;

                case "()":
                    this.checkBracket.call(this);       //调用heckBracket函数，正确输入括号
                    break;

                case "C":
                    this.num = "";
                    this.express = "";
                    break;

                case "Del":
                    this.delete.call(this);           
                    break;

                case ".":
                    this.checkDot.call(this);           //调用checkDot函数，正确输入点
                    break;

                case "+/-":
                    this.checkPosNeg.call(this);        //调用checkPosNeg函数，正确计算正负数
                    break;

                case "xⁿ": 
                    this.num += "^(";
                    break;

                case "x²": 
                    this.num += "^(2)";
                    break;

                case "sin":
                    this.num  += "sin(";
                    break;

                case "cos":
                    this.num  += "cos(";
                    break;

                case "tan":
                    this.num  += "tan(";
                    break;

                case "√":
                    this.num  += "√(";
                    break;

                default: 
                    break;
            }

            // 将表达式输出到计算器显示窗口
            this.enterBar.value = this.num;
            this.outputBar.value = this.express;
        },

        //equal方法：依次匹配幂函数、三角函数或者普通运算
        equal: function() {
            // 使用try、catch，将输入有误的表达式作出提示
            // try {
                // 定义变量存储运算结果
                var result = 0,
                    temp = this.num;

                // 将表达式内的全部“x”和“÷”转变成“*”和“/”
                temp = this.num.replace(/×/g, "*");
                temp = temp.replace(/÷/g, "/");
                temp = temp.replace(/%/g, "/100");

                if (this.num != "") { 
                    // 表达式匹配到幂函数
                    if (patPow.test(temp)) {
                        // 调用checkPow函数进行冥函数运算，并将一次运算结果保存到result中
                        result = this.checkPow.call(this, temp);
                        // 判断result中是否含有三角函数；例如：sin(5^(1+1)+5) ==> result = sin(25+5),所以得要判断result是否含有三角函数
                        if (patSinceOperate.test(result)) {
                            result = this.trigonometricFun.call(this, result, this.deg);
                            temp = eval(result); 
                        } else {
                            temp = eval(result); 
                        }
                    }

                    // 表达式匹配三角函数
                    if (patSinceOperate.test(temp)) {
                         // 调用trigonometricFun函数进行三角函数运算
                        result = this.trigonometricFun(temp, this.deg);
                        temp = eval(result);
                    } 

                    // 表达式进行普通运算
                    this.express = this.num;
                    this.num = eval(temp);
                    
                } else {
                    this.num = "";
                }
            // } catch (e) {
            //     this.express = "输入有误！";
            // }
        },

        // checkZero函数：未输入任何字符，点击“0”，则弹出“0.”，否则进行判断输出正确的“0”
        checkZero: function() {
            if (this.num == "") {
                this.num = "0.";
            } else {
                // 判断输入字符最后一位是否为数字，若不是，则继续判断最后一位是否为“.”，若是，则输出“0”,否则输出“0.”
                if (isNaN(this.num[this.num.length - 1])) {
                    if (this.num[this.num.length - 1] == ".") {
                        this.num += "0";
                    } else {
                        this.num += "0.";
                    }
                } else {
                    // 最后一位是数字,则输出“0”
                    this.num += "0";
                }
            }
        },

        // checkBracket函数：输出正确的括号
        checkBracket: function() {
            if (this.num == "") {
                this.num += "(";
            } else {
                // 判断表达式最后一位是否为数字
                if (isNaN(this.num[this.num.length - 1])) {
                    // 继续判断表达式最后一位是否“)”或者“π”
                    if (this.num[this.num.length - 1] == ")" || this.num[this.num.length - 1] == "π" || this.num[this.num.length - 1] == "%") {
                        // 调用outputBra函数
                        this.outputBra.call(this);
                    } else {
                        this.num += "(";
                    }
                } else {
                    // 调用outputBra函数
                    this.outputBra.call(this);
                }
            }
        },

        // checkDot函数：输出正确的点
        checkDot: function() {

            var lastOperatorPos,                   //存储表达式中最后一位运算符的位置
                lastPowPos;                        //存储表达式中最后一位幂运算符的位置

            if (this.num == "") {
                this.num += "0.";
            } else {
                // 判断表达式最后一位是否为数字
                if (isNaN(this.num[this.num.length - 1])) {
                    // 匹配幂运算符
                    if (patOther.test(this.num[this.num.length - 1]) || this.num[this.num.length - 1] == "%") {
                        // 匹配成功则不处理
                        this.num = this.num;
                    } else {
                        this.num += "0.";
                    }
                } else {
                    // 调用getLastFlagPos函数获取最后一位运算符的位置
                    lastOperatorPos = this.getLastFlagPos.call(this, this.num, ["+", "-", "*", "/"]);
                  
                    lastPowPos = this.num.lastIndexOf("^");

                    if (lastPowPos > lastOperatorPos) {
                        // 调用outputDot函数，传入lastPowPos
                        this.outputDot.call(this, ".", lastPowPos);
                    } else {
                        // 调用outputDot函数，传入lastOperatorPos
                        this.outputDot.call(this, ".", lastOperatorPos);
                    }
                }
            }
        },

        // checkPosNeg函数：输出正确的负号
        checkPosNeg: function() {
            var leftBra,
                rightBra;

            if (this.num == "") {
                this.num += "-";
            } else {
                if (isNaN(this.num[this.num.length - 1])) {
                    // 表达式最后一位是“(”，则在表达式最后一位添加“-”
                    if (this.num[this.num.length - 1] == "(") {
                        this.num += "-";
                    } else if (this.num[this.num.length - 1] == ")" || this.num[this.num.length - 1] == "π") {
                        // 表达式最后一位是“)”或者“π”，则在表达式取反运算
                        this.num = -eval(this.num);
                    } else {
                        // 否则，在表达式最后一位添加“(-”
                        this.num += "(-";
                    }
                } else {
                    // 错误机制
                    leftBra = this.num.split("(").length - 1;
                    rightBra = this.num.split(")").length - 1;

                    if (leftBra > rightBra) {
                        this.num = "输入有误！";
                    } else {
                        this.num = -eval(this.num);
                    }
                }
            }
        },

        // delete函数：删除表达式的最后一位
        delete: function() {
            if (this.num != "") {
                this.num = this.num.substr(0, this.num.length - 1);
                this.outputBar.value = this.num;
            } else {
                this.num = this.num;
            }
        },

        // checkPow函数：循环调用pow函数，从字符串最内部依次解析幂
        checkPow: function(str) {
            var powOperator = str.split("^").length - 1,                  //存储表达式中的幂运算符的个数
                powStr = str,
                powPosition;                                              //存储powStr中最后一个幂运算符的位置

            // 循环调用pow函数，依次从表达式最内部计算幂运算
            for (var i = 0; i < powOperator; i++) {
                powPosition = powStr.lastIndexOf("^");
                
                if (powPosition > -1) {
                    powStr = this.pow.call(this, powPosition, powStr);
                } else {
                    break;
                }
                
            }

            return powStr;
        },

        // pow函数：拆分字符串，如1+2^(1+(2-1))+15拆分成1+、2^(1+(2-1))、+15三部分，并且算出幂运算的结果，最后拼接三部分，返回1+4+15
        pow: function(powPosition, str) {
            var baseNumleftBra,                    //记录底数左半边括号出现位置
                lastLeftBra,                       //存储最内部“^”前最后一次出现“（”的位置
                hasOperator,                       //记录底数没有括号时，底数左边第一个运算符的位置（如1+2^(2-1)，hasOperator表示"+"出现的位置）
                result,                            //接收getPowResult函数返回的返回值（如1+2^(1+1)，result = 1 + 4） 
                temp,                              //存储“^”符号前一个字符为“)”时，将str中最内部“^”的前面所有字符反转（PS：此方法用于调用getInnerEquation函数获取底数）
                baseNum,                           //存储底数
                flag = 0;                          //判断“^”前的底数是单独的数字还是表达式（如2^(1+1)和（1+2）^（1+1））

            lastLeftBra = str.lastIndexOf("(", powPosition);

            // 判断底数是否带括号
            if (str[powPosition - 1] == ")") {     //底数带括号
                //将str中最内部“^”的前面所有字符反转，并存储（PS：此方法用于调用getInnerEquation函数获取底数，getInnerEquation函数获取内部的表达式，
                //解析方向是从字符串的第一个位置开始，而表达式可能为1+（1+2）^(1+1)，底数为（1+2），如果从第一个位置开始解析，无法获取底数，所以先反转，
                //在调用getInnerEquation函数即可获取底数）           
                temp = str.substring(0, powPosition).split("").reverse().join("");
                baseNum = this.getInnerEquation(temp);
                baseNumleftBra = temp.length - 1 - baseNum.lastBraPos;

                // 调用getPowResult函数
                result = this.getPowResult.call(this, baseNumleftBra, powPosition, flag, str);

            } else {                               //底数不带括号

                flag = 1;
                // 调用getLastOperatorPos函数，得到左边最靠近底数的运算符的位置，并且将结果赋给hasOperator
                hasOperator = this.getLastFlagPos(str.substring(0, powPosition), ["+", "-", "*", "/"]);

                // 用于判断2^(2^(1+1))和1+2^(1+1)两种情况，并调用getPowResult函数
                if (lastLeftBra > hasOperator) {
                    result = this.getPowResult.call(this, lastLeftBra + 1, powPosition, flag, str);
                } else {
                    result = this.getPowResult.call(this, hasOperator + 1, powPosition, flag, str);
                }

            }

            return result;
        },

        // getPowResult函数：将底数的运算结果赋给powX，将指数的运算结果赋给powY，利用Math.pow(powX,powY)，计算出幂运算的结果保存在powResult中，拼接字符串并返回拼接好的字符串
        getPowResult: function(ag1, ag2, ag3, ag4) {
            var powRightBra,                       //存储“^”后面表达式最外面的“)”的位置
                inner = {},                        //调用getInnerEquation函数，获取指数的运算表达式，及指数运算表达式最后一个括号的位置
                powY,                              //存储指数
                powX,                              //存储底数
                firstPart,                         //存储幂运算的前半部分
                lastPart,                          //存储幂运算的后半部分
                powResult,                         //存储Mth.pow(powX,powY)的结果
                equationResult,                    //存储返回的结果，即firstPart + powResult + lastPart
                temp,                              //存储最内部“^”的前半部分的所有字符串
                hasOtherPow,                       //获取temp中最后一个“^”的位置（判断temp中是否含有“^”）
                tempReverse,                       //存储反转temp
                baseNumReverse,                    //存储调用getInnerEquation函数后，获取底数表达式的反转
                baseNum;                           //存储底数

            // 调用getInnerEquation函数获取指数
            inner = this.getInnerEquation(ag4.substring(ag2 + 1));

            // 判断指数中是否含有三角函数，若含有，则调用trigonometricFun函数获取指数，否则，直接获取指数
            if (patSinceOperate.test(inner.equation)) {
                powY = eval(this.trigonometricFun(inner.equation, this.deg));
            } else {
                powY = eval(inner.equation);
            }

            powRightBra = inner.lastBraPos;
            temp = ag4.substring(0, ag2);

            // 判断底数是否是表达式
            if (ag3) {                                //不是表达式

                hasOtherPow = temp.lastIndexOf("^");

                // 判断temp中是否含有“^”:
                if (hasOtherPow >= 0) {
                    powX = eval(temp.substring(ag1));
                    firstPart = ag4.substring(0, ag1);
                } else {
                    powX = eval(ag4.substring(ag1, ag2));
                    firstPart = ag4.substring(0, ag1);
                }
                
            } else {                                  //是表达式

                // 将temp反转，调用getInnerEquation函数，获取底数
                tempReverse = temp.split("").reverse().join("");
                baseNumReverse = this.getInnerEquation(tempReverse);
                baseNum = baseNumReverse.equation.split("").reverse().join("");

                // 判断底数是否含有三角函数，含有，调用trigonometricFun函数，否则，普通计算底数
                if (patSinceOperate.test(baseNum)) {
                    powX = eval(this.trigonometricFun(baseNum, this.deg));
                } else {
                    powX = eval(this.checkPow(baseNum));
                }
  
                firstPart = ag4.substring(0, ag1);
            }

            powResult = String(Math.pow(powX, powY));

            lastPart = ag4.substring(ag2 + powRightBra + 2);

            // 拼接字符串
            equationResult = String(firstPart + powResult + lastPart);

            return equationResult;
        },

        // trigonometricFun函数：判断当前计算三角函数的状态，分别调用radTrigonometric函数或者degTrigonometric函数
        trigonometricFun: function(str, element) {
            var triStr;
            // 判断当前计算是deg状态还是rad状态
            if (element.style.backgroundColor == this.color) {
                triStr = this.degTrigonometric(str);
            } else {
                triStr = this.radTrigonometric(str, ["sin","cos","tan","√"]);
            }

            return triStr;
        },

        // radTrigonometric函数：将表达式中的三角函数如sin、cos等全部转换为Math.sin，Math.cos等，并将转换后的公式返回
        radTrigonometric: function(str, flagName) {
            var newStr = str,
                // arr = ["sin","cos","tan","√"],
                arr = flagName,
                rad;

            for (var i = 0; i < arr.length; i++) {
                rad = new RegExp(arr[i],"g");
                newStr = newStr.replace(rad, "Math." + (arr[i] == "√" ? arr[i] = "sqrt" : arr[i]));
            }

            return newStr;
        },

        //degTrigonometric函数：从表达式中最内部的三角函数处开始计算角度制的值，并逐次向外计算，得到最终值
        degTrigonometric: function(str) {
            var loopCount = 0,                         //统计要解析循环次数
                sin = str.split("sin").length - 1,
                cos = str.split("cos").length - 1,
                tan = str.split("tan").length - 1,
                lastTriPos,                            //存储最内部的三角函数出现的位置
                inner = {},                            //调用getInnerEquation函数，获取三角函数内部的运算表达式，及运算表达式最后一个括号的位置
                innerResult,                           //存储inner.equation的计算结果
                result,                                //存储最内部三角函数的计算结果
                firstPart,                             //存储三角函数的前半部分
                lastPart,                              //存储三角函数的后半部分
                newStr = str,
                trigonometric;                         //存储最内部的三角函数

            loopCount = sin + cos + tan;

            if (loopCount == 0) {
                newStr = this.radTrigonometric(str, ["√"]);
            } else {
                // 循环计算弧度
                for (var i = 0; i < loopCount; i++) {

                    lastTriPos = this.getLastFlagPos(newStr, ["sin","cos","tan"]);           //存储最内部的三角函数的位置
                    inner = this.getInnerEquation(newStr.substring(lastTriPos + 3));   //存储最内部三角函数内部的表达式

                    // 判断内部表达式是否匹配幂函数，若匹配，则调用checkPow函数，进行幂函数运算，得出内部表达式的计算结果
                    if (patPow.test(inner.equation)) {                                 
                        innerResult = this.checkPow(inner.equation);
                    } else {
                        // deg状态下将三角函数内部的根号转换为Math.sqrt
                        if (inner.equation.indexOf("√") > -1) {
                            innerResult = this.radTrigonometric(inner.equation, ["√"]);
                        } else {
                            innerResult = inner.equation;
                        }
                        // innerResult = this.radTrigonometric(inner.equation, ["√"]);
                    } 

                    result = newStr.substr(lastTriPos, inner.lastBraPos + 4);      //存储最内部三角函数的计算结果
                    firstPart = newStr.substring(0, lastTriPos);

                    // 判断三角函数运算前半部分是否包含根号，例如：cos(√(sin(30)+99.5)+50)或者√(cos(60)+99.5)
                    if (firstPart.indexOf("√") > -1) {
                        firstPart = this.radTrigonometric(firstPart, ["√"]);
                    } else {
                        firstPart = firstPart;
                    }

                    lastPart = newStr.substring(lastTriPos + inner.lastBraPos + 4);
                    trigonometric = newStr.charAt(lastTriPos + 1);                         //存储最内部三角函数的类型

                    // 判断最内部三角函数的类型，并进行相应的弧度制计算
                    if (trigonometric == "i") { 
                        result = Math.round(Math.sin(eval(innerResult) * Math.PI / 180) * 1000000000000) / 1000000000000;  
                    } else if (trigonometric == "o") {
                        result = Math.round(Math.cos(eval(innerResult) * Math.PI / 180) * 1000000000000) / 1000000000000;
                    } else if (trigonometric == "a") {
                        result = Math.round(Math.tan(eval(innerResult) * Math.PI / 180) * 1000000000000) / 1000000000000;
                    }

                    newStr = firstPart + result + lastPart;
                }
            }

            return newStr;
        },

        // getLastFlagPos函数，获取最内部运算符的位置
        getLastFlagPos: function(ag, flagName) { 
            var operator = flagName,
                arr = [];

            // 将传入字符串中所有运算符的位置传入arr数组，利用Math.max方法获取最大值，即最内部运算符的位置
            for (var i = 0; i < operator.length; i++) {
                arr.push(ag.lastIndexOf(operator[i]));
            }

            return Math.max.apply(Array, arr);
        },

        // getInnerEquation函数：获取内部表达式
        getInnerEquation: function(equation) {
            var leftBra = 0,
                rigthBra = 0,
                inner = {};

            // 统计传入表达式中左括号和右括号的数目，当第一次出现左括号等于右括号的数目时，即得到内部表达式
            for (var i = 0; i < equation.length; i++) {
                if (equation[i] == "(") {
                    leftBra += 1;
                }

                if (equation[i] == ")") {
                    rigthBra += 1;
                }

                if (leftBra == rigthBra) {
                    inner.equation = equation.substring(0, i + 1);
                    inner.lastBraPos = i;
                    break;
                }
            }

            return inner;
        },

        // outputDot: 截取最后一个幂运算符或者运算符位置开始处到字符串结尾处的字符，判断是否含有“.”,并输出正确的点
        outputDot: function(dot, position) {
            var hasDot = this.num.indexOf(dot, position);
            if (hasDot > 0) {
                this.num = this.num;
            } else {
                this.num += ".";
            }
        },

        // outputBra: 判断左右括号的数目，并确定输出左括号还是右括号
        outputBra: function() {
            // 使用split方法统计表达式内的左右括号的数目
            var leftBra = this.num.split("(").length - 1,
                rightBra = this.num.split(")").length - 1;

            if (leftBra > rightBra) {
                this.num += ")";
            } else {
                this.num += "*(";
            }
        },

        // returnThisNum函数：输入框自适应需要已经输入的表达式，返回表达式以供用
        returnThisNum: function() {
            return this.num;
        }
    }

    // 抛出公共接口
    window.Calculator = Calculator;

})();
