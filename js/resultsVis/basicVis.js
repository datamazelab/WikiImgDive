/*
TO BE CALLED BY PAPERResultsVisualizations.js
Helper functions only
INIT function stored in paperResultsVisualizations.js
 */
//helper
function updateBasicAxis(basicScales) {
    var xAxisID="basic_xAxis_g",
        yAxisID="basic_yAxis_g";
    var xAxisSelector,yAxisSelector;
    if($('#'+xAxisID).length != 0) {
         xAxisSelector=d3.select("#"+xAxisID);
         yAxisSelector=d3.select("#"+yAxisID)
    }
    else{
         xAxisSelector=d3.select("#basic_scatter_g")
            .append("g")
            .attr("id",xAxisID);
         yAxisSelector=d3.select("#basic_scatter_g")
            .append("g")
            .attr("id",yAxisID);
    }
    xAxisSelector.attr("transform", "translate(0," + basicScales["scatterEnd"] + ")")
        .call(d3.axisBottom(basicScales["xScatterBand"]));

    // add the y Axis
    yAxisSelector
        .call(d3.axisLeft(basicScales["yScatterScale"])
        );

}
function setBarAttrForBasic(d3Selector,displayOption,basicScales) {
    d3Selector.attr("class","bar")
        .attr("x", function(d) { return basicScales["xScatterBand"](d["edition"]); })
        .attr("width", basicScales["xScatterBand"].bandwidth())
        .attr("y", function(d)
        {
            return basicScales["yScatterScale"](d[displayOption]); })
        .attr("height", function(d) {
            return  basicScales["scatterEnd"] - basicScales["yScatterScale"](d[displayOption]); });
}
function buildBasicScales(xNum,yNum,basicScales) {

    basicScales["xBand"]=d3.scaleBand().range([space.margin.left*3,space.width-2*space.margin.left]).domain([...Array(xNum).keys()])
.padding(0.2);
    basicScales["xScatterStart"]=space.margin.left*3;
    basicScales["xScatterEnd"]=space.width-3*space.margin.left;
    basicScales["xScatterBand"]=d3.scaleBand().range([0,basicScales["xScatterEnd"]]).domain(data["aggr"].map(function (value) { return value["edition"]})).padding(0.2);
        // console.log( basicScales["xScatterBand"].domain());
    var scatterStart=space.margin.top*8,
        scatterEnd=space.sectionHeight-10*space.margin.bottom;
    basicScales["scatterStart"]=scatterStart;
    basicScales["scatterEnd"]=scatterEnd;

    basicScales["scatterHeight"]=scatterEnd-scatterStart;

    basicScales["yScatterScale"]=d3.scaleLog()
        .range([scatterEnd,scatterStart])
        .base(10)
        .nice();
    var yTicks = basicScales["yScatterScale"].ticks(5),
        tickFormat = basicScales["yScatterScale"].tickFormat(5, ",d");
    yTicks.map(tickFormat);
    //TODO: TICK FORMAT IS STILL WRONG
        //no default domain

    basicScales["yBand"]=d3.scaleBand().range([space.margin.top*8,space.sectionHeight-2*space.margin.bottom]).domain([...Array(yNum).keys()])
.padding(0.1);

    var minFontSize=15;
    var fontPropotion=0.3;

    basicScales["pgSize"]=d3.scaleLinear().range([minFontSize,basicScales["xBand"].bandwidth()*fontPropotion]).domain(getMinMax(data["aggr"],"qualPG"));

    basicScales["imgSize"]=d3.scaleLinear().range([minFontSize,basicScales["xBand"].bandwidth()*fontPropotion]).domain(getMinMax(data["aggr"],"qualImg"));

    basicScales["textYband"]=d3.scaleBand()
        .range([0,basicScales["yBand"].bandwidth()])
        .domain(["normal","pg","img"])
        .padding(0.8);
}
var animationSec=2;
function buildVisTextAnimation(i,opacityDuration,disappearOffset) {
    //helper method for basicVisStory
    var appearTween=TweenMax.to("#basicTitle_"+i,animationSec,{"fill-opacity":1});
    var disappearTween=TweenMax.to("#basicTitle_"+i,animationSec,{"fill-opacity":0});

    var scroll=new ScrollMagic.Scene({
        triggerElement: "#basicPanel",
        offset:opacityDuration*i,
        triggerHook:0,duration:opacityDuration
    })
        .setTween(appearTween);


    var disScroll=new ScrollMagic.Scene({
        triggerElement: "#basicPanel",
        offset:opacityDuration*(i+1),
        triggerHook:0,duration:disappearOffset
    })
        .setTween(disappearTween)
        .addIndicators({name:"line"+i});
    sceneCollection.push(scroll);
    sceneCollection.push(disScroll)
}
function  buildStoryTWEENclassVersion(i,stageDuration,disappearOffset,tweenInfo,mainTrigger) {
//tween info for each stage(could include multiple tweens in one stage), include selector id and tween info
    //sample tween info:  visStages[0]=[{"class":"editionText","tween":{"fill-opacity":1,"font-size":basicFont*2}}];//edition text appear
    //called by for loopInfo
    for (var j=0;j<tweenInfo.length;j++){
        var tween=TweenMax.to("."+tweenInfo[j]["class"],animationSec,tweenInfo[j]["tween"]);
        var scroll=new ScrollMagic.Scene({
            triggerElement: "#"+mainTrigger,
            offset:stageDuration*i,
            triggerHook:0,duration:stageDuration
        })
            .setTween(tween)
            .addIndicators({name:"line"+i});
        sceneCollection.push(scroll);
    }
}
function addBasicDesc_textAnimation(storyContent,opacityDuration,svgPinDuration) {
    var opacityTween=TweenMax.to(["#"+storyContent[0]["attrs"]["id"],"#"+storyContent[1]["attrs"]["id"]],animationSec,{opacity:1});
    var twoOpacity= new ScrollMagic.Scene({
        triggerElement: storyContent[0]["trigger"],
        triggerHook:0,duration:opacityDuration
    })
        .setTween(opacityTween)
        .addIndicators({name:"story1"});

    var pinTop=new ScrollMagic.Scene({
        triggerElement: storyContent[0]["trigger"],
        triggerHook:0,
        duration:svgPinDuration
    })
        .setPin("#basic_description");
    sceneCollection.push(twoOpacity);
    sceneCollection.push(pinTop);
}

