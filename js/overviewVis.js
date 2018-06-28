/**
 * Created by heslicia on 1/23/2018.
 * Generate overall visualization
 */

var midMargin = 20;
//helper
function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            y = text.attr("y"),
            dy = parseFloat(text.attr("dy")),
            tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
            }
        }
    });
}
function buildChordData() {
    //INITIATE
    var overlapData=[];
    var domOrder=masterData["sortedDomOrder"];
    masterData["pairwiseOverlap"]={};
    var imgProcessedData=masterData["pairwiseOverlap"]
    masterData["domUniq"]={}
    domUniq=masterData["domUniq"]

    //initiate domUniq
    for (var i =0;i<domOrder.length;i++) {
        var dom1 = masterData["sortedDomOrder"][i]
        // var imgs1=new Set(masterData["domFilteredImg"][dom1])
        var imgs1 = masterData["domFilteredImg"][dom1]
        if(imgs1!=null){
            domUniq[dom1] = imgs1.slice()
        }
    }
    //pairwise calculation
    for (var i =0;i<domOrder.length-1;i++){
        var dom1=masterData["sortedDomOrder"][i]
        // var imgs1=new Set(masterData["domFilteredImg"][dom1])
        var imgs1=masterData["domFilteredImg"][dom1]
        if (imgs1!=null && imgs1.length>0){
            for (var j=i+1;j<domOrder.length;j++){
                var dom2=masterData["sortedDomOrder"][j]
                // var imgs2=new Set(masterData["domFilteredImg"][dom2])
                var imgs2=masterData["domFilteredImg"][dom2]
                if (imgs2!=null && imgs2.length>0){
                    var overlaps=intersect_safe(imgs1,imgs2)
                    // console.log('ov',dom1,dom2, overlaps)
                    if (overlaps.length>0){
                        overlapData.push({"root":dom1,"node":dom2,"count":overlaps.length,"imgs":overlaps})
                        overlapData.push({"root":dom2,"node":dom1,"count":overlaps.length,"imgs":overlaps})
                        imgProcessedData[dom1+"_"+dom2]=overlaps;
                        imgProcessedData[dom2+"_"+dom1]=overlaps;
                        //get rid of non-unique imgs
                        for(var o of overlaps){
                            removeIfExist(o,domUniq[dom1])
                            removeIfExist(o,domUniq[dom2])
                        }
                    }
                }
            }
        }
    }

    //unique image calculation
    for (var i =0;i<domOrder.length;i++){
        var dom=masterData["sortedDomOrder"][i]
        if(dom in domUniq){
            var imgs=domUniq[dom]
            if (imgs.length>0){
                overlapData.push({"root":dom,"node":dom,"count":imgs.length})
                imgProcessedData[dom+"_"+dom]=imgs
            }
        }
    }

    return overlapData
}

