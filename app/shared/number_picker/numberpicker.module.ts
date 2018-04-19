import { NgModule } from "@angular/core";
import { registerElement } from "nativescript-angular/element-registry";

import { DIRECTIVES } from "./numberpicker.directives";

@NgModule({
    declarations: [DIRECTIVES],
    exports: [DIRECTIVES],
})
export class NumberPickerModule { }

console.log("Loading numpicker.module");
//let np = require("./numberpicker");
//console.log("Requiring number picker", np);

registerElement("NumberPicker", () => {
    console.log("In register element");
    return require("./numberpicker").NumberPicker;
});
