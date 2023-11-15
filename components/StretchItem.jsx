import BouncyCheckbox from 'react-native-bouncy-checkbox';


export function StretchItem({color="red", name="unnanmed",})
{
return <BouncyCheckbox
  size={25}
  fillColor={color}
  unfillColor="#FFFFFF"
  text={name}
  iconStyle={{ borderColor: "red" }}
  innerIconStyle={{ borderWidth: 2 }}
  textStyle={{ fontFamily: "JosefinSans-Regular", textDecorationLine: 'none' }}
  onPress={(isChecked) => {}}
/>
}