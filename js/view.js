/**
 * Created by heslicia on 1/14/2018.
 * display crawled information
 */
//helpers
function generateResizedImgUrl(rawImgUrl){
    /*
    given the original img url gained from query, replace it with smaller images
     */
    var domStarter="https://upload.wikimedia.org/wikipedia/";
    var domainEndIndex=rawImgUrl.slice(domStarter.length).indexOf("/")+domStarter.length;
    var domain=rawImgUrl.slice(domStarter.length,domainEndIndex);
    var imgName=rawImgUrl.slice(rawImgUrl.lastIndexOf("/")+1);


    var processedUrl=domStarter+domain+"/thumb"+rawImgUrl.slice(domainEndIndex)+"/"+imgWidth+imgName;
    return processedUrl
}

//------generator
function getPgUrl(dom, pgId) {
    return "https://" + dom + ".wikipedia.org/?curid=" + pgId;
}
function createDotPage(dom, pgId, title, imgUser, id) {
    /*
     create a black dot that links to a particular page
     */
    // console.log(dom,title)
    var pgUrl = getPgUrl;
    var tooltip = dom + " : " + title + " ,  used " + masterData["domFilteredImg"][dom].length + " qualified images. The page was created on " + masterData["domFirstRev"][dom]["timestamp"] + " by user " + masterData["domFirstRev"][dom]["user"] + ".";
    // var icon="&#11044";//dot
    var icon = "&#x25A0;"
    if (imgUser == masterData["domFirstRev"][dom]["user"]) {
        icon = "&#x25A9;"
    }
    // var dotElemLinkVer="<a href='"+pgUrl+"'target='_blank'  data-toggle='tooltip' title='"+tooltip+"'  class='my_tooltip'><p  id='"+id+"'>"+icon+"</p></a>";

    var dotElem = "<a data-toggle='modal' title='" + tooltip + "' data-target='#mainmodal_div' onclick='createSingleModal(this)'  id='" + id + "'><p class='largeIcon'>" + icon + "</p></a>";
    // var dotLink="<a data-toggle='modal' title='"+tooltip+"' data-target='#mainmodal_div' onclick='createSingleModal(this)' id='"+id+"'></a>";
    return dotElem
    // ;
}
function fourLevelTryCatch(level1,level2,level3,level4) {
    try{
        return level1[level2][level3][level4]
    }catch(error){
        console.log(error);
        return "_"
    }
}
function createPageToolTip(dom, title) {
    // console.log(dom,masterData["domFilteredImg"])
    var imgCt=masterData["domFilteredImg"][dom].length;
    var time=fourLevelTryCatch(masterData,"domFirstRev",dom,"timestamp");
    var user=fourLevelTryCatch(masterData,"domFirstRev",dom,"user");
    var tooltip = dom + " : " + title + " ,  used " + imgCt + " qualified images. The page was created on " + time + " by user " + user + ".";
    return tooltip
    // return ""
}
function generateImgElem(imgObj, imgTitle) {
    /*
     return img element
     */
    // console.log(imgObj)
    var rawImgUrl = imgObj["url"];//this is the original image url generated from query. It needs to be shrunken through commons service
    var imgUrl=generateResizedImgUrl(rawImgUrl);

    var fileUrl = imgObj["descriptionurl"];
    var key = encodeURIComponent(imgTitle.slice(0, imgTitle.indexOf(".")))
    var extension = imgTitle.slice(imgTitle.lastIndexOf(".") + 1);
    // console.log(extension)
    // <p><a href='" + fileUrl + "'>" + imgTitle + "</a></p>

    if (extension.toLowerCase() == "svg") {
        var imgElement = "<svg class='icon' viewBox='0 0 100 100'><use xlink:href='" + imgUrl + "'></use></svg>"
    } else {
        var imgElement = "<img id='" + key + "' src='" + imgUrl + "' class='widthSet img-responsive' onerror='imgNotFound(this)'  style='display:block;'>";
    }

    if (masterData["imgLang"][imgTitle] == null) {
        //debugging purpose
        console.log(imgTitle)
        console.log(masterData["imgLang"])
    }
    var tooltipInfo = imgTitle + " is uploaded on " + imgObj["timestamp"] + "  by user " + imgObj["user"] + ". It is used by " + masterData["imgLang"][imgTitle].size + " pages.";
    var tooltip = "<a href='" + fileUrl + "'title='" + tooltipInfo + "' id='" + key + "_ttip' target='_blank' data-toggle='tooltip' class='my_tooltip'>" + imgElement + "</a>";

    return tooltip

}

