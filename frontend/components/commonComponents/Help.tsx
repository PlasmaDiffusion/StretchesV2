import { useState } from "react";
import { TouchableOpacity, Text } from "react-native";
import { GeneralModal } from "./GeneralModal";

interface Props {
  helpText: string;
}

function Help({ helpText }: Props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {showModal ? (
        <GeneralModal
          visible={showModal}
          text={helpText}
          onClose={() => {
            setShowModal(false);
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={() => {
            setShowModal(true);
          }}
        >
          <Text
            style={{
              textAlign: "center",
            }}
          >
            {"(?)"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
}

export default Help;
