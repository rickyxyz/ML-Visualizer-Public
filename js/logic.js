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
var regressionParameter = {lrate: 0, epochs: 0, m:0, b:0};
var KNNParameter = {k: 3};
var lastClickedElement = NaN;
var toolMode = 'view';
var algoMode = 0;
var xvalid = -1, yvalid = -1;

var col1, col2;

var KNNLineExist = false;

var linearRegressionDatasetIndex = 0;
var KNNDotDatasetIndex = 1;
var redDotDatasetIndex = 2;
var blueDotDatasetIndex = 3;
var KNNLineStartIndex = 4;

var LINEAR_REGRESSION_DATASET = draggableChart.data.datasets[linearRegressionDatasetIndex];
var KNN_DOT_DATASET = draggableChart.data.datasets[KNNDotDatasetIndex];
var RED_DOT_DATASET = draggableChart.data.datasets[redDotDatasetIndex];
var BLUE_DOT_DATASET = draggableChart.data.datasets[blueDotDatasetIndex];

function checkValidColumn() {
    if(document.getElementById('x-col') === null) return;
    if(document.getElementById('y-col') === null) return;
    x = document.getElementById('x-col').value;
    y = document.getElementById('y-col').value;
    if(rawTable[0] == null) {
        // console.log('1');
        document.getElementById('error').innerHTML = "You haven't imported any external .csv!";
        return;
    }
    if(x && y) {
        // console.log(x + y);
        xvalid = -1;
        yvalid = -1;

        for(let i = 0; i < rawTable[0].length && !(xvalid > -1 && yvalid > -1); i++) {
            // console.log(">" + i);
            if(x == rawTable[0][i] && xvalid === -1) xvalid = i;
            if(y == rawTable[0][i] && yvalid === -1) yvalid = i;
        }
        if(xvalid > -1 && yvalid > -1) {
            // console.log('2');
            document.getElementById('error').innerHTML = "";
            clearGraph();
            getData();
        } else if (xvalid === -1){
            // console.log('3');
            document.getElementById('error').innerHTML = "Columns for X-axis doesn't exist within the .csv!";
        } else {
            // console.log('4');
            document.getElementById('error').innerHTML = "Columns for Y-axis doesn't exist within the .csv!";
        }
    } else {
        // console.log('5');
        document.getElementById('error').innerHTML.innerHTML = "Both columns don't exist within the .csv!";
    }
}

function addData(i, x, y){
    draggableChart.data.datasets[i].data.unshift({x: parseInt(x), y: parseInt(y)});
    draggableChart.update();
}

function clearGraph(){
    for(let i = 0; i < draggableChart.data.datasets.length; i++){
        draggableChart.data.datasets[i].data.splice(0, draggableChart.data.datasets[i].data.length);
    }
    draggableChart.update();
    algorithmExplanation.selectedAlgorithm = 0;
}

function clearRegression(){
    LINEAR_REGRESSION_DATASET.data.splice(0, LINEAR_REGRESSION_DATASET.data.length);
    draggableChart.update();
}

function linearRegression(){
    let m = 1;
    let b = 0;
    let x1 = 0;
    let y1 = m * x1 + b;
    let x2 = 1;
    let y2 = m * x2 + b;

    let dataLength = RED_DOT_DATASET.data.length;
    let xSum = 0;
    let ySum = 0;

    for(let i = 1; i < dataLength; i++){
        let data = RED_DOT_DATASET.data[i];
        xSum += data.x;
        ySum += data.y;
    }
    let xMean = xSum / dataLength;
    let yMean = ySum / dataLength;

    let numerator = 0;
    let denominator = 0;
    for(let i = 1; i < dataLength; i++){
        let data = RED_DOT_DATASET.data[i];
        numerator += (data.x - xMean) * (data.y - yMean);
        denominator += (data.x - xMean) * (data.x - xMean);
    }

    m = numerator/denominator;
    b = yMean - m * xMean;

    x1 = 0;
    y1 = m * x1 + b;
    x2 = 25;
    y2 = m * x2 + b;

    LINEAR_REGRESSION_DATASET.data[0] = {x: x1, y: y1};
    LINEAR_REGRESSION_DATASET.data[1] = {x: x2, y: y2};
    LINEAR_REGRESSION_DATASET.pointRadius = 0;
    draggableChart.update();

    regressionParameter.lrate = 0;
    regressionParameter.epochs = 0;
    regressionParameter.m = m;
    regressionParameter.b = b;
}

