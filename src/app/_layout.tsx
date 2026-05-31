import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      {/* This renders your index.tsx screen and hides the default top header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}