import '../less/buttons.less';

import {setupHeader} from "./headers";
import {setupDialogs} from "./dialogs";
import {} from "./containers"

$(document).ready(() => {
    setupHeader();
    setupDialogs();
});