//content
function addBasicOptionsToDescription(idHeader,displayOptions,sortOptions) {
    d3.select("#"+idHeader+"_description")
        .append("div")
        .attr("id","basicOptions_div")
        .style("opacity",0);
    var appendSelector=$("#basicOptions_div");

    initDropDown(appendSelector,"basicScatterDisplay",displayOptions.map(function (value) { return value['t'] }),displayOptions[0]['t']);
    initDropDown(appendSelector,"basicScatterSort",sortOptions.map(function (value) { return value["t"] }),sortOptions[0]["t"]);
    $("#basicScatterSort_btn_div").addClass("topMargin")
}
function buildBasicVisCaptions(panelId,stages) {

    var titles=svgG.select("#basic_panel")
        .selectAll("text.visTitle")
        .data(stages)
        .enter()
        .append("text")
        .attrs({"class":'visTitle',"id":panelId+"_t_0",'y':space.margin.top*4,"fill-opacity":0})
        .text(function (d) {
            return d["text"]
        })
        .attr("id",function (d,i) {
            return "basicTitle_"+i
        });
    titles.call(centerWrap, space.width,space.width/2,30);
}
function addTextBlockVis(basicScales,xNum,yNum) {
    var textGroup=svgG.select("#basic_panel")
        .append("g")
        .attr("id","edition_texts");
    //make text
    var textBind=textGroup.selectAll("text.basicText")
        .data(data["aggr"],function (d) {
            return d.edition
        })
        .enter()
        .append('g')
        .attr("id",function (d) {
            return "edition_"+d.edition
        })
        .attr("transform",function (d,i) {
            var x=basicScales["xBand"]((i % xNum));
            var y=basicScales["yBand"](Math.floor(i / yNum));
            return "translate("+x+","+y+")";
        });

    //
    //edition text
    var editionText=addText(textBind,{"class":"basicText editionText","fill-opacity":0.5},{"font-size":basicFont*1.5+"px"},basicScales,"normal");
    editionText.text(function (d) {
        return d.edition
    });


    // //pgText
    var pgText=addText(textBind,{"class":"basicText pgText",'fill-opacity':0},{},basicScales,"pg");
    pgText.text(function (d) {
        return convertToMillion(d.qualPG)
    })
        .style("font-size",function (d) {
            return basicScales["pgSize"](d.qualPG)
        });
    var imgText=addText(textBind,{"class":"basicText imgText",'fill-opacity':0},{},basicScales,"img");
    imgText.text(function (d) {
        return convertToMillion(d.qualImg)
    })
        .style("font-size",function (d) {
            return basicScales["imgSize"](d.qualImg)
        });
}
function addBasicScatter(basicScales,displayOptions,sortOptions){
    // console.log(basicScales)
    //add scatter plot

    //add group
    var scatterGroup=d3.select("#basic_panel")
        .append('g')
        .attr("id","basic_scatter_g")
        .attr("transform","translate("+basicScales["xScatterStart"]+",0)");
    //get options
    var displaySelected=$('#basicScatterDisplay_btn').text();

    var displayOption = displayOptions
        .filter(function( obj ) {
        return obj.t.trim()==displaySelected.trim()
    })[0]["content"];
    console.log(displayOption);
    //todo add sort options here
    //update scale
    basicScales["yScatterScale"].domain(getMinMax(data["aggr"],displayOption));
    // console.log(data["aggr"])
    var bars=scatterGroup
        .append("g")
        .attr("id","basic_bars")
        .selectAll(".bar")
        .data(data['aggr'],function (d) {
            return d["edition"]
        });
    //add bars
    var barAppend=bars.enter()
        .append('rect');
    setBarAttrForBasic(barAppend,displayOption,basicScales);
    setBarAttrForBasic(bars,displayOption,basicScales);

    //add axis
    updateBasicAxis(basicScales)
    //todo, add options


}

