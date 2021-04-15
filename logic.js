var menuStyle = 0;
var activemenu = 0;
var menu = [document.getElementById('filebtn'), document.getElementById('graphbtn'), document.getElementById('algobtn')];
var toolrow = [document.getElementById('filediv'), document.getElementById('graphdiv'), document.getElementById('algodiv')];
var graphtool = [document.getElementById('drawRed'), document.getElementById('drawBlue'), document.getElementById('knn'),  document.getElementById('delete')]
var algo = [document.getElementById('linreg'), document.getElementById('knn')]
var linreg = 0;
var knn = 0;

var rawColumns = [];
var rawTable = [];
var regressionLine = {m:0, b:0};
var lastClickedElement = NaN;
var toolMode = 'view';
var algoMode = 0;
var xvalid = -1, yvalid = -1;

var k = 3;
var col1, col2;

function checkValidColumn() {
    x = document.getElementById('x-col').value;
    y = document.getElementById('y-col').value;
    if(rawTable[0] == null) {
        console.log('1');
        document.getElementById('error').innerHTML = "You haven't imported any external .csv!";
        return;
    }
    if(x && y) {
        console.log(x + y);
        xvalid = -1;
        yvalid = -1;

        for(let i = 0; i < rawTable[0].length && !(xvalid > -1 && yvalid > -1); i++) {
            console.log(">" + i);
            if(x == rawTable[0][i] && xvalid === -1) xvalid = i;
            if(y == rawTable[0][i] && yvalid === -1) yvalid = i;
        }
        if(xvalid > -1 && yvalid > -1) {
            console.log('2');
            document.getElementById('error').innerHTML = "";
            clearGraph();
            getData();
        } else if (xvalid === -1){
            console.log('3');
            document.getElementById('error').innerHTML = "Columns for X-axis doesn't exist within the .csv!";
        } else {
            console.log('4');
            document.getElementById('error').innerHTML = "Columns for Y-axis doesn't exist within the .csv!";
        }
    } else {
        console.log('5');
        document.getElementById('error').innerHTML.innerHTML = "Both columns don't exist within the .csv!";
    }
}

function updateAlgoDesc() {
    switch(algoMode) {
        case 1:
            document.getElementById('algo').textContent = "Linear Regression";
            document.getElementById('linreg-explanation').className = "";
            document.getElementById('knn-explanation').className = "gone";
            break;
        case 2:
            document.getElementById('algo').textContent = "K-Nearest Neighbours";
            document.getElementById('linreg-explanation').className = "gone";
            document.getElementById('knn-explanation').className = "";
            break; 
        default:
            document.getElementById('algo').textContent = "Select an algorithm";
            document.getElementById('linreg-explanation').className = "gone";
            document.getElementById('knn-explanation').className = "gone";
            break;
    }
}

function updateModeDesc() {
    switch(toolMode) {
        case "drawRed":
            document.getElementById('mode').textContent = "Draw Red.";
            document.getElementById('description').innerHTML= "Draw a RED data point on the graph. Click anywhere on the graph!";
            break;
        case "drawBlue":
            document.getElementById('mode').textContent = "Draw Blue.";
            document.getElementById('description').innerHTML= "Draw a BLUE data point on the graph. Click anywhere on the graph!";
            break;
        case "delete":
            document.getElementById('mode').textContent = "Delete.";
            document.getElementById('description').innerHTML= "Deletes a data point. Click on any existing data point to delete it.";
            break;
        case "KNN":
            document.getElementById('mode').textContent = "KNN Prediction.";
            document.getElementById('description').innerHTML= "Predict what class would be given to a data point. Click anywhere on the graph!";
            break;
        default:
            document.getElementById('mode').textContent = "Select a tool.";
            document.getElementById('description').innerHTML= "This box will briefly show what the selected tool does.";
            break;
    }
}

function setInactiveAlgo() {
    for(let i = 0; i < 2; i++) {
        // if(algo[i].className !== "tool") {
        //     draggableChart.data.datasets[4].data = [];
        //     draggableChart.data.datasets[5].data = [];
        //     draggableChart.data.datasets[6].data = [];
        // }
        algo[i].className = "tool";
    }
}

function setInactiveTool() {
    for(let i = 0; i < 4; i++) {
        graphtool[i].className = "tool";
    }
}

function toggleKNN() {
    if(!knn) {
        knnMode();
        clearRegression();
        setInactiveTool();
        setInactiveAlgo();
        document.getElementById('knn').className = "tool active-tool";
        linreg = 0;
        algoMode = 2;
        toolMode = 'KNN';
    } else {
        document.getElementById('knn').className = "tool";
        algoMode = 0;
        toolMode = 'view';
        draggableChart.data.datasets[4].data = [];
        draggableChart.data.datasets[5].data = [];
        draggableChart.data.datasets[6].data = [];
    }
    knn = !knn;
    updateModeDesc();
    updateAlgoDesc();
}


