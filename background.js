/* copy from index.js, change to tab listener */

// @ts-check
const namespace = '__chrome-highlight-heading-ext__';
let checkPageButton;
const state = {
    isActive: false,
};

function getTabs(tabs) {
    const currentTab = tabs[0].id;
    chrome.tabs.sendMessage(currentTab, {namespace, state}, undefined, handleResponse);
}

function getInitialState(tabs) {
    const currentTab = tabs[0].id;
    // not sending state - thus indicating initial handshake
    chrome.tabs.sendMessage(currentTab, {namespace}, undefined, handleResponse);
}

function triggerMessage(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true,
    }, callback);
}

function setButtonText() {
    checkPageButton.innerText = state.isActive ? 'Un-highlight Headings' : 'Highlight Headings';
}

function handleResponse(response) {
    state.isActive = !!response;
    setButtonText();
}

// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
//     state.isActive = false;
//     if (!(changeInfo.status == "unloaded" || changeInfo.status == "loading")) {
//         triggerMessage(getInitialState);
//         triggerMessage(getTabs);
//     }
// });

// action when extension icon is clicked
chrome.action.onClicked.addListener(() => {
    triggerMessage(getTabs);
});
