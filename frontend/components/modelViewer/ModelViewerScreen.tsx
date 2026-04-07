import React, { useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { OrbitControls } from '@react-three/drei/native';
import * as THREE from 'three';

function HumanBody() {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef}>
      {/* Head */}
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1.28, 0]}>
        <cylinderGeometry args={[0.09, 0.09, 0.18, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Torso */}
      <mesh position={[0, 0.75, 0]}>
        <boxGeometry args={[0.55, 0.75, 0.28]} />
        <meshStandardMaterial color="#2980b9" />
      </mesh>

      {/* Pelvis */}
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.22, 0.25]} />
        <meshStandardMaterial color="#1a5276" />
      </mesh>

      {/* Left upper arm */}
      <mesh position={[-0.4, 0.9, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.08, 0.07, 0.42, 16]} />
        <meshStandardMaterial color="#2980b9" />
      </mesh>

      {/* Left forearm */}
      <mesh position={[-0.52, 0.55, 0]} rotation={[0, 0, 0.15]}>
        <cylinderGeometry args={[0.065, 0.055, 0.38, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Left hand */}
      <mesh position={[-0.6, 0.35, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Right upper arm */}
      <mesh position={[0.4, 0.9, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.08, 0.07, 0.42, 16]} />
        <meshStandardMaterial color="#2980b9" />
      </mesh>

      {/* Right forearm */}
      <mesh position={[0.52, 0.55, 0]} rotation={[0, 0, -0.15]}>
        <cylinderGeometry args={[0.065, 0.055, 0.38, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Right hand */}
      <mesh position={[0.6, 0.35, 0]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Left thigh */}
      <mesh position={[-0.15, -0.12, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.55, 16]} />
        <meshStandardMaterial color="#1a5276" />
      </mesh>

      {/* Left shin */}
      <mesh position={[-0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.065, 0.5, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Left foot */}
      <mesh position={[-0.15, -0.95, 0.05]}>
        <boxGeometry args={[0.12, 0.07, 0.22]} />
        <meshStandardMaterial color="#784212" />
      </mesh>

      {/* Right thigh */}
      <mesh position={[0.15, -0.12, 0]}>
        <cylinderGeometry args={[0.12, 0.1, 0.55, 16]} />
        <meshStandardMaterial color="#1a5276" />
      </mesh>

      {/* Right shin */}
      <mesh position={[0.15, -0.65, 0]}>
        <cylinderGeometry args={[0.08, 0.065, 0.5, 16]} />
        <meshStandardMaterial color="#f5cba7" />
      </mesh>

      {/* Right foot */}
      <mesh position={[0.15, -0.95, 0.05]}>
        <boxGeometry args={[0.12, 0.07, 0.22]} />
        <meshStandardMaterial color="#784212" />
      </mesh>
    </group>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[3, 5, 3]} intensity={1.2} castShadow />
      <directionalLight position={[-3, 2, -2]} intensity={0.4} />
      <pointLight position={[0, 3, 3]} intensity={0.5} />

      <HumanBody />

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.5}
        maxDistance={6}
      />
    </>
  );
}

export default function ModelViewerScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>3D Body Viewer</Text>
        <Text style={styles.subtitle}>Drag to rotate  •  Pinch to zoom</Text>
      </View>
      <View style={styles.canvasContainer}>
        <Canvas
          camera={{ position: [0, 0.4, 3.5], fov: 45 }}
          style={styles.canvas}
        >
          <Scene />
        </Canvas>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d1117',
  },
  header: {
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 20,
    backgroundColor: '#161b22',
    borderBottomWidth: 1,
    borderBottomColor: '#30363d',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#e6edf3',
  },
  subtitle: {
    fontSize: 13,
    color: '#8b949e',
    marginTop: 2,
  },
  canvasContainer: {
    flex: 1,
  },
  canvas: {
    flex: 1,
  },
});
