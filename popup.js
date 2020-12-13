var linkList = document.getElementById("links");

var getLinkNode = (link) => {
    return `
    <div class="linkbox">
        <span class="link">${link}</span>
        <div class="icongroup">
            <a href="${link}" target="_blank"><img src="icons/newtab.png" class="icon" id="newtab"/></a>
        </div>
    </div>
    `
}

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let tabId = tabs[0].id;
    chrome.runtime.sendMessage({ tabId }, (response) => {
        let { data } = response;
        if (data.length == 0) {
            linkList.innerHTML = "<center>No streams found</center>"
        } else {
            data.forEach(url => {
                linkList.innerHTML += getLinkNode(url);
            })
        }
    });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        linkList.innerHTML += JSON.stringify(request);

    }
);
