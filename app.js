// ==========================
// بيانات سورة البقرة
// ==========================

let athman = [];

for(let i = 1; i <= 39; i++){

    athman.push({
        id:i,
        done:false
    });

}



// ==========================
// المتغيرات
// ==========================

let currentThumn = null;

let repeatCount = 0;

let recorder = null;

let audioChunks = [];

let currentStream = null;



// ==========================
// IndexedDB للصوت
// ==========================

let db;


let request = indexedDB.open(
    "BaqaraAudioDB",
    1
);



request.onupgradeneeded = function(e){

    db = e.target.result;


    if(!db.objectStoreNames.contains("voices")){

        db.createObjectStore("voices");

    }

};



request.onsuccess=function(e){

    db = e.target.result;

};





function saveVoice(id,blob){


    let tx =
    db.transaction(
        "voices",
        "readwrite"
    );


    let store =
    tx.objectStore("voices");


    store.put(
        blob,
        "voice_"+id
    );

}





function getVoice(id,callback){


    let tx =
    db.transaction(
        "voices",
        "readonly"
    );


    let store =
    tx.objectStore("voices");


    let req =
    store.get(
        "voice_"+id
    );



    req.onsuccess=function(){

        callback(req.result);

    };


}





function deleteVoiceDB(id){


    let tx =
    db.transaction(
        "voices",
        "readwrite"
    );


    let store =
    tx.objectStore("voices");


    store.delete(
        "voice_"+id
    );


}




// ==========================
// تشغيل التطبيق
// ==========================

function startApp(){


let saved =
localStorage.getItem(
"baqara_progress"
);



if(saved){

athman =
JSON.parse(saved);

}



displayAthman();

updateProgress();


}






// ==========================
// عرض الأثمان
// ==========================


function displayAthman(){


let container =
document.getElementById("athman");


container.innerHTML="";



athman.forEach(thumn=>{


let card =
document.createElement("div");



card.className="card";



if(thumn.done){

card.classList.add("done");

}



card.innerHTML =
"الثمن "+thumn.id;



card.onclick=function(){

openThumn(thumn);

};



container.appendChild(card);


});


}






// ==========================
// فتح الثمن
// ==========================


function openThumn(thumn){


currentThumn =
thumn;


repeatCount=0;


document.getElementById("count")
.innerHTML=0;



document.getElementById("title")
.innerHTML =
"الثمن "+thumn.id;



document.getElementById("info")
.innerHTML =
`
📖 سورة البقرة<br>
رواية ورش<br>
<br>
ابدئي التسميع من حفظك
`;



document.getElementById("audioPlayer")
.removeAttribute("src");



// تحميل التسجيل الموجود

loadVoice(thumn.id);



document.getElementById("popup")
.style.display="flex";


}// ==========================
// عداد التكرار
// ==========================


document.getElementById("plus")
.onclick=function(){


repeatCount++;


document.getElementById("count")
.innerHTML =
repeatCount;


};




document.getElementById("minus")
.onclick=function(){


if(repeatCount>0){

repeatCount--;

}


document.getElementById("count")
.innerHTML =
repeatCount;


};





// ==========================
// حفظ الثمن
// ==========================


document.getElementById("saveBtn")
.onclick=function(){


if(currentThumn){


currentThumn.done=true;


localStorage.setItem(

"baqara_progress",

JSON.stringify(athman)

);



closePopup();


displayAthman();


updateProgress();


}


};






// ==========================
// التقدم
// ==========================


function updateProgress(){


let finished =
athman.filter(x=>x.done).length;



let percent =
(finished / 39) * 100;



document.getElementById("bar")
.style.width =
percent+"%";



document.getElementById("progressText")
.innerHTML =
finished+" / 39 ثمن";


}







// ==========================
// التسجيل الصوتي
// ==========================


document.getElementById("recordBtn")
.onclick =
async function(){


try{


currentStream =
await navigator.mediaDevices
.getUserMedia({

audio:true

});



recorder =
new MediaRecorder(
currentStream
);



audioChunks=[];



recorder.ondataavailable =
function(e){

audioChunks.push(e.data);

};





recorder.onstop=function(){



let blob =
new Blob(
audioChunks,
{
type:"audio/webm"
}
);



// حفظ التسجيل

saveVoice(
currentThumn.id,
blob
);





let url =
URL.createObjectURL(blob);



document
.getElementById("audioPlayer")
.src=url;



document
.getElementById("status")
.innerHTML =
"تم حفظ التسجيل ✅";





// إغلاق الميكروفون

currentStream
.getTracks()
.forEach(track=>track.stop());



};





recorder.start();



document
.getElementById("status")
.innerHTML =
"🔴 جاري التسجيل...";



document
.getElementById("recordBtn")
.disabled=true;



document
.getElementById("stopBtn")
.disabled=false;



}


catch(error){


alert(
"يجب السماح باستعمال الميكروفون"
);


}


};







// ==========================
// إيقاف التسجيل
// ==========================


document.getElementById("stopBtn")
.onclick=function(){



if(recorder){

recorder.stop();

}



document
.getElementById("recordBtn")
.disabled=false;



this.disabled=true;


};







// ==========================
// تحميل تسجيل الثمن
// ==========================


function loadVoice(id){



getVoice(
id,
function(blob){



let player =
document.getElementById("audioPlayer");



if(blob){


let url =
URL.createObjectURL(blob);


player.src=url;


}

else{


player.removeAttribute(
"src"
);


}



});


}







// ==========================
// حذف التسجيل
// ==========================


document.getElementById("deleteVoice")
.onclick=function(){



if(currentThumn){



deleteVoiceDB(
currentThumn.id
);



document
.getElementById("audioPlayer")
.removeAttribute("src");



document
.getElementById("status")
.innerHTML =
"تم حذف التسجيل 🗑️";


}


};








// ==========================
// إغلاق النافذة
// ==========================


document.getElementById("closeBtn")
.onclick=function(){


closePopup();


};




function closePopup(){


document
.getElementById("popup")
.style.display="none";


}






// ==========================
// تشغيل التطبيق
// ==========================


startApp();