/**
 * Created by heslicia on 1/10/2018.
 * deal with basic query parts
 */
// ----basic helpers
function getLLfilter() {
    /*
     by default, return 25 languages we are using
     could support more customized filter later.
     */
    return new Set(['en', 'uk', 'ru', 'pl', 'no', 'nl', 'ja', 'it', 'de', 'fi', 'sv', 'es', 'zh', 'ca', 'fr', 'pt', "cs", "da", "he", "hu", "id", "ko", "ro", "sk", "tr"])
}
function getFullDomName() {
    return ["English", "Ukrainian", "Russian", "Polish", "Norwegian", "Dutch", "Japanese", "Italian", "German", "Finnish", "Swedish", "Spanish", "Chinese", "Catalan", "French", "Portuguese", "Czech", "Danish", "Hebrew", "Hungarian", "Indonesian", "Korean", "Romanian", "Slovak", "Turkish"]
}
function buildDomNameMapping(nameDomMap, domNameMap) {
    var array = ['en', 'uk', 'ru', 'pl', 'no', 'nl', 'ja', 'it', 'de', 'fi', 'sv', 'es', 'zh', 'ca', 'fr', 'pt', "cs", "da", "he", "hu", "id", "ko", "ro", "sk", "tr"]
    var name = ["English", "Ukrainian", "Russian", "Polish", "Norwegian", "Dutch", "Japanese", "Italian", "German", "Finnish", "Swedish", "Spanish", "Chinese", "Catalan", "French", "Portuguese", "Czech", "Danish", "Hebrew", "Hungarian", "Indonesian", "Korean", "Romanian", "Slovak", "Turkish"]

    for (var i = 0; i < name.length; i++) {
        domNameMap[array[i]] = name[i]
        nameDomMap[name[i]] = array[i]
    }
}
//-----filters
function jsonpAjax(url) {
    return $.ajax({
        url: url,
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        }
    })
}
function heuristicFilter(imgInfo) {
    /*
     taken an img info object, return true if it is considered as an administrative image.
     filter "wikipedia", "commons","mediawiki", and anything that has one of width/height less than 200.
     */
    var title = imgInfo["canonicaltitle"].toLowerCase();
    var height = parseInt(imgInfo["height"]);
    var width = parseInt(imgInfo["width"]);
    var forbidWords = ["wikipedia", "commons"];
    for (var i = 0; i < forbidWords.length; i++) {
        if (title.indexOf(forbidWords[i]) != -1) {
            return true
        }
    }
    if (width < sizeLimit || height < sizeLimit) {
        return true
    }
    return false
}
// --------experimental features
function findImageCategory(imgTitle, returnId) {
    /*
     Works for commons only. Will go query an image and find out its images.
     */
    //TODO: process image titles to make sure non-english characters works
    jsonUrl = "https://commons.wikimedia.org/w/api.php?action=query&prop=categories&titles=File%3A" + imgTitle + "&format=json";

    $.ajax({
        url: "https://commons.wikimedia.org/w/api.php?action=query&prop=categories&lllimit=max&titles=File%3AIcon_of_All_Saints_by_Simeon_Khromoy.jpg&format=json",
        jsonp: "callback",
        dataType: "jsonp",
        data: {
            format: "json"
        },
        success: function (response) {
            if (response["query"]["pages"] != undefined) {
                var pgInfo = response["query"]["pages"];
                var pgId = Object.keys(pgInfo)[0];
                var categoryDict = pgInfo[pgId]["categories"];
                var categories = [];
                var cLength = "Category:".length;
                var catN = categoryDict.length;
                var categoryLinkedInfo = "";
                // process categories
                for (var i = 0; i < catN; i++) {
                    var cat = categoryDict[i.toString()]["title"].slice(cLength)
                    categories.push(cat);
                    categoryLinkedInfo += "<a href=https://commons.wikimedia.org/wiki/Category:" + encodeURIComponent(cat) + ">" + cat + " | </a>"
                }
                $("#" + returnId).append(categoryLinkedInfo);
            }


        }

    });
}

