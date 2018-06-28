/**
 * Created by heslicia on 1/16/2018.
 * create page information of a particular
 */

//helpers
function initModal(){
    /*
    create a general modal if the original doesn't exist.
     */

    if ($("#"+modalId+"_div").length>0){
        //exist already, do nothing
        return
    }
    $("body").append("<div class='modal fade bd-example-modal-lg' id='"+modalId+"_div' tabindex='-1' role='dialog',aria-labelledby='"+modalId+"_title' aria-hidden='true'></div>")
    $("#"+modalId+"_div").append("<div class='modal-dialog modal-lg' role='document'><div class='modal-content'><div class='modal-header' id='"+modalId+"_header'></div><div class='modal-body' id='"+modalId+"_body'></div></div></div>")

    $("#"+modalId+"_header").append("<h5 class='modal-title' id='"+modalId+"_title'></h5><button type='button' class='close' data-dismiss='modal' aria-label='Close'><span aria-hiddne='true'>&times;</span></button>")


    $("#"+modalId+"_body").append("<div class='container-fluid' id='"+introId+"_containDiv'><div class='row'><div class='col-md-2'><h4 id='"+introId+"_domH2'></h4></div><div class='col-md-2'></div><div class='col-md-6'><a id='"+introId+"_titleA' target='_blank'> <h2 id='"+introId+"_titleH1'></h2></a></div></div><div class='row'><div class='col-lg-8' id='"+introId+"_infoDiv'><p id='"+introId+"_infoP'></p></div></div></div>");

}
function populateIntroSection(selectedDom) {
    //modify the modal information by adding the title

    //grab the infoSection, populate domain and title
    $("#"+introId+"_domH2").text(domNameMap[selectedDom]+" Wiki: ");
    //get pageId
    var pgId=masterData["pgIdCollection"][selectedDom];
    var title=masterData["remLL"][selectedDom];
    // console.log(pgId)
    $("#"+introId+"_titleA").attr("href",getPgUrl(selectedDom,pgId));
    $("#"+introId+"_titleH1").text(title);
    var info=selectedDom+" : "+title+" used "+masterData["domFilteredImg"][selectedDom].length+" qualified images. The page was created on "+masterData["domFirstRev"][selectedDom]["timestamp"]+" by user "+masterData["domFirstRev"][selectedDom]["user"]+".";
    $("#" + introId + "_infoDiv").append(info)

}
//main methods
function createSingleModal(info) {
    // var selectedDom=$(info).data('original-title')//when we have tooltip as toggles.
    var selectedDom=$(info).attr("title");
    selectedDom=$.trim(selectedDom.slice(0,selectedDom.indexOf(":")));
    //clean modal
    cleanModal();
    //Create the first section, intro section
    populateIntroSection(selectedDom)

}
