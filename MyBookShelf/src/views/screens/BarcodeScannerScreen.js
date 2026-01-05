import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { searchByISBN } from '../../services/googleBooksApi';
import { addBook } from '../../services/restDbApi';
import colors from '../../theme/colors';

const BarcodeScannerScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  const cameraHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/@zxing/library@latest"></script>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          background: #000;
          font-family: Arial, sans-serif;
          overflow: hidden;
        }
        #camera-container {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        #scan-overlay {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 280px;
          height: 180px;
          border: 3px solid #4CAF50;
          border-radius: 12px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
          pointer-events: none;
        }
        .corner {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 4px solid #4CAF50;
        }
        .corner.top-left {
          top: -2px;
          left: -2px;
          border-right: none;
          border-bottom: none;
        }
        .corner.top-right {
          top: -2px;
          right: -2px;
          border-left: none;
          border-bottom: none;
        }
        .corner.bottom-left {
          bottom: -2px;
          left: -2px;
          border-right: none;
          border-top: none;
        }
        .corner.bottom-right {
          bottom: -2px;
          right: -2px;
          border-left: none;
          border-top: none;
        }
        #instructions {
          position: absolute;
          bottom: 100px;
          left: 0;
          right: 0;
          text-align: center;
          color: white;
          font-size: 16px;
          text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          padding: 0 20px;
        }
        #result {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          background: rgba(76, 175, 80, 0.9);
          color: white;
          padding: 15px;
          border-radius: 8px;
          display: none;
          font-size: 14px;
          text-align: center;
        }
        #error {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          background: rgba(244, 67, 54, 0.9);
          color: white;
          padding: 15px;
          border-radius: 8px;
          display: none;
          font-size: 14px;
          text-align: center;
        }
        .scanning-line {
          position: absolute;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #4CAF50, transparent);
          animation: scan 2s linear infinite;
        }
        @keyframes scan {
          0% { top: 0; }
          50% { top: 100%; }
          100% { top: 0; }
        }
      </style>
    </head>
    <body>
      <div id="camera-container">
        <video id="video" autoplay playsinline></video>
        
        <div id="scan-overlay">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
          <div class="scanning-line"></div>
        </div>
        
        <div id="instructions">
          Posicione o código de barras dentro da área verde
        </div>
        
        <div id="result"></div>
        <div id="error"></div>
      </div>

      <script>
        const video = document.getElementById('video');
        const resultDiv = document.getElementById('result');
        const errorDiv = document.getElementById('error');
        const codeReader = new ZXing.BrowserMultiFormatReader();
        let isScanning = false;

        // Iniciar câmara
        async function startCamera() {
          try {
            const constraints = {
              video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
              }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            
            video.onloadedmetadata = () => {
              video.play();
              startScanning();
            };
          } catch (err) {
            console.error('Erro ao aceder à câmara:', err);
            showError('Erro ao aceder à câmara. Verifique as permissões.');
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'error',
              message: 'Camera permission denied'
            }));
          }
        }

        function startScanning() {
          if (isScanning) return;
          isScanning = true;

          codeReader.decodeFromVideoDevice(null, 'video', (result, err) => {
            if (result) {
              const code = result.text;
              console.log('Código detectado:', code);
              
              if (/^\\d{10}$/.test(code) || /^\\d{13}$/.test(code)) {
                showResult('ISBN detectado: ' + code);
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'barcode',
                  data: code
                }));
                isScanning = false;
              }
            }
            
            if (err && err.name !== 'NotFoundException') {
              console.error('Erro na leitura:', err);
            }
          });
        }

        function showResult(message) {
          resultDiv.textContent = message;
          resultDiv.style.display = 'block';
          setTimeout(() => {
            resultDiv.style.display = 'none';
          }, 3000);
        }

        function showError(message) {
          errorDiv.textContent = message;
          errorDiv.style.display = 'block';
          setTimeout(() => {
            errorDiv.style.display = 'none';
          }, 5000);
        }

        startCamera();

        window.ReactNativeWebView.postMessage(JSON.stringify({
          type: 'ready'
        }));
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'ready') {
        console.log('Câmara pronta!');
      }
      
      if (message.type === 'error') {
        Alert.alert(
          'Erro de Permissão',
          'Não foi possível aceder à câmara. Verifique as permissões nas configurações do dispositivo.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
      
      if (message.type === 'barcode') {
        const isbn = message.data;
        console.log('ISBN recebido:', isbn);
        handleISBNDetected(isbn);
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };

  const handleISBNDetected = async (isbn) => {
    setLoading(true);
    
    try {
      const bookData = await searchByISBN(isbn);
      
      if (bookData) {
        await addBook({
          ...bookData,
          status: 'to_read',
          added_date: new Date().toISOString(),
        });
        
        Alert.alert(
          'Livro Adicionado! ✅',
          `"${bookData.title}" foi adicionado à sua biblioteca.`,
          [
            {
              text: 'Ver Detalhes',
              onPress: () => navigation.navigate('BookDetails', { book: bookData }),
            },
            {
              text: 'Adicionar Outro',
              onPress: () => setLoading(false),
            },
          ]
        );
      } else {
        Alert.alert(
          'Livro Não Encontrado',
          'Não foi possível encontrar informações sobre este ISBN.',
          [{ text: 'Tentar Novamente', onPress: () => setLoading(false) }]
        );
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao buscar o livro. Tente novamente.',
        [{ text: 'OK', onPress: () => setLoading(false) }]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Escanear Código de Barras</Text>
      </View>

      {/* WebView com câmara */}
      <View style={styles.cameraContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: cameraHTML }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true}
          onMessage={handleWebViewMessage}
        />
      </View>

      {/* Loading overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Buscando livro...</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBox: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 15,
    fontSize: 16,
    color: colors.textPrimary || '#000',
    fontWeight: '600',
  },
});

export default BarcodeScannerScreen;