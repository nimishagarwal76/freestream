var tabLink = {};

chrome.webRequest.onBeforeRequest.addListener((details) => {
    console.log(details);
    let { tabId, url, method } = details;

    if (details.type == "main_frame") {
        var redirectUrl = chrome.extension.getURL('video.html') + "#" + details.url;
        console.log(redirectUrl);
        return { redirectUrl }
    }

    if (method == "GET") {
        if (tabLink[tabId]) tabLink[tabId].push(url);
        else tabLink[tabId] = [url];
    }

}, { urls: ["*://*/*.m3u8*"] }, ["blocking"])


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let { tabId } = message;
    console.log("popup is asking in background")
    console.log(tabId);
    // console.log(tabLink[tabId]);
    let data;
    if (!tabLink[tabId]) data = [];
    else data = tabLink[tabId];

    sendResponse({ data })
});

chrome.tabs.onRemoved.addListener((tabId) => {
    if(tabLink[tabId]) delete tabLink[tabId];
})
