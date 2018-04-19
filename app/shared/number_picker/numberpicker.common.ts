import { View, Style, Property, CssProperty, isIOS } from "tns-core-modules/ui/core/view";


export abstract class NumberPickerBase extends View
{

    public static valueChangedEvent = "valueChanged";

}


export const  minValueProperty = new Property<NumberPickerBase, number>({
    name:"minValue"
});
export const  maxValueProperty = new Property<NumberPickerBase, number>({
    name:"maxValue"
});
export const  valueProperty = new Property<NumberPickerBase, number>({
    name:"value"
});


maxValueProperty.register(NumberPickerBase);

minValueProperty.register(NumberPickerBase);

valueProperty.register(NumberPickerBase);


(NumberPickerBase.prototype as any).recycleNativeView = false;