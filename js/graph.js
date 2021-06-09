window.myChart = document.getElementById('myChart').getContext('2d');

var graphKNNk = 3;
var graphKNNStartIndex = 4;

var draggableChart = new Chart(window.myChart, {
    data: {
        datasets: [{
            label: 'Regression Line',
            type: 'line',
            pointRadius: 0,
            data: [{x: 0,y: 0}, {x: 0,y: 0}],
            dragData: false // prohibit dragging this dataset
        },{
            name: 'knnPointer',
            type: 'scatter',
            pointRadius: 4.5,
            data: [],
            dragData: false
        },{
            label: 'Red Data Point',
            type: 'scatter',
            pointRadius: 4.5, 
            data: [{x: 7, y: 1}, {x: 2, y: 12}, {x: 14, y: 11}, {x: 17, y: 8}, {x: 13, y: 8}, {x: 15, y: 23}, {x: 20, y: 7}, {x: 18, y: 21}, {x: 22, y: 7}],
            fill: false,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 10, // for improved touch support
            borderColor: '#FF0000'
        },{
            label: "Blue Data Point",
            hidden: false,
            type: 'scatter',
            pointRadius: 4.5, 
            data: [{x: 4, y: 17}, {x: 16, y: 14}, {x: 4, y: 1}, {x: 12, y: 18}, {x: 9, y: 10}, {x: 2, y: 4}, {x: 6, y: 15}, {x: 2, y: 15}, {x: 8, y: 3}],
            fill: false,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 10, // for improved touch support
            borderColor: '#0000FF'
        }]
    },
    options: {
        scales: {
            y: {
                max: 25,
                min: 0,
                ticks: {
                    precision: 0
                }
                // dragData: false // disables datapoint dragging for the entire axis
            },
            x: {
                dragData: true,
                type: 'linear',
                position: 'bottom',
                max: 25,
                min: 0
            }
        },
        onClick: function graphClick(e, element){
            let canvasPosition = Chart.helpers.getRelativePosition(e, draggableChart);
            let x = draggableChart.scales.x.getValueForPixel(canvasPosition.x);
            let y = draggableChart.scales.y.getValueForPixel(canvasPosition.y);
            // console.log(x, y);
            if(element.length > 0){
                lastClickedElement = element[0];
                // let dataX = document.getElementById('dataX');
                // let dataY = document.getElementById('dataY');
                let datasetIndex = lastClickedElement.datasetIndex;
                let index = lastClickedElement.index;
                if(toolMode === 'delete'){
                    if (index > -1) {
                        draggableChart.data.datasets[datasetIndex].data.splice(index, 1);
                        draggableChart.update();
                    }
                }
                else{
                    dataX.value = draggableChart.data.datasets[datasetIndex].data[index].x.toFixed(1);
                    dataY.value = draggableChart.data.datasets[datasetIndex].data[index].y.toFixed(1);
                }
            }
            else{
                // dataX.value = 'NaN';
                // dataY.value = 'NaN';
                lastClickedElement = NaN;

                if(toolMode == 'drawRed'){
                    addData(2, x, y);
                }
                else if(toolMode == 'drawBlue'){
                    addData(3, x, y);
                }
                else if(toolMode == 'KNN'){
                    knn_predict(x, y);
                }
            }
        },
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip:{
                enabled: false
            },
            dragData: {
                round: 1, // rounds the values to n decimal places 
                // in this case 1, e.g 0.1234 => 0.1)
                showTooltip: true, // show the tooltip while dragging [default = true]
                dragX: true, // also enable dragging along the x-axis.
                // this solely works for continous, numerical x-axis scales (no categories or dates)!
                onDragStart: function (e, element) {
                    if(toolMode !== 'view')
                        return false;
                    /*
                    // e = event, element = datapoint that was dragged
                    // you may use this callback to prohibit dragging certain datapoints
                    // by returning false in this callback
                    if (element.datasetIndex === 0 && element.index === 0) {
                        // this would prohibit dragging the first datapoint in the first
                        // dataset entirely
                        return false
                    }
                    */
                },
                onDrag: function (e, datasetIndex, index, value) {
                    /*     
                    // you may control the range in which datapoints are allowed to be
                    // dragged by returning `false` in this callback
                    if (value < 0) return false // this only allows positive values
                    if (datasetIndex === 0 && index === 0 && value > 20) return false 
                    */
                },
                onDragEnd: function (e, datasetIndex, index, value) {
                    // you may use this callback to store the final datapoint value
                    // (after dragging) in a database, or update other UI elements that
                    // dependent on it
                },
            }
        }
    }
})