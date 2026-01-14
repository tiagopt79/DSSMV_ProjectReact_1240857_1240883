import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Vibration,
  StatusBar,
  PermissionsAndroid
} from 'react-native';
import WebView from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSelector } from 'react-redux';
import colors from '../../theme/colors';

const BarcodeScannerScreen = ({ navigation, route }) => {
  const { fromList, listId, listName } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const webViewRef = useRef(null);

  const libraryBooks = useSelector(state => state.books.books);

  useEffect(() => {
    const requestPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            setHasPermission(true);
          } else {
            Alert.alert('Erro', 'Sem permissão de câmara.');
            navigation.goBack();
          }
        } catch (err) {
          console.warn(err);
        }
      } else {
        setHasPermission(true);
      }
    };
    requestPermission();
  }, []);

  const cameraHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://unpkg.com/@zxing/library@latest"></script>
      <style>
        body { margin: 0; background: #000; overflow: hidden; font-family: sans-serif; }
        #video-container { 
            position: relative; 
            width: 100vw; 
            height: 100vh; 
            display: flex;
            justify-content: center;
            align-items: center;
            background: #000;
        }
        video { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
        }
        /* Caixa de Scan */
        .scan-box {
            position: absolute;
            width: 70%;
            height: 200px;
            border: 2px solid rgba(255, 255, 255, 0.8);
            border-radius: 12px;
            box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.5); /* Escurece à volta */
            z-index: 10;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .scan-line {
            width: 90%;
            height: 2px;
            background: red;
            box-shadow: 0 0 4px red;
            animation: scanAnim 2s ease-in-out infinite;
        }
        @keyframes scanAnim { 
            0% { transform: translateY(-80px); opacity: 0.5; } 
            50% { opacity: 1; } 
            100% { transform: translateY(80px); opacity: 0.5; } 
        }
      </style>
    </head>
    <body>
      <div id="video-container">
        <video id="video" autoplay muted playsinline></video>
        <div class="scan-box">
            <div class="scan-line"></div>
        </div>
      </div>

      <script>
        const video = document.getElementById('video');
        const codeReader = new ZXing.BrowserMultiFormatReader();
        let lastScanTime = 0;

        async function start() {
          try {
            const constraints = { 
                video: { 
                    facingMode: 'environment',
                    width: { ideal: 640 }, 
                    height: { ideal: 480 } 
                } 
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            
            video.onloadedmetadata = () => {
                video.play();
                requestAnimationFrame(scanLoop);
            };
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: err.message }));
          }
        }

        function scanLoop() {
           const now = Date.now();
           if (now - lastScanTime > 250) {
               
               codeReader.decodeFromVideoDevice(null, 'video', (result, err) => {
                  if (result) {
                     const code = result.text;
                     const clean = code.replace(/-/g, '');
                     
                     if (/^\\d{9,13}[\\dX]?$/.test(clean)) {
                        window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'barcode', data: clean }));
                     }
                  }
               });
               
               lastScanTime = now;
           }
           
           requestAnimationFrame(scanLoop);
        }

        // Inicia após breve pausa para garantir que a WebView está pronta
        setTimeout(start, 500);
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'barcode') {
        const isbn = message.data;
        if (!loading) {
          Vibration.vibrate(100);
          handleISBNDetected(isbn);
        }
      }
    } catch (e) { console.error(e); }
  };

  const handleISBNDetected = async (isbn) => {
    setLoading(true);
    
    
    setTimeout(() => {
      try {
        
        const existingBook = libraryBooks.find(b => 
          (b.isbn === isbn) || (b.isbn_13 && b.isbn_13.includes(isbn))
        );

        setLoading(false);

        if (existingBook) {
          
          navigation.navigate('BookDetails', {
            book: existingBook,
            fromList,
            listId,
            listName
          });
        } else {
          navigation.navigate('BookDetails', {
            scannedISBN: isbn,
            fromScanner: true,
            fromList,
            listId,
            listName
          });
        }
      } catch (error) {
        setLoading(false);
        Alert.alert('Erro', 'Ocorreu um erro ao processar o código.', [
          { text: 'OK' }
        ]);
      }
    }, 100);
  };

  if (!hasPermission) return <View style={styles.center}><ActivityIndicator color={colors.primary}/></View>;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}> Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Scan ISBN</Text>
        <View style={{width: 60}} />
      </View>

      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: cameraHTML, baseUrl: 'https://localhost/' }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        mediaPlaybackRequiresUserAction={false}
        allowsInlineMediaPlayback={true}
        onPermissionRequest={(req) => req.grant(req.resources)}
        androidLayerType="hardware"
        onMessage={handleWebViewMessage}
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>A procurar livro...</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#E8D5A8' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 20 : 50,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.6)',
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  title: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  
  webview: { 
    flex: 1, 
    backgroundColor: '#000' 
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20
  },
  loadingText: {
    color: '#fff',
    marginTop: 15,
    fontSize: 16,
    fontWeight: 'bold',
  }
});

export default BarcodeScannerScreen;