import '../less/dialogs.less'

export function setupDialogs() {
    [$('#chat-dialog'), $('#art-dialog')].forEach(dialog => dialog.draggable({ cursor: "move" }));
}