import React, { useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import PinLockScreen from './pinLockScreen';

const RootLayout = () => {
  const [isUnlocked, setIsUnlocked] = useState(false);

  return (
    <>
      {!isUnlocked ? (
        <PinLockScreen onUnlock={() => setIsUnlocked(true)} />
      ) : (
        <>
          <Stack screenOptions={{ headerShown: true }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="main" />
          </Stack>
          <StatusBar backgroundColor="white" style="dark" />
        </>
      )}
    </>
  );
};

export default RootLayout;
