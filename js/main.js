/**
 * Created by heslicia on 1/15/2018.
 * set up query forms
 * initiate query
 * get value query value
 * set up global data
 */

var masterData={};//all info
var scrollingComp=[];//a list of tags (class/id) that are scrolled
var nameDomMap={};//utility: edition names
var domNameMap={};

var imgExt = ['jpg', 'jpeg', 'jpe', 'gif', 'png', 'apng', 'bmp'];// not including svg to avoid icon images
//// EXTENSION_LIST = ['xcf', 'djvu', 'djv', 'jpg', 'jpeg', 'jpe', 'svg', 'pdf', 'gif', 'png', 'apng', 'bmp', 'tif', 'tiff']
var sizeLimit = 200;

//initial values for sorting and search
var rowOrder="By Image Name";
var colOrder="By Edition Name";
var initialDomain="(en) English";
// var initialTitle="Rice Cake";
// var initialTitle="Albert Einstein";
// var initialTitle="Feminism";
var initialTitle = "Rice cake";
// var initialTitle="Unit";
// var initialTitle="海賊 (ONE PIECE)";
var imgWidth="200px-";

//global ids
var modalId="mainmodal";
var introId="introSection";
var timeID="timeComparison";
var imgCtId="imgCountVis";
var imgVennId="imgVennVis";
var lenImgRatio='lengthImgRatio';

buildDomNameMapping(nameDomMap,domNameMap);
buildFormAndQueryPlatform();

function deleteExist() {
    /*
    after one query, if another query is submitted, delete all previous query information
     delete existing elements
     */
    var ids=["#title","#sortDiv","#tableMainDiv","#errorInQuery","#title_vis","#visDiv","#chordModal"];
    scrollingComp=[];
    for (var i =0;i<ids.length;i++){
        if ($(ids[i]).length!=0){
            $(ids[i]).remove()
        }
    }
}

function initQuery() {
    /*
    major function to be called when the query start.
    initiate a data storage (masterData),
    update searching info, delete existing element and start searching
     */
    masterData={};
    var startDom = $.trim($('#dom_select_btn').text()).slice(1,3);
    var title = $.trim($('#titleInput').val());
    masterData["startDom"]=startDom;
    masterData["title"]=title;
    //delete old elements
    deleteExist();
    mainQuery(title, startDom,masterData);

}

