/*
concept level/percent/count/2012 data
 */

function buildConcept_degScales(scaleStorage) {
    scaleStorage["margin"]={"left":space.margin.left*3,"right":space.margin.left*3,"top":space.margin.top*8,"bottom":10*space.margin.top};

    scaleStorage["xBand"]=d3.scaleBand().range([0,space.width-scaleStorage["margin"]["right"]]).domain(range(data["edition_deg"].length,1)).padding(0.2);

    scaleStorage["y"]={};
    scaleStorage["y"]["linear"]=d3.scaleLinear()
        .range([space["sectionHeight"]-scaleStorage["margin"]["top"]-scaleStorage["margin"]["bottom"],0])
        .nice();

    scaleStorage["y"]["log"]=d3.scaleLinear()
        .range([scales["width"]-scaleStorage["margin"]["left"]-scaleStorage["margin"]["right"],0])
        .nice();
}
function createConcept_degBars(panelId,displayOptions,sortOptions,scaleOption) {
    var visGroup=d3.select("#"+panelId+"_vis_g");
    var scaleStorage=scales[panelId];

    var disOptionBtnSelector=$('#'+panelId+"VisDisplay_btn");
    var selectedDisplay=getSelectedOption(disOptionBtnSelector,displayOptions);
    //get scale
    var scaleOptionBtnSelector=$('#'+panelId+"VisScale_btn");
    var selectedScale=getSelectedOption(scaleOptionBtnSelector,scaleOption);


    //build chart

    //add bars
    var bars=visGroup
        .append("g")
        .attr("id",panelId+"_bars")
        .selectAll(".bar")
        .data(data['edition_deg'],function (d) {
            return d["imgCt"]
        });

    var barAppend=bars.enter()
        .append('rect');
    //update scale
    var domain;

    if(selectedDisplay.toLowerCase().includes("perc")){
        console.log("1!");
        domain=[0,1]
    }
    else{
        domain=getMinMax(data["edition_deg"],selectedDisplay)
    }

    scaleStorage["y"][selectedScale].domain(domain);

    var xScale=scaleStorage["xBand"];
    var yScale=scaleStorage["y"][selectedScale];
    // console.log(yScale(1),yScale(200));
    var xFunc=function (d,i) {
        return xScale(i+1)
    };
    var yFunc=function (d) {
        return yScale(d[selectedDisplay])
    };
    var heightFunc=function (d) {
        return yScale.range()[0]-yScale(d[selectedDisplay])
    };
    console.log("update",selectedDisplay,selectedScale);
    setBarAttr(barAppend,xFunc,yFunc,heightFunc,xScale);
    setBarAttr(bars.transition(),xFunc,yFunc,heightFunc,xScale);

    addOrUpdateAxis(panelId,xScale,yScale,space.sectionHeight-scaleStorage['margin']['bottom']-scaleStorage["margin"]["top"])
}
function updateDegBars() {
    /*WRAPPER FOR DEG BARS*/
    var panelId="concept_deg",
        displayOptions=visData[panelId]["displayOptions"],
        sortOptions=visData[panelId]["sortOptions"],
        scaleOption=visData[panelId]["scaleOptions"];


    createConcept_degBars(panelId,displayOptions,sortOptions,scaleOption)

}


function buildConceptDegVis(panelId,stages,displayOptions,sortOptions,scaleOptions){
    scales[panelId]={};
    var scaleStorage=scales[panelId];
    buildConcept_degScales(scaleStorage);
    var visGroup=d3.select("#"+panelId+"_panel")
        .append('g')
        .attr("id",panelId+"_vis_g")
        .attr("transform","translate("+scaleStorage["margin"]["left"]+","+scaleStorage["margin"]["top"]+")");
    //get display
    createConcept_degBars(panelId,displayOptions,sortOptions,scaleOptions)
}

function makeConcept_degChart() {
    var panelId="concept_deg";
    // var displayOptions=[{"t":"Display Image Count","content":"imgCt"},{"t":"Display Image Percentage","content":"imgPerc"},{"t":"Display Text Count(2012)","content":"text_12_ct"},{"t":"Display Text Percentage(2012)","content":"text_12_perc"},{"t":"Display Text Percentage(2017)","content":"text_2017_perc"}];
    var displayOptions=[{"t":"Display Text Percentage(2012)","content":"text_12_perc"},{"t":"Display Text Percentage(2017)","content":"text_2017_perc"}];
    var sortOptions=[{"t":"Sort by Value (Descending)",'content':"qualImg"},{"t":"Sort Alphabetically","content":"qualPg"}];//todo
    var scaleOptions=[{"t":"Linear Scale",'content':"linear"},{"t":"Log Scale","content":"log"}];//todo
    var stages=[];


    visData[panelId]={};
    visData[panelId]["displayOptions"]=displayOptions;
    visData[panelId]["sortOptions"]=sortOptions;
    visData[panelId]["scaleOptions"]=scaleOptions;

    buildDisplaySortScaleOptions(panelId,displayOptions,sortOptions,scaleOptions);
    addButton($("#"+panelId+"_description"),panelId+"_update","updateDegBars()","Update");

    // d3.select('#'+panelId+"_description")
    //     .style("transform","translate(0,"+space.sectionHeight+')');

    addVisDownloadButton($("#"+panelId+"_description"));
    buildConceptDegVis(panelId,stages,displayOptions,sortOptions,scaleOptions)
}