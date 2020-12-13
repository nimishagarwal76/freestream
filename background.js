var tabLink = {};

chrome.webRequest.onBeforeRequest.addListener((details) => {
    let { tabId, url, method } = details;

    if (details.type == "main_frame") {
        let redirectUrl = chrome.extension.getURL('video.html') + "#" + details.url;
        return { redirectUrl }
    }

    if (method == "GET") {
        if (tabLink[tabId]) {
            tabLink[tabId].push(url);
        } else {
            tabLink[tabId] = [url];
        }

        if (tabLink[tabId].length == 1) {
            chrome.browserAction.setIcon({
                tabId,
                path: "icons/icon_128_yellow.png"
            });
        }
    }

}, { urls: ["*://*/*.m3u8*"] }, ["blocking"])


chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    let { tabId } = message;
    let data;
    if (!tabLink[tabId]) data = [];
    else data = tabLink[tabId];

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
