/**
 * Low level format helpers using bootstrap
 * Created by heslicia on 1/12/2018.
 */
//make basic elements
function makeTh(content) {
    /*
     return th element
     */

    return "<th>" + content + "</th>"
}
function appendListAsTh(selector, contentList) {
    /*
    given selector and a list of content
    push information into selector as th element
     */
    for (let content of contentList){
        // var content=contentList[i];
        selector.append(makeTh(content))
    }
}
function addDotLine(cssSelector) {
    cssSelector.append("<hr style='border-top: dotted 1px;'/>")
}
function makeToolTipElement(elem,tooltip) {
        return "<a data-toggle='tooltip' class='my_tooltip' title='"+tooltip+"'>"+elem+"</a>"
}
function generateContainerDiv(selector,idHeader,colList) {
    /*
    make a bootstrap row according to colList
    return div ids
    the id for the row is the idheader
    THE ID for each column is: :
        idHeader_col-i

     */
    selector.append("<div class='row' id='"+idHeader+"'></div>");
    var row=$("#"+idHeader);
    var divIds=[];
    for (var i=0;i<colList.length;i++){
        var num=colList[i];
        row.append("<div class='col-"+num+"' id='"+idHeader+"_col-"+i+"'></div>");
        divIds.push(idHeader+"_col-"+i)
    }
    return divIds


    // <div col='col-2' id='"+idHeader+"_col2_1'></div><div col='col-8' id='"+idHeader+"_col8'></div><div col='col-2' id='"+idHeader+"_col2_2'></div></div>")


}
function returnDotLine() {
    return "<hr style='border-top: dotted 1px;' />"

}

//create advanced element
function appendListAsToolTipThWithColor(selector,contentList,tooltipList) {
    for (var i=0;i<contentList.length;i++){
        // var textElem="<p class='outlineHeader>"+contentList[i]+"</p>"
        var textElem=contentList[i]
        // console.log(textElem)
        var th="<th bgcolor='"+domColorMapping[contentList[i]]+"'>" + makeToolTipElement(textElem,tooltipList[i]) + "</th>";
        // console.log(th)
        selector.append(th)
    }
}
function initDropDown(appendSelector,id,options,initialInfo) {
    /*
     initiate generic drop down
     */

    appendSelector.append("<div class='btn-group' id='"+id+"_btn_div'></div>");
    var btn_div_selector=$("#"+id+"_btn_div");
    btn_div_selector.append("<i class='dropdown-arrow dropdown-arrow-inverse'></i>")
    var button="<button class='btn btn-primary dropdown-toggle  btn-lg ' data-toggle='dropdown' id='"+id+"_btn"+"'> <span class='caret'>"+initialInfo+"</span></button>";
    btn_div_selector.append(button);
    btn_div_selector.append("<ui class='dropdown-menu dropdown-inverse' id='"+id+"_dropdown' ></ui>")
    var manuSelector=$("#"+id+"_dropdown");

    for (var i=0;i<options.length;i++){
        manuSelector.append("<li><a class='dropdown-item'>"+options[i]+"</a></li>")
    }
    $('#'+id+"_dropdown  a").click(function(e){
        $("#"+id+"_btn").text(this.innerHTML);
    });
}
function generateNavigationBar(selector) {
    /*
    Create the element for navigation bar
    Use default setting
     */
    var mainTitle="WikiImgDive";
    selector.prepend('<nav id="navbar" class="navbar navbar-fixed-top navbar-light bg-light"></nav>');
    $("#navbar").append('<a class="navbar-brand" href="index.html">'+mainTitle+'</a>');
    $("#navbar").append('<ul id="navList" class="nav nav-pills"></ul>');
    // var navInfo=["About","ImgDive  Tool","Results","Source Code and Help"];
    var navInfo=["About","ImgDive  Tool","Source Code and Help"];
    var navLink=["about","tool","https://github.com/datamazelab/WikiImgDive"];//github link fo
    // var navLink=["about","tool","paperResults","https://github.com/datamazelab/WikiImgDive"];//github link fo
    for (var i=0;i<navInfo.length-1;i++){
        var pg=navInfo[i];
        $("#navList").append('<li class="nav-item"><a class="dropdown-item" href="'+navLink[i]+'.html">'+pg+'</a></li>')
    };
    var pg=navInfo[i];
    $("#navList").append('<li class="nav-item"><a class="dropdown-item" href="'+navLink[i]+'">'+pg+'</a></li>')

}

function generate2_8_2div(selector,idHeader) {
    /*
    make a bootstrap 2-8-2 row, and add optional ids into the divs
    ID_col2_1
    ID_col_8
    ID_col2_2
    not updated with the new method (Because of id changes)
     */
    selector.append("<div class='row'><div col='col-2' id='"+idHeader+"_col2_1'></div><div col='col-8' id='"+idHeader+"_col8'></div><div col='col-2' id='"+idHeader+"_col2_2'></div></div>")


}


//catch
function imgNotFound(source) {
    console.log("404");
    console.log(source.src);
    source.src="img/404.jpg";
    source.onerror="";
    return true;
    // console.log(imgUrl);
    // console.log(fileUrl)
}
function initErrorDiv(err){
    /*
    something went wrong during the query process
     */
    console.log(err);
    $("body").append("<div id='errorInQuery' class='container'><div class='col-2'></div><div class='col-8'><h2 style='color:crimson'>Sorry, something went wrong with the query. Please check your title and edition input. Make sure that you are using the exact title (case and space sensitive) to start the query.</h2></div></div>")

}