//data organizer
function processPageInfo(title,statCt,startDom) {
    //important:edited the remLL to include the starting domain
    var pgData = [
        {
            "title": "We found <b><mark>"+statCt['llCt']+"</mark></b> language editions that have articles about the concept: <b><mark>"+title+"</mark></b> .",
            "tooltip": 'The query started from the ' + domNameMap[startDom] + '.'
        }
    ];
    var remInfo= {
        'title': "Within these <b><mark>"+statCt['llCt']+"</mark></b> language editions, we found <b><mark>"+statCt['remLL']+"</mark></b> languages that fit our criteria",
        "tooltip": 'From these ' + (statCt['llCt']) + ' articles about ' + title + " , we selected " + (statCt['remLL']) + " articles that fit our language selection criteria (see the about page for the language selection criteria)."
    };
    pgData.push(remInfo);

    if(statCt["noQualDomCt"]>0){
        var nDinfo={
            'title': "Out of these <b><mark>"+statCt['remLL']+"</mark></b> articles, we found <b><mark>"+(statCt['remLL']-statCt['noQualDomCt'])+"</mark></b> articles that use qualified images to describe the concept <b><mark>"+title+"</mark></b>.",
            "tooltip": ''
        };
        for(var nDom of masterData["noQualDom"]){
            nDinfo.tooltip+=domNameMap[nDom]+", "
        }
        nDinfo.tooltip+=" do not have any qualified and displayable images. See the about page for our definition of qualified images and our filtering method.";
        pgData.push(nDinfo)
    }
    pgData[pgData.length-1]["title"]="<green><u>"+ pgData[pgData.length-1]["title"]+"</u></green>";
    return pgData
}
function processImgInfo(title,statCt) {
    var imgData=[];
    var total={
        "title":"These qualified articles use <b><hlight>"+ statCt["fileCt"] +"</hlight></b> unique files in total.",
        "tooltip":"This file count includes all types of files that are directly linked in these articles."
    };
    var displayable={
        "title":"Within these <b><hlight>"+statCt["fileCt"] +"</hlight></b> files, there are <b><hlight>"+statCt['imgCt']+"</hlight></b> displayable images.",
        "tooltip":"Unlike the research paper (see the about page), we are only displaying images in the format of "
    };
    for (var i=0;i<imgExt.length;i++){
        displayable["tooltip"]+=imgExt[i]+", "
    }
    var filter={
        "title": "We filtered out <b><hlight>"+ +statCt["adminCt"]+" </hlight></b> potential template images.",
        "tooltip":"We try to avoid comparing images that are likely to be used for administrative purposes. See the about page for more information."
    };
    imgData.push(total);
    imgData.push(displayable);
    imgData.push(filter);
    if(statCt["failedImg"]>0){
        imgData.push({
            "title":"We failed to reach <b><hlight>"+ statCt["failedImg"] +"</hlight></b> images.",
            "tooltip":"It is possible that these images have changed name/location, or there is a connection error."
        })
    }
    imgData.push({
        "title":"<green><u>We will display <b><hlight>"+statCt["remImgCt"]+"</hlight></b> images in the following visualization/table.</u></green>",
        "tooltip":"You can see these images on the Overlap Table or by clicking chords on the chord diagram."
    });
    return imgData
}

//structure

function addPgInformation(divSelector,title,statCt,startDom){
    /*
    present 1) total number of page/language found
    2) total number of pages in our langauge range
    3) total number of pages that have qualified images
    //initially in a center grid, than change to top grid (empty previously//tween?)
     */
    var pgData=processPageInfo(title,statCt,startDom);
    //pgData stores all information we need, stored as list of objects. Each object has title, tooltip, ct, color

    divSelector.append("<ul class=\"list-group list-group-flush\" id='pgInfo_list'>");
    for(var i=0;i<pgData.length;i++){
        var data=pgData[i];
        var liElem="<li id='pgData_"+i+"'>"+data["title"]+"</li>";
        liElem=makeToolTipElement(liElem,data["tooltip"]);
        $("#pgInfo_list").append(liElem);
        scrollingComp.push('#pgData_'+i)
    }


}
function addImgInformation(divSelector,title,statCt) {
    /*
    img info: total files, displayable img, potential template imgs, failed imgs,qualified images
     */

    divSelector.append("<ul class=\"list-group list-group-flush\" id='imgInfo_list'>");
    var imgData=processImgInfo(title,statCt);
    for(var i=0;i<imgData.length;i++){
        var data=imgData[i];
        var liElem="<li id='imgData_"+i+"'>"+data["title"]+"</li>";
        liElem=makeToolTipElement(liElem,data["tooltip"]);
        $("#imgInfo_list").append(liElem);
        scrollingComp.push('#imgData_'+i)
    }



}
function initImgModal() {
    /*
    by default, append to #("body"), could be improved by adding this reference
     */
    $("body").append('<div class="modal fade" id="chordModal" tabindex="-1" role="dialog" aria-labelledby="chordModal_label" aria-hidden="true"></div>');
    $("#chordModal").append(' <div class="modal-dialog" role="document" id="chord_modal_content"><div class="modal-content"></div></div>');
    $("#chord_modal_content").append('<div class="modal-header">\n' +
        '        <h5 class="modal-title" id="chordModal_label">Image Usage</h5>\n' +
        '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">\n' +
        '          <span aria-hidden="true">&times;</span>\n' +
        '        </button>\n' +
        '      </div>')

}

