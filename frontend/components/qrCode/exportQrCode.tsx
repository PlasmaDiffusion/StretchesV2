import React, { useEffect } from "react";
import {
  View,
  Image,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import {
  generateSlotQRCode,
  loadAllSaveNames,
} from "../../utilities/stretchSaving";
import { Button } from "@rneui/themed";

//Saves and loads stretches for when you want to put the data on other devices.
function QrCodeSaveImporterAndExporter() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = React.useState<string>("");
  const [selectedSlot, setSelectedSlot] = React.useState<number>(1);
  const [slotNames, setSlotNames] = React.useState<string[]>([]);

  const slots = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  // Load all save names for slots
  useEffect(() => {
    const fetchSlotNames = async () => {
      const names = await loadAllSaveNames(slots);
      setSlotNames(names);
    };
    fetchSlotNames();
  }, []);

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const qrCodeGeneratedUrl = await generateSlotQRCode(
          "save" + selectedSlot
        );
        setQrCodeDataUrl(qrCodeGeneratedUrl);
        console.log("QR Code Data URL:", qrCodeGeneratedUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    };

    generateQRCode();
  }, [generateSlotQRCode]);

  return (
    <View>
      <Text>Exported QR Code of all stretch save slots:</Text>
      {qrCodeDataUrl && <Image source={{ uri: qrCodeDataUrl }} />}
      <Text>Scan this QR code to import your stretches on another device.</Text>

      {/* Horizontally scrollable list of slot buttons */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollListContent}
        horizontal={true}
        showsHorizontalScrollIndicator={true}
      >
        {slots.map((slot, index) => (
          <TouchableOpacity
            key={slot}
            onPress={() => setSelectedSlot(slot)}
            style={[
              styles.slotButton,
              selectedSlot === slot ? styles.selectSlot : styles.unSelectedSlot,
            ]}
          >
            <Text style={styles.slotButtonText}>
              {slotNames[index + 1] || "n/a"}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View>
        <Text>
          Hit scan here if you want to import saves from another device.
        </Text>
        <Text style={{ color: "red" }}>
          This will overwrite your current stretch saves.
        </Text>

        <Button>Scan QR Code To Load Save</Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollList: {
    maxHeight: 60,
    marginVertical: 12,
  },
  scrollListContent: {
    alignItems: "center",
    flexDirection: "row",
  },
  slotButton: {
    width: 100,
    height: 32,
    borderWidth: 1,
    borderRadius: 4,
    marginHorizontal: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  slotButtonText: {
    fontSize: 14,
  },
  selectSlot: {
    backgroundColor: "#ffeaea",
    borderColor: "red",
  },
  unSelectedSlot: {
    backgroundColor: "#eef6ff",
    borderColor: "blue",
  },
});

export default QrCodeSaveImporterAndExporter;
