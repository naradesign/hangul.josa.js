# 한글 조사 출력기 hangul.josa.js(jQuery plugin)
맥락에 맞는 한글 조사(은/는, 이/가, 을/를, 와/과, 로/으로)를 붙여주는 기능을 합니다. 한글 뿐만 아니라 숫자와 알파벳 발음 끝에 종성이 있는지 여부에 따라 적절한 한글 조사를 붙여 줍니다. 

## 한글 조사 출력기 사용법
jquery.min.js 와 hangul.josa.min.js 파일을 순서대로 로드한 다음 조사를 붙일 DOM 요소에 .josa() 메서드를 통해 적절한 인자(은/는, 이/가, 을/를, 와/과, 로/으로)를 넘겨주면 실행합니다.

    <script src="jquery.min.js"></script>
    <script src="hangul.josa.min.js"></script>
    <script>
        $(".e").josa("이/가"); // 주격 조사(이, 가)를 붙여야 하는 경우 "이/가"를 인자로 넘긴다.
        $(".e").josa("을/를"); // 목적격 조사(을, 를)를 붙여야 하는 경우 "을/를"을 인자로 넘긴다.
        $(".e").josa("은/는"); // 보격 조사(은, 는)를 붙여야 하는 경우 "은/는"을 인자로 넘긴다.
        $(".e").josa("와/과"); // 접속 조사(와, 과)를 붙여야 하는 경우 "와/과"를 인자로 넘긴다.
        $(".e").josa("로/으로"); // 부사격 조사(로, 으로)를 붙여야 하는 경우 "로/으로"를 인자로 넘긴다.
    </script>
  
## 한글 조사 출력 테스트 케이스
http://naradesign.github.io/hangul.josa.js/hangul.josa.html

## 저작권/라이선스
Copyright (c) 2016 ChanMyeong Jeong | Under the **MIT** license.
