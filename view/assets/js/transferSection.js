function showTransferSection(id) {
    var divShow = document.getElementById("show");
    document.getElementById("row1").innerHTML = "";
    document.getElementById("row2").innerHTML = "";
    document.getElementById("row3").innerHTML = "";
    divShow.style.display = "none";
    var accTrans = document.getElementById("accTrans");
    accTrans.innerHTML = "";
    accTrans.style.display = "block";
    // accTrans.innerHTML=id; TESTING
    var showButton = document.createElement("button");
    showButton.innerHTML = "Show Main Page";
    showButton.setAttribute("class", "panel panel-primary text-center no-boder panel-body blue");
    showButton.onclick = function () {
        showAccounts();
        accTrans.innerHTML = "";
        accTrans.style.display = "none";
    }
    accTrans.appendChild(showButton);
    var mainDiv = document.createElement("div");
    var selectAcc = document.createElement("select");
    selectAcc.setAttribute("class", "form-control");
    var pSelectAcc=document.createElement("p");
    pSelectAcc.innerHTML="Selected Account";
    mainDiv.appendChild(pSelectAcc);
    //AJAX to catch all accounts names + their ids;
    var request = new XMLHttpRequest();
    request.open("get", "../controller/accountsController.php?accName=get");
    request.onreadystatechange = function () {
        if (request.status === 200 && request.readyState === 4) {
            var response = JSON.parse(this.responseText);
            for (var item in response) {
                var option = document.createElement("option");
                option.innerHTML = response[item]["name"];
                option.value = response[item]["id"];
                if (response[item]["id"] == id) {
                    option.selected = "selected";
                }
                selectAcc.appendChild(option);
            }
            //console.log(JSON.parse(this.responseText)); TEST
        }
    }
    request.send();
    //End of ajax
    //Getting the selected id from drop down menu;
    selectAcc.onchange = function () {
        if (this.value != id) {
            //updating id with the selected acc id!
            //Later we will use id to for the transaction in DB;
            id = this.value;
            console.log(id);
        }
    }
    mainDiv.appendChild(selectAcc);
    accTrans.appendChild(mainDiv);

    //Amount input
    var mainDiv5=document.createElement("div");
    var pAmount=document.createElement("p");
    pAmount.innerHTML="Amount";
    mainDiv5.appendChild(pAmount);
    var amountInput=document.createElement("input");
    amountInput.id="amountInput";
    amountInput.type="number";
    amountInput.setAttribute("class","form-control");
    amountInput.setAttribute("maxlength","10");
    amountInput.setAttribute("min",0);
    mainDiv5.appendChild(amountInput);
    accTrans.appendChild(mainDiv5);


    //DropDown with types (income/expense);
    var mainDiv2 = document.createElement("div");
    var selectType = document.createElement("select");
    selectType.setAttribute("class", "form-control");
    var pTypeTransaction=document.createElement("p");
    pTypeTransaction.innerHTML="Select Type of transaction";
    mainDiv2.appendChild(pTypeTransaction);
    var requestType = new XMLHttpRequest();
    requestType.open("get", "../controller/AccountsController.php?transType=get");
    requestType.onreadystatechange = function () {
        if (requestType.status === 200 && requestType.readyState === 4) {
            var responseType = JSON.parse(this.responseText);
            var optionType = document.createElement("option");
            optionType.innerHTML = "";
            optionType.value = "";
            selectType.appendChild(optionType);
            for (var i in responseType) {
                var optionType = document.createElement("option");
                optionType.innerHTML = responseType[i]["name"];
                optionType.value = responseType[i]["id"];
                selectType.appendChild(optionType);
            }
        }
    }
    requestType.send();
    mainDiv2.appendChild(selectType);
    accTrans.appendChild(mainDiv2);
    var type_id = ""; //default the transactions will be income.
    selectType.onchange = function () {
        //updating id with the selected acc id!
        type_id = this.value;
        console.log(type_id);

    };


    //Dropdown with all categories

    var mainDiv3 = document.createElement("div");
    var selectCategory = document.createElement("select");
    selectCategory.setAttribute("class", "form-control");
    var pCategory=document.createElement("div");
    pCategory.innerHTML="Category:";
    mainDiv3.appendChild(pCategory);
    var requestCategory = new XMLHttpRequest();
    requestCategory.open("get", "../controller/accountsController.php?giveCategory=get");
    requestCategory.onreadystatechange = function () {
        if (requestCategory.status === 200 && requestCategory.readyState === 4) {
            var responseCategory = JSON.parse(this.responseText);
            var optionCategory = document.createElement("option");
            optionCategory.innerHTML = "";
            optionCategory.setAttribute("value", "");
            selectCategory.appendChild(optionCategory);
            for (var i in responseCategory) {
                if (responseCategory[i]["name"] !== "First Income" && responseCategory[i]["id"] != 1) {
                    var optionCategory = document.createElement("option");

                    optionCategory.setAttribute("value", responseCategory[i]["id"]);
                   // optionCategory.setAttribute("background-image:url",responseCategory[i]["img_url"]);
                    var imgCat=document.createElement("IMG");
                    imgCat.setAttribute("src",responseCategory[i]["img_url"]);
                    optionCategory.innerHTML+=imgCat;
                    optionCategory.innerHTML += responseCategory[i]["name"];
                    selectCategory.appendChild(optionCategory);
                }

            }
        }
    };
    requestCategory.send();
    mainDiv3.appendChild(selectCategory);
    accTrans.appendChild(mainDiv3);

    var mainDiv44=document.createElement("div");
    accTrans.appendChild(mainDiv44);

    var category_id = "";
    selectCategory.onchange = function () {
        if(this.value==12){
           category_id=this.value; // Later should check if category id=12!
            var mainDiv4=document.createElement("div");
            mainDiv4.id="4";
             var nameNewCat= document.createElement("input");
             var paragraphNameCategory=document.createElement("p");
             paragraphNameCategory.innerHTML="New category name";
             mainDiv4.appendChild(paragraphNameCategory);
             nameNewCat.setAttribute("class","form-control");
             nameNewCat.setAttribute("maxlength","20");
             mainDiv4.appendChild(nameNewCat);

             var selectIcon=document.createElement("select");
             selectIcon.setAttribute("class","form-control");
             var pIcon=document.createElement("p");
             pIcon.innerHTML="Select Icon";
             mainDiv4.appendChild(pIcon);

             var requestIcon = new XMLHttpRequest();
             requestIcon.open("get","../controller/AccountsController.php?getIconList=get");
             requestIcon.onreadystatechange=function(){
                 if(requestIcon.status===200 && requestIcon.readyState===4){
                     var responseIcon=JSON.parse(this.responseText);
                     var optionIcon=document.createElement("option");
                     optionIcon.setAttribute("value","");
                     optionIcon.innerHTML="";
                     selectIcon.appendChild(optionIcon);
                     for(var e in responseIcon){
                         var optionIcon=document.createElement("option");
                         optionIcon.setAttribute("value",responseIcon[e]["id"]);
                         var img=document.createElement("IMG");
                         img.setAttribute("src",responseIcon[e]["img_id"]);
                         optionIcon.innerHTML+=img;
                         selectIcon.appendChild(optionIcon);
                     }
                 }

             }
             requestIcon.send();


             mainDiv4.appendChild(selectIcon);
             var icon_id;
            selectIcon.onchange=function(){
                icon_id=this.value;
               // console.log(icon_id); Testing;
            }


            mainDiv44.appendChild(mainDiv4);


        }else {
            //updating id with the selected cat id!
            if(typeof(document.getElementById("4"))!="undefined" && document.getElementById("4")!=null) {
                var removeDiv = document.getElementById("4");
                mainDiv44.removeChild(removeDiv);
            }

            //Setting Category id! ; IMPORTANT for later!
            category_id = this.value;

        }
        console.log(category_id);
    }

    accTrans.appendChild(mainDiv44);


    var buttonInsertTransacation=document.createElement("button");
    buttonInsertTransacation.innerHTML="Insert Transaction into Account";
    buttonInsertTransacation.setAttribute("class","btn btn-success");
        // Ajax input into DB.
    // buttonInsertTransacation.onclick=function(){
    //     if(id!="" && id!=null){
    //         var amount=document.getElementById("amountInput").value;
    //         if(amount!="" && amount!=null && amount>0){
    //
    //         }
    //     }
    // }

        accTrans.appendChild(buttonInsertTransacation);
     var mainDivErr=document.createElement("div");

     accTrans.appendChild(mainDivErr);


}






// !!!!!!!!!--------!!!!!!!! Must have validaions if Any value of the drop down is empty string /""/ and if
// there is such value in db!;