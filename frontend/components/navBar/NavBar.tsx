import { Views } from "../../interfaces/views";
import { Text, Touchable, TouchableOpacity } from "react-native";   
import NavButton from "./navButton";

interface Props {
    currentView: Views;
    setCurrentView: (view: Views) => void;
}

export default function NavBar({currentView, setCurrentView}: Props) {
    return (
        <>
            <NavButton text={"Stretch Screen"} isCurrentView={currentView===Views.STRETCH_SCREEN}
            onPress={()=>{setCurrentView(Views.STRETCH_SCREEN)}} />
            <NavButton text={"Exercise Log"} isCurrentView={currentView===Views.EXERCISE_LOG}
            onPress={()=>{setCurrentView(Views.EXERCISE_LOG)}} />

        </>
    );

}
