/*
created to add animation and storytelling configurations
use scroll reveal, for the tool page only
 */
var scrollSetting={duration:800,origin:'bottom',mobile: true};
//debugging utility: afterReveal: function (domEl) {console.log(domEl)}
var sequenceDelay=5;

function addScrolling() {
    window.sr = ScrollReveal({ reset: true });
    // console.log(scrollingComp);
    for (var i=0;i<scrollingComp.length;i++){

        var info=scrollingComp[i];
        // console.log(info);
        if(Array.isArray(info)){
            sr.reveal(info[0],info[1],sequenceDelay)
        }else{
            sr.reveal(info,scrollSetting,sequenceDelay)
        }

    }
}