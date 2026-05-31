import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Share,
  Animated,
  Easing,
} from 'react-native';
import Markdown from 'react-native-markdown-display';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ── Animated glowing scan line ──────────────────────────────────────────────
function ScanLine() {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
        Animated.timing(anim, { toValue: 0, duration: 2200, easing: Easing.inOut(Easing.quad), useNativeDriver: true }),
      ])
    ).start();
  }, [anim]);

  const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, 60] });
  const opacity    = anim.interpolate({ inputRange: [0, 0.2, 0.8, 1], outputRange: [0, 1, 1, 0] });

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.scanLine, { opacity, transform: [{ translateY }] }]}
    />
  );
}

// ── Pulsing ring around the scan button ─────────────────────────────────────
function PulseRing({ active }: { active: boolean }) {
  const scale   = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    if (!active) return;
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale,   { toValue: 1.25, duration: 900, useNativeDriver: true }),
          Animated.timing(scale,   { toValue: 1,    duration: 900, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0,   duration: 900, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.6, duration: 900, useNativeDriver: true }),
        ]),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [active, scale, opacity]);

  if (!active) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.pulseRing, { transform: [{ scale }], opacity }]}
    />
  );
}

// ── Corner bracket decoration ────────────────────────────────────────────────
function CornerBrackets({ color = '#00f5a0' }: { color?: string }) {
  const s = 10;
  const t = 2;
  const corners = [
    { top: 0, left:  0, borderTopWidth: t, borderLeftWidth:  t },
    { top: 0, right: 0, borderTopWidth: t, borderRightWidth: t },
    { bottom: 0, left:  0, borderBottomWidth: t, borderLeftWidth:  t },
    { bottom: 0, right: 0, borderBottomWidth: t, borderRightWidth: t },
  ];
  return (
    <>
      {corners.map((c, i) => (
        <View key={i} style={[{ position: 'absolute', width: s, height: s, borderColor: color }, c]} />
      ))}
    </>
  );
}

// ── Blinking cursor ──────────────────────────────────────────────────────────
function BlinkCursor() {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ])
    ).start();
  }, [opacity]);
  return <Animated.Text style={[styles.cursor, { opacity }]}>█</Animated.Text>;
}

