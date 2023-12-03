import BouncyCheckbox from 'react-native-bouncy-checkbox';


export function StretchCheckbox({color="red", name="unnanmed",})
{
return <BouncyCheckbox
  size={25}
  fillColor={color}
  unfillColor="#FFFFFF"
  text={name}
  style={{minWidth: 150}}
  iconStyle={{ borderColor: "red" }}
  innerIconStyle={{ borderWidth: 2 }}
  textStyle={{  textDecorationLine: 'none' }}
  onPress={(isChecked) => {}}
/>
}