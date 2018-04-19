import { Component } from "@angular/core";
import { ModalDialogParams } from "nativescript-angular/modal-dialog";

import * as _ from "lodash";

@Component({
    selector: "options-dialog",
    templateUrl: "./options-dialog.html",
    moduleId: module.id,        
    providers: [ ],
    styleUrls:['options-dialog.css']         
})
export class AudioDialog {
    public prompt: string;
    private status: string;
    
    
    constructor(private params: ModalDialogParams) 
    {
        this.prompt = params.context.promptMsg;
        
    }

    public close(result: string) {
        this.params.closeCallback(result);
  }
}