//object and array
function removeFromArray(elem, array) {
    var index=array.indexOf(elem);
    if(index > -1){
        array.splice(index, 1);
    }
}
function retrieveOrEmpty(dictionary, key) {
    /*
    if key in dictionary, return dictionary[key]
    else, return []
     */
    if(key in dictionary){
        return dictionary[key]
    }
    return []
}
Set.prototype.intersection = function(setB) {
    var intersection = new Set();
    for (var elem of setB) {
        if (this.has(elem)) {
            intersection.add(elem);
        }
    }
    return intersection;
};
function intersect_safe(a, b)
{
    var ai=0, bi=0;
    var result = [];

    while( ai < a.length && bi < b.length )
    {
        if      (a[ai] < b[bi] ){ ai++; }
        else if (a[ai] > b[bi] ){ bi++; }
        else /* they're equal */
        {
            result.push(a[ai]);
            ai++;
            bi++;
        }
    }

    return result;
}
function removeIfExist(elem, array) {
    var index = array.indexOf(elem);
    if(index>-1){
        array.splice(index,1)
    }

}
Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};
function convertToMillion (num) {

    // Nine Zeroes for Billions
    return Math.abs(Number(num)) >= 1.0e+9

        ? (Math.abs(Number(num)) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions
        : Math.abs(Number(num)) >= 1.0e+6

            ? (Math.abs(Number(num)) / 1.0e+6).toFixed(2) + "M"
            // Three Zeroes for Thousands
            : Math.abs(Number(num)) >= 1.0e+3

                ? (Math.abs(Number(num)) / 1.0e+3 ).toFixed(2)+ "K"

                : Math.abs(Number(num));

}
if(typeof(String.prototype.trim) === "undefined")
{
    String.prototype.trim = function()
    {
        return String(this).replace(/^\s+|\s+$/g, '');
    };
}

//updates
function updateTooltip() {
    $(document).ready(function(){
        $('[data-toggle="tooltip"]').tooltip();
    });
    $('.my_tooltip').tooltip({"data-html": true})
}

//color and font
function initColorMapping() {
    domColorMapping['en']='#00a756'
    domColorMapping['uk']='#447c69'
    domColorMapping['ru']='#bdf2c6'
    domColorMapping['pl']='#8e8c6d'
    domColorMapping['no']='#e4bf80'
    domColorMapping['ja']='#b2faca'
    domColorMapping['de']='#e2975d'
    domColorMapping['fi']='#f19670'
    domColorMapping['sv']='#e1cfd5'
    domColorMapping['es']='#c91c1a'
    domColorMapping['zh']='#9a6e80'
    domColorMapping['fr']='#e46300'
    domColorMapping['ca']='#993767'
    domColorMapping['pt']='#8c3fa8'
    domColorMapping['cs']='#b24dff'
    domColorMapping['da']='#645a89'
    domColorMapping['he']='#ff8fb9'
    domColorMapping['hu']='#e0598b'
    domColorMapping['id']='#93b097'
    domColorMapping['ko']='#9abf88'
    domColorMapping['ro']='#bba302'
    domColorMapping['sk']='#e8dd4f'
    domColorMapping['tr']='#7a421f'
    domColorMapping['nl']='#e88e0f'
    domColorMapping['it']='#e8e4ac'
}
var domColorMapping={};
initColorMapping();
function shadeColor2(color, percent) {
    var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
}

function blendColors(c0, c1, p) {
    var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
    return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
}
// console.log(blendColors("#da6042","#7c8496","0.5"))

function leftwrap(text, width) {
    /*
    tutorial found here:https://bl.ocks.org/mbostock/7555321
     */
    text.each(function() {
        var text = d3.select(this);

        var  words = text.text().split(/\s+/).reverse();
        // console.log(words)
        var  word,
            line = [],
            lineNumber = 0,
            lineHeight = storyFontSize*2,// double space px
            y = text.attr("y"),
            x = text.attr("x"),
            tspan = text.text(null).append("tspan").attr("x", x).attr("y", y).attr("class","wrap");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", x).attr("y", y).attr("dy", ++lineNumber * lineHeight  + "px").attr("y", y).attr("class","wrap").text(word);
            }
        }
        // var bbox=text.node().getBBox();
        // text.attr("transform","translate("+0+","+(space.sectionHeight-space.margin.top*4-bbox.height)/2+")")
    });
}
function centerWrap(text, width,centerX,fontSize) {
    // console.log("wrap",text);
    text.each(function() {
        var text = d3.select(this);

        var  words = text.text().split(/\s+/).reverse();
        // console.log(words)
        var  word,
            line = [],
            lineNumber = 0,
            lineHeight = fontSize*2,// double space px
            y = text.attr("y"),
            x = parseFloat(text.attr("x")),
            tspan = text.text(null).append("tspan").attr("y",y).attr("x",centerX).attr("class","centerAnchor");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", centerX).attr("y", y).attr("dy", ++lineNumber * lineHeight  + "px").attr("y", y).attr("class","centerAnchor").text(word);
            }
        }
        // var bbox=text.node().getBBox();
        // text.attr("transform","translate("+centerX+","+0+")");
        // text.attr("x",x+centerX);
        // lineCt[text.attr("id")]={"lc":lineNumber,"bbox":bbox}
        // console.log(lineCt)
    });
}
function range(size, startAt) {
    // console.log(startAt)
    // console.log([...Array(size).keys()].map(i => i + startAt))
    return [...Array(size).keys()].map(i => i + startAt);
}