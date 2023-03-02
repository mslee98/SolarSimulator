import { Simulator } from './lib/Simulator';
import { SimulatorChart } from './lib/SimulatorChart';
// import datepicker from 'js-datepicker';

function domInit() {
    var openBtn = document.querySelector(".open");
    var leftCont = document.querySelector(".left-box");
    var rightCont = document.querySelector(".right-box");
    openBtn.addEventListener("click",function(){
        leftCont.classList.toggle("on");
        rightCont.classList.toggle("on");
        openBtn.classList.toggle("on");

        var icon = document.querySelector(".open i");
        if(openBtn.classList.contains("on")){
            setTimeout(function(){
                icon.classList.replace("fa-caret-right","fa-caret-left");
            },250);
        }else{
            setTimeout(function () {
                icon.classList.replace("fa-caret-left", "fa-caret-right");
            }, 250);
        }
    });

    var tabList = document.querySelectorAll(".tab-list .tab");
    var tabCont = document.querySelectorAll(".tab-cont .tcon");
    tabList[0].classList.add("on");
    tabCont[0].classList.add("on");

    for (var i = 0; i < tabList.length; i++) {
        tabList[i].index = i; // index 값을 미리 지정합니다.
        var n = 0;

        tabList[i].addEventListener("click", function (e) {
            n = e.currentTarget.index;
            // console.log("n : "+n);

            for (var j = 0; j < tabList.length; j++) {
                if (j == n) {
                    tabList[j].classList.add("on");
                    tabCont[j].classList.add("on");
                }
                else {
                    tabList[j].classList.remove("on");
                    tabCont[j].classList.remove("on");
                }
            }
        });

    }

    const modal = document.querySelector("#modal");

    var navList = document.querySelectorAll(".nav ul li");
    navList[0].classList.add("on");
    for (var i = 0; i < navList.length; i++) {
        navList[i].index = i;
        var n = 0;

            navList[i].addEventListener("click", function (e) {
            n = e.currentTarget.index;

            for (var j = 0; j < navList.length; j++) {
                if (j == n) {
                    navList[j].classList.add("on");

                    if(j == 1) {
                        modal.style.display = 'flex';
                    } else {
                        modal.style.display = 'none';
                    }

                }
                else {
                    navList[j].classList.remove("on");
                }
            }
        });
    }

}



