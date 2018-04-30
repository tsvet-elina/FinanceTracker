
var req = new XMLHttpRequest();
req.open("get","../index.php?target=budget&action=differentBudgetLoading");
req.onreadystatechange = function (ev) {
    if(req.status === 200 && req.readyState === 4) {
        var response = 4;
        var str = "";

        var res = JSON.parse(this.responseText);
        console.log(res);

        for (var i = 0; i < res.length; i++) {

            str += "<div class=\"col-sm-10\" style=\"margin-top: 30px\" >";
            str += "    <div>";
            str += "        <p>";
            str += "            <strong>";
            str += res[i].fromTo;
            str += "</strong>";
            if(res[i].percent > 0) {
                str += "<span class=\"pull-right text-muted\">";
                str +=  res[i].percent + "%</span>";
                str += "</p>";
                str += "<div class=\"progress progress-striped active\">";
                str += "<div class=\"progress-bar progress-bar-success\" role=\"progressbar\" aria-valuenow= \"";
                str += res[i].percent + "\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:";
                str += res[i].percent + "%\">";
                str += "<span class=\"sr-only\">";
                str += res[i].percent + "% Complete (danger)</span>";
                str += "            </div>";
                str += "        </div>";
                str += "    </div>";
                str += "</div>";
            }else{
                str += "<span class=\"pull-right text-muted\">";
                str +=  "100%</span>";
                str += "</p>";
                str += "<div class=\"progress progress-striped active\">";
                str += "<div class=\"progress-bar progress-bar-danger\" role=\"progressbar\" aria-valuenow= \"";
                str += "100\" aria-valuemin=\"0\" aria-valuemax=\"100\" style=\"width:";
                str += "100%\">";
                str += "<span class=\"sr-only\">";
                str += "100% Complete (danger)</span>";
                str += "            </div>";
                str += "        </div>";
                str += "    </div>";
                str += "<div><p>Over Limit Expenses (<span style=\" color:red;\">";
                str += res[i].percent;
                str += "</span>)</p></div>";
                str += "</div>";
            }


        }

        document.getElementById("infoBudget").innerHTML = str;

        console.log(str);
    }
}
req.send();