function linearRegressionGradientDescent(lrate = 0.0001, epochs = 1000){
    // console.log("Gradient descent linear regression was called");
    let dataLength = RED_DOT_DATASET.data.length;
    let m = 0;
    let b = 0;
    let step_m = 0;
    let step_b = 0;
    let x1 = 0;
    let y1 = 0;
    let x2 = 25;
    let y2 = 0;
    let y_yPred = 0;
    for(let ii =0 ; ii!=epochs; ii++){
        let sum_m = 0;
        let sum_b = 0;
        for(let i = 0; i < dataLength; i++){
            let data = RED_DOT_DATASET.data[i];
            y_yPred = data.y - ( m * data.x + b);
            sum_m += data.x * y_yPred;
            sum_b += y_yPred;
        }
        step_m = lrate * (-2/dataLength * sum_m);
        step_b = lrate * (-2/dataLength * sum_b);
        if(Math.abs(step_m)>0.00001 && Math.abs(step_b)>0.00001){
            m = m - step_m;
            b = b - step_b;
        }else{
            break;
        }
    }   
    y1 = m * x1 + b;
    y2 = m * x2 + b;
    LINEAR_REGRESSION_DATASET.data[0] = {x: x1, y: y1};
    LINEAR_REGRESSION_DATASET.data[1] = {x: x2, y: y2};
    LINEAR_REGRESSION_DATASET.pointRadius = 0;
    draggableChart.update();

    regressionParameter.lrate = lrate;
    regressionParameter.epochs = epochs;
    regressionParameter.m = m;
    regressionParameter.b = b;
}

function knnSort(a, b){
    if(a.dist > b.dist) return 1;
    if(a.dist < b.dist) return -1;
    return 0;
}

function addKNNLine(x, y, arr){
    let arrLength = arr.length;
    for(let i = 0; i < arrLength; i++){
        draggableChart.data.datasets[KNNLineStartIndex+i] = {
            name: 'knnLine'+i,
            type: 'line',
            data: [{x: x,y: y}, {x: arr[i].x,y: arr[i].y}],
            dragData: false,
            pointRadius: 0,
            borderWidth: 1,
            borderColor: arr[i].backgroundColor
        }
    }
}

function clearKNNLine(){
    for(let i = 0; i < KNNParameter.k; i++){
        draggableChart.data.datasets[KNNLineStartIndex+i].data = [];
        draggableChart.data.datasets[KNNLineStartIndex+i].hidden = true;
    }
    draggableChart.update();
}

function knn_predict(x, y){
    let data1 = RED_DOT_DATASET;
    let data2 = BLUE_DOT_DATASET;
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
    // console.log(distData);

    let neighbors = [0, 0];
    let maxDist = 0;
    for(let i = 0; i < KNNParameter.k; i++){
        neighbors[distData[i].category] += 1;
        if(distData[i].dist > maxDist) maxDist = distData[i].dist;
    }
    // console.log(neighbors);
    // console.log(maxDist);

    if(KNN_DOT_DATASET.data.length < 1){
        addData(KNNDotDatasetIndex, x, y);
        if(neighbors[0] > neighbors[1]){
            KNN_DOT_DATASET.backgroundColor = '#FF0000';
        }
        else{
            KNN_DOT_DATASET.backgroundColor = '#0000FF';
        }
    }
    else{
        KNN_DOT_DATASET.data[0].x = x;
        KNN_DOT_DATASET.data[0].y = y;
        if(neighbors[0] > neighbors[1]){
            KNN_DOT_DATASET.backgroundColor = '#FF0000';
        }
        else{
            KNN_DOT_DATASET.backgroundColor = '#0000FF';
        }
    }
    addKNNLine(x, y, distData.slice(0,KNNParameter.k));
    draggableChart.update();
}

