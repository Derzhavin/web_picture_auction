import '../less/headers.less';

let buttonIdAndRoute = {
    "purchases": "/user-purchases",
    "bidding": "/user-bidding",
}

export function setupHeader() {
    $("div.header").find("button.redirectButton").get().forEach((button) => {
        if (document.location.href.includes(buttonIdAndRoute[button.name])) {
            $(button).css("background-color", "olivedrab");
            return;
        }
    });
}