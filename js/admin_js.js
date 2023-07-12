var segment_str = window.location.pathname; 
var segment_array = segment_str.split( '/' );
var last_segment = segment_array.pop();
var array = [];
var array_2 = "";
array = last_segment

for(var i = 0; i < array.length; i++){
    if(array[i] != '.'){
        array_2 = array_2+array[i];
    }else{
        break;
    }
}

window.onload = products;

var files = [];
        var reader = new FileReader();
        

        var myimg = document.getElementById('myimg');
        var SelBtn = document.getElementById('selbtn');
        var img_n = document.getElementById('namebox');

        var input = document.createElement('input');
        input.type = 'file';
        
        input.onchange = e =>{
            files = e.target.files;

            var extention = GetFileExt(files[0]);
            var name = GetFileName(files[0]);

            img_n.value = name;
            extlab.innerHTML = extention;

            reader.readAsDataURL(files[0]);
        }

        reader.onload = function(){
            myimg.src = reader.result;
        }


        SelBtn.onclick = function(){
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


        var id = 0;
        function products() {
            onValue(issuesRef, (snapshot) => {
                snapshot.forEach(snap => {
                    const issue = snap.val();

                    var id_2 = document.createElement("div");
                    var div = document.createElement("div");
                    var div2 = document.createElement("div");
                    var div3 = document.createElement("div");
                    var div4 = document.createElement("div");
                    var img = document.createElement("img");
                    img.setAttribute("src", issue.ImgUrl);
                    img.setAttribute('width', 200);
                    img.setAttribute('height', 200);

                    var ciara = document.createElement("div")

                    /* delete button */
                    var buttn = document.createElement("button");
                    buttn.setAttribute("id", issue.RollNo);
                    
                    buttn.addEventListener("click", function(event) {
                        remove(ref(db, array_2 + event.target.id));
                        location.reload();
                    });

                    /*update button*/
                    var namebox_u = document.getElementById("Namebox");
                    var rollbox = document.getElementById("Rollbox");
                    var secbox = document.getElementById("Secbox");
                    var genbox = document.getElementById("Genbox");
                    var position = document.getElementById("position");
                    var img_url = document.getElementById("Image");

                    var insBtn = document.getElementsByClassName("Insbtn");

                    var buttn_update = document.createElement("button");
                    buttn_update.setAttribute("id", issue.RollNo);
                    
                    buttn_update.addEventListener("click", function(event) {
                        get(child(dbref, array_2 + '/' + event.target.id)).then((snapshot)=>{
                            namebox_u.value = snapshot.val().NameOfStd;
                            rollbox.value = snapshot.val().RollNo;
                            secbox.value = snapshot.val().Section;  
                            img_url.value = snapshot.val().ImgUrl;  
                            myimg.setAttribute("src", snapshot.val().ImgUrl);                        
                        });
                
                        /* mozno funguje iba ked je jeden class na stranke */
                        insBtn[0].setAttribute("id", event.target.id);
                    });

                    insBtn[0].addEventListener("click", function(event) {
                        if(img_n.value == ""){
                            set(ref(db, array_2 + '/' + event.target.id),{
                                NameOfStd: namebox_u.value,
                                RollNo: rollbox.value,
                                Section: secbox.value,
                                Gender: genbox.value,
                                ImgUrl: img_url.value
                                })
                            .then(()=>{
                                alert('Success');
                            })
                            .catch((error)=>{
                                alert('Unsuccessful, error' + error);
                            });
                            location.reload();
                    
                        }
                        else{
                            var ImgToUpload = files[0];

                            var ImgName = namebox.value + extlab.innerHTML;

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
                                        console.log(downloadURL);
                                        img_url.value = downloadURL;
                                        set(ref(db, array_2 + '/' + event.target.id),{
                                            NameOfStd: namebox_u.value,
                                            RollNo: rollbox.value,
                                            Section: secbox.value,
                                            Gender: genbox.value,
                                            ImgUrl: img_url.value
                                        })
                                        .then(()=>{
                                            alert('Success');
                                        })
                                        .catch((error)=>{
                                            alert('Unsuccessful, error' + error);
                                        });
                                        location.reload();
                                    })
                                }
                            ); 
                        }
                        
                    });
                    
                    var br = document.createElement("br");
                    
                    id_2.innerHTML = ++id;
                    div.innerHTML = issue.NameOfStd;
                    div2.innerHTML = issue.Gender;
                    div3.innerHTML = issue.RollNo;
                    div4.innerHTML = issue.Section;
                    ciara.innerHTML = "------------"
                    buttn.innerHTML = "delete";
                    buttn_update.innerHTML = "update";

                    
                    document.body.appendChild(id_2)
                    document.body.appendChild(div);
                    document.body.appendChild(div2);
                    document.body.appendChild(div3);
                    document.body.appendChild(div4);
                    document.body.appendChild(img);
                    document.body.appendChild(buttn);
                    document.body.appendChild(buttn_update);
                    document.body.appendChild(ciara);
                    document.body.appendChild(br)
                })
            });  
        }