import { Component, OnInit, ViewChild, Output, Input, EventEmitter } from "@angular/core";
import { DrawerTransitionBase, SlideInOnTopTransition } from "nativescript-pro-ui/sidedrawer";
import { RadSideDrawerComponent } from "nativescript-pro-ui/sidedrawer/angular";
import * as gestures from "tns-core-modules/ui/gestures";

@Component({
    selector: "SideDrawerContainer",
    moduleId: module.id,
    templateUrl: "./side-drawer-container.html"
  
})
export class SideDrawerContainerComponent implements OnInit {

    @Output() handleOptionsTap = new EventEmitter<gestures.GestureEventData>();
    @Input() title: string;

      /* ***********************************************************
    * Use the @ViewChild decorator to get a reference to the drawer component.
    * It is used in the "onDrawerButtonTap" function below to manipulate the drawer.
    *************************************************************/
   @ViewChild("drawer") private drawerComponent: RadSideDrawerComponent;

   private _sideDrawerTransition: DrawerTransitionBase;

   /* **********************************************************
   * Use the sideDrawerTransition property to change the open/close animation of the drawer.
   *************************************************************/
   ngOnInit(): void {
       console.log("SideDrawerContainerComponent onInit");
       this._sideDrawerTransition = new SlideInOnTopTransition();
   }
 
   /* ***********************************************************
   * According to guidelines, if you have a drawer on your page, you should always
   * have a button that opens it. Use the showDrawer() function to open the app drawer section.
   *************************************************************/
   private onDrawerButtonTap(): void {
       this.drawerComponent.sideDrawer.showDrawer();
   }
}