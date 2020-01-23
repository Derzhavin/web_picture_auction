let buttonIdAndRoute = {
    "artsRedirect": "/arts",
    "participantsRedirect": "/participants",
    "settingsRedirect": "/settings"
}

let route = document.location.href;
let edited = [];
let newRecordsNum = 0;

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

function activateButtonWhenInputsFilled(inputs, buttons) {
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

function edit(button) {
    $(button).prop("disabled", true);
    let inputs = $(button).parent("div").find("fieldset").children("input");
    $(button).next().prop("disabled", false);
    $(button).next().next().prop("disabled", true);
    inputs.prop("disabled", false);

    activateButtonWhenInputsFilled(inputs.get(), [$(button).next()]);

    edited.push($(button).parent("div").get()[0]);

    if (route.includes('/arts')) {
        addLinkOnImg($(button).closest("div.artOuterDiv").get()[0]);
    }
}

function apply(button) {
    let divToFind = $(button).parent("div").get()[0];
    let isEdited = edited.includes(divToFind);
    let method = isEdited ? "PUT": "POST";

    if (isEdited) {
        edited.splice(divToFind, 1);
    }

    ajaxRequest(button, route, method);
}

function remove(button) {
    switch($("title").text()){
        case "Arts":
            $(button).closest("div").parent("div").remove();
            break;
        default:
            $(button).closest("div").remove();
    }

    ajaxRequest(button, route, "DELETE");
}

function addNew(button) {
    if (newRecordsNum === 0) {
        $(button).next().prop("disabled", false);
    }

    newRecordsNum++;

    let instanceDiv = $("div:eq(2)").clone();

    instanceDiv.show();

    let inputsInDiv = instanceDiv.find("input.input");

    instanceDiv.find("input.fileInput").get().forEach(fileInput => fileInput.onchange = addArt);

    instanceDiv.find("button").get().forEach((divButton) => {
        $(divButton).prop("disabled", true);

        if ($(divButton).hasClass('applyButton')) {
            activateButtonWhenInputsFilled(inputsInDiv.get(), [divButton]);
        }
    });

    if (route.includes("/arts")) {
        addLinkOnImg(instanceDiv);
    }
    $(button).next().after(instanceDiv);
}

function addLinkOnImg(artDiv) {
    let img = $(artDiv).find("img").get()[0];
    let linkInput = $(artDiv).find("input[name=link]").get()[0];
    let applyButton = $(artDiv).find("button.applyButton").get()[0];
    applyButton.addEventListener("click", () => {
        img.src = linkInput.value;
    });
}

function ajaxRequest(button, url, type) {
    let closestDiv = null;

    if (route.includes('/arts')) {
        closestDiv = $(button).closest("div.artOuterDiv");
    } else {
        closestDiv = $(button).closest("div");
    }

    let inputsInDiv = closestDiv.find("input");
    let data = {}

    inputsInDiv.get().forEach(input => {
        data[input.name] = input.value;
    });

    $.ajax({
        url: url,
        type: type,
        dataType: "json",
        data: data,
        beforeSend: () =>  {
            $(button).prop("disabled", true);
            $(button).prev().prop("disabled", false);
            $(button).next().prop("disabled", false);
            $(button).parent("div").find("fieldset").children("input").prop("disabled", true);
        },

        success: (result) => {alert(result.msg);}
    });
}

function eraseNew(button) {
    $(button).next().remove()

    newRecordsNum--;
    if (newRecordsNum === 0) {
        $(button).prop("disabled", true);
    }
}