import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

interface ThreeCanvasProps {
  style?: any;
}

function Box() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

export default function ThreeCanvas({ style }: ThreeCanvasProps) {
  return (
    <View style={[styles.container, style]}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Box />
        <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
      </Canvas>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
  },
});
