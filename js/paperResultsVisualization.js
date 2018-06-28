/*
Created to visualize results from the table
Including several heatmaps, ranked information and comparisons(scatter plot)
 */
//helpers
function createPanels(desID) {
    var sectionData=[{"id":"basic","fill":"#decef5"},{"id":"concept_deg","fill":"#E9F3F5"},{"id":"concept_pw","fill":"#D9E2EA"},{"id":"sub_pw","fill":"#E7EDF0"}];
    // var sectionData=["blue","yellow","green"];
    svgG.selectAll("g.panel")
        .data(sectionData)
        .enter()
        .append("g")
        .attr("class","panel")
        .attr("id",function (d,i) {
            return d["id"]+"_panel"
        })
        .attr("transform",function (d,i) {
            return "translate(0,"+(i*space.sectionHeight)+")"
        })
        .append("rect")
        .attr("id",function (d,i) {
            return d["id"]+"_rect"
        })
        .attr("fill",function (d){return d["fill"]})
        .attr("x",0)
        .attr("y",0)
        .attr("width",space.width)
        .attr("height",space.sectionHeight)
        .style("opacity",0.5);

    d3.select("#"+desID)
        .selectAll("div.description")
        .data(sectionData)
        .enter()
        .append("div")
        .attr("class","description")
        .attr("id",function (d) {
            return d["id"]+"_description"
        })
}
function addScenesToScroll() {
    $(function () {
        for (var i=0;i<sceneCollection.length;i++){
            sceneCollection[i].addTo(scrollController)
        }
    })
}

//animation plan
//helper vis


// /plotter

//setup


function setUpSpaceAndSvg(selectorID,visRatio) {
    /*
    set up a vertical svg for long scrolling
     */
    var margin = {top: 20, right: 20, bottom: 20, left:20},
        width = (window.innerWidth - margin.left - margin.right)*visRatio,
        sectionHeight = (window.innerHeight - margin.top - margin.bottom);

    var x=d3.scaleLinear().range([0,width]);
    var y=d3.scaleLinear().range([sectionHeight,0]);
    window.space={"x":x,"sectionY":y,"width":width,"sectionHeight":sectionHeight,"margin":margin};
    window.scales={};

    window.svg = d3.select("#"+selectorID)
        .append("div")
        .attr("id","svgDiv")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", (sectionHeight + margin.top + margin.bottom)*4)
        .attr("id","main_svg");

    window.svgG=svg.append("g")
        .attr("id","mainSvg")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
}
//major methods
function initCharts() {
    /*
    major method to be called for the chart
     */
    d3.json("paperResults/mergedData.json", function(error, data) {
        if (error) throw error;
        window.data=data;
        // console.log()
        console.log(d3.sum(data["edition_deg"],function (d) {
            return d.imgCt
        }));
        makeBasicChart();
        makeConcept_degChart();
        // addScenesToScroll();//called in the last line
    });
}


function main() {
    //add navigation
    generateNavigationBar($("body"));
    //set up title://TODO
    // generateHeader();
    //set up  display spaces
    $("body").append("<div id='visDiv' class='container'></div>");
    generateContainerDiv($("#visDiv"),"visRow",[3,9]);
    $("#visDiv").addClass("lessPadding");
    var visRatio=0.8;
    setUpSpaceAndSvg("visRow_col-1",visRatio);
    createPanels("visRow_col-0");//create rect background and left bars

    window.scrollController = new ScrollMagic.Controller();
    window.sceneCollection=[];
    initCharts();
    window.visData={}
    // console.log(sceneCollection)

}
main();