function toggleLinreg() {
    if(knn) {
        toolMode = "view";
    }
    if(!linreg) {
        linearRegression();
        setInactiveAlgo();
        document.getElementById('linreg').className = "tool active-tool";
        knn = 0;
        algoMode = 1;
    } else {
        clearRegression();
        document.getElementById('linreg').className = "tool";
        algoMode = 0;
    }
    linreg = !linreg;
    updateModeDesc();
    updateAlgoDesc();
}

function toggleMenu() {
    if(menuStyle == 1) {
        menuStyle = 0;
        for(let i = 0; i < 5; i++) {
            if(graphtool[i] != null)
                graphtool[i].className += "tool";
            if(menu[i] != null)
                menu[i].className = "";
            if(toolrow[i] != null)
                toolrow[i].className = "gone";
        }
        menu[activemenu].className = "active-menu";
        toolrow[activemenu].className = "";
        if(toolMode === 'drawRed') {
            graphtool[0].className = "tool active-tool";
        }
        if(toolMode === 'drawBlue') {
            graphtool[1].className = "tool active-tool";
        }
        if(toolMode === 'KNN') {
            graphtool[2].className = "tool active-tool";
        }
        if(toolMode === 'erase') {
            graphtool[3].className = "tool active-tool";
        }
        document.getElementById('toggleup').id = 'toggledown';
    } else {
        for(let i = 0; i < 5; i++) {
            if(menu[i] != null)
                menu[i].className = "gone";
            if(toolrow[i] != null)
            // if(!toolrow[i].className.includes("active-tool"))
                toolrow[i].className = "";
        }
        menuStyle = 1;
        document.getElementById('toggledown').id = 'toggleup';
    }
}

function highlight(n) {
    activemenu = n - 1;
    for(let i = 0; i < 4; i++) {
        if(i == activemenu) {
            menu[i].className = "active-menu";
            toolrow[i].className = "";
        } else {
            menu[i].className = "";
            toolrow[i].className = "gone";
        }
    }
}

function getInput(){
    let x = document.getElementById('inputX').value;
    let y = document.getElementById('inputY').value;
    console.log(x, y);
    addData(0, x, y);
}

function addData(i, x, y){
    draggableChart.data.datasets[i].data.unshift({x: parseInt(x), y: parseInt(y)});
    draggableChart.update();
}

function drawModeRed(){
    if(toolMode === 'drawRed') {
        toolMode = 'view';
        setInactiveTool();
    } else {
        toolMode = 'drawRed';
        setInactiveTool();
        document.getElementById('drawRed').className = "tool active-tool";
    }
    updateModeDesc();
}

function drawModeBlue(){
    if(toolMode === 'drawBlue') {
        toolMode = 'view';
        setInactiveTool();
    } else {
        toolMode = 'drawBlue';
        setInactiveTool();
        document.getElementById('drawBlue').className = "tool active-tool";
    }
    updateModeDesc();
}

function knnMode(){
    toolMode = 'KNN';
}

function deleteMode(){
    if(toolMode === 'delete') {
        toolMode = 'view';
        setInactiveTool();
    } else {
        toolMode = 'delete';
        setInactiveTool();
        document.getElementById('delete').className = "tool active-tool";
    }
    updateModeDesc();
}

function viewMode(){
    toolMode = 'view';
    updateModeDesc();
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

    for(let i = 1; i < dataLength; i++){
        let data = draggableChart.data.datasets[0].data[i];
        xSum += data.x;
        ySum += data.y;
    }
    let xMean = xSum / dataLength;
    let yMean = ySum / dataLength;

    let numerator = 0;
    let denominator = 0;
    for(let i = 1; i < dataLength; i++){
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

function knn_predict(x, y){
    console.log('asd');
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
    let i = xvalid, j = yvalid;
    let invalidColumn = true;
    let last = "";
    // do {
    //     var col1 = prompt("Input column representing the X-axis!", "");
        
    //     for(i = 0; i < rawTable[0].length; i++) {
    //         if(col1 === rawTable[0][i]) {
    //             invalidColumn = false;
    //             break;
    //         }
    //     }
    // } while (invalidColumn);

    // invalidColumn = true;

    // do {
    //     var col2 = prompt("Input column representing the Y-axis!", "");
        
    //     invalidColumn = true;
    //     for(j = 0; j < rawTable[0].length; j++) {
    //         if(col2 === rawTable[0][j]) {
    //             invalidColumn = false;
    //             break;
    //         }
    //     }
    // } while (invalidColumn);

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
                    if(i == rawTable[1].length - 1)
                        rawTable[j][i] = rawTable[j][i].slice(0, -1);
                    cell = docRow.insertCell(i);
                    cell.innerHTML = rawTable[j][i];
                    // cell.innerHTML = "<input type=\"text\" value=\"" + rawTable[j][i] +"\" id=\""+ j + ","+i+"\"/>";
                }
            }
        }
        document.getElementById("readColumns").innerHTML = rawTable[1].length;
        document.getElementById("readRows").innerHTML = rawTable.length - 1;
        // getData();
    };
    document.getElementById("input").value = null;
}