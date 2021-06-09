var algorithmExplanation = new Vue({
    el: "#vue-algorithmExplanation",
    data: {
        selectedAlgorithm: 0,
        algorithmName: "Select an algorithm",
        regressionLRate: regressionParameter.lrate,
        regressionEpochs: regressionParameter.epochs,
        regressionM: regressionParameter.m,
        regressionB: regressionParameter.b,
        KNNk: 3
    },
    methods: {
        changeSelectedAlgorithm: function(selectedAlgorithm){
            if(selectedAlgorithm === 'none'){
                this.algorithmName = "Select an algorithm";
                this.selectedAlgorithm = 'none';
            }
            else{
                this.algorithmName = selectedAlgorithm;
                this.selectedAlgorithm = selectedAlgorithm;
            }
        },
        setRegressionParameter: function(){
            this.regressionLRate = regressionParameter.lrate;
            this.regressionEpochs = regressionParameter.epochs;
            this.regressionM = regressionParameter.m;
            this.regressionB = regressionParameter.b;
        },
        updateRegressionParameter: function(){
            linearRegressionGradientDescent(this.regressionLRate, this.regressionEpochs);
            this.regressionM = regressionParameter.m;
            this.regressionB = regressionParameter.b;
        },
        resetRegressionParameter: function(){
            this.regressionLRate = 0;
            this.regressionEpochs = 0;
            this.regressionM = 0;
            this.regressionB = 0;
        },
        updateKNNParameter: function(){
            clearKNNLine();
            KNN_DOT_DATASET.data = [];
            draggableChart.update();
            KNNParameter.k = this.KNNk;
            graphKNNk = this.KNNk;
        }
    }
})

var navbar = new Vue({
    el: "#vue-header",
    data: {
        linearRegressionIsVisible: false,
        KNNIsVisible: false,
        menuIsHidden: false,
        menuIcon: 'toggledown',
        toolrow: [document.getElementById('filediv'), document.getElementById('graphdiv'), document.getElementById('algodiv')],
        selectedMenu: 1,
        selectedTool1: 0,
        selectedTool2: 0,
        toolDescriptionDict: {
            "toolDefault": ["Move Mode.", "Drag a dot on the graph to move it."],
            "drawRed": ["Draw Red.", "Draw a RED data point on the graph. Click anywhere on the graph!"],
            "drawBlue": ["Draw Blue.", "Draw a BLUE data point on the graph. Click anywhere on the graph!"],
            "delete": ["Delete.", "Deletes a data point. Click on any existing data point to delete it."],
            "linearRegression": ["Linear Regression.", "Look at the line in the graph."],
            "KNN": ["KNN Predition.", "Predict what class would be given to a data point. Click anywhere on the graph!"]
        },
        mode: "Move Mode.",
        description: "Drag a dot on the graph to move it."
    },
    methods: {
        changeMode: function(mode){
            if(toolMode === mode){
                mode = "toolDefault";
                toolMode = 'view';
            }
            else toolMode = mode;
            this.mode = this.toolDescriptionDict[mode][0];
            this.description = this.toolDescriptionDict[mode][1];
        },
        selectAlgorithm: function(selectedAlgorithm){
            if(selectedAlgorithm === algorithmExplanation.selectedAlgorithm) selectedAlgorithm = 'none';
            algorithmExplanation.changeSelectedAlgorithm(selectedAlgorithm);
        },
        toggleMenu: function(){
            if(this.menuIsHidden){
                this.menuIcon = 'toggledown';
            }
            else{
                this.menuIcon = 'toggleup';
            }
            this.menuIsHidden = !this.menuIsHidden;
        },
        toggleLinearRegression: function(){
            KNN_DOT_DATASET.data = [];
            if(KNNLineExist){
                clearKNNLine();
            }
            if(this.linearRegressionIsVisible){
                algorithmExplanation.resetRegressionParameter();
                clearRegression();
            }
            else{
                clearRegression();
                linearRegressionGradientDescent();
                algorithmExplanation.setRegressionParameter();
            }
            this.linearRegressionIsVisible = !this.linearRegressionIsVisible;
            draggableChart.update();
        },
        toggleKNN: function(){
            if(this.linearRegressionIsVisible) this.linearRegressionIsVisible = !this.linearRegressionIsVisible;
            if(this.KNNIsVisible){
                clearKNNLine();
            }
            KNNLineExist = true;
            clearRegression();
            KNN_DOT_DATASET.data = [];
            draggableChart.update();
            algorithmExplanation.KNNk = 3;
            this.KNNIsVisible = !this.KNNIsVisible;
        }
    }
})

var datasetDisplay = new Vue({
    el: "#vue-dataset",
    data:{
        columnNames: []
    },
    methods:{
        getColumns: function(){
            for(let i = 0; i < rawTable[0].length; i++){
                this.columnNames.unshift(rawTable[0][i]);
            }
        },
        clearColumns: function(){
            this.columnNames = [];
        },
        setXAxis: function(e){
            // console.log(e.target.value);
            xvalid = rawTable[0].indexOf(e.target.value);
        },
        setYAxis: function(e){
            // console.log(e.target.value);
            yvalid = rawTable[0].indexOf(e.target.value);
        },
        updateAxis: function(){
            if(xvalid != -1 && yvalid != -1){
                clearGraph();
                getData();
            }
        }
    }
})