// ── Main Component ───────────────────────────────────────────────────────────
export default function HomeScreen() {
  const [targetInput, setTargetInput]   = useState('');
  const [threatReport, setThreatReport] = useState('Enter an IP or URL above to begin the scan.');
  const [isLoading, setIsLoading]       = useState(false);
  const [statusMessage, setStatusMessage] = useState('Initiating scan...');
  const [scanHistory, setScanHistory]   = useState<any[]>([]);

  // Fade-in mount animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const loadPersistentHistory = async () => {
      try {
        const storedHistory = await AsyncStorage.getItem('@soc_scan_history');
        if (storedHistory !== null) setScanHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Failed to load history from disk:', error);
      }
    };
    loadPersistentHistory();
  }, []);

  const clearHistory = async () => {
    try {
      await AsyncStorage.removeItem('@soc_scan_history');
      setScanHistory([]);
    } catch (error) {
      console.error('Failed to clear history:', error);
    }
  };

  const shareReport = async () => {
    try {
      await Share.share({
        message: `🚨 Autonomous SOC Threat Assessment\nTarget: ${targetInput}\n\n${threatReport}`,
        title: 'SOC Threat Assessment',
      });
    } catch (error: any) {
      console.error('Sharing failed:', error.message);
    }
  };

  const scanTarget = async () => {
    if (!targetInput.trim()) return;
    Keyboard.dismiss();
    setIsLoading(true);
    setStatusMessage('📡 Querying Threat Intel Databases...');
    setThreatReport('');

    try {
      const apiUrl = 'https://autonomous-soc-api-n5pr.onrender.com/api/scan';
      setStatusMessage('🤖 Autonomous Agent analyzing results...');

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Bypass-Tunnel-Reminder': 'true',
        },
        body: JSON.stringify({ target: targetInput.trim() }),
      });

      setStatusMessage('✍️ Compiling Markdown Security Report...');
      const data = await response.json();

      if (data.status === 'success') {
        setThreatReport(data.report);
        const newEntry = {
          target: targetInput.trim(),
          report: data.report,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        const updatedHistory = [newEntry, ...scanHistory].slice(0, 10);
        AsyncStorage.setItem('@soc_scan_history', JSON.stringify(updatedHistory)).catch(
          (err) => console.error('Storage save error:', err)
        );
        setScanHistory(updatedHistory);
      } else {
        setThreatReport('**Error:** Scan failed on the backend.');
      }
    } catch (error: any) {
      setThreatReport(
        `**Network Error:** Ensure your FastAPI server is running.\n\nDetails: ${error.message}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const loadFromHistory = (historyItem: any) => {
    setTargetInput(historyItem.target);
    setThreatReport(historyItem.report);
    Keyboard.dismiss();
  };

  const isValidReport =
    !isLoading &&
    !threatReport.includes('Enter an IP or URL') &&
    !threatReport.includes('Error') &&
    !threatReport.includes('Invalid Input');

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.container, { opacity: fadeAnim }]} pointerEvents="box-none">

            {/* ── HEADER ── */}
            <View style={styles.header}>
              {/* decorative grid lines */}
              <View style={styles.headerGrid} pointerEvents="none">
                {Array.from({ length: 6 }).map((_, i) => (
                  <View key={i} style={[styles.gridLine, { left: `${i * 20}%` as any }]} />
                ))}
              </View>

              <View style={styles.badgeRow}>
                <View style={styles.badge}>
                  <View style={styles.badgeDot} />
                  <Text style={styles.badgeText}>SYSTEM ONLINE</Text>
                </View>
              </View>

              <Text style={styles.title}>AUTONOMOUS SOC</Text>
              <Text style={styles.titleSub}>
                {'< '}POWERED BY LANGGRAPH & CORAL{' >'}
              </Text>

              {/* animated scan line on header */}
              <ScanLine />
            </View>

            {/* ── INPUT SECTION ── */}
            <View style={styles.inputWrapper}>
              <CornerBrackets color="#00f5a0" />
              <View style={styles.inputRow}>
                <Text style={styles.inputPrefix}>TARGET://</Text>
                <TextInput
                  style={styles.input}
                  placeholder="0.0.0.0 or domain.tld"
                  placeholderTextColor="#1a4a36"
                  value={targetInput}
                  onChangeText={setTargetInput}
                  autoCapitalize="none"
                  keyboardType="url"
                  returnKeyType="done"
                  onSubmitEditing={scanTarget}
                  selectionColor="#00f5a0"
                />
              </View>
            </View>

            {/* ── SCAN BUTTON ── */}
            <View style={styles.buttonOuter}>
              <PulseRing active={isLoading} />
              <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonActive]}
                onPress={scanTarget}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                {/* corner brackets on button */}
                <CornerBrackets color={isLoading ? '#00f5a0' : '#006644'} />
                <Text style={styles.buttonText}>
                  {isLoading ? '[ SCANNING... ]' : '[ ANALYZE THREAT LEVEL ]'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* ── HISTORY ── */}
            {scanHistory.length > 0 && !isLoading && (
              <View style={styles.historySection}>
                <View style={styles.historyHeader}>
                  <View style={styles.historyLabelRow}>
                    <View style={styles.historyDot} />
                    <Text style={styles.historyTitle}>RECENT TARGETS</Text>
                  </View>
                  <TouchableOpacity onPress={clearHistory}>
                    <Text style={styles.clearHistoryText}>PURGE</Text>
                  </TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {scanHistory.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.historyCard}
                      onPress={() => loadFromHistory(item)}
                      activeOpacity={0.75}
                    >
                      <CornerBrackets color="#00f5a044" />
                      <Text style={styles.historyCardIp}>{item.target}</Text>
                      <Text style={styles.historyCardTime}>{item.timestamp}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* ── LOADING ── */}
            {isLoading && (
              <View style={styles.loadingContainer}>
                <CornerBrackets color="#00f5a0" />
                <ActivityIndicator size="large" color="#00f5a0" style={{ marginBottom: 18 }} />
                <Text style={styles.loadingLabel}>AGENT STATUS</Text>
                <Text style={styles.loadingText}>{statusMessage}</Text>
                <View style={styles.loadingBar}>
                  <Animated.View style={styles.loadingBarFill} />
                </View>
              </View>
            )}

            {/* ── REPORT ── */}
            {!isLoading && (
              <View style={styles.reportContainer}>
                <View style={styles.reportHeader}>
                  <CornerBrackets color="#00f5a055" />
                  <View style={styles.reportTitleRow}>
                    <View style={styles.reportDot} />
                    <Text style={styles.reportTitle}>THREAT ASSESSMENT REPORT</Text>
                    <BlinkCursor />
                  </View>
                  <View style={styles.reportDivider} />
                </View>

                <ScrollView
                  style={styles.reportScroll}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 10 }}
                >
                  <Markdown style={markdownStyles}>{threatReport}</Markdown>
                </ScrollView>

                {isValidReport && (
                  <TouchableOpacity
                    style={styles.shareButton}
                    onPress={shareReport}
                    activeOpacity={0.8}
                  >
                    <CornerBrackets color="#00f5a066" />
                    <Text style={styles.shareButtonText}>[ 📤  EXPORT REPORT ]</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── STYLES ───────────────────────────────────────────────────────────────────
const C = {
  bg:         '#020c08',   // near-black with green tint
  surface:    '#050f0a',   // panels
  surfaceAlt: '#081410',   // slightly lighter
  border:     '#0d2e1e',   // subtle borders
  borderGlow: '#00f5a0',   // neon green
  accent:     '#00f5a0',   // primary neon
  accentDim:  '#00c47e',   // dimmer green
  accentMid:  '#007a4d',   // mid green
  accentDark: '#003d26',   // dark green
  text:       '#c8ffe8',   // main text
  textDim:    '#4daa7e',   // secondary text
  textMuted:  '#1f5c3b',   // very muted
  danger:     '#ff4560',   // red for errors
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: C.bg,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingTop: Platform.OS === 'web' ? 50 : 12,
    paddingBottom: 20,
    backgroundColor: C.bg,
    minHeight: '100%' as any,
  },

  // ── HEADER ──
  header: {
    position: 'relative',
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 22,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerGrid: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
  },
  gridLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#00f5a008',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00f5a030',
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  badgeRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.accentDark,
    backgroundColor: '#001a0f',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 2,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
    marginRight: 6,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  badgeText: {
    color: C.accentDim,
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 2,
    fontWeight: '700',
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: C.accent,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 6,
    textShadowColor: C.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 12,
  },
  titleSub: {
    fontSize: 10,
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 2,
    marginTop: 5,
  },

  // ── INPUT ──
  inputWrapper: {
    position: 'relative',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.accentDark,
    borderRadius: 2,
    paddingHorizontal: 14,
    paddingVertical: 4,
    marginBottom: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputPrefix: {
    color: C.accentMid,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 15,
    color: C.accent,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 1,
  },

  // ── BUTTON ──
  buttonOuter: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  pulseRing: {
    position: 'absolute',
    top: -6,
    left: -6,
    right: -6,
    bottom: -6,
    borderWidth: 2,
    borderColor: C.accent,
    borderRadius: 4,
  },
  button: {
    position: 'relative',
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: C.accentDark,
    borderWidth: 1,
    borderColor: C.accentMid,
    borderRadius: 2,
  },
  buttonActive: {
    borderColor: C.accent,
    backgroundColor: '#001f12',
  },
  buttonText: {
    color: C.accent,
    fontSize: 13,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 3,
    textShadowColor: C.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },

  // ── HISTORY ──
  historySection: {
    marginTop: 18,
    marginBottom: 4,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  historyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.accentDim,
    marginRight: 7,
  },
  historyTitle: {
    color: C.textDim,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  clearHistoryText: {
    color: C.danger,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
  },
  historyCard: {
    position: 'relative',
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 2,
    marginRight: 10,
    minWidth: 130,
  },
  historyCardIp: {
    color: C.accentDim,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.5,
  },
  historyCardTime: {
    color: C.textMuted,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    marginTop: 5,
    letterSpacing: 1,
  },

  // ── LOADING ──
  loadingContainer: {
    position: 'relative',
    marginTop: 18,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#010d07',
    borderWidth: 1,
    borderColor: C.accentDark,
    borderRadius: 2,
  },
  loadingLabel: {
    color: C.accentMid,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    letterSpacing: 3,
    marginBottom: 6,
  },
  loadingText: {
    color: C.accent,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingBar: {
    marginTop: 18,
    width: '80%',
    height: 2,
    backgroundColor: C.accentDark,
    borderRadius: 1,
    overflow: 'hidden',
  },
  loadingBarFill: {
    width: '60%',
    height: '100%',
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },

  // ── REPORT ──
  reportContainer: {
    position: 'relative',
    marginTop: 16,
    marginBottom: 6,
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 2,
    minHeight: 320,
    overflow: 'hidden',
  },
  reportHeader: {
    position: 'relative',
    paddingHorizontal: 14,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: '#030f09',
  },
  reportTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.accent,
    marginRight: 8,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 4,
  },
  reportTitle: {
    color: C.accentDim,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    flex: 1,
  },
  cursor: {
    color: C.accent,
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  reportDivider: {
    marginTop: 8,
    height: 1,
    backgroundColor: C.border,
  },
  reportScroll: {
    maxHeight: 420,
    paddingHorizontal: 14,
    paddingTop: 10,
  },

  // ── SHARE ──
  shareButton: {
    position: 'relative',
    margin: 14,
    paddingVertical: 13,
    alignItems: 'center',
    backgroundColor: '#001208',
    borderWidth: 1,
    borderColor: C.accentMid,
    borderRadius: 2,
  },
  shareButtonText: {
    color: C.accentDim,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
  },
});

// ── MARKDOWN ─────────────────────────────────────────────────────────────────
const markdownStyles = StyleSheet.create({
  body: {
    fontSize: 14,
    color: '#c8ffe8',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  heading1: {
    color: '#00f5a0',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  heading2: {
    color: '#00c47e',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 6,
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  heading3: {
    color: '#007a4d',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
    marginTop: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  strong: {
    color: '#ff4560',
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  em: {
    color: '#00c47e',
    fontStyle: 'italic',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  bullet_list: {
    marginTop: 8,
  },
  list_item: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  bullet_list_icon: {
    color: '#00f5a0',
    marginRight: 6,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  code_inline: {
    backgroundColor: '#001a0f',
    color: '#00f5a0',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 2,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
  },
  fence: {
    backgroundColor: '#000f07',
    borderLeftWidth: 2,
    borderLeftColor: '#00f5a0',
    padding: 10,
    marginVertical: 8,
    borderRadius: 2,
  },
  blockquote: {
    backgroundColor: '#001a0f',
    borderLeftWidth: 3,
    borderLeftColor: '#007a4d',
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginVertical: 6,
  },
  hr: {
    backgroundColor: '#0d2e1e',
    height: 1,
    marginVertical: 12,
  },
  link: {
    color: '#00f5a0',
    textDecorationLine: 'underline',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
  },
  table: {
    borderWidth: 1,
    borderColor: '#0d2e1e',
    marginVertical: 8,
  },
  thead: {
    backgroundColor: '#001a0f',
  },
  th: {
    color: '#00f5a0',
    fontWeight: '800',
    padding: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 11,
    letterSpacing: 1,
  },
  td: {
    color: '#c8ffe8',
    padding: 8,
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    fontSize: 12,
    borderTopWidth: 1,
    borderTopColor: '#0d2e1e',
  },
});
