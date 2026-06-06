import { setAudioModeAsync, useAudioPlayer } from "expo-audio";
import { Globe, Pause, Play } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Image, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import TextTicker from "react-native-text-ticker";
import { Facebook, Tiktok, Youtube } from "../components/social";

const STREAM_URL = "https://polskieradioscotlandstream.cloud/listen/polskie_radio_scotland_stream/radio.mp3";
const METADATA_API_URL = "https://polskieradioscotlandstream.cloud/api/nowplaying/polskie_radio_scotland_stream";
const logoImage = require("../assets/logo.png");

export default function App() {
  const player = useAudioPlayer(STREAM_URL);

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
          artist: data.now_playing.song.artist ? `" — " ${data.now_playing.song.artist}` : "",
        });
      }
    } catch (error) {
      console.log("Error fetching stream metadata:", error);
    }
  };

  useEffect(() => {
    async function setupAudio() {
      await setAudioModeAsync({
        playsInSilentMode: true,
        interruptionModeAndroid: "doNotMix",
      });
    }
    setupAudio();

    fetchMetadata();

    const interval = setInterval(fetchMetadata, 15000);
    return () => clearInterval(interval);
  }, []);

  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
    if (player.playing) {
      player.pause();
    } else {
      player.play();
    }
  };

  const socialLinks = [
    { icon: Facebook, label: "Facebook", url: "https://facebook.com" },
    { icon: Youtube, label: "Youtube", url: "https://www.youtube.com/@PolskieRadioScotland" },
    { icon: Tiktok, label: "Tiktok", url: "https://www.tiktok.com/@polskie.radio.scotland" },
    { icon: Globe, label: "Website", url: "https://www.polskieradioscotland.co.uk/" },
  ];

  return (
    <View style={styles.parentContainer}>
      <ImageBackground
        source={require("../assets/bg.jpg")}
        // For local images use: source={require('./assets/bg.png')}
        resizeMode="cover"
        style={styles.mainBG}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={styles.container}>
            {/* Top - Logo & Info */}
            <View style={styles.header}>
              <Image source={logoImage} style={styles.logo} resizeMode="contain" />
              <Text style={styles.title}>Polskie Radio Scotland</Text>
            </View>

            {/* Middle - Main Controls & Metadata (Moved Higher) */}
            <View style={styles.controls}>
              {/* Metadata Display */}
              <View style={styles.metadataContainer}>
                {player.playing ? (
                  <TextTicker style={styles.songTitleText} duration={12000} loop bounce={false} repeatSpacer={100} marqueeDelay={1000}>
                    {trackInfo.title}
                  </TextTicker>
                ) : (
                  <Text style={styles.songTitleText}> </Text>
                )}
              </View>

              <TouchableOpacity onPress={togglePlayPause} activeOpacity={0.8}>
                <ImageBackground
                  source={require("../assets/play-bg.png")}
                  // For local images use: source={require('./assets/bg.png')}
                  resizeMode="cover"
                  style={styles.playButtonBg}
                >
                  {isPlaying ? <Pause size={60} color="#fff" fill="#fff" /> : <Play size={60} color="#fff" fill="#fff" style={{ marginLeft: 6 }} />}
                </ImageBackground>
              </TouchableOpacity>
            </View>

            <Image source={require("../assets/tune.png")} style={{ width: 80, height: 80, marginTop: 20, marginHorizontal: "auto" }} resizeMode="contain" />

            <View style={{ borderRadius: 20, overflow: "hidden", width: "100%", maxWidth: "100%", alignSelf: "center" }}>
              <ImageBackground
                source={require("../assets/footer-bg.png")}
                // For local images use: source={require('./assets/bg.png')}
                resizeMode="cover"
                style={styles.socialLinkBg}
              >
                <View style={styles.footer}>
                  <View style={styles.socialRow}>
                    {socialLinks.map(({ icon: Icon, label, url }) => (
                      <TouchableOpacity key={label} onPress={() => Linking.openURL(url)} style={styles.socialIcon}>
                        <Icon size={24} color="white" />
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
  parentContainer: {
    flex: 1,
  },
  safeArea: { flex: 1 },
  container: { flex: 1 },
  mainBG: { flex: 1 },
  image: {
    flex: 1,
    justifyContent: "center", // Centers children vertically
    alignItems: "center", // Centers children horizontally
  },

  // Decreased header flex size from 2 to 1.5 to push things upward
  header: { flex: 1.5, justifyContent: "center", alignItems: "center", paddingTop: 40 },
  logo: { width: 180, height: 180, marginBottom: 10 },
  title: { color: "#fff", fontSize: 22, fontWeight: "600" },
  playButtonBg: { width: 120, height: 120, justifyContent: "center", alignItems: "center" },

  // Kept flex 1.5 but layout will shift upwards due to overall flex changes
  controls: { flex: 1.5, justifyContent: "flex-start", alignItems: "center", paddingTop: 10 },

  metadataContainer: {
    alignItems: "center",
    marginBottom: 25,
    width: "50%",
    height: 30, // Fixed height prevents UI layout shifts when playing vs paused
    paddingHorizontal: 10,
    overflow: "hidden",
    justifyContent: "center",
  },
  songTitleText: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
  },

  socialLinkBg: { width: "100%", height: 100, justifyContent: "center", alignItems: "center" },
  // Increased footer flex from 1 to 1.2 to claim more space at bottom, forcing center section up
  footer: { flex: 1, width: "100%", justifyContent: "center" },
  socialRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly", // or center
    alignItems: "center",
  },
  socialIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#27272a",
    justifyContent: "center",
    alignItems: "center",
  },
});
