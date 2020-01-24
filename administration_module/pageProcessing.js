let buttonIdAndRoute = {
    "artsRedirect": "/arts",
    "participantsRedirect": "/participants",
    "settingsRedirect": "/settings"
}

let route = document.location.href;
let edited = [];

$(document).ready(() => {
    setupHeader();
    hideInstance();
    $("input.fileInput").get().forEach(input => input.onchange = addArt);
});

function setupHeader() {
    $("#header").children().get().forEach((button) => {
        if (route.includes(buttonIdAndRoute[button.id])) {
            $(button).css("background-color", "olivedrab");
        }
    });
}

function hideInstance() {
    if (!route.includes('/settings')) {
        $("div:eq(2)").hide();
    }
}

function activateButtonsWhenInputsFilled(inputs, buttons) {
    inputs.forEach(outerInput => outerInput.addEventListener('keyup', () => {
        let empty = false;
        inputs.forEach(innerInput => {
            if (innerInput.value === "") {
                empty = true;
            }
        });

        buttons.forEach(button => {
            $(button).prop("disabled", empty);
        });
    }));
}

function getDataFromDiv(div) {
    let data = {};
    $(div).find("input").get().forEach(input => {
        data[input.name] = input.value;
    });

    return data;
}

function edit(button) {
    let divForm = $(button).parent("div");
    edited.push(divForm.get()[0]);

    if (!route.includes("/settings")) {
        $(divForm.find("button[name=remove]").get()[0]).prop("disabled", true);
    }

    let inputs = divForm.find("input").get();
    inputs.forEach(input => {$(input).prop("disabled", false);});

    let applyButton = divForm.find("button[name=apply]").get()[0];
    $(applyButton).prop("disabled", false);
    $(divForm.find("img[name=check]").get()[0]).prop("src", "/imgs/writing.png");

    $(button).prop("disabled", true);

    activateButtonsWhenInputsFilled(inputs, [applyButton]);
}

function remove(button) {
    let divToRemove = null;

    if (route.includes("/arts")) {
        divToRemove =  $(button).closest("div").parent("div");
    } else {
        divToRemove = $(button).closest("div");
    }

    let img = divToRemove.find("img[name=check]").get()[0];


    let success = (result) => {
        if (result.status === 200) {
            $(img).prop("src", "/imgs/success.png");
            divToRemove.remove();
        } else {
            $(img).prop("src", "/imgs/failure.png");
        }

        alert(result.msg);
    }

    ajaxRequest(route, "DELETE", getDataFromDiv(divToRemove), () => addWaitGif(divToRemove), success);
}

function apply(button) {
    let divToApply = $(button).parent("div");

    let isSettings = route.includes("/settings");
    let isEdited = edited.includes(divToApply.get()[0]);
    let method = (isEdited || isSettings) ? "PUT": "POST";
    let img = divToApply.find("img[name=check]").get()[0];

    let removeButton = divToApply.find("button[name=remove]").get()[0];

    if (!isSettings) {
        $(removeButton).prop("disabled", true);
    }

    let success = (result) => {
        if (result.status === 200) {
            $(img).prop("src", "/imgs/success.png");

            if (isEdited) {
                edited.splice(divToApply, 1);
            }

            if (!isSettings) {
                $(removeButton).prop("disabled", false);
                divToApply.find("button[name=erase]").prop("disabled", true);
            }

            if (route.includes("/arts")) {
                divToApply.parent("div").find("img").get()[0].src= divToApply.find("input[name=way]").get()[0].value;
            }

            $(button).prop("disabled", true);
            $(divToApply.find("button[name=edit").get()[0]).prop("disabled", false);
            divToApply.find("input").get().forEach(input => $(input).prop("disabled", true));

        } else {
            $(img).prop("src", "/imgs/failure.png");
        }

        alert(result.msg);
    }

    let beforeSend = () => {divToApply.find("button[name=erase]").prop("disabled", true); addWaitGif(divToApply);}
    ajaxRequest(route, method, getDataFromDiv(divToApply), beforeSend, success);
}

function addNew(button) {
    let instanceDiv = $("div:eq(2)").clone();
    instanceDiv.show();

    let inputs = instanceDiv.find("input").get();
    let applyButton = instanceDiv.find("button[name=apply]").get()[0];
    activateButtonsWhenInputsFilled(inputs, [applyButton]);

    if (route.includes("/arts")) {
        let img = $(instanceDiv).find("img").get()[0];
        applyButton.addEventListener("click", () => {img.src = instanceDiv.find("input[name=way]").get()[0].value;});
    }

    $(button).after(instanceDiv);
}

function erase(button) {
    let divToErase = null;

    if (route.includes("/arts")) {
        divToErase = $(button).parent("div.artOuterDiv");
    } else {
        divToErase = $(button).parent("div");
    }

    divToErase.remove();
}
function ajaxRequest(url, type, data, beforeSend, success) {
    $.ajax({
        url: url,
        type: type,
        dataType: "json",
        data: data,
        beforeSend: beforeSend,
        success: success
    });
}

function addWaitGif(div) {
    let img = div.find("img[name=check]").get()[0];

    $(img).prop("src", "/imgs/wait.gif");
}