function buildChordDiagram(summarySvg, visDivWidth, sumHeight, title, startDom) {
    /*
     chord information for summary
     */
    //initiate modal section
    // initImgModal();
    //build data
    overlapData=buildChordData();
    var imgProcessedData=masterData["pairwiseOverlap"];
    domUniq=masterData["domUniq"];

    var mpr = chordMpr(overlapData);
    mpr
        .addValuesToMap('root')
        .addValuesToMap('node')
        .setFilter(function(row, a, b) {
            return (row.root === a.name && row.node === b.name)
        })
        .setAccessor(function(recs, a, b) {
            if (!recs[0]) return 0;
            return +recs[0].count;
        });
    var matrix=mpr.getMatrix();
    var mmap= mpr.getMap();

    //setup
    var w = visDivWidth,
        h = sumHeight,
        r1 = h / 2,
        r0 = r1 - 110;
    var sumVisG = summarySvg.append("g")
        .attr("transform", "translate(" + visDivWidth/2 + "," + r1 + ")");

    var chord = d3.chord()
        .padAngle(0.05)
        .sortSubgroups(d3.ascending)
        .sortChords(d3.ascending);
        // .sortSubgroups(function (a,b) {
        //     // console.log(a,b)
        //     return b < a ? -1 : b > a ? 1 : b >= a ? 0 : NaN;
        // })//d3.descending


    var arc = d3.arc()
        .innerRadius(r0)
        .outerRadius(r0 + 20);

    var ribbon = d3.ribbon()
        .radius(r0);
    var svg = sumVisG
        .datum(chord(matrix));

    svg.append("circle")
        .attr("r", r0 + 20)
        .style("fill","#f9f9f9");

    var mapReader = chordRdr(matrix, mmap);
    masterData["mapReader"]=mapReader
    // console.log(matrix)
    var g = svg.selectAll("g.group")
        .data(function(chords) {
            // console.log(chords)
            // console.log(chords.groups)
            return chords.groups;
        })
        .enter().append("svg:g")
        .attr("class", "group");
    //bind to chords.groups
    // console.log(chords.groups)
    g.append("g")
        .attr("data-toggle", 'modal')
        .attr("data-target", '#'+modalId+"_div")
        .append("a")
        .attr("data-toggle", 'tooltip')
        .attr('title', function (d) {
            var dom=mapReader(d).gname;
            var tooltip=domNameMap[dom] +" page uses "+masterData["domFilteredImg"][dom].length+" images.";
            // console.log(dom,masterData["domFilteredImg"][dom])
            return tooltip;
        })
        .attr('class', 'my_tooltip')
        .append("svg:path")
        .style("stroke", "grey")
        .style("fill", function(d) {

            return domColorMapping[mapReader(d).gname];
        })
        .attr("d", arc)
        .on("click",displayDomImg);
        // .on("click",filterDom)//no longer needed//


    g.append("svg:text")
        .each(function(d) {
            d.angle = (d.startAngle + d.endAngle) / 2;
        })
        .attr("dy", ".35em")
        .style("font-family", "helvetica, arial, sans-serif")
        .style("font-size", "12px")
        .attr("text-anchor", function(d) {
            return d.angle > Math.PI ? "end" : null;
        })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")" +
                "translate(" + (r0 + 26) + ")" +
                (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) {
            return mapReader(d).gname +": ("+masterData["domFilteredImg"][mapReader(d).gname].length+" imgs)";
        });

    var colors = d3.scaleOrdinal(d3.schemeCategory20c);

    var chordPaths = svg.selectAll("path.chord")
        .data(function(chords) {
            return chords;
        })
        .enter()
        .append("g")
        .attr("data-toggle", 'modal')
        .attr("data-target", '#'+modalId+"_div")
        .append('a')
        .attr("data-toggle", 'tooltip')
        .attr('title', function (d) {
            var dLink=mapReader(d)
            var dom1=dLink["sname"]
            var dom2=dLink["tname"]
            var key=dom1+"_"+dom2;
            var overlaps=imgProcessedData[key];
            // console.log(key, overlaps)
            // console.log(masterData["domFilteredImg"][dom1],dom1)
            var tooltip= "The "+domNameMap[dom1]+" and "+domNameMap[dom2]+" articles share "+overlaps.length+" images when describing the concept "+title+"."
            if (dom1==dom2){
                tooltip="The "+domNameMap[dom1]+" article uses "+domUniq[dom1].length+" unique images when describing the concept "+title+"."
            }
            return tooltip
        })
        .attr('class', 'my_tooltip')
        .append("svg:path")
        .attr("class", "chord")
        .attr("id", function (d,i) {
            return "chordPath_"+i
        })
        .style("stroke", "grey")
        .style("fill", function(d, i) {
            var dLink=mapReader(d)
            var dom1C=domColorMapping[dLink["sname"]];
            var dom2C=domColorMapping[dLink["tname"]];
            var overlapsPercent=dLink["svalue"]/Math.max(dLink["stotal"],dLink["ttotal"])
            // console.log(dom1C,dom2C,dLink["sname"],dLink["tname"])
            // console.log(overlapsPercent)
            // console.log(blendColors(dom1C,dom2C,0.5))
            // console.log(blendColors(dom1C,dom2C,0.2))
            return blendColors(dom1C,dom2C,0.5)
        })
        .attr("d", ribbon.radius(r0))
        .on("click",displayChordImg);
        // .on("click",filterChord)//no longer doing filtering
    //add title information
    sumVisG.append("text")
        .attr("x", -midMargin)
        .attr("y", -h/2+midMargin)
        .attr("class","chartTitle")
        .text(title)

}
function getFilterCheckBoxValue() {
    // var value=$("#check_filter_box").val()
    // console.log(value)
    if($('#check_filter_box').is(":checked")){
        return true
    }
    return false
}
function addDownloadButton(selector) {
    selector.append("<button type='button' class='btn btn-info btn-lg' onclick='downloadSvg()'>Download Chord Diagram</button>")
}
function downloadSvg() {
    try {
        var isFileSaverSupported = !!new Blob();
    } catch (e) {
        alert("blob not supported");
    }

    var html = d3.select("#summary_svg")
        .attr("title", "imgDive"+masterData["startDom"]+masterData["title"])
        .attr("version", 1.1)
        .attr("xmlns", "http://www.w3.org/2000/svg")
        .node().parentNode.innerHTML;

    var blob = new Blob([html], {type: "image/svg+xml"});
    saveAs(blob, "imgDive"+masterData["startDom"]+masterData["title"]+".svg");

}

