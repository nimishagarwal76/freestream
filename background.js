var tabLink = {};
var tabRef = {};

chrome.webRequest.onBeforeRequest.addListener((details) => {
    let { tabId, url, method, initiator } = details;

    if (details.type == "main_frame") {
        let redirectUrl = chrome.extension.getURL('video.html') + "#" + details.url;
        return { redirectUrl }
    }

    if (method == "GET" && initiator.startsWith("http")) {
        if (tabLink[tabId]) {
            tabLink[tabId].push(url);
        } else {
            tabLink[tabId] = [url];
        }
        // tabRef[url] = initiator;

        if (tabLink[tabId].length == 1) {
            chrome.browserAction.setIcon({
                tabId,
                path: "icons/icon_128_yellow.png"
            });
        }
    }

}, { urls: ["*://*/*.m3u8*"] }, ["blocking"])

chrome.webRequest.onBeforeSendHeaders.addListener((details) => {
    
    let {tabId} = details;
    // console.log("da");
    let { url } = details,
        refIndex = details.requestHeaders.findIndex(header => header.name === "Referer");

    if(refIndex === -1 && tabRef[tabId]) {

            details.requestHeaders.push({ name: "Referer", value: tabRef[tabId] })
    }
    // let initiator = tabRef[url];
    // if (refIndex === -1 && initiator) {
    //     if(!initiator.endsWith("/")) initiator += "/";
    // }
    return { requestHeaders: details.requestHeaders };
}, { urls: ["*://*/*.m3u8*", "*://*/*.ts*"] }, ['requestHeaders', 'blocking', 'extraHeaders']);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    let { tabId } = message;
    let data;
    if (!tabLink[tabId]) data = [];
    else data = tabLink[tabId];
    if(message.msg) {
        tabRef[message.msg] = message.url;
    }

    sendResponse({ data })
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabLink[tabId]) delete tabLink[tabId];
})

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.url) {
        if (tabLink[tabId]) {
            tabLink[tabId] = [];
            chrome.browserAction.setIcon({
                tabId,
                path: "icons/icon_128_grey.png"
            });
        }
    }
});
