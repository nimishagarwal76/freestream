var linkList = document.getElementById("links");

var getLinkNode = (link) => {
    let linkDiv = document.createElement("div");
    linkDiv.classList.add("linkbox");
    let span1 = document.createElement("span");
    span1.classList.add("link");
    span1.textContent = link;

    linkDiv.appendChild(span1);

    let icgDiv = document.createElement("div");
    icgDiv.classList.add("icongroup");
    let linkAnchor = document.createElement("a");
    linkAnchor.setAttribute("href", link);
    linkAnchor.setAttribute("target", "_blank");
    let newTabIcon = document.createElement("img");
    newTabIcon.setAttribute("src", "icons/newtab.png");
    newTabIcon.setAttribute("id", "newtab");
    newTabIcon.classList.add("icon");
    linkAnchor.appendChild(newTabIcon);
    icgDiv.appendChild(linkAnchor);

    linkDiv.appendChild(icgDiv);
    return linkDiv


    /*
    
    <div class="linkbox">
        <span class="link">${link}</span>
        <div class="icongroup">
            <a href="${link}" target="_blank"><img src="icons/newtab.png" class="icon" id="newtab"/></a>
        </div>
    </div>
     
    */
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tabId = tabs[0].id;
    chrome.runtime.sendMessage({ tabId }, (response) => {
        let { data } = response;
        if (data.length == 0) {
            linkList.textContent = "No streams found"
        } else {
            data.forEach(url => {
                linkList.appendChild(getLinkNode(url));
            })
        }
    });
});