//init for table
function buildTitleListVersion(title, startDom, descCollection, domCt, imgCt, statCt) {
    /*
     start the title area.
     Push stat into the presentation area
     */
    // console.log(startDom,title)
    $("body").append("<div id='title' class='mx-auto col-sm-9'><h1>" + title + "</h1></div>");
    var titleDiv = $("#title");
    titleDiv.append("<p><strong>" + descCollection[startDom] + "</strong></p>");
    titleDiv.append("<p>Started query from <u>" + startDom + "</u>, found <u>" + imgCt + "</u> images in <u>" + domCt + "</u> language editions</p>");
    titleDiv.append("<ul id='titleInfo'></ul>");
    var presentOrder = ["llCt", "remLL", "emptyPg", "fileCt", "imgCt", "adminCt", "failedImg", "remImgCt"];
    var description = ["The number of concept connections we have found", "The number of concept connections within the 25 selected editions", "The number of pages without qualified images", "The number of files used in the concept (among selected editions)", "The number of displayable images", "The number of images that are likely to be template images", "The number of images that failed to connect", "The number of qualified images"];

    for (var i = 0; i < presentOrder.length; i++) {
        var statKey = presentOrder[i];
        $("#titleInfo").append("<li>" + description[i] + " : " + statCt[statKey] + "</li>");
    }
}
function buildTitle(title, startDom, descCollection, domCt, imgCt, statCt) {
    /*
     display title information as organized chart
     also add vis and filter
     */
    $("body").append("<div id='title' class='mx-auto col-sm-9'><h1>" + title + "</h1></div>");
    var titleDiv = $("#title");
    scrollingComp.push("#title");

    titleDiv.append("<p><strong>" + descCollection[startDom] + "</strong></p>");


    $("body").append("<div id='title_vis' class='container mx-auto col-sm-9'></div>");

    $("#title_vis").append("<div class='row' id='stat_title_row'><div  class='col-sm'><h4>Concept Query Status</h4></div></div>");
    $("#stat_title_row").append("<div class='col-sm'><h4>Image Query Status</h4></div>");
    scrollingComp.push("#stat_title_row");

    $("#title_vis").append("<div class='row'><div id='pg_info_section' class='col-sm'></div><div id='img_info_section' class='col-sm'></div></div>");

    //add info in the #title_vis_row_div
    addPgInformation($("#pg_info_section"),title,statCt,startDom);
    addImgInformation($("#img_info_section"),title,statCt);

    addDotLine($("#title_vis"));
    }
function buildChordSection(selector,title, startDom, descCollection, domCt, imgCt, statCt) {

        //build chord section
        selector.append("<div class='row topMargin' ><div  class='row'><div id='summary_vis_div' class='col-9 topMargin'></div><div id='chord_util_div' class='col-3  topMargin'></div></div>");

        var bb = window.innerWidth-5*midMargin;
        var visDivWidth =bb*4/5;
        // var visDivWidth =document.getElementById("summary_vis_div").offsetWidth-5*midMargin;
        var sumHeight = 800;
        var summarySvg = d3.select("#summary_vis_div").append("svg")
            .attr("width", visDivWidth)
            .attr("height", sumHeight)
            .attr("id", "summary_svg");

        buildChordDiagram(summarySvg, visDivWidth, sumHeight, title, startDom);

    $("#chord_util_div").append("<div class='row topMargin' id='chord_help'></div><div class='row topMargin'  id='vis_download_btn_div'></div></div>");

    var chord_help_infobox="<p id='chord_help_infobox'>Clicking on the ";
    chord_help_infobox+=makeToolTipElement("<b>chord</b>","displaying pairwise image overlap")+" and ";
    chord_help_infobox+=makeToolTipElement("<b>band</b>","displaying all images used by that language edition");
    chord_help_infobox+=" to display image thumbnails</p>";
    $("#chord_help").append(chord_help_infobox);

        addDownloadButton($("#vis_download_btn_div"));
    }


