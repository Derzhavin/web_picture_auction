import '../less/buttons.less';

import {setupHeader} from "./headers";
import {setupDialogs} from "./dialogs";

$(document).ready(() => {
    setupHeader();
    setupDialogs();
});