function buildBasicVis(panelId,stages,displayOptions,sortOptions){
    //add svg description
    //1) list all editions
    //2) add page count
    //3) add image count
    //4) sortable
    //add title
    buildBasicVisCaptions(panelId,stages);
    var xNum=5,
        yNum=5;
    scales["basic"]={};
    var basicScales=scales["basic"];
    buildBasicScales(xNum,yNum,basicScales);
    //buildText
    addTextBlockVis(basicScales,xNum,yNum);
    addBasicScatter(basicScales,displayOptions,sortOptions)



    //add sorting function













}

//animation
function arrangebasicDescStory(storyContent,opacityDuration,svgPinDuration) {
    /*manage the left column*/
    addBasicDesc_textAnimation(storyContent,opacityDuration,svgPinDuration)
    var optionOpacityTween=TweenMax.to("#basicOptions_div",animationSec,{opacity:1});

    var optionOpacityScroll= new ScrollMagic.Scene({
        triggerElement: storyContent[0]["trigger"],
        triggerHook:0,
        offset:opacityDuration*3, duration:opacityDuration/2
    })
        .setTween(optionOpacityTween);

    sceneCollection.push(optionOpacityScroll);


}

function arrangeBasicVisStory(svgDuration,stages,opacityDuration,disappearOffset,visStages) {
    /*
    deal with vis story
    edition text: opacity from 0.5 to 1
    size from basicFont*2 to basicFont, disappear after scroll
    pgText: opacity from 0 to 1, disappear after text disappear
    imgText: opacity from 0 to 1, enter the sort mode.
     */
    var pinSVG=new ScrollMagic.Scene({
        triggerElement: "#visDiv",
        triggerHook:0,
        duration:svgDuration
    })
        .setPin("#svgDiv")
        .addIndicators({name:"story2"});
    sceneCollection.push(pinSVG);

    //init the first vis title
    d3.select("#basicTitle_0")
        .attr("fill-opacity",0.4);


    //set up the linked opacity and sizeChange
    for (var i=0;i<stages.length;i++){
        //TWEEN FOR TEXTS
        buildVisTextAnimation(i,opacityDuration,disappearOffset);
        buildStoryTWEENclassVersion(i,opacityDuration,disappearOffset,visStages[i],"basicPanel");
    }
    //make all block vis disappear
    var blockID="edition_texts";
    var blockDisSetting={
        triggerElement: "#basicPanel",
        offset:opacityDuration*3,
        triggerHook:0,duration:disappearOffset
    };
    offsetDisappear(blockID,blockDisSetting);
    //todo: make scatter plot appear


}