function startTable(selector,sortedDomOrder) {
    /*
     add a basic table head to body
     */
    // console.log(selector);
    selector.append("<div id='tableMainDiv' class='container-fluid topMargin tableContainer'><div class='row'><div class='col-1'></div><div id='tableDiv' class='col-lg-9'></div></div></div>");

    $("#tableDiv").append("<table   class='table' id='mainTable'></table>")
    var tableSelector = $("#mainTable");
    tableSelector.append("<thead id='tableHeader' class='fixedHeader' style='border-top:1px solid black; border-bottom:1px solid black; background:lightskyblue'></thead>")
    $("#tableHeader").append("<th><strong>Image</strong></th>")
    var tooltips = [];
    for (var i = 0; i < sortedDomOrder.length; i++) {
        var dom = sortedDomOrder[i];

        var imgUsdCt = retrieveOrEmpty(masterData["domFilteredImg"], dom).length;
        // var t="qualified imgs : "+imgUsdCt
        var t = domNameMap[dom]+" : "+createPageToolTip(dom, masterData["remLL"][dom]);
        tooltips.push(t)
    }
    //for the dom order, make elements of links
    //todo
    appendListAsToolTipThWithColor($("#tableHeader"), sortedDomOrder, tooltips);

    return tableSelector
}
function pushOneRow(tbSelector, img, idx,sortedDomOrder) {
    /*
     produce one tr element with one th and multiple tds/
     */
    var pgIdCollection = masterData["pgIdCollection"];
    var filteredImg = masterData['filteredImg'];
    var imgLang = masterData['imgLang'];
    var imgElemCollection = masterData['imgElemCollection'];
    var imgDomDotElemCollection = masterData['imgDomDotElemCollection'];
    var domTitle = masterData['remLL'];
    // var trId=encodeURIComponent(img.slice(0,img.indexOf(".")))
    var trId = idx + "_tr"
    tbSelector.append("<tr id='" + trId + "'></tr>");
    var trSelector = $("#" + trId)
    // console.log(filteredImg[img])
    var imgElem = generateImgElem(filteredImg[img], img);
    imgElemCollection[img] = imgElem;
    trSelector.append("<td class='imgRow' id='" + idx + "_img'>" + imgElem + "</td>")
    var imgUser = filteredImg[img]["user"];

    for (var i = 0; i < sortedDomOrder.length; i++) {
        var imgDom = imgLang[img];
        var targetDom = sortedDomOrder[i];
        if (imgDom.has(targetDom)) {
            // console.log(pgIdCollection[targetDom],dom)
            var pgId = pgIdCollection[targetDom];
            // console.log(domTitle)
            var cellId = targetDom + "_cell_" + idx
            var pgElement = createDotPage(targetDom, pgId, domTitle[targetDom], imgUser, cellId);
            trSelector.append("<td id='" + idx + "_dom_" + i + "' class='hasPage'>" + pgElement + "</td>")
            if (img in imgDomDotElemCollection) {
                imgDomDotElemCollection[img][targetDom] = pgElement;
            } else {
                imgDomDotElemCollection[img] = {};
                imgDomDotElemCollection[img][targetDom] = pgElement;
            }
        } else {
            trSelector.append("<td id='" + idx + "_dom_" + i + "'>" + "" + "</td>")
        }
    }
    //
}
function initSortArea(selector) {
    /*
     sort row
     sort column
     */
    selector.append("<div id='sortDiv' class='container-fluid topMargin'></div>")
    $("#sortDiv").append("<div class='row' id='sortRow1'></div>");
    $("#sortRow1").append("<div class='col-1'></div>")
    $("#sortRow1").append("<div class='col-2'><p>Sort Language Editions (Col) By</p></div>")
    $("#sortRow1").append("<div class='col-2' id='colSortDiv'></div>")
    $("#sortRow1").append("<div class='col-1'></div>")
    $("#sortRow1").append("<div class='col-2'><p>Sort Images (Row) By</p></div>")
    $("#sortRow1").append("<div class='col-2'id='rowSortDiv'></div>")
    $("#sortRow1").append("<div class='col-1'id='sort_bnt_div'></div>")
    // $("#sortDiv").append("<div class='row' id='sortRow2'></div>");
    // $("#sortRow2").append("<div class='col-1'></div>")
    // $("#sortRow2").append("")
    // $("#sortRow2").append("<div class='col-1'></div>")
    // $("#sortRow2").append("<div class='col-4'id='rowSortDiv'></div>")

    initDropDown($("#colSortDiv"), "colSort", ["By Edition Name", "By Number of Images", "By Initiate Date"], "By Edition Name")
    // ],
    initDropDown($("#rowSortDiv"), "rowSort", ["By Image Name", "By Uploading Time", "By Size", "By Number of Pages"], "By Image Name")
    $("#sort_bnt_div").append("<button type='button' class='btn btn-info btn-lg' onclick='sortTable()'>Sort Results</button>")
    //adjust to be secondary
}

