

//////////////svg text
function addStoryLineSVG(panelId,storyContent) {//,aosSetting,chained
    var textLine=d3.select("#"+panelId)
        .selectAll("text.story")
        .data(storyContent)
        .enter()
        .append('text')
        .text(function (d) {
            return d.t
        })
        .attr('class',function (d,i) {
            return "centerAnchor "+d["c"]
        })
        .attr('id',function (d,i) {
            d["id"]=panelId+"_s_"+i;
            return panelId+"_s_"+i
        })
        .attr('x',0)
        .attrs(function (d) {
            return d.attrs
        })
        .styles(function (d) {
            return d.styles
        })
        .call(centerWrap,space.width-space.margin.top*5,(space.width-space.margin.top*5)/2);


    textLine.attr('y',function (d,i) {
        if(i==0){
            return space.margin.top*4
        }
        var prevText=d3.select("#"+panelId+"_s_"+(i-1));
        var prevY=parseFloat(prevText.attr("y")),
            prevLine=prevText.node().childElementCount;

        return prevY+storyFontSize*2*prevLine
    });

    for (var i=0;i<storyContent.length;i++){
        if(i==0){
            var triggerElement="#panel0";
        }else{
            var triggerElement="#"+panelId+"_s_"+(i-1)
        }
    }
}
function buildStoryOneSVGversion(section1) {
    var animationSec=2;
    var opacityTween=TweenMax.to("#panel_rect0",animationSec,{opacity:1});
    var scene1= new ScrollMagic.Scene({
        triggerElement: "#"+section1[0]["trigger"],
        triggerHook:0,duration:100
    })
        .setTween(opacityTween)
        .addIndicators({name:"story1"});
    var pinTween=TweenMax.to("#"+section1[0]["id"],animationSec,{opacity:1});
    var scene2=new ScrollMagic.Scene({
        triggerElement: '#panel0'
    })
        .addIndicators()
    // var sizeShrinkTween=TweenMax.to("#"+section1[0]["id"],animationSec,{transformation:"scale(0.5)"});
    sceneCollection.push(scene1)
    sceneCollection.push(scene2)
    //todo pin still doesn't work
}
/////////////////
Scroll magic is a powerful lib, but the pinning method would fail for svg because 1) <div> element 2) positioning styles are not suitable for svg elements



//svg-scroll//hard to control percentage
var wrappedElement = new svgScroll.ScrollWrapper('#story1');
document.addEventListener('DOMContentLoaded', wrappedElement.hide, false);

window.addEventListener("scroll", function(e) {
    wrappedElement.reveal([0, 0.1], [0, 1]);
    wrappedElement.changeOnScroll([0.1, 0.2], 'stroke', ['#bc3c2f', '#ecd093']);
    wrappedElement.changeOnScroll([0.2, 0.3], 'opacity', [1, 0]);
});
//scroll reveal: hard control where the item shows
window.sr=ScrollReveal({ duration: 2000,origin:'top',mobile: true,afterReveal: function (domEl) {console.log(domEl)}});
function addPanelScroll() {
    /*
    not really successfull
    need to rework //todo
     */
    for (var i=0;i<3;i++){
        var panelId="#panel_rect"+i;
        var ScrollWrapper = svgScroll.ScrollWrapper;
        var wrappedElement =new ScrollWrapper(panelId);
        var pec=0.8;

        window.addEventListener("scroll", function(e) {
            //when hitting the box, show up
            wrappedElement.changeOnScroll([i*pec, (i+1)*pec],"opacity",[0.1,1]);
            //when passed, hide
            wrappedElement.changeOnScroll([i+1*pec, Math.min(1,(i+2)*pec)],"opacity",[1,0.1]);
        });
    }

}
function addScrollAnimation() {
    /*test scroll magic
     */
    $(function () {
        var controller=new ScrollMagic.Controller({
            globalSceneOptions:{
                triggerHook:'onLeave'
            }
        });
        var slides=document.querySelectorAll("g.panel");
        for (var i=0;i<slides.length;i++) {
            new ScrollMagic.Scene({
                triggerElement: slides[i]
            })
                .setPin(slides[i])
                .addTo(controller)
        }

    })
}


// sr.reveal(".story");
sr.reveal("#story0");
sr.reveal("#story1");
sr.reveal("#story2");
// sr.reveal(".story",{container:'#panel0'});

window.sr = ScrollReveal();
//SUPER ANNOYING CENTER WRAP
.attr("x",function (d,i) {
    if(i==0){
        return space.margin.top*4
    }
    var thisText=d3.select(this);
    var prevText=d3.select("#story"+(i-1));
    var preWidth=prevText.node().getComputedTextLength()
    var preX=parseFloat(prevText.attr("x"));
    var currentWidth=thisText.node().getComputedTextLength();
    //check if previous text is wrapped
    if(preWidth+preX+currentWidth > space.width-space.margin.top*5){
        return space.margin.top*4
    } else{
        return (storyFontSize/2+preX+preWidth)
    }
})
    .attr("y",function (d,i) {
        if(i==0){
            return space.margin.top*4
        }
        var thisText=d3.select(this);
        var prevText=d3.select("#story"+(i-1));
        var preY=parseFloat(prevText.attr('y'));
        var preX=parseFloat(prevText.attr("x"));
        var currentX=parseFloat(thisText.attr('x'));
        var tspanNodes=prevText.node().childNodes;

        console.log(tspanNodes)
        console.log(prevText.selectAll(".wrap").size())
        // console.log()
        console.log(tspanNodes["length"])

        for (node in tspanNodes.keys()){
            console.log(node)
        }
        if (tspanNodes.length>1){
            console.log('larger')
            var startPosition=preY+(tspanNodes.length+1)*2*(storyFontSize)
        }else{
            startPosition=preY
        }
        if(currentX <= preX){
            console.log(i,startPosition,preY,tspanNodes.length)
            //switching to new line
            return startPosition+2*(storyFontSize)
        } else{
            //continue
            return startPosition
        }
    })



///scrollreveal:
<script>
// init controller
var controller = new ScrollMagic.Controller();
</script>
</section>
<section class="demo">
    <div class="spacer s2"></div>
    <div id="trigger1" class="spacer s0"></div>
    <div id="pin1" class="box2 blue">
    <p>Stay where you are (at least for a while).</p>
</div>
<div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <div class="spacer s2"></div>
    <script>
    $(function () {
        var scene = new ScrollMagic.Scene({triggerElement: "#trigger1", duration: 300})
            .setPin("#pin1")
            .addIndicators({name: "1 (duration: 300)"}) // add indicators (requires plugin)
            .addTo(controller);
    });
</script>
<!--</section>-->
<!--<section class="demo">-->
<!--<div class="spacer s2"></div>-->
    <!--<div id="trigger2" class="spacer s0"></div>-->
    <!--<div id="pin2" class="box2 blue">-->
    <!--<p>Take me with you!</p>-->
<!--</div>-->
<!--<div class="spacer s2"></div>-->
    <!--<script>-->
    <!--$(function () { // wait for document ready-->
    <!--// build scene-->
        <!--var scene = new ScrollMagic.Scene({triggerElement: "#pin2"})-->
        <!--.setPin("#pin2")-->
        <!--.addIndicators({name: "2 (duration: 0)"}) // add indicators (requires plugin)-->
        <!--.addTo(controller);-->
        <!--});-->
<!--</script>-->
<!--</section>-->
