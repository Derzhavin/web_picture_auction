import '../less/buttons.less';

import {setupHeader} from "./headers";
import {setupDialogs} from "./dialogs";
import {} from "./containers"
import {setupTabs} from "./tabs"

$(document).ready(() => {
    setupTabs();
});