//animationArranger
function buildBasicStory(storyContent,stages,visStages) {
    //setup
    var stageDuration=300;
    var disappearOffset=50;
    var svgPinDuration=(stageDuration+disappearOffset)*4;

    arrangebasicDescStory(storyContent,stageDuration,svgPinDuration);

    arrangeBasicVisStory(svgPinDuration,stages,stageDuration,disappearOffset,visStages);



}


//major method
function makeBasicChart() {
    /*
     */
    var panelId="basic";
    var basicStory=[{"t":"Part I: Data Collection","attrs":{"class":"emphasize-text; topMargin100","id":"deg_title"},"styles":{"opacity":0.5,"font-size":"30px"},"trigger":"#visDiv"},
        {"t":"Basic descriptions for our dataset: WIKI25ARTICLES and WIKI25IMAGES.","attrs":{"class":"emphasize-text","id":"deg_desc"},"styles":{"opacity":0.2,"font-size":"20px"},"animation":"opacity change, and disappear again","trigger":"#visDiv"}];

    var stages=[{"text":"We selected 25 Language Editions","code":"normal"},{"text":"In total, we collected 23.7 M qualified Wikipedia articles.","code":"qualPG"},{"text":"These 23.7 M articles use 10.4 M images.","code":"qualImg"},{"text":"You can sort language editions, or hover over numbers to view the exact numbers.","code":"sortEditions"}];
    window.basicFont=25;
    var visStages=[]//tween info for each stage(could include multiple tweens in one stage), include selector id and tween info
    visStages[0]=[{"class":"editionText","tween":{"fill-opacity":1,"font-size":basicFont}}];//edition text appear
    visStages[1]=[{"class":"editionText","tween":{"fill-opacity":0.7}},{"class":"pgText","tween":{"fill-opacity":1}}];//edition text shrink, page text appear
    visStages[2]=[{"class":"pgText","tween":{"fill-opacity":0}},{"class":"imgText","tween":{"fill-opacity":1}}];//edition text shrink, page text appear
    visStages[3]=[];//TODO ending pose
    var displayOptions=[{"t":"Display Page Stat","content":"qualPG"},{"t":"Display Image Stat","content":"qualImg"}];
    var sortOptions=[{"t":"Sort Alphabetically","content":"qualPg"},{"t":"Sort by Value (Descending)",'content':"qualImg"}];//todo

    buildDescription(panelId,basicStory);//generic
    addBasicOptionsToDescription(panelId,displayOptions,sortOptions);

    buildBasicVis(panelId,stages,displayOptions,sortOptions);

    buildBasicStory(basicStory,stages,visStages);
}