///FILTERS : no longer needed: remove soon //todo
function cleanFilters() {
    //restore original table
    $("#tableMainDiv").remove();
    // console.log(masterData["original_tableMainDiv"])
    $("body").append(masterData["original_tableMainDiv"])
    //todo: check
    //restore all checked

}
function filterChord(e) {
    /*
    manage table filtering process, no longer used
     */
    if(getFilterCheckBoxValue()){
        var dLink=  masterData["mapReader"](e);
        // console.log(dLink)
        var dom1=dLink["sname"];
        var dom2=dLink["tname"];
        var domToDisplay=[];
        var imgsToDisplay=[];
        if(dom1==dom2){
            //display only unique images
            domToDisplay.push(dom1)
            imgsToDisplay=masterData["domUniq"][dom1]

        }else{
            domToDisplay.push(dom1)
            domToDisplay.push(dom2)
            imgsToDisplay=masterData["pairwiseOverlap"][dom1+"_"+dom2]
        }
        // console.log(domToDisplay,imgsToDisplay)
        //todo keep adding
        $("#tableMainDiv").remove();
        var tableSelector = startTable($("#tableCarousel"),domToDisplay);
        tableSelector.append("<tbody class='scrollContent' id='tb'></tbody>");
        for (var idx = 0; idx <imgsToDisplay.length; idx++) {
            var img = imgsToDisplay[idx];
            pushOneRow($("#tb"), img, idx,domToDisplay);
        }
        //todo adjust style
        var pathId="#chordPath_"+e["source"]["index"]
        // console.log(pathId, $(pathId), e["source"],e)
        // $(pathId).attr("style",{fill:"#1b4b91"})
        // d3.select(pathId).style("fill","#1b4b91")
    }
}
function filterDom(e) {
    if(getFilterCheckBoxValue()){
        var dLink=  masterData["mapReader"](e);
        var dom=dLink.gname;
        var imgsToDisplay=masterData["domFilteredImg"][dom];
        $("#tableMainDiv").remove();
        var domToDisplay=masterData["sortedDomOrder"];
        var tableSelector = startTable($("#tableCarousel"),domToDisplay);
        tableSelector.append("<tbody class='scrollContent' id='tb'></tbody>");
        for (var idx = 0; idx <imgsToDisplay.length; idx++) {
            var img = imgsToDisplay[idx];
            pushOneRow($("#tb"), img, idx,domToDisplay);
        }

        // console.log(dLink)
    }
}
//image thumbnail display
function cleanModal() {
    $("#"+modalId+"_title").text("");
    // console.log("#" + introId + "_infoDiv");
    $("#" + introId + "_infoDiv").empty();
    $("#" + introId + "_domH2").text("");
    $("#" + introId + "_titleH1").text("");
    $("#" + introId + "_titleA").attr("href","#");
}
function pushImgRowsToModal(imgsToDisplay){
//todo: adjust image layout
    var rowCt=5;
    var rowId=-1;
    for (var i=0;i<imgsToDisplay.length;i++){
        if(i%rowCt==0) {
            rowId+=1;
            //initiate a new row
            $("#" + introId + "_infoDiv").append("<div class='row' id='img_modal_row_" + rowId + "'></div>")
        }
        $("#img_modal_row_"+rowId).append(masterData['imgElemCollection'][imgsToDisplay[i]]);
    }

}
function displayChordImg(e) {
    /*
    based on the chord clicked, display images only for the chord
    change mainmodal_title,
    _introId+"_infoDiv'
    _introId+"_infoP'
     */
    //get imgs
    var dLink=  masterData["mapReader"](e);
    // console.log(dLink)
    var dom1=dLink["sname"];
    var dom2=dLink["tname"];
    var domToDisplay=[];
    var imgsToDisplay=[];
    if(dom1==dom2){
        //display only unique images
        domToDisplay.push(dom1);
        imgsToDisplay=masterData["domUniq"][dom1]

    }else{
        domToDisplay.push(dom1);
        domToDisplay.push(dom2);
        imgsToDisplay=masterData["pairwiseOverlap"][dom1+"_"+dom2]
    }
    //add to title
    if(dom1==dom2){
        var title="Images that are ONLY used by the "+domNameMap[dom1]+" article."
    }else{
        var title="Image Usage Overlap Between "+domNameMap[dom1]+' and '+domNameMap[dom2]
    }
    cleanModal();
    $("#"+modalId+"_title").text(title);
    //pushImg

    pushImgRowsToModal(imgsToDisplay);

}
function displayDomImg(e) {
    /*
    based on the domain band clicked, display images only for the language edition
     */
    //process data:
    var dLink=  masterData["mapReader"](e);
    var dom=dLink.gname;
    var imgsToDisplay=masterData["domFilteredImg"][dom];
    cleanModal();
    //edit title
    $("#"+modalId+"_title").text("Images that are used by the "+domNameMap[dom]+" article.");
    //pushImg
    pushImgRowsToModal(imgsToDisplay);
}