////get urls for images
function makeDescUrl(title, startDom) {
    return "https://" + startDom + ".wikipedia.org/w/api.php?action=query&formatversion=2&prop=pageterms&titles=" + encodeURIComponent(title) + "&format=json";
}
function makeLlUrl(title, startDom) {
    return "https://" + startDom + ".wikipedia.org/w/api.php?action=query&prop=langlinks&lllimit=max&titles=" + encodeURIComponent(title) + "&format=json";

}
function makeImgUrl(dom, title) {
    /*
     create url for image query
     */
    /*
     create url for image query
     */
    return "https://" + dom + ".wikipedia.org/w/api.php?action=query&formatversion=2&prop=images&imlimit=max&titles=" + encodeURIComponent(title) + "&format=json";
}
function makeImgQueryUrl(imgName) {
    /*
     return something like:
     // https://www.mediawiki.org/w/api.php?action=query&titles=File:23_Albert_Einstein_visit%C3%A0_l%27Escola_Industrial.jpg&prop=imageinfo&iiprop=size|url|timestamp|userid|canonicaltitle&format=json
     */
    return "https://www.mediawiki.org/w/api.php?action=query&titles=File:" + encodeURIComponent(imgName) + "&prop=imageinfo&iiprop=size|url|timestamp|userid|user|canonicaltitle&format=json"
}
function makeFirstRevUrl(dom, title) {
    return "https://" + dom + ".wikipedia.org/w/api.php?action=query&prop=revisions&titles=" + encodeURIComponent(title) + "&rvlimit=1&rvprop=timestamp|userid|user|ids&rvdir=newer&format=json"
}

//----process
function processDesc(descProm) {
    /*
     GIVE BACK TERM INFORMATION
     */
    var response = descProm[0];
    try {
        var des = response["query"]["pages"][0]["terms"]["description"][0];
        return des
    } catch (err) {
        return ""
    }
}
function processLangLink(llProm, pgIdCollection, startDom, statCt) {
    /*
     given an array of language links in the structure
     {lang: "li", *: "Albert Einstein"}, filter by a list of languages.
     Currently, using 25 languages.
     */
    var response = llProm[0]
    // console.log
    var pgs = response["query"]["pages"];
    var pgid = Object.keys(pgs)[0];
    pgIdCollection[startDom] = pgid;
    var llArray = pgs[pgid]["langlinks"];
    statCt["llCt"] = llArray.length+1;


    var filter = getLLfilter();
    // console.log(filter)
    var remLL = {};
    for (var ll of llArray) {
        // console.log(ll["lang"] );
        if (filter.has(ll["lang"].toLowerCase())) {
            remLL[ll["lang"]] = ll["*"]
        }
    }
    statCt["remLL"] = Object.keys(remLL).length+1;
    return remLL
}
function processImgProms(imgProms, imgLang, pgImg, sortedDomOrder, pgIdCollection, statCt) {
    /*
     given a language link in the format {"lang":en, "*":title}, find out all images it has and append it to an image-language dictionary.
     */
    var fileSet = new Set()
    masterData["fileSet"] = fileSet
    for (var i = 0; i < sortedDomOrder.length; i++) {
        var response = imgProms[i][0];
        var dom = sortedDomOrder[i];

        var pgId = response["query"]["pages"][0]["pageid"];
        // console.log(dom,pgId,response["query"]["pages"][0])
        var imgs = response["query"]["pages"][0]["images"];

        if (imgs == null) {
            statCt["emptyPg"] += 1;
        } else {
            // console.log(imgs)
            pgIdCollection[dom] = pgId;
            pgImg[dom] = []
            for (var j = 0; j < imgs.length; j++) {
                var imgObj = imgs[j]

                var imgRaw = imgObj["title"];

                var img = imgRaw.slice(imgRaw.indexOf(":") + 1);
                fileSet.add(img)
                var imgExtension = img.slice(img.lastIndexOf(".") + 1).toLowerCase();
                if (imgExt.indexOf(imgExtension) != -1) {
                    // console.log(imgExtension);
                    pgImg[dom].push(img);
                    if (img in imgLang) {
                        imgLang[img].add(dom)
                    } else {
                        imgLang[img] = new Set();
                        imgLang[img].add(dom)
                    }
                }
            }
        }
    }

    statCt["fileCt"] = fileSet.size
}
function processImgUrl(imgUrlProms, imgNameSorted, removedImgs, filteredImg, failedImgs, imgLang, domFilteredImg, statCt) {
    /*
     take the query result, extract url, description, size,
     canonicaltitle
     descriptionshorturl
     descriptionurl
     height
     size
     timestamp
     url
     userid
     width
     */
    // console.log(imgUrlProms[0])
    for (var i = 0; i < imgUrlProms.length; i++) {
        var imgTitle = imgNameSorted[i];
        var response = imgUrlProms[i][0];
        var domsSet = imgLang[imgTitle];
        var imageInfoA = response["query"]["pages"]["-1"]["imageinfo"];
        // console.log(response)
        if (imageInfoA != undefined) {
            var imgObj = imageInfoA[0];
            // console.log(imgObj)
            var isAdmin = heuristicFilter(imgObj);
            if (isAdmin) {
                statCt["adminCt"] += 1;
                removedImgs.push(imgTitle)
            } else {
                var title = imgObj["canonicaltitle"];
                var img = title.slice(title.indexOf(":") + 1);
                filteredImg[img] = imgObj;
            }
        } else {
            statCt["failedImg"] += 1;
            failedImgs.push({"title": imgTitle, "queryUrl": makeImgQueryUrl(imgTitle)})
            domsSet.forEach(function (dom) {
                // console.log("remove",imgTitle,domFilteredImg[dom].length)
                removeFromArray(imgTitle, domFilteredImg[dom])
                // console.log(domFilteredImg[dom].length)
            });

        }
    }
    var doms = Object.keys(domFilteredImg)
    masterData["noQualDom"] = []
    for (dom of doms) {
        if (domFilteredImg[dom].length == 0) {
            masterData["noQualDom"].push(dom)
            statCt["noQualDomCt"] += 1;
            delete domFilteredImg[dom]
        }
    }
    // console.log(filteredImg)
}
function processFirstRev(fRevProms, domFirstRev, sortedDomOrder) {
    /*
     take the first rev query result
     */
    for (var i = 0; i < sortedDomOrder.length; i++) {
        var dom = sortedDomOrder[i];
        var response = fRevProms[i][0];
        if (response == undefined) {
            response = fRevProms[0]
        }
        // console.log(response)
        var pgs = response["query"]["pages"]
        var pgId = Object.keys(pgs)[0]
        domFirstRev[dom] = pgs[pgId]["revisions"][0]

    }
}


