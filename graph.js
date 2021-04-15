window.myChart = document.getElementById('myChart').getContext('2d');

var draggableChart = new Chart(window.myChart, {
    data: {
        datasets: [{
            type: 'scatter',
            data: [{x: 1,y: 1}, {x: 2,y: 2}, {x: 3,y: 3}, {x: 4,y: 4}, {x: 5,y: 5}],
            fill: false,
            tension: 0.4,
            borderWidth: 1,
            pointRadius: 4.5, 
            pointHitRadius: 10, // for improved touch support
            borderColor: '#FF0000',
            label: 'Data Point'
        },{
            type: 'line',
            data: [{x: 0,y: 0}, {x: 0,y: 0}],
            dragData: false, // prohibit dragging this dataset
            pointRadius: 0,
            label: 'Regression Line'
        },{
            hidden: false,
            type: 'scatter',
            data: [{x: 11,y: 11}, {x: 12,y: 12}, {x: 13,y: 13}, {x: 14,y: 14}, {x: 15,y: 15}],
            fill: false,
            tension: 0.4,
            borderWidth: 1,
            pointRadius: 4.5, 
            pointHitRadius: 10, // for improved touch support
            borderColor: '#0000FF' 
        },{
            name: 'knnPointer',
            type: 'scatter',
            pointRadius: 4.5,
            data: [],
            dragData: false
        },{
            name: 'knnLine1',
            type: 'line',
            data: [{x: 0,y: 0}, {x: 0,y: 0}],
            dragData: false,
            pointRadius: 0,
            borderWidth: 1
        },{
            name: 'knnLine2',
            type: 'line',
            data: [{x: 0,y: 0}, {x: 0,y: 0}],
            dragData: false,
            pointRadius: 0,
            borderWidth: 1
        },{
            name: 'knnLine3',
            type: 'line',
            data: [{x: 0,y: 0}, {x: 0,y: 0}],
            dragData: false,
            pointRadius: 0,
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                max: 25,
                min: 0,
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
            console.log(x, y);
            if(element.length > 0){
                lastClickedElement = element[0];
                let dataX = document.getElementById('dataX');
                let dataY = document.getElementById('dataY');
                let datasetIndex = lastClickedElement.datasetIndex;
                let index = lastClickedElement.index;

                if(toolMode === 'delete'){
                    if (index > -1) {
                        draggableChart.data.datasets[datasetIndex].data.splice(index, 1);
                        if(datasetIndex === 3){
                            draggableChart.data.datasets[4].data = [];
                            draggableChart.data.datasets[5].data = [];
                            draggableChart.data.datasets[6].data = [];
                        }
                        draggableChart.update();
                    }
                }
                else{
                    dataX.value = draggableChart.data.datasets[datasetIndex].data[index].x.toFixed(1);
                    dataY.value = draggableChart.data.datasets[datasetIndex].data[index].y.toFixed(1);
                }

            }
            else{
                dataX.value = 'NaN';
                dataY.value = 'NaN';
                lastClickedElement = NaN;

                if(toolMode == 'drawRed'){
                    addData(0, x, y);
                }
                else if(toolMode == 'drawBlue'){
                    addData(2, x, y);
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