window.onload = () => {
    domInit();

    // const startDt = document.querySelector("#startDt");

    // const start = new datepicker('#startDt');


    //Chart 실행
    window.simulatorChart = new SimulatorChart();

    //Simulator 실행
    const simulator = new Simulator();

    const modal = document.getElementById("modal");
    
    // const modalBtn = document.querySelector(".upload");

    // const modalCloseBtn = document.querySelector(".close-area");
    
    // modalBtn.addEventListener('click', () => {
    //     modal.style.display = 'flex';
    // });

    const file = document.querySelector("#file");

    file.addEventListener('change', setPreviewImage);

    function setPreviewImage(e) {

        const reader = new FileReader();
    
        reader.onload = (e) => {
            
            const html = "<img src="+e.target.result+" width='250' height='250'>";

            // const img = document.createElement("img");
            // img.setAttribute("src", e.target.result);
            // img.setAttribute("width", 250);
            // img.setAttribute("height", 250);

            dropZone.innerHTML = html;
        }
    
        reader.readAsDataURL(e.target.files[0]);
    }


    const dropZone = document.querySelector(".dropzone");

    dropZone.addEventListener('dragenter', (e) => {
        console.log('dragEnter');
    });


    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();

        dropZone.style.backgroundColor = 'blue';
        dropZone.style.backgroundColor = 'rgba( 107, 107, 107, 0.70 )';    
    });

    //
    dropZone.addEventListener('dragleave', (e) => {
        dropZone.style.backgroundColor = 'rgba( 0, 0, 0, 0.70 )';
    });


    //drop
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();

        dropZone.style.backgroundColor = 'rgba( 107, 107, 107, 0.70 )';
        
        console.log(e.dataTransfer.files[0]);
        let text = '<div style="margin:10px;"><h2>업로드 파일 정보</h2><table border="1" width="100%" style="border-color:#fdfdfd"><tr><th>파일 이름</th><td>'+e.dataTransfer.files[0].name+'</td></tr><tr><th>파일 크기</th><td>'+e.dataTransfer.files[0].size+'</td></tr> <tr> <th>파일 형태</th><td>GLB</td></tr><tr><th>파일 경로</th><td>C:\Users\agics\eclipse\...</td> </tr></table><div class="btn_area" style="margin:10px;"><button class="btn" id="Scan">Scan</button><button class="btn" id="Modeling" style="margin-left:10px;">Modeling</button></div></div><div><img width=170px; src="./assets/images/test_thumnail.png"></div>';

        dropZone.innerHTML = text;

        const modelBtn = document.querySelector("#Modeling");
        modelBtn.addEventListener('click', () => {
            
            document.querySelector("#loadingDiv").style.display = 'block';
            
            setTimeout(() => {
                modal.style.display = 'none';
                
                const nav = document.querySelectorAll(".nav ul li");
                nav[0].classList.add("on");
                nav[1].classList.remove("on");


                simulator._testModeling();

            }, 2000)

        })
    });

    const closeBtn = document.querySelector(".close-area");

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    const runBtn = document.querySelector("#simulator-run");

    runBtn.addEventListener('click', () => {
        
        // 차트 업데이트
        // simulatorChart._update();

        // 렌더러 업데이트
        simulator._testVariable();

        emulateProcesses();

    });

    const stopBtn = document.querySelector("#simulator-stop");

    stopBtn.addEventListener('click', () => {

        document.querySelector("#loadingDiv").style.display = 'block';

        setTimeout(() => {
            const div = document.createElement("DIV");
            const img = document.createElement("IMG");
            img.setAttribute("src","./assets/images/KakaoTalk_20230228_130917988.png");
            img.setAttribute("width", "1920");
            img.setAttribute("height", "1080");
            img.style.position = "absolute";
            img.style.top = "0px";
    
            div.appendChild(img);
            document.body.appendChild(div);
        }, 2000);


        // const frame = document.createElement("IFRAME");
        // frame.setAttribute("src","http://127.0.0.1:5500/three.js-master/mslee/iframe/index.html");
        // frame.setAttribute("width", "1910");
        // frame.setAttribute("height", "1070");
        // frame.style.position = "absolute";
        // frame.style.top ="-10px";
        // frame.style.zIndex = "5";
        // frame.style.backgroundColor = 'ffffff';

        // document.body.appendChild(frame);
        
    });

}

    function emulateProcesses() {

        $('.loading-bar').css('left', '-100%');
        var completed = 0;
        var processes = 365; 
        setInterval(function(){ 
            if(completed <= processes) {
                loadBar(completed, processes, "Processing...", "", 2000);
                completed++;
            }
        }, rand(0,500));
    }

    function loadBar(completed, total, processingMessage, completeMessage, hideDelay) {
        var progress = (completed / total) * 100;
        $(".loading-bar-container").show();
        $('.loading-bar').html('');
        $(".loading-bar-outer-text").html(processingMessage);
        
        $('.loading-bar').stop().animate({
        left: '-' + (100 - progress) + '%'
        }, 600, function () {
            if (progress === 100) {
            $('.loading-bar').html(completeMessage);
            $(".loading-bar-outer-text").html('');
            
            if (hideDelay) {
                $(".loading-bar-container").delay(hideDelay).fadeOut(300);
                setTimeout(function () { $(".loading-bar").css({ left: '-100%' }) }, hideDelay + 300);
            }
            }
        });
        }

    // Helper func
    function rand(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min
    }


