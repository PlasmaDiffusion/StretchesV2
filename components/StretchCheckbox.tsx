import { CheckBox } from '@rneui/themed';


import { Stretch } from "../utilities/stretchList";
import { StyleSheet } from "react-native";

interface Props {
  stretch: Stretch;
  setCheckbox: (checked: boolean) => any;
}

export function StretchCheckbox({ stretch, setCheckbox }: Props) {

  return (
    <CheckBox 
    disabled={false}
    checked={stretch.enabled || false}
    title={stretch.name}
    checkedColor={stretch.color}
    uncheckedColor={stretch.color}
    containerStyle={styles.checkboxContainer}
    onPress={(isChecked) => {
      setCheckbox(!stretch.enabled);
    }}
    />
   
  );
}

const styles = StyleSheet.create({
  checkboxContainer:{
    borderWidth: 1,
    borderStyle: 'dashed',
    minWidth: 170,
  }
});
