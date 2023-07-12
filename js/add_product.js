// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
              
// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyDzWrGoQuvqsifNujdvQKRkMlmZY6Iaalc",
authDomain: "project1-b3e3b.firebaseapp.com",
projectId: "project1-b3e3b",
storageBucket: "project1-b3e3b.appspot.com",
messagingSenderId: "804904357357",
appId: "1:804904357357:web:683f377e92d41bfa2dabe4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

import { getDatabase, ref, set, child, update, remove, onValue } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-storage.js"
const db = getDatabase();

var files = [];
var reader = new FileReader();

var image = document.getElementById('image_name');
var extlab = document.getElementById('extlab');
var selected_img = document.getElementById('selected_img');
var select_img = document.getElementById('select_img');

var product_name = document.getElementById("product");
var product_type = document.getElementById("product_type");

var save_buttn = document.getElementById("save");          

var input = document.createElement('input');
input.type = 'file';

input.onchange = e =>{
    files = e.target.files;

    var extention = GetFileExt(files[0]);
    var name = GetFileName(files[0]);

    image.value = name;
    extlab.innerHTML = extention;

    reader.readAsDataURL(files[0]);
}

reader.onload = function(){
    selected_img.src = reader.result;
}

select_img.onclick = function(){
    input.click();
}

function GetFileExt(file){
    var temp = file.name.split('.');
    var ext = temp.slice((temp.length-1),(temp.length));
    return '.' + ext[0];
}

function GetFileName(file){
    var temp = file.name.split('.');
    var fname = temp.slice(0,-1).join('.');
    return fname;
}

var max_id = 0;
var id = 0;
var id_2 = 0; 
async function UploadProcess() {
    /* zistovanie poslednej osoby (id) v databaze */
    
    const issuesRef = ref(db, product_type.value + "/");
    onValue(issuesRef, (snapshot) => {
        snapshot.forEach(snap => {
            const issue = snap.val();
            max_id = issue.Product_id;
        })
    });

    var ImgToUpload = files[0];

    var ImgName = product_name.value + extlab.innerHTML;

    const metaData = {
        contentType: ImgToUpload.type
    }

    const storage = getStorage();

    const storageRef = sRef(storage, "Images/" + ImgName);

    const UploadTask = uploadBytesResumable(storageRef, ImgToUpload, metaData);

    UploadTask.on('state-changed', (snapshot)=>{
        var progress = (snapshot.bytesTrabsferred / snapshot.totalBytes) * 100;
    },
    (error) =>{
        alert("error");
    },
    ()=>{
        getDownloadURL(UploadTask.snapshot.ref).then((downloadURL)=>{
            InsertData(downloadURL);
        })
    }
    );
}

function InsertData(URL){             
    id_2 = ++id
    while(max_id >= id_2){
        id_2 = ++id;
    }
    
    var name = image.value;
    var ext = extlab.innerHTML;
    
    set(ref(db, product_type.value + "/" + id_2),{
        ProductId: id_2,
        ProductName: product_name.value,
        //Section: secbox.value,
        ProductType: product_type.value,
        ImgUrl: URL
    })
    .then(()=>{
        alert('Success');
    })
    .catch((error)=>{
        alert('Unsuccessful, error' + error);
    });
    location.reload();
}

save_buttn.addEventListener('click', UploadProcess);

if (localStorage.getItem("heslo") != "0000") {
    window.location = "password_page.html";
}