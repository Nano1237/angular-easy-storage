var rueckerGeld = undefined;

function onAppWindowCreated(appWindow) {
    appWindow.onClosed.addListener(onAppWindowClosed);
}
chrome.app.runtime.onLaunched.addListener(function () {
    chrome.app.window.create(
        "test.html", {
            id: "rueckerGeld",
            innerBounds: {width: 360, height: 200},
            resizable: false
        }, onAppWindowCreated);
});

function onAppWindowClosed() {
    if (rueckerGeld) {
        rueckerGeld.disconnect();
    }
    window.close();
}