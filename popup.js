chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let pageUrl = tabs[0].url;
    

    var linkList = document.getElementById("links");

    var getLinkNode = (link) => {
        return `
    <div class="linkbox">
        <span class="link">${link}</span>
        <div class="icongroup">
            <img src="icons/newtab.png" class="icon" vidurl="${link}" id="newtab"/>
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

    linkList.addEventListener("click", (e) => {
        let url = e.target.getAttribute("vidurl");
        /**
         * HACK : need to pass tabId to background.js
         * selected = false helps that to happen else popup.js will close as focus changes
         * and information regarding referer won't be passed to background
         */
        chrome.tabs.create({ url, selected: false }, (tab) => {
            chrome.runtime.sendMessage({
                msg: tab.id,
                url: pageUrl
            })
        })
    })

});