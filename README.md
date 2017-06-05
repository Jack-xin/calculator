# calculator
概要：
	该科学计算器，使用ES5语法编写，可以实现普通运算以及科学运算。将核心计算程序封装成模块，可复用。准确判断输入左右括号，小数点等。

调用方法：
1、	引入calculate.js
2、	创建构造函数，并且传入显示窗口元素，输出窗口元素，deg元素，以及deg的backgroundColor
        var 	result = $("result"),
    		formula = $("formula"),
    		deg = $("deg"),
   		 	color = "rgb(0, 204, 102)",
    		cal = new Calculator(result, formula, deg, color);
3、	调用cal.calculate(argument)方法，将键入值传入calculate方法中。

实现运算种类：
1、	普通运算：1+2+3=5；1x2-(5+6)=-9等
2、	幂运算：
（1）2^(1+1) = 4
（2）1+2^(1+1)x2-6 = 3
（3）2^(2^(2^(1-1)))+1 = 5
（4）1+(1+2)^(1+2^(1-1))+6 = 16
（5）(1+2)^(2^((1+2)^(2^(1-1)))-8)+6 = 7
（6）2^(1+π) = 17.6499……
（7）2^(√(2+2))+5 = 9
（8）√(2^(2)) = 2
	3、三角函数：
		角度制运算：
			（1）cos(60) = 0.5
			（2）cos(10+2x20+10) = 0.5
			（3）sin(29.5+cos(20+40)) = 0.5
		弧度制与角度制一样
4、混合运算：
（1）2^(cos(20+40)+1.5) = 4
（2）cos(2^(2^(1+1))+44) = 0.5
（3）cos(2^(2^(1.5+sin(30)))+44)+1.5 = 2
（4）cos(√(cos(10+50)+99.5)+50) = 0.5
（5）cos(√(cos(10+50)+99.5)+2^(2+3)+2^(1+3)+2) = 0.5
（6）√(cos(60)+99.5) = 10
（7）√(100) + tan(45) = 11
（8）2^(√(tan(45)+3))+1 = 5
（9）tan(√(tan(45)+99)+35) = 1
待优化：
1、	js浮点数运算bug没有修复
2、	底数为百分数的幂运算时，若百分数带括号，即(200%)^(1+1) = 4无bug，若百分数不带括号，即200%^(1+1) = 4，有小bug，该计算器计算结果为0.02，原因：将底数误以为100，而不是200/100（时间原因未修复）

