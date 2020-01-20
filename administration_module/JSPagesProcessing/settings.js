function editForm() {
    $("#editForm").prop("disabled", true);
    $("#applyChanges").prop("disabled", false);
    $("input").prop("disabled", false);
}

function applyChanges() {
    $("#applyChanges").prop("disabled", true);
    $("#editForm").prop("disabled", false);
    $("input").prop("disabled", true);
}