//-----sort functions
function alphabetDomSort() {
    masterData["sortedDomOrder"].sort()
}
function imgCtDomSort() {
    // console.log(masterData["sortedDomOrder"]);
    masterData["sortedDomOrder"].sort(function (a, b) {
        var domFilteredImg = masterData["domFilteredImg"];
        var aCt = domFilteredImg[a].length;
        var bCt = domFilteredImg[b].length;
        return bCt - aCt
    })
}
function alphabetImgSort() {
    masterData["sortedImg"].sort()
}
function timeStampImgSort() {
    masterData["sortedImg"].sort(function (a, b) {
        var imgObjA = new Date(masterData["filteredImg"][a]["timestamp"])
        var imgObjB = new Date(masterData["filteredImg"][b]["timestamp"])
        return imgObjB - imgObjA
    })
}
function imgSizeSort() {
    masterData["sortedImg"].sort(function (a, b) {
        var sizeA = masterData["filteredImg"][a]["size"]
        var sizeB = masterData["filteredImg"][b]["size"]
        return sizeB - sizeA
    })
}
function imgPageCtSort() {
    masterData["sortedImg"].sort(function (a, b) {
        var pgCtA = masterData["imgLang"][a].size
        var pgCtB = masterData["imgLang"][b].size
        // console.log(pgCtA,pgCtB)
        return pgCtB - pgCtA
    })
}
function pgDateSort() {
    /*
     sort by date
     */
    masterData["sortedDomOrder"].sort(function (a, b) {
        // console.log(masterData["domFirstRev"],a)
        var pgDateA = new Date(masterData["domFirstRev"][a]["timestamp"])
        var pgDateB = new Date(masterData["domFirstRev"][b]["timestamp"])
        // console.log(pgDateA)
        return pgDateA - pgDateB
    })

}

