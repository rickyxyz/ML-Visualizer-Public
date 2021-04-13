var rawColumns = [];
var rawTable = [];
var regressionLine = {m:0, b:0};
var lastClickedElement = NaN;
var clickMode = 'view';
var k = 3;
var col1, col2;

function getInput(){
    let x = document.getElementById('inputX').value;
    let y = document.getElementById('inputY').value;
    console.log(x, y);
    addData(0, x, y);
}

function addData(i, x, y){
    x = parseInt(x);
    y = parseInt(y);
    draggableChart.data.datasets[i].data.unshift({x: x, y: y});
    draggableChart.update();
}

function drawModeRed(){
    document.getElementById('mode').textContent = "Draw Mode Red";
    document.getElementById('description').textContent = "Click on the graph to add red data point";
    clickMode = 'drawRed';
}

function drawModeBlue(){
    document.getElementById('mode').textContent = "Draw Mode Blue";
    document.getElementById('description').textContent = "Click on the graph to add blue data point";
    clickMode = 'drawBlue';
}

function knnMode(){
    document.getElementById('mode').textContent = "KNN Mode";
    document.getElementById('description').textContent = "Click on the graph to do a KNN classification";
    clickMode = 'KNN';
}

function deleteMode(){
    document.getElementById('mode').textContent = "Delete Mode";
    document.getElementById('description').textContent = "Click on existing data point or the KNN point to delete it";
    clickMode = 'delete';
}

function viewMode(){
    document.getElementById('mode').textContent = "View Mode";
    document.getElementById('description').textContent = "Click on existing data point to move it";
    clickMode = 'view';
}

function clearGraph(){
    draggableChart.data.datasets[0].data.splice(0, draggableChart.data.datasets[0].data.length);
    draggableChart.data.datasets[1].data.splice(0, draggableChart.data.datasets[1].data.length);
    draggableChart.data.datasets[2].data.splice(0, draggableChart.data.datasets[2].data.length);
    draggableChart.data.datasets[3].data.splice(0, draggableChart.data.datasets[3].data.length);
    draggableChart.data.datasets[4].data.splice(0, draggableChart.data.datasets[4].data.length);
    draggableChart.data.datasets[5].data.splice(0, draggableChart.data.datasets[5].data.length);
    draggableChart.data.datasets[6].data.splice(0, draggableChart.data.datasets[6].data.length);
    draggableChart.update();
}

function clearRegression(){
    draggableChart.data.datasets[1].data.splice(0, draggableChart.data.datasets[1].data.length);
    draggableChart.update();
}

function linearRegression(){
    let m = 1;
    let b = 0;
    let x1 = 0;
    let y1 = m * x1 + b;
    let x2 = 1;
    let y2 = m * x2 + b;

    let dataLength = draggableChart.data.datasets[0].data.length;
    let xSum = 0;
    let ySum = 0;
    for(let i = 0; i < dataLength; i++){
        let data = draggableChart.data.datasets[0].data[i];
        xSum += data.x;
        ySum += data.y;
    }
    let xMean = xSum / dataLength;
    let yMean = ySum / dataLength;

    let numerator = 0;
    let denominator = 0;
    for(let i = 0; i < dataLength; i++){
        let data = draggableChart.data.datasets[0].data[i];
        numerator += (data.x - xMean) * (data.y - yMean);
        denominator += (data.x - xMean) * (data.x - xMean);
    }

    m = numerator/denominator;
    b = yMean - m * xMean;

    x1 = 0;
    y1 = m * x1 + b;
    x2 = 25;
    y2 = m * x2 + b;

    draggableChart.data.datasets[1].data[0] = {x: x1, y: y1};
    draggableChart.data.datasets[1].data[1] = {x: x2, y: y2};
    draggableChart.data.datasets[1].pointRadius = 0;
    draggableChart.update();

    regressionLine.m = m;
    regressionLine.b = b;
}

function knnSort(a, b){
    if(a.dist > b.dist) return 1;
    if(a.dist < b.dist) return -1;
    return 0;
}

function knnLine(x, y, arr){
    let line1 = draggableChart.data.datasets[4];
    let line2 = draggableChart.data.datasets[5];
    let line3 = draggableChart.data.datasets[6];

    line1.borderColor = arr[0].backgroundColor;
    line2.borderColor = arr[1].backgroundColor;
    line3.borderColor = arr[2].backgroundColor;

    line1.data[0] = {x: x, y: y};
    line2.data[0] = {x: x, y: y};
    line3.data[0] = {x: x, y: y};

    line1.data[1] = {x: arr[0].x, y: arr[0].y};
    line2.data[1] = {x: arr[1].x, y: arr[1].y};
    line3.data[1] = {x: arr[2].x, y: arr[2].y};
}

