var form = document.getElementById("myForm"),
    imgInput = document.querySelector(".img"),
    file = document.getElementById("imgInput"),
    passengerName = document.getElementById("name"),
    age = document.getElementById("age"),
    nationality = document.getElementById("city"), 
    nextOfKinEmail = document.getElementById("email"), 
    nextOfKinPhone = document.getElementById("phone"), 
    seatNo = document.getElementById("post"), 
    departureDate = document.getElementById("sDate"), 
    submitBtn = document.querySelector(".submit"),
    passengerInfo = document.getElementById("data"),
    modal = document.getElementById("userForm"),
    modalTitle = document.querySelector("#userForm .modal-title"),
    newUserBtn = document.querySelector(".newUser");

let passengerData = localStorage.getItem('passengerProfile') ? JSON.parse(localStorage.getItem('passengerProfile')) : [];

let isEdit = false, editId;
showPassengerInfo();

newUserBtn.addEventListener('click', ()=> {
    submitBtn.innerText = 'Submit';
    modalTitle.innerText = "Fill the Form";
    isEdit = false;
    imgInput.src = "/images/profile-icon.jpeg";
    form.reset();
});

file.onchange = function(){
    if(file.files[0].size < 1000000){  // 1MB = 1000000
        var fileReader = new FileReader();

        fileReader.onload = function(e){
            imgUrl = e.target.result;
            imgInput.src = imgUrl;
        };

        fileReader.readAsDataURL(file.files[0]);
    }
    else{
        alert("This file is too large!");
    }
};

function showPassengerInfo(){
   
    document.querySelectorAll('.passengerDetails').forEach(info => info.remove());

    passengerData.forEach((element, index) => {
        let createElement = `<tr class="passengerDetails text-white">
            <td>${index+1}</td>
            <td><img src="${element.picture}" alt="" width="50" height="50"></td>
            <td>${element.passengerName}</td>
            <td>${element.age}</td>
            <td>${element.nationality}</td> 
            <td>${element.nextOfKinEmail}</td> 
            <td>${element.nextOfKinPhone}</td> 
            <td>${element.seatNo}</td> 
            <td>${element.departureDate}</td> 
            <td>
                <button class="btn btn-success" onclick="readPassengerInfo('${element.picture}', '${element.passengerName}', '${element.age}', '${element.nationality}', '${element.nextOfKinEmail}', '${element.nextOfKinPhone}', '${element.seatNo}', '${element.departureDate}')" data-bs-toggle="modal" data-bs-target="#readData"><i class="bi bi-eye"></i></button>

                <button class="btn btn-primary" onclick="editPassengerInfo(${index}, '${element.picture}', '${element.passengerName}', '${element.age}', '${element.nationality}', '${element.nextOfKinEmail}', '${element.nextOfKinPhone}', '${element.seatNo}', '${element.departureDate}')" data-bs-toggle="modal" data-bs-target="#userForm"><i class="bi bi-pencil-square"></i></button>

                <button class="btn btn-danger" onclick="deletePassengerInfo(${index})"><i class="bi bi-trash"></i></button>    
            </td>
        </tr>`;

        passengerInfo.innerHTML += createElement;
    });
}

function readPassengerInfo(pic, name, age, nationality, email, phone, seatNo, departureDate){
    document.querySelector('.showImg').src = pic;
    document.querySelector('#showName').value = name;
    document.querySelector("#showAge").value = age;
    document.querySelector("#showNationality").value = nationality;
    document.querySelector("#showEmail").value = email;
    document.querySelector("#showPhone").value = phone;
    document.querySelector("#showPost").value = seatNo;
    document.querySelector("#showsDate").value = departureDate;
}

function editPassengerInfo(index, pic, name, Age, Nationality, Email, Phone, Post, Sdate){
    isEdit = true;
    editId = index;
    imgInput.src = pic;
    passengerName.value = name;
    age.value = Age;
    nationality.value = Nationality;
    nextOfKinEmail.value = Email;
    nextOfKinPhone.value = Phone;
    seatNo.value = Post;
    departureDate.value = Sdate;

    submitBtn.innerText = "Update";
    modalTitle.innerText = "Update The Form";
}

function deletePassengerInfo(index){
    if(confirm("Are you sure want to delete?")){
        passengerData.splice(index, 1);
        localStorage.setItem("passengerProfile", JSON.stringify(passengerData));
        showPassengerInfo();
    }
}

form.addEventListener('submit', (e)=> {
    e.preventDefault();

    const information = {
        picture: imgInput.src == undefined ? "/images/profile-icon.jpeg" : imgInput.src,
        passengerName: passengerName.value,
        age: age.value,
        nationality: nationality.value,
        nextOfKinEmail: nextOfKinEmail.value,
        nextOfKinPhone: nextOfKinPhone.value,
        seatNo: seatNo.value,
        departureDate: departureDate.value
    };

    if(!isEdit){
        passengerData.push(information);
    }
    else{
        isEdit = false;
        passengerData[editId] = information;
    }

    localStorage.setItem('passengerProfile', JSON.stringify(passengerData));

    submitBtn.innerText = "Submit";
    modalTitle.innerHTML = "Fill The Form";

    showPassengerInfo();

    form.reset();

    imgInput.src = "/images/profile-icon.jpeg";  
});