//init for headers
function initTopContainer() {
    $("body").append("<div class='container-fluid topMargin' id='pageHeader'></div>");
    var info = "Image Dive";
    var info2 = "Wikipedia Within-Concept Image Comparison Tool";
    $("#pageHeader").append("<div class='row' id='pgHeaderRow'></div>");
    $("#pgHeaderRow").append("<div class='col-1'></div>")
    $("#pgHeaderRow").append("<div class='col-md-8'><h1>" + info + "</h1></div>")
    $("#pageHeader").append("<div class='row'><div class='col-1'></div><div class='col-md-8'><h5>" + info2 + "</h5></div></div>")
}
function initDomDropDown(divSelector) {
    /*
     create a drop down list populated with options of the domains
     add it to the div using the selector.
     */
    // console.log(masterData)
    var dom = Object.keys(nameDomMap);
    // dom.sort()
    var processedDom = [];
    for (var i = 0; i < dom.length; i++) {
        var dName = dom[i];
        var domInfo = "(" + nameDomMap[dName] + ") " + dName
        processedDom.push(domInfo)
    }
    processedDom.sort();
    var id = "dom_select";
    initDropDown(divSelector, id, processedDom, initialDomain)
}
function initQueryArea() {
    /*
     page title query, starting language query, and submit button
     */
    $("body").append("<div class='container-fluid topMargin' id='queryDiv'></div>")
    $("#queryDiv").append("<div class='row' id='queryRow'></div>");
    $("#queryRow").append("<div class='col-1'><p></p></div>")
    $("#queryRow").append("<div class='col-2'><p>Select the language edition</p></div>")
    $("#queryRow").append("<div class='col-2' id='dom_dropdown'></div>")
    $("#queryRow").append("<div class='col-1'></div>")
    $("#queryRow").append("<div class='col-2'><p>Enter the page title (case sensitive)</p></div>")
    $("#queryRow").append("<div class='col-2' id='title_form'></div>")
    $("#queryRow").append("<div class='col-2' id='submit_button'></div>")

    initDomDropDown($("#dom_dropdown"));
    $("#title_form").append("<input class='form-control form-control-lg' type='text' value='" + initialTitle + "' id='titleInput'>")//Albert Einstein
    $("#submit_button").append("<button type='button' class='btn btn-info btn-lg' onclick='initQuery()'>Start Query</button>")
}
function sortTable() {
    /*
     sort table according to the new selection
     //todo how to access the dataset?
     */
    var colSorting = {
        "By Edition Name": alphabetDomSort,
        "By Number of Images": imgCtDomSort,
        "By Initiate Date": pgDateSort
    }
    var rowSorting = {
        "By Image Name": alphabetImgSort,
        "By Uploading Time": timeStampImgSort,
        "By Size": imgSizeSort,
        "By Number of Pages": imgPageCtSort
    }


    var requestRowSort = $.trim($("#rowSort_btn").text())
    var requestColSort = $.trim($("#colSort_btn").text())
    // console.log(requestColSort,requestRowSort)
    //approach, delete table and create new version
    if ((requestRowSort != rowOrder) || (requestColSort != colOrder)) {
        // console.log(requestRowSort,rowOrder,requestRowSort==rowOrder )
        // console.log(requestColSort,colOrder,requestColSort==colOrder)
        // console.log("Delete");
        colSorting[requestColSort]();
        rowSorting[requestRowSort]();

        $("#tableMainDiv").remove();
        var tableSelector = startTable($("#tableCarousel"),masterData["sortedDomOrder"]);//todo: remove dependency
        tableSelector.append("<tbody class='scrollContent' id='tb'></tbody>");
        for (var idx = 0; idx < masterData["sortedImg"].length; idx++) {
            var img = masterData["sortedImg"][idx];
            pushOneRow($("#tb"), img, idx,masterData["sortedDomOrder"]);
        }

        //
        rowOrder = requestRowSort;
        colOrder = requestColSort;
        updateTooltip()
    }
}

