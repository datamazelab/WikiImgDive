//Created for the animated vis page

function getMinMax(dataSource,key) {
    /*
    return [min,max] of the data[key]
     */
    var minVal=d3.min(dataSource,function (d) {
      return d[key]
    });
    var maxVal=d3.max(dataSource,function (d) {
        return d[key]
    });
    return [minVal,maxVal]


}
function addOrUpdateAxis(panelId,xScale,yScale,yTranslate) {

    var xAxisID=panelId+"_xAxis_g",
        yAxisID=panelId+"_yAxis_g";
    var xAxisSelector,yAxisSelector;
    if($('#'+xAxisID).length != 0) {
        xAxisSelector=d3.select("#"+xAxisID);
        yAxisSelector=d3.select("#"+yAxisID)
    }
    else{
        xAxisSelector=d3.select("#"+panelId+"_vis_g")
            .append("g")
            .attr("id",xAxisID);
        yAxisSelector=d3.select("#"+panelId+"_vis_g")
            .append("g")
            .attr("id",yAxisID);
    }
    xAxisSelector.attr("transform", "translate(0," + yTranslate+ ")")
        .call(d3.axisBottom(xScale));

    // add the y Axis
    yAxisSelector
        .call(d3.axisLeft(yScale)
        );
}
function addButton(selector,idHeader,onClickFunctionString,btnText) {
    selector.append("<button type='button' class='btn btn-info btn-lg' onclick='"+onClickFunctionString+"' id='"+idHeader+"_btn'>"+btnText+"</button>")
}
function buildDescription(idHeader,storyContent) {

    var textLine=d3.select("#"+idHeader+"_description")
        .selectAll("text.story")
        .data(storyContent)
        .enter()
        .append('p')
        .text(function (d) {
            return d.t
        })
        .attrs(function (d) {
            return d.attrs
        })
        .styles(function (d) {
            return d.styles
        })
}
function buildDisplaySortScaleOptions(idHeader,displayOptions,sortOptions,scaleOption) {
    /*todo: opacity =0*/
    // console.log("#"+idHeader+"_description",$("#"+idHeader+"_description"));
    d3.select("#"+idHeader+"_description")
        .append("div")
        .attr("id",idHeader+"Options_div");
        // .style("opacity",0);//todo
    var appendSelector=$("#"+idHeader+"Options_div");

    initDropDown(appendSelector,idHeader+"VisDisplay",displayOptions.map(function (value) { return value['t'] }),displayOptions[0]['t']);
    initDropDown(appendSelector,idHeader+"VisSort",sortOptions.map(function (value) { return value["t"] }),sortOptions[0]["t"]);
    initDropDown(appendSelector,idHeader+"VisScale",scaleOption.map(function (value) { return value["t"] }),scaleOption[0]["t"]);
    $("#"+idHeader+"VisSort_btn_div").addClass("topMargin")
    $("#"+idHeader+"VisScale_btn_div").addClass("topMargin")
}
function getSelectedOption(optionBtnSelector,optionsToFind) {
    var textSelected=optionBtnSelector.text();
    // console.log(textSelected,optionsToFind)
    var selected = optionsToFind
        .filter(function( obj ) {
            return obj.t.trim()==textSelected.trim()
        })[0]["content"];
    return selected
}
function downloadVisSvg() {
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var html = d3.select("#main_svg")
        .attr("title", "imgDive_vis")
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, "imgDive_vis.svg");
}
function addVisDownloadButton(selector) {
    selector.append("<button type='button' class='btn btn-info btn-lg' onclick='downloadVisSvg()'>Download SVG</button>")
}
function setBarAttr(d3Selector,xFunction,yFunction,heightFunction,xScaleBand) {

    d3Selector.attr("class","bar")
        .attr("x", xFunction)
        .attr("width", xScaleBand.bandwidth())
        .attr("y", yFunction)
        .attr("height",heightFunction );
}


function addText(d3Bind,attrs,styles,basicScales,tag) {
    var appendedText = d3Bind.append("text")
        .attrs(attrs)
        .styles(styles)
        .attr("y", function (d, i) {
            // console.log(tag,basicScales["textYband"](tag))
            return basicScales["textYband"](tag)});

    return appendedText
}

function offsetDisappear(toDisappear,sceneSetting){
    /*
    make a tween so that the opacity gradually goes to 0
     */
    var disappearTween=TweenMax.to("#"+toDisappear,animationSec,{"opacity":0});
    var scroll=new ScrollMagic.Scene(sceneSetting)
        .setTween(disappearTween)
        // .addIndicators("DISAPPEAR");
    sceneCollection.push(scroll)
}