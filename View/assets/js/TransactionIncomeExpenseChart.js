function TransactionIncomeExpenseChart(id) {

    var mainDiv = document.getElementById("chart");
    mainDiv.innerHTML = ""; //Clean the div everytime it is invoked
    // mainDiv.setAttribute("class", "col-lg-12");
    mainDiv.style.width="100%";
    mainDiv.style.height="400px";
    // mainDiv.innerHTML="heer";

    var request = new XMLHttpRequest();
    request.open("get", "../index.php?target=transactions&action=chartIncomeExpenses&ia=" + id);
    request.onreadystatechange = function () {
        if (request.readyState === 4 && request.status === 200) {
            var response = JSON.parse(this.responseText);
            // var trial=[{"kkey":"name","value":"14"},{"kkey":"name","valuee":"16"}];
    //         // console.log(response);
    //          // console.log("chart"+response);
    //         // var income = response[0]["income"];
    //         // console.log(response[0]["income"]);
    //         // if (income == null) {
    //         //     income = 0
    //         // }
    //         // var expense = response[0]["expense"];
    //         // if (expense == null) {
    //         //     expense = 0;
    //         // }
    //         //
    //         // if (income != 0 || expense != 0) {
    //         //     // google.charts.load("current", {packages: ["corechart"]});
    //         //     // google.charts.setOnLoadCallback(drawChart);
    //         //     //
    //         //     // function drawChart() {
    //         //     //     var data = google.visualization.arrayToDataTable([
    //         //     //         ['Task', 'Hours per Day'],
    //         //     //         ['Income', Number(income)],
    //         //     //         ['Expense', Number(expense)]
    //         //     //
    //         //     //     ]);
    //         //     //     console.log(data);
    //         //     //     var options = {
    //         //     //         title: 'Income and Expense Chart',
    //         //     //         pieHole: 0.4,
    //         //     //         height:260
    //         //     //
    //         //     //     };
    //         //     //     $(window).resize(function(){
    //         //     //         drawChart();
    //         //     //     });
    //         //     //     var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
    //         //     //     chart.draw(data, options);
    //         //
                var chart;
                var legend;
                var dar = response;
                console.log(dar);
                var chartData = dar;
                AmCharts.ready(function () {
                    // PIE CHART
                    chart = new AmCharts.AmPieChart();
                    chart.addTitle("Age", 16);
                    chart.dataProvider = chartData;
                    chart.titleField = "kkey";
                    chart.valueField = "valuee";
                    chart.outlineColor = "#FFFFFF";
                    chart.outlineAlpha = 0.8;
                    chart.outlineThickness = 2;
                    chart.balloonText = "[[title]]<br><span style='font-size:14px'><b>[[value]]</b> ([[percents]]%)</span>";
                    // this makes the chart 3D
                    chart.depth3D = 15;
                    chart.angle = 30;
                    // WRITE
                    chart.write("chart");

                });
            }
            // else {
            //     var h1 = document.createElement("h1");
            //     donutchart.appendChild(h1);
            //     h1.innerHTML = "Still no data to display charts";
            //     donutchart.style.height = "150px";
            //     donutchart.setAttribute("class", "alert alert-info alert-dismissable");
            // }

        }


    // }

    request.send();

}