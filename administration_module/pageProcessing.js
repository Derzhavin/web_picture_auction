let buttonIdAndRoute = {
    "artsRedirect": "/arts",
    "participantsRedirect": "/participants",
    "settingsRedirect": "/settings"
}

let route = document.location.href;

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

function activateButtonWhenInputsFilled(inputs, button) {
    inputs.forEach(outerInput => outerInput.addEventListener('keyup', () => {
        let empty = false;
        inputs.forEach(innerInput => {
            if (innerInput.value === "") {
                empty = true;
            }
        });

        if (!empty) {
            $(button).prop("disabled", false);
        } else {
            $(button).prop("disabled", true);
        }
    }));
}

function edit(button) {
    $(button).prop("disabled", true);
    let inputs = $(button).parent("div").find("fieldset").children("input");
    $(button).next().prop("disabled", false);
    inputs.prop("disabled", false);

    activateButtonWhenInputsFilled(inputs.get(), $(button).next());
}

function apply(button) {
    $(button).prop("disabled", true);
    $(button).prev().prop("disabled", false);
    $(button).next().prop("disabled", false);

    $(button).parent("div").find("form")[0].submit();

    $(button).parent("div").find("fieldset").children("input").prop("disabled", true);
}

function remove(button) {
    switch($("title").text()){
        case "Arts":
            $(button).closest("div").parent("div").remove();
            break;
        default:
            $(button).closest("div").remove();
    }
}

function addNew(button) {
    let instanceDiv = $("div:eq(2)").clone();

    instanceDiv.show();

    let inputsInDiv = instanceDiv.find("input.input");

    instanceDiv.find("input.fileInput").get().forEach(fileInput => fileInput.onchange = addArt);

    instanceDiv.find("button").get().forEach((divButton) => {
        if (!$(divButton).hasClass('removeButton')) {
            $(divButton).prop("disabled", true);
        }

        if ($(divButton).hasClass('applyButton')) {
            activateButtonWhenInputsFilled(inputsInDiv.get(), divButton);
        }
    });

    $(button).after(instanceDiv);
}

function addArt(event) {
    let file = event.target.files[0];
    let reader = new FileReader();
    let preview = $(event.target).parent("div").find("img").get()[0];

    reader.onloadend = function () {
        preview.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.src="";
    }
}