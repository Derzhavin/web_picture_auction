$(document).ready(() => {
    setupHeader();
    hideInstance();
});

function setupHeader() {
    $("#header").children().get().forEach((button) => {
        if ($(button).text() === $("title").text()) {
            $(button).css("background-color", "olivedrab");
        }
    });
}

function hideInstance() {
    $("#instance").hide();
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
    $(button).parent("div").find("fieldset").children("input").prop("disabled", true);
}

function remove(button) {
    let div = $(button).closest("div");
    div.next().remove();
    div.remove();
}

function addNew(button) {
    let div = $("#instance").clone();
    div.show();
    let inputsInDiv = div.find("fieldset").children("input");

    div.children("button").get().forEach((divButton) => {
        if ($(divButton).text() !== "Remove") {
            $(divButton).prop("disabled", true);
        }

        if ($(divButton).text() === "Apply") {
            activateButtonWhenInputsFilled(inputsInDiv.get(), divButton);
         }
    });

    $(button).after(div);
}