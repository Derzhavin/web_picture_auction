import '../less/headers.less'
import '../less/buttons.less'

let buttonIdAndRoute = {
    "purchases": "/user-purchases",
    "bidding": "/user-bidding",
}

let route = document.location.href;

$(document).ready(() => {
    setupHeader();
});

function setupHeader() {
    $("div.header").find("button.redirectButton").get().forEach((button) => {
        if (route.includes(buttonIdAndRoute[button.name])) {
            $(button).css("background-color", "olivedrab");
            return;
        }
    });
}