// ------main
function mainQuery(title, startDom, masterData) {
    /*
     manage all together
     1. query description
     2. query language link
     3. filter edition
     4. for every edition, images (second level)
     5. format all information.
     */

    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
    });
    console.log(title, startDom)
    // console.log(makeDescUrl(title, startDom))
    var descriptionAjax = jsonpAjax(makeDescUrl(title, startDom));
    var langLinkAjax = jsonpAjax(makeLlUrl(title, startDom));
    var statCt = {
        //important:edited the remLL and LLcount to include the starting domain
        "llCt": 1,
        "remLL": 1,
        "fileCt": 0,
        "imgCt": 0,
        "adminCt": 0,
        "failedImg": 0,
        "emptyPg": 0,
        "noQualDomCt": 0
    };
    masterData["statCt"] = statCt;
    // console.log(makeDescUrl(title, startDom))
    $.when(descriptionAjax, langLinkAjax).done(function (descProm, langlinkProm) {
        //getting description
        var descCollection = {};
        masterData["descCollection"] = descCollection;
        try {
            descCollection[startDom] = processDesc(descProm);

            // console.log(descCollection[startDom])

            //getting language link
            var pgIdCollection = {};
            masterData["pgIdCollection"] = pgIdCollection;
            var remLL = processLangLink(langlinkProm, pgIdCollection, startDom, statCt);//include filtering.
            remLL[startDom] = title;
            masterData["remLL"] = remLL;

            masterData["sortedDomOrder"] = Object.keys(remLL)
            var sortedDomOrder = masterData["sortedDomOrder"]
            sortedDomOrder.sort()
            // console.log(sortedDomOrder);
            //for each language, go check it's images.
            var imgAjaxs = [];

            for (dom of sortedDomOrder) {
                imgAjaxs.push(jsonpAjax(makeImgUrl(dom, remLL[dom])))
            }
            // storage=[]
            $.when.apply($, imgAjaxs).done(function () {

                var imgProms = arguments;
                // console.log(imgProms[0])
                var imgLang = {};
                var pgImg = {};
                masterData["imgLang"] = imgLang;
                masterData["pgImg"] = pgImg;
                //get page image, imgLang
                processImgProms(imgProms, imgLang, pgImg, sortedDomOrder, pgIdCollection, statCt);

                //need to do another query to filter out invalid image, images that are too small, images with known filter words
                var imgUrlAjax = [];

                var imgNameSorted = Object.keys(imgLang).sort();
                masterData["imgNameSorted"] = imgNameSorted;
                statCt['imgCt'] = imgNameSorted.length;
                // console.log(imgNameSorted)
                for (var j = 0; j < imgNameSorted.length; j++) {
                    var imgName = imgNameSorted[j];
                    // console.log(imgName)
                    imgUrlAjax.push(jsonpAjax(makeImgQueryUrl(imgName)));
                }
                var filteredImg = {};
                masterData["filteredImg"] = filteredImg;
                $.when.apply($, imgUrlAjax).done(function () {
                    var imgUrlProms = arguments;
                    // console.log(imgUrlProms[0])

                    var removedImgs = [];
                    masterData["removedImgs"] = removedImgs;
                    var failedImgs = [];
                    masterData["failedImgs"] = failedImgs;
                    var domFilteredImg = Object.assign({}, pgImg);
                    masterData["domFilteredImg"] = domFilteredImg;

                    processImgUrl(imgUrlProms, imgNameSorted, removedImgs, filteredImg, failedImgs, imgLang, domFilteredImg, statCt);
                    statCt["remImgCt"] = Object.keys(filteredImg).length;
                    masterData["sortedDomOrder"] = Object.keys(domFilteredImg);
                    // console.log(masterData["sortedDomOrder"])
                    sortedDomOrder = masterData["sortedDomOrder"]
                    sortedDomOrder.sort();
                    //query page histories, user remLL to get the first timestamp.
                    var domFirstRev = {};
                    masterData["domFirstRev"] = domFirstRev;
                    var firstRevAjaxs = [];
                    for (var j = 0; j < sortedDomOrder.length; j++) {
                        var dom = sortedDomOrder[j];
                        var queryTitle = remLL[dom];
                        firstRevAjaxs.push(jsonpAjax(makeFirstRevUrl(dom, queryTitle)))
                    }
                    $.when.apply($, firstRevAjaxs).done(function () {
                        var fRevProms = arguments;
                        // console.log(fRevProms[0])
                        processFirstRev(fRevProms, domFirstRev, sortedDomOrder)


                        // ///FINISH ALL QUERY, START FORMATTING.
                        // console.log(sortedDomOrder)
                        formatInfoIntoTable(title, startDom, sortedDomOrder, descCollection, pgIdCollection, pgImg, imgLang, filteredImg, statCt, remLL)
                    })
                })
            });
        } catch (err) {
            initErrorDiv(err)
        }
    })


}
