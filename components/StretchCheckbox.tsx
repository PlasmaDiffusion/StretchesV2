import BouncyCheckbox from "react-native-bouncy-checkbox";
import { Stretch } from "../utilities/stretchList";

interface Props {
  stretch: Stretch;
  setCheckbox: (checked:boolean) => any;
}

export function StretchCheckbox({ stretch, setCheckbox }: Props) {

  return (
    <BouncyCheckbox
      size={25}
      fillColor={stretch.color}
      unfillColor="#FFFFFF"
      text={stretch.name}
      style={{ minWidth: 150 }}
      iconStyle={{ borderColor: "red" }}
      innerIconStyle={{ borderWidth: 2 }}
      textStyle={{ textDecorationLine: "none" }}
      onPress={(isChecked) => {setCheckbox(!stretch.enabled)}}
    />
  );
}
