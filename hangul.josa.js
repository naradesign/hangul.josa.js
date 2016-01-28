/*! https://github.com/naradesign/korean.josa.js | Copyright (c) 2016 ChanMyeong Jeong | Under the MIT license. */
;(function($){
    "use strict";
    $.fn.josa = function(josaInput){ // "이/가", "을/를", "은/는", "와/과", "로/으로" 중 하나를 인자로 받아야 한다.
        // 선택한 DOM을 순환한다.
        this.each(function(){
            var $this = $(this), // 선택한 DOM 요소.
                isInput = $this.is("input"), // 인풋 요소인가? value 값을 취할 것이다.
                isSelect = $this.is("select"), // 셀렉트 요소인가? "option:selected" 요소의 value 값을 취할 것이다.
                s = ":selected",
                string; // 선택한 DOM 요소에서 가져올 문자열을 담는 변수. DOM 형태에 따라서 다른 값을 담게 된다.

            if( isInput ){ // 인풋 요소인 경우.
                string = $this.val();
            } else if( isSelect ){ // 셀렉트 요소인 경우.
                string = $this.find(s).val();
            } else { // 텍스트 요소인 경우.
                string = $this.text();
            }

            // 조사 붙이는 함수.
            var printJosa = function(){
                var $next = $this.next(),
                    str = string.replace(/[^가-힣a-z\d]/gi, ""), // 한글+영문+숫자만 남기고 공백과 특수문자(일문, 중문 포함)를 모두 제거.
                    hasFinal = ( /[가-힣]$/.test(str) && (str.substr(-1).charCodeAt(0) - 0xac00) % 28 > 0 ) || ( /[가-힣]\d*[013678]$/.test(str) || /[a-z]\d*[1789]$/i.test(str) ) || ( /([clmnp]|[blnt](e)|[co](k)|[aeiou](t)|mb|ng|lert)$/i.test(str) ), // 한글, 숫자, 알파벳 발음에 종성이 있는가?
                    josa; // 덧붙일 조사의 최종 값.

                var setJosa = function(josaCase){ // josaCase는 josaOutput 객체의 값으로써 출력해야 할 조사 값이고 배열이다.
                    // josaInput은 플러그인 사용자로부터 받은 인자다.
                    if( josaInput === "이/가" ){ // 주격 조사.
                        josa = josaCase[0]; // "이(가)", "이", "가"
                    } else if ( josaInput === "을/를" ){ // 목적격 조사.
                        josa = josaCase[1]; // "을(를)", "을", "를"
                    } else if ( josaInput === "은/는" ){ // 보격 조사.
                        josa = josaCase[2]; // "은(는)", "은", "는"
                    } else if ( josaInput === "와/과" ){ // 접속 조사.
                        josa = josaCase[3]; // "와(과)", "과", "와"
                    } else if ( josaInput === "로/으로" ){ // 부사격 조사.
                        josa = josaCase[4]; // "로(으로)", "으로", "로"
                    } else { // 받아온 josaInput 인자가 없을 때.
                        josa = "";
                    }
                };

                // 문자열의 특징에 따라서 어떤 조사를 붙여야 할지 분기 처리한다.
                if( !/([가-힣]|\d|[a-z])$/i.test(str) ){ // 어떤 조사를 붙여야 할지 모르는 경우.
                    setJosa(["이(가)", "을(를)", "은(는)", "와(과)", "로(으로)"]); // ["이(가)", "을(를)", "은(는)", "와(과)", "로(으로)"] 를 인자로 넘긴다.
                } else if( hasFinal ){ // 발음에 종성 있는 경우.
                    setJosa(["이", "을", "은", "과", "으로"]); // ["이", "을", "은", "과", "으로"] 를 인자로 넘긴다.
                } else if( !hasFinal ){ // 발음에 종성 없는 경우.
                    setJosa(["가", "를", "는", "와", "로"]); // ["가", "를", "는", "와", "로"] 를 인자로 넘긴다.
                }

                // 결정된 josa 값을 DOM 요소 우측에 출력.
                // ".josa" 라는 컨테이너 요소를 굳이 사용하는 이유는 실시간으로 앞 단어가 변경되는 경우 조사를 삭제하거나 갱신하기 위함.
                if( $next.is(".josa") ){
                    $next.text(josa);
                }else{
                    $this.after("<span class='josa'>"+josa+"</span>");
                }

                // 올바른 값을 얻거나 할당했는지 콘솔에서 확인하기 위한 코드.
                //console.log("# 인풋 요소인가?(isInput): " + isInput);
                //console.log("# 셀렉트 요소인가?(isSelect): " + isSelect);
                //console.log("# 검사할 문자(string): " + string);
                //console.log("# 한글/영문/숫자만 남긴(str): " + str);
                //console.log("# 결론적으로 발음에 종성이 있는가?: " + hasFinal);
                //console.log("# 덧붙일 조사(josa): " + josa);
                //console.log("");
            };
            printJosa(); // 조사 붙이기 함수 실행.

            if( isInput || isSelect ){ // 인풋 또는 셀렉트 요소인 경우.
                $this.on("keyup change", function(){ // 사용자 이벤트에 의해 실시간으로 값이 변경되면 printJosa 함수를 다시 실행.
                    if( isInput ){ // 인풋 이면.
                        string = $this.val(); // value 값을 다시 string에 할당.
                    } else if( isSelect ) { // 셀렉트 이면.
                        string = $this.find(s).val(); // "option:selected" value 값을 다시 string에 할당.
                    }
                    printJosa(); // 조사 붙이기 함수 다시 실행.
                });
            }
        });
    };
}(jQuery));