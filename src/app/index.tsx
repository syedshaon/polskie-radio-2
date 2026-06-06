import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from "expo-audio";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextTicker from "react-native-text-ticker";

const STREAM_URL = "https://polskieradioscotlandstream.cloud/listen/polskie_radio_scotland_stream/radio.mp3";
const METADATA_API_URL = "https://polskieradioscotlandstream.cloud/api/nowplaying/polskie_radio_scotland_stream";

const logoImage = require("../assets/logo.png");
const Facebook = require("../assets/facebook.png");
const Web = require("../assets/web.png");
const Twitter = require("../assets/twitter.png");
const Instagram = require("../assets/instagram.png");
const Share = require("../assets/share.png");
const Play = require("../assets/play-button.png");
const Pause = require("../assets/pause.png");

export default function App() {
  const player = useAudioPlayer(STREAM_URL);
  // Hook listener cleanly tracks dynamic audio streaming states (playing, buffering, etc.)
  const status = useAudioPlayerStatus(player);

  const [trackInfo, setTrackInfo] = useState({
    title: "Live Stream",
    artist: "Polskie Radio Scotland",
  });

  const fetchMetadata = async () => {
    try {
      const response = await fetch(METADATA_API_URL);
      const data = await response.json();

      if (data && data.now_playing && data.now_playing.song) {
        setTrackInfo({
          title: data.now_playing.song.title || "Live Stream",
          // Fixed syntax string formatting bug
          artist: data.now_playing.song.artist ? ` — ${data.now_playing.song.artist}` : "Polskie Radio Scotland",
        });
      }
    } catch (error) {
      console.log("Error fetching stream metadata:", error);
    }
  };

  // 1. Initialize Audio Sessions and Handle Polling Clock Intervals
  useEffect(() => {
    async function configureAudioSession() {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          shouldPlayInBackground: true,
          interruptionMode: "doNotMix", // Prevents Android system termination hooks
          allowsRecording: false,
        });
      } catch (error) {
        console.log("Error configuring Audio Mode:", error);
      }
    }
    configureAudioSession();
    fetchMetadata();

    const interval = setInterval(fetchMetadata, 15000);
    return () => clearInterval(interval);
  }, []);

  // 2. Bind Active Runtime Stream States with OS Lockscreens
  useEffect(() => {
    if (player) {
      player.setActiveForLockScreen(true, {
        title: trackInfo.title,
        artist: trackInfo.artist,
      });
    }

    return () => {
      if (player) {
        player.clearLockScreenControls();
      }
    };
  }, [status.playing, trackInfo]);

  // 3. Playback State Callbacks
  const togglePlayPause = () => {
    if (status.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/profile.php?id=61582724020965" },
    { icon: Web, label: "Website", url: "https://www.polskieradioscotland.co.uk/" },
    { icon: Twitter, label: "Tiktok", url: "https://x.com/polskieradiopl?lang=en" },
    { icon: Instagram, label: "Youtube", url: "https://www.instagram.com/polskieradio/?hl=en" },
    { icon: Share, label: "Share", url: "https://www.polskieradioscotland.co.uk/" },
  ];

  return (
    <View style={styles.parentContainer}>
      <ImageBackground source={require("../assets/bg.jpg")} resizeMode="cover" style={styles.mainBG}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Top - Logo & Info */}
            <View style={styles.header}>
              <Image source={logoImage} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Polskie Radio Scotland</Text>
            </View>

            {/* Middle - Controls & Metadata */}
            <View style={styles.controls}>
              <View style={styles.metadataContainer}>
                {status.playing ? (
                  <TextTicker style={styles.songTitleText} duration={12000} loop bounce={false} repeatSpacer={100} marqueeDelay={1000}>
                    {trackInfo.title} {trackInfo.artist}
                  </TextTicker>
                ) : (
                  <Text style={styles.songTitleText}>Stream Paused</Text>
                )}
              </View>

              <TouchableOpacity onPress={togglePlayPause} activeOpacity={0.8}>
                <ImageBackground source={require("../assets/play-bg.png")} resizeMode="cover" style={styles.playButtonBg}>
                  <Image
                    source={status.playing ? Pause : Play}
                    style={{
                      width: 60,
                      height: 60,
                      marginLeft: status.playing ? 0 : 6,
                    }}
                    resizeMode="contain"
                  />
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <Image source={require("../assets/tune.png")} style={{ width: 80, height: 80, marginTop: 20, marginHorizontal: "auto" }} resizeMode="contain" />

            {/* Footer - Social Media Connections */}
            <View style={{ borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: "100%", alignSelf: "center", marginBottom: 30 }}>
              <ImageBackground source={require("../assets/footer-bg.png")} resizeMode="cover" style={styles.socialLinkBg}>
                <View style={styles.footer}>
                  <View style={styles.socialRow}>
                    {socialLinks.map(({ icon, label, url }) => (
                      <TouchableOpacity key={label} onPress={() => Linking.openURL(url)} style={styles.socialIcon}>
                        <Image source={icon} style={styles.socialIconImage} resizeMode="contain" />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </ImageBackground>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  parentContainer: { flex: 1 },
  container: { flex: 1 },
  mainBG: { flex: 1 },
  header: { flex: 1.5, justifyContent: "center", alignItems: "center", paddingTop: 40 },
  logo: { width: 180, height: 180, marginBottom: 10 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  playButtonBg: { width: 120, height: 120, justifyContent: "center", alignItems: "center" },
  controls: { flex: 1.5, justifyContent: "flex-start", alignItems: "center", paddingTop: 10 },
  metadataContainer: {
    alignItems: "center",
    marginBottom: 25,
    width: "55%",
    height: 30,
    paddingHorizontal: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  songTitleText: { color: "white", fontSize: 20, fontWeight: "600", textAlign: "center" },
  socialLinkBg: { width: "100%", height: 100, justifyContent: "center", alignItems: "center" },
  footer: { flex: 1, width: "100%", justifyContent: "center" },
  socialRow: { flexDirection: "row", width: "100%", justifyContent: "space-evenly", alignItems: "center" },
  socialIcon: { width: 56, height: 56, justifyContent: "center", alignItems: "center" },
  socialIconImage: { width: 36, height: 36 },
});
