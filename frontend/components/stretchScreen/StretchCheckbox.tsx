import { CheckBox } from "@rneui/themed";

import { Stretch } from "../../interfaces/stretchList";
import { StyleSheet, Image } from "react-native";

interface Props {
  stretch: Stretch;
  editing: boolean;
  setCheckbox: (checked: boolean) => any;
}

const editIcon = require("../../assets/pencil.png");

export function StretchCheckbox({ stretch, editing, setCheckbox }: Props) {
  return (
    <>
      {editing && (
        <Image
          style={styles.pencilIcon}
          source={editIcon}
        />
      )}
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
    </>
  );
}

const styles = StyleSheet.create({
  checkboxContainer: {
    borderWidth: 1,
    borderStyle: "dashed",
    minWidth: 170,
  },
  pencilIcon: {
    marginLeft: 8,
    width: 16,
    height: 16,
  },
});
