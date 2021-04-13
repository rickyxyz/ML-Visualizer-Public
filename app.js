var app = new Vue({
    el: '#vue-tool',
    data: {
        modeTitle: "Mode Title",
        modeDescription: "Default mode"
    },
    methods: {
        changeMode(mode){
            let modeDict = {
                drawRed: ["Draw Red Data Point", "Click on the graph to add red data point"],
                drawBlue: ["Draw Blue Data Point", "Click on the graph to add blue data point"],
                delete: ["Delete Data Point", "Click on existing data point or the KNN point to delete it"],
                view: ["View Mode", "Click on existing data point to move it"],
                KNN: ["KNN Mode", "Click on the graph to do a KNN classification"]
            };
            clickMode = mode;
            this.modeTitle = modeDict[mode][0];
            this.modeDescription = modeDict[mode][1];
        }
    }
})