function knn(x, y){
    let data1 = draggableChart.data.datasets[0];
    let data2 = draggableChart.data.datasets[2];
    let dataLength1 = data1.data.length;
    let dataLength2 = data2.data.length;

    let distData = [];

    for(let i = 0; i < dataLength1; i++){
        let dist = Math.sqrt(Math.pow((data1.data[i].x - x),2)+Math.pow((data1.data[i].y - y),2));
        let distObject = {category: 0, dist: dist, x: data1.data[i].x, y: data1.data[i].y, backgroundColor: data1.borderColor};
        distData.unshift(distObject);
    }
    for(let i = 0; i < dataLength2; i++){
        let dist = Math.sqrt(Math.pow((data2.data[i].x - x),2)+Math.pow((data2.data[i].y - y),2));
        let distObject = {category: 1, dist: dist, x: data2.data[i].x, y: data2.data[i].y, backgroundColor: data2.borderColor};
        distData.unshift(distObject);
    }

    distData.sort(knnSort);
    console.log(distData);

    let neighbors = [0, 0];
    let maxDist = 0;
    for(let i = 0; i < k; i++){
        neighbors[distData[i].category] += 1;
        if(distData[i].dist > maxDist) maxDist = distData[i].dist;
    }
    console.log(neighbors);
    console.log(maxDist);

    if(draggableChart.data.datasets[3].data.length < 1){
        addData(3, x, y);
        if(neighbors[0] > neighbors[1]){
            draggableChart.data.datasets[3].backgroundColor = '#FF0000';
        }
        else{
            draggableChart.data.datasets[3].backgroundColor = '#0000FF';
        }
    }
    else{
        draggableChart.data.datasets[3].data[0].x = x;
        draggableChart.data.datasets[3].data[0].y = y;
        if(neighbors[0] > neighbors[1]){
            draggableChart.data.datasets[3].backgroundColor = '#FF0000';
        }
        else{
            draggableChart.data.datasets[3].backgroundColor = '#0000FF';
        }
    }
    knnLine(x, y, distData.slice(0,3));
    draggableChart.update();
}

function showUploadModal(){
    document.getElementById("uploadmodal").style.display = "block";
}

function showDownloadModal(){
    document.getElementById("downloadmodal").style.display = "block";
    var output = "";
    for(let j = 0; j < rawTable.length; j++) {
        if(rawTable[j][0] == '') {
            continue;
        }
        output += rawTable[j].join() + "\n";
        console.log(j);
    }
    document.getElementById("result").value = output;
}

function closeModal() { 
    document.getElementById("uploadmodal").style.display = "none";
    document.getElementById("downloadmodal").style.display = "none";
}

function getData(){
    const xs = [];
    const ys = [];
    let i = 0, j = 0;
    let invalidColumn = true;
    do {
        var col1 = prompt("Input column representing the X-axis!", "");
        
        for(i = 0; i < rawTable[0].length; i++) {
            if(col1 === rawTable[0][i]) {
                invalidColumn = false;
                break;
            }
        }
    } while (invalidColumn);

    invalidColumn = true;

    do {
        var col2 = prompt("Input column representing the Y-axis!", "");
        
        invalidColumn = true;
        for(j = 0; j < rawTable[0].length; j++) {
            if(col2 === rawTable[0][j]) {
                invalidColumn = false;
                break;
            }
        }
    } while (invalidColumn);

    if(i != null && j != null){
        col1 = parseInt(i);
        col2 = parseInt(j);
    }

    for(let x = 1; x < rawTable.length; x++) {
        // xs.push(rawTable[x][col1]);
        // ys.push(rawTable[x][col2]);
        addData(0, rawTable[x][col1], rawTable[x][col2]);
        // console.log(rawTable[x][col1], rawTable[x][col2]); 
    }

    // return {xs, ys};
}

function smartsplit(str) {
    var result = [];
    var temp = "";
    var inside = false;
    for(let i = 0; i < str.length; i++) {
        if(str[i] == '"') {
            inside = !inside;
        }
        if(str[i] != ',') {
            temp += str[i];
        }
        if(!inside && (str[i] == ',' || i == str.length-1)) {
            result.push(temp);
            temp = "";
        }
    }
    return result;
}

function upload() {
    document.getElementById("uploadmodal").style.display = "none";
    console.log(document.getElementById("input").files[0]);
    document.getElementById("dataname").value = document.getElementById("input").files[0].name;

    var FR = new FileReader();
    FR.readAsText(document.getElementById("input").files[0]);
    FR.onloadend = function() {

        clearGraph();

        console.log("Finished Reading", FR.readyState);
        var lines = FR.result.split("\n");
        // rawColumns = lines[0].split(",");
        rawColumns = smartsplit(lines[0]);
        rawTable.splice(0, rawTable.length);
        while(document.getElementById("table").hasChildNodes()) {
            document.getElementById("table").removeChild(document.getElementById("table").firstChild);
        }

        for(let i = 0; i < lines.length; i++) {
            rawTable.push(smartsplit(lines[i]));
        }

        var docTable = document.getElementById("table");
        for(let j = 0; j < lines.length; j++) {
            if(rawTable[j][0] == '') {
                continue;
            }
            var docRow = docTable.insertRow(docTable.length);
            for(let i = 0; i < rawTable[1].length; i++) {
                if(rawTable[j][i] != null) {
                    cell = docRow.insertCell(i);
                    cell.innerHTML = rawTable[j][i];
                    // cell.innerHTML = "<input type=\"text\" value=\"" + rawTable[j][i] +"\" id=\""+ j + ","+i+"\"/>";
                }
            }
        }
        document.getElementById("readColumns").innerHTML = rawTable[1].length;
        document.getElementById("readRows").innerHTML = rawTable.length - 1;
        getData();
    };
    document.getElementById("input").value = null;
}