///main method to call
//called by main
function buildFormAndQueryPlatform() {
    /*
     main method to build query platform
     */

    //add navigation
    generateNavigationBar($('body'));
    //init top container
    initTopContainer();
    initQueryArea();
    $("body").append("<hr>")
}
function buildTableSection(selector,title, startDom, sortedDomOrder, descCollection, pgIdCollection, pgImg, imgLang, filteredImg, statCt, remLL){
    /*
    master function to control all behaviors for table
     */
    var tableSelector = startTable(selector,sortedDomOrder);
    tableSelector.append("<tbody id='tb' class='scrollContent'></tbody>");
    var sortedImg = Object.keys(filteredImg).sort();
    masterData["sortedImg"] = sortedImg;
    // for (var idx=0;idx<sortedImg.length;idx++) {//todo uncomment
    var imgElemCollection = {};
    // console.log(remLL)
    var imgDomDotElemCollection = {};
    masterData["imgElemCollection"] = imgElemCollection;
    masterData["imgDomDotElemCollection"] = imgDomDotElemCollection;
    for (var idx = 0; idx < sortedImg.length; idx++) {
        var img = sortedImg[idx];
        pushOneRow($("#tb"), img, idx,sortedDomOrder);
    }

}
function buildAnalyzeSection(title, startDom, sortedDomOrder, descCollection, pgIdCollection, pgImg, imgLang, filteredImg, statCt, remLL) {
    /*
    build and optimize the chord diagram and the table section
     */
    //initiate visSection

    $("body").append('<div class=\'container-fluid topMargin\' id="visDiv"></div>');
    addDotLine($("#visDiv"));
    $("#visDiv").append("<div class='row'><div class='col-sm'></div><div class='col-sm' id='visTitleDiv'></div><div class='col-sm'></div></div>");
    $("#visTitleDiv").append(makeToolTipElement("<h4>Query Results</h4>","The chord diagram displays pairwise image overlap and the Image Explorer(table view) provides multiple-edition comparison."));
    addDotLine($("#visDiv"));
    scrollingComp.push("#visDiv");

    //add visCarousel
    $("#visDiv").append("<div class='row'><div class='col-sm'></div><div class='col-sm' id='visBtnDiv1'></div><div class='col-sm' id='visBtnDiv2'></div><div class='col-sm'></div></div>");
    $("#visBtnDiv1").append("<button type='button' class='btn btn-light' data-target=\"#visCarousel\" data-slide-to=\"0\"> &lt &ltChord Diagram</button>");
    $("#visBtnDiv2").append("<button type='button' class='btn btn-light' data-target=\"#visCarousel\" data-slide-to=\"1\">Image Explorer&gt &gt</button>");
    //build vis Carousel
    $("#visDiv").append("<div id=\"visCarousel\" class=\"carousel slide\" data-ride=\"carousel\" interval: false><div class=\"carousel-inner\" id='carousel_inner'></div></div>");
    $("#carousel_inner").append(" <div class=\"carousel-item active\"><div id='chordCarousel'></div></div>");
    $("#carousel_inner").append(" <div class=\"carousel-item\"><div id='tableCarousel'></div></div>");


    //add chord and table button
    buildChordSection($("#chordCarousel"),title, startDom, descCollection, sortedDomOrder.length, Object.keys(imgLang).length, statCt);

    initSortArea($("#tableCarousel"));
    // start table and build first row
    buildTableSection($("#tableCarousel"),title, startDom, sortedDomOrder, descCollection, pgIdCollection, pgImg, imgLang, filteredImg, statCt, remLL);

}

//called after query
function formatInfoIntoTable(title, startDom, sortedDomOrder, descCollection, pgIdCollection, pgImg, imgLang, filteredImg, statCt, remLL) {
    /*
     master function to format all relevent information into the web.
     only get executed if there's no existing version
     */
    //add overall stats
    // console.log(sortedDomOrder)
    //update navigation
    masterData["modal"] = {
        "introSection": {},
        "timeComparison": {},
        "imgCountVis": {},
        "imgVennVis": {},
        "revHistoryVis": {}
    };//USED to store modal related information
    initModal();
    buildTitle(title, startDom, descCollection, sortedDomOrder.length, Object.keys(imgLang).length, statCt);
    //add analyzeSection
    buildAnalyzeSection(title, startDom, sortedDomOrder, descCollection, pgIdCollection, pgImg, imgLang, filteredImg, statCt, remLL);

    updateTooltip();
    masterData["original_tableMainDiv"] = $("#tableMainDiv")[0];
    addScrolling();
}