function showUploadModal(){
    document.getElementById("uploadmodal").style.display = "block";
}

function showDownloadModal(){
    let data = RED_DOT_DATASET.data;

    var csv = 'X,Y\n';
    data.forEach(row => {
        csv += row.x + ',' + row.y;
        csv += "\n";
    });

    // console.log(csv);
    let hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'data.csv';
    hiddenElement.click();
}

function closeModal() { 
    document.getElementById("uploadmodal").style.display = "none";
    document.getElementById("downloadmodal").style.display = "none";
}

function getData(){
    let xMin, yMin = Number.POSITIVE_INFINITY;
    let xMax, yMax = Number.NEGATIVE_INFINITY;

    const xs = [];
    const ys = [];
    let i = xvalid, j = yvalid;
    let invalidColumn = true;
    let last = "";

    if(i != null && j != null){
        col1 = parseInt(i);
        col2 = parseInt(j);
    }

    for(let x = 1; x < rawTable.length; x++) {
        if(xMin > parseInt(rawTable[x][col1])) xMin = parseInt(rawTable[x][col1])-3;
        if(yMin > parseInt(rawTable[x][col2])) yMin = parseInt(rawTable[x][col2])-3;
        if(xMax < parseInt(rawTable[x][col1])) xMax = parseInt(rawTable[x][col1])+3;
        if(yMax < parseInt(rawTable[x][col2])) yMax = parseInt(rawTable[x][col2])+3;
        // xs.push(rawTable[x][col1]);
        // ys.push(rawTable[x][col2]);
        addData(2, rawTable[x][col1], rawTable[x][col2]);
        // console.log(rawTable[x][col1], rawTable[x][col2]); 
    }

    draggableChart.options.scales.y.max = yMax;
    draggableChart.options.scales.y.min = yMin;
    draggableChart.options.scales.x.max = xMax;
    draggableChart.options.scales.x.min = xMin;
    draggableChart.update();

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
    // console.log(document.getElementById("input").files[0]);
    document.getElementById("dataname").value = document.getElementById("input").files[0].name;

    var FR = new FileReader();
    FR.readAsText(document.getElementById("input").files[0]);
    FR.onloadend = function() {
        
        clearGraph();

        // console.log("Finished Reading", FR.readyState);
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
        datasetDisplay.clearColumns();
        datasetDisplay.getColumns();

        xvalid = datasetDisplay.columnNames.length - 1;
        yvalid = datasetDisplay.columnNames.length - 1;

        // getData();
    };
    document.getElementById("input").value = null;
}

function loadDefault(){
    clearGraph();
    let defaultRedData = [{x: 7, y: 1}, {x: 2, y: 12}, {x: 14, y: 11}, {x: 17, y: 8}, {x: 13, y: 8}, {x: 15, y: 23}, {x: 20, y: 7}, {x: 18, y: 21}, {x: 22, y: 7}];
    let defaultBlueData = [{x: 4, y: 17}, {x: 16, y: 14}, {x: 4, y: 1}, {x: 12, y: 18}, {x: 9, y: 10}, {x: 2, y: 4}, {x: 6, y: 15}, {x: 2, y: 15}, {x: 8, y: 3}];

    defaultRedData.forEach(element => {
        addData(redDotDatasetIndex, element.x, element.y);
    });
    defaultBlueData.forEach(element => {
        addData(blueDotDatasetIndex, element.x, element.y);
    });

    draggableChart.options.scales.y.max = 25;
    draggableChart.options.scales.y.min = 0;
    draggableChart.options.scales.x.max = 25;
    draggableChart.options.scales.x.min = 0;
    draggableChart.update();
}