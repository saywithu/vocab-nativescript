import { NumberPickerBase, maxValueProperty, minValueProperty, valueProperty } from "./numberpicker.common";

console.log("Loading numpicker.android.ts");

let valueChangeListener: android.widget.NumberPicker.OnValueChangeListener;

// NOTE: ClickListenerImpl is in function instead of directly in the module because we 
// want this file to be compatible with V8 snapshot. When V8 snapshot is created
// JS is loaded into memory, compiled & saved as binary file which is later loaded by
// android runtime. Thus when snapshot is created we don't have android runtime and
// we don't have access to native types.

interface Formatter {
    new (owner: NumberPicker): android.widget.NumberPicker.Formatter;
}

interface NumberPickerListeners extends 
android.widget.NumberPicker.OnValueChangeListener,
    android.widget.NumberPicker.OnScrollListener {
}

interface NumberPickerListenersClass {
    prototype: NumberPickerListeners;
    new (): NumberPickerListeners;
}

let Formatter: Formatter;
let numberPickerListener: NumberPickerListenersClass;

function initializeNativeClasses(): void {
    if (Formatter) {
        return;
    }
    if (numberPickerListener) {
        return;
    }

    @Interfaces([android.widget.NumberPicker.Formatter])
    class FormatterImpl extends java.lang.Object implements android.widget.NumberPicker.Formatter {
        constructor(private owner: NumberPicker) {
            super();
            return global.__native(this);
        }

        format(index: number): string {
            return "Lesson " + (index);
        }
    }

    @Interfaces([android.widget.NumberPicker.OnValueChangeListener])
    class NumberPickerListenersImpl extends java.lang.Object 
    implements android.widget.NumberPicker.OnValueChangeListener,
    android.widget.NumberPicker.OnScrollListener {
        constructor() {
            super();
            console.log("Build ValueChangeLister");
            return global.__native(this);
        }

        onScrollStateChange(picker: android.widget.NumberPicker, scrollState: number): void {
            return;
/*
            switch(scrollState)
            {
                case android.widget.NumberPicker.OnScrollListener.SCROLL_STATE_FLING:
                {
                    console.log("Fling");
                break;
                }
                case android.widget.NumberPicker.OnScrollListener.SCROLL_STATE_IDLE:
                {
                    console.log("Idle");
                break;
                }
                case android.widget.NumberPicker.OnScrollListener.SCROLL_STATE_TOUCH_SCROLL:
                {
                    console.log("Touch");
                break;
                }
                
                default:
                {
                    console.error("Unknown scroll state", scrollState);
                }

            }
  */          
        }
			
        

        onValueChange(picker: android.widget.NumberPicker, oldValue: number, newValue: number): void {
            
            const owner = (<any>picker).owner;
            if (owner) {
                console.log("onvaluechange", oldValue, "newValue", newValue,
             "min", owner.nativeView.getMinValue(),
            "max", owner.nativeView.getMaxValue());
            
                valueProperty.nativeValueChange(owner, newValue);
            
                owner.notify({
                    eventName: NumberPickerBase.valueChangedEvent,
                    object: owner
                });
            } else {
                console.error("Owner not defined");
            }
        }
    }

    Formatter = FormatterImpl;
    numberPickerListener = NumberPickerListenersImpl;
}


export class NumberPicker extends NumberPickerBase  {
 
    nativeView: android.widget.NumberPicker;
    private _selectorWheelPaint: android.graphics.Paint;

    public createNativeView() {
        console.log("Create Native View in NumberPicker");
        initializeNativeClasses();
        const picker = new android.widget.NumberPicker(this._context);
       
        picker.setDescendantFocusability(android.widget.NumberPicker.FOCUS_BLOCK_DESCENDANTS);
        picker.setMinValue(0);
        picker.setMaxValue(0);
        picker.setValue(0);
        picker.setWrapSelectorWheel(true);

        const formatter = new Formatter(this);
        picker.setFormatter(formatter);
        //(<any>picker).formatter = formatter;

        const valueChangedListener = new numberPickerListener();
        picker.setOnValueChangedListener(valueChangedListener);
        // picker.setOnScrollListener(valueChangedListener);
        //(<any>picker).scrollStateLister = valueChangedListener;

        return picker;
    }
    

    // gets the default native value for opacity property.
    // Alpha could be controlled from Android theme.
    // Thus we take the default native value from the nativeView.
    // If view is recycled the value returned from this method
    // will be passed to [myOppacityProperty.setNative]
    [maxValueProperty.getDefault](): number {
        return this.nativeView.getMaxValue();
    }

    // set opacity to the native view.
    [maxValueProperty.setNative](value: number) {
        console.log("Set max value to", value, typeof(value));
        
        return this.nativeView.setMaxValue(value);
    }

    [minValueProperty.getDefault](): number {
        let mValToReturn = this.nativeView.getMinValue(); 
        console.log("min value is", mValToReturn);
        return mValToReturn;
    }

    // set opacity to the native view.
    [minValueProperty.setNative](value: number) {
        console.log("Set min value to", value);
        
        return this.nativeView.setMinValue(value);
    }

    [valueProperty.getDefault](): number {
        return this.nativeView.getMinValue();
    }

    // set opacity to the native view.
    [valueProperty.setNative](value: number) {
        console.log("NumberPicker.  Set value to", value, "min", this.nativeView.getMinValue(),
            "max",
            this.nativeView.getMaxValue());
        return this.nativeView.setValue(value);
    }



    constructor() {
        super();
    }


    /**
     * Initializes properties/listeners of the native view.
     */
    initNativeView(): void {
        console.log("InitNativeView");
        (<any>this.nativeView).owner = this;
        super.initNativeView();

        //const nativeView = this.nativeView;
        //(<any>nativeView).formatter.owner = this;
        //(<any>nativeView).valueChangedListener.owner = this;
        
    }

    /**
     * Clean up references to the native view and resets nativeView to its original state.
     * If you have changed nativeView in some other way except through setNative callbacks
     * you have a chance here to revert it back to its original state 
     * so that it could be reused later.
     */
    disposeNativeView(): void {
        console.log("disposeNativeView");

        //const nativeView = this.nativeView;
        //(<any>nativeView).formatter.owner = null;
        (<any>this.nativeView).owner = null;
        
        // If you want to recycle nativeView and have modified the nativeView 
        // without using Property or CssProperty (e.g. outside our property system - 'setNative' callbacks)
        // you have to reset it to its initial state here.
        super.disposeNativeView();
    }

}

