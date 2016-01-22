/*! https://github.com/naradesign/korean.josa.js | Copyright (c) 2016 ChanMyeong Jeong | Under the MIT license. */
;(function($){
    "use strict";
    $.fn.josa = function(josaInput){ // "이/가", "을/를", "은/는", "와/과", "로/으로" 중 하나를 인자로 받아야 한다.

        // 종성 유무에 따라 출력할 "주격", "목적격", "보격", "접속", "부사격" 조사를 배열에 담아 둔다.
        var josaOutput = {
            "unknown"       : ["이(가)", "을(를)", "은(는)", "와(과)", "로(으로)"], // 어떤 조사를 붙여야 할지 알 수 없는 경우 이 값 중 하나를 출력.
            "afterFinal"    : ["이", "을", "은", "과", "으로"], // 종성 있는 경우 이 값 중 하나를 출력.
            "afterMiddle"   : ["가", "를", "는", "와", "로"] // 종성 없는 경우 이 값 중 하나를 출력.
        };

        // 선택한 DOM을 순환한다.
        $(this).each(function(){
            var $this = $(this), // 선택한 DOM 요소.
                isInput = $this.is("input"), // 인풋 요소인가? value 값을 취할 것이다.
                isSelect = $this.is("select"); // 셀렉트 요소인가? "option:selected" 요소의 value 값을 취할 것이다.

            // 선택한 DOM 요소에서 가져올 문자열을 담는 변수. DOM 형태에 따라서 다른 값을 담게 된다.
            var string;
            if( isInput ){ // 인풋 요소인 경우.
                string = $this.val();
            } else if( isSelect ){ // 셀렉트 요소인 경우.
                string = $this.find(":selected").val();
            } else { // 텍스트 요소인 경우.
                string = $this.text();
            }

            // 조사 붙이는 함수.
            var printJosa = function(){
                var regKor = /[가-힣]/, // 한글 정규식
                    regEng = /[a-z]/i, // 영문 정규식
                    regEngHasFinal = /[clmnp]/i, // 종성 있는 영문 정규식
                    regEngHasFinal2 = /(mb)|(be)|(le)|(ne)|(te)|(ng)|(ck)|(ok)/i, // 종성 있는 영문 정규식
                    regDig = /\d/g, // 숫자 정규식
                    strKorEngNum = string.replace(/[^(가-힣a-z0-9)]/gi, ""), // 한글+영문+숫자만 남기고 공백과 특수문자(일문, 중문 포함)를 모두 제거.
                    strKorEngNumEnd = strKorEngNum.substr(-1), // 한글+영문+숫자 세트의 마지막 문자열 하나를 취한다.
                    strKorEngNumEnd2 = strKorEngNum.substr(-2), // 한글+영문+숫자 세트의 마지막 문자열 두 개를 취한다.
                    strKorEng = strKorEngNum.replace(regDig, ""), // 숫자를 제거해서 한글+영문만 남긴다.
                    strKorEngEnd = strKorEng.substr(-1), // 숫자가 제거된 한글+영문 세트의 마지막 문자열 하나를 취한다.
                    isKor = regKor.test(strKorEngNumEnd), // 마지막 문자열은 한글인가?
                    isKorHasFinal = isKor && (strKorEngNumEnd.charCodeAt(0) - 0xac00) % 28 > 0, // 한글 마지막 문자열에 종성이 있는가? "0" 이면 종성 없는 글자.
                    isNum = regDig.test(strKorEngNumEnd), // 마지막 문자열이 숫자인가?
                    isNumHasFinal = isNum && ( regKor.test(strKorEngEnd) && /[013678]/.test(strKorEngNumEnd) ) || ( regEng.test(strKorEngEnd) && /[1789]/.test(strKorEngNumEnd) ) , // 마지막 숫자 발음에 종성이 있는가?
                    isEng = regEng.test( strKorEngNumEnd ), // 마지막 문자열이 알파벳인가?
                    isEngHasFinal = isEng && ( regEngHasFinal.test(strKorEngNumEnd) || regEngHasFinal2.test(strKorEngNumEnd2) ), // 알파벳 발음에 종성이 있는가?
                    hasFinal = isKorHasFinal || isNumHasFinal || isEngHasFinal, // 발음에 종성이 있는가?
                    josa; // 덧붙일 조사의 최종 값.

                var setJosa = function(josaCase){ // josaCase는 josaOutput 객체의 값으로써 출력해야 할 조사 값이고 배열이다.
                    switch(josaInput){ // josaInput은 플러그인 사용자로부터 받은 인자다.
                        case "이/가": // 주격 조사.
                            josa = josaCase[0]; // "이(가)", "이", "가"
                            break;
                        case "을/를": // 목적격 조사.
                            josa = josaCase[1]; // "을(를)", "을", "를"
                            break;
                        case "은/는": // 보격 조사.
                            josa = josaCase[2]; // "은(는)", "은", "는"
                            break;
                        case "와/과": // 접속 조사.
                            josa = josaCase[3]; // "와(과)", "과", "와"
                            break;
                        case "로/으로": // 부사격 조사.
                            josa = josaCase[4]; // "로(으로)", "으로", "로"
                            break;
                        default:
                            josa = ""; // 받아온 josaInput 인자가 없을 때.
                    }
                };

                // 문자열의 특징에 따라서 어떤 조사를 붙여야 할지 분기 처리한다.
                if( !isKor && !isNum && !isEng ){ // 어떤 조사를 붙여야 할지 모르는 경우.
                    setJosa(josaOutput.unknown); // ["이(가)", "을(를)", "은(는)", "와(과)", "로(으로)"] 를 인자로 넘긴다.
                } else if( hasFinal ){ // 발음에 종성 있는 경우.
                    setJosa(josaOutput.afterFinal); // ["이", "을", "은", "과", "으로"] 를 인자로 넘긴다.
                } else if( !hasFinal ){ // 발음에 종성 없는 경우.
                    setJosa(josaOutput.afterMiddle); // ["가", "를", "는", "와", "로"] 를 인자로 넘긴다.
                }

                // 결정된 josa 값을 DOM 요소 우측에 출력.
                // ".josa" 라는 컨테이너 요소를 굳이 사용하는 이유는 실시간으로 앞 단어가 변경되는 경우 조사를 삭제하거나 갱신하기 위함.
                $this.next().is(".josa") ? $this.next().text(josa) : $this.after("<span class='josa'>"+josa+"</span>");

                // 올바른 값을 얻거나 할당했는지 콘솔에서 확인하기 위한 코드.
                /*console.log("# 인풋 요소인가?(isInput): " + isInput);
                console.log("# 셀렉트 요소인가?(isSelect): " + isSelect);
                console.log("# 검사할 문자(string): " + string);
                console.log("# 한글/영문/숫자만 남긴(strKorEngNum): " + strKorEngNum);
                console.log("# 한글/영문/숫자만 남긴 후 마지막 문자 하나(strKorEngNumEnd): " + strKorEngNumEnd);
                console.log("# 한글/영문/숫자만 남긴 후 마지막 문자 두 개(strKorEngNumEnd2): " + strKorEngNumEnd2);
                console.log("# 한글/영문만 남긴(strKorEng): " + strKorEng);
                console.log("# 한글/영문만 남긴 후 마지막 문자 하나(strKorEngEnd): " + strKorEngEnd);
                console.log("# 마지막 문자는 한글인가?(isKor): " + isKor);
                console.log("# 마지막 한글 문자에 종성이 있는가?(isKorHasFinal): " + isKorHasFinal);
                console.log("# 마지막 문자는 숫자인가?(isNum): " + isNum);
                console.log("# 마지막 숫자 발음에 종성이 있는가?(isNumHasFinal): " + isNumHasFinal);
                console.log("# 마지막 문자는 영문인가?(isEng): " + isEng);
                console.log("# 마지막 영문 발음에 종성이 있는가?(isEngHasFinal): " + isEngHasFinal);
                console.log("# 결론적으로 발음에 종성이 있는가?: " + hasFinal);
                console.log("# 덧붙일 조사(josa): " + josa);
                console.log("");*/
            };
            printJosa(); // 조사 붙이기 함수 실행.

            if( isInput || isSelect ){ // 인풋 또는 셀렉트 요소인 경우.
                $this.on("keyup change", function(){ // 사용자 이벤트에 의해 실시간으로 값이 변경되면 printJosa 함수를 다시 실행.
                    if( isInput ){ // 인풋 이면.
                        string = $this.val(); // value 값을 다시 string에 할당.
                    } else if( isSelect ) { // 셀렉트 이면.
                        string = $this.find(":selected").val(); // "option:selected" value 값을 다시 string에 할당.
                    }
                    printJosa(); // 조사 붙이기 함수 다시 실행.
                });
            }
        });
    };
}(jQuery));