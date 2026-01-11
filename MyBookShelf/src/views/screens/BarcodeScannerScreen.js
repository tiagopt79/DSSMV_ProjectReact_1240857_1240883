import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
  Vibration,
  StatusBar
} from 'react-native';
import { WebView } from 'react-native-webview';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'; // Correção do ícone
// Imports do Redux
import { useDispatch, useSelector } from 'react-redux';
import { addBookFromISBN, addBookToList } from '../../flux/actions';
import colors from '../../theme/colors';

const BarcodeScannerScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  // Recebe parâmetros se viemos de uma lista
  const { fromList, listId, listName } = route.params || {};
  
  const [loading, setLoading] = useState(false);
  const webViewRef = useRef(null);

  // Aceder à biblioteca para verificar duplicados localmente
  const libraryBooks = useSelector(state => state.books.books);

  // O teu HTML da câmara (Mantido intacto)
  const cameraHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/@zxing/library@latest"></script>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { background: #000; font-family: Arial, sans-serif; overflow: hidden; }
        #camera-container { position: relative; width: 100vw; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        video { width: 100%; height: 100%; object-fit: cover; }
        #scan-overlay { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 280px; height: 180px; border: 3px solid #4CAF50; border-radius: 12px; box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6); pointer-events: none; }
        .scanning-line { position: absolute; width: 100%; height: 2px; background: linear-gradient(90deg, transparent, #4CAF50, transparent); animation: scan 2s linear infinite; }
        @keyframes scan { 0% { top: 0; } 50% { top: 100%; } 100% { top: 0; } }
        #instructions { position: absolute; bottom: 100px; left: 0; right: 0; text-align: center; color: white; font-size: 16px; text-shadow: 0 2px 4px rgba(0,0,0,0.8); padding: 0 20px; }
      </style>
    </head>
    <body>
      <div id="camera-container">
        <video id="video" autoplay playsinline></video>
        <div id="scan-overlay"><div class="scanning-line"></div></div>
        <div id="instructions">Posicione o código de barras na área verde</div>
      </div>
      <script>
        const video = document.getElementById('video');
        const codeReader = new ZXing.BrowserMultiFormatReader();
        let isScanning = false;

        async function startCamera() {
          try {
            const constraints = { video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } };
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.onloadedmetadata = () => { video.play(); startScanning(); };
          } catch (err) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'error', message: 'Camera permission denied' }));
          }
        }

        function startScanning() {
          if (isScanning) return;
          isScanning = true;
          codeReader.decodeFromVideoDevice(null, 'video', (result, err) => {
            if (result) {
              const code = result.text;
              if (/^\\d{10}$/.test(code) || /^\\d{13}$/.test(code)) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'barcode', data: code }));
                isScanning = false; 
                // Pausa breve para não ler o mesmo código 10 vezes
                setTimeout(() => { isScanning = true; }, 3000);
              }
            }
          });
        }
        startCamera();
      </script>
    </body>
    </html>
  `;

  const handleWebViewMessage = async (event) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      
      if (message.type === 'error') {
        Alert.alert('Erro', 'Permissão de câmara negada.');
      }
      
      if (message.type === 'barcode') {
        const isbn = message.data;
        // Evita processar múltiplos scans se já estivermos a carregar
        if (!loading) {
          Vibration.vibrate(100);
          handleISBNDetected(isbn);
        }
      }
    } catch (error) {
      console.error('Erro ao processar mensagem:', error);
    }
  };

  const handleISBNDetected = async (isbn) => {
    setLoading(true);
    
    try {
      // 1. Verificar se já existe na biblioteca (Redux)
      const existingBook = libraryBooks.find(b => 
        (b.isbn === isbn) || (b.isbn_13 && b.isbn_13.includes(isbn))
      );

      if (existingBook) {
        if (fromList && listId) {
          // Se viemos de uma lista, adicionamos o livro existente a essa lista
          await dispatch(addBookToList(listId, existingBook._id));
          Alert.alert(
            'Adicionado à Lista', 
            `"${existingBook.title}" já estava na tua biblioteca e foi adicionado à lista "${listName}".`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
          );
        } else {
          Alert.alert(
            'Já existe!',
            `O livro "${existingBook.title}" já está na tua biblioteca.`,
            [
              { text: 'OK', onPress: () => setLoading(false) }, // Permite continuar a scanear
              { text: 'Ver Detalhes', onPress: () => navigation.navigate('BookDetails', { book: existingBook }) }
            ]
          );
        }
        return;
      }

      // 2. Se não existe, buscar e criar (Redux Action)
      const newBook = await dispatch(addBookFromISBN(isbn));
      
      if (newBook) {
        if (fromList && listId) {
          await dispatch(addBookToList(listId, newBook._id));
          Alert.alert('Sucesso', 'Livro adicionado à biblioteca e à lista!');
        } else {
          Alert.alert(
            'Sucesso! 📚',
            `"${newBook.title}" foi adicionado.`,
            [
              { text: 'Scanear Outro', onPress: () => setLoading(false) },
              { text: 'Ver Detalhes', onPress: () => navigation.replace('BookDetails', { book: newBook }) }
            ]
          );
        }
      } else {
        // Se a action não retornar livro (erro ou não encontrado)
        throw new Error('Livro não encontrado');
      }

    } catch (error) {
      console.error('Erro scanner:', error);
      Alert.alert(
        'Não Encontrado',
        'Não conseguimos encontrar informações para este código.',
        [{ text: 'OK', onPress: () => setLoading(false) }]
      );
    } finally {
      // Se não navegámos para outro ecrã, paramos o loading
      // setLoading(false) é chamado nos botões de alerta para manter o loading visível durante o alerta
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text style={styles.backButtonText}> Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan ISBN</Text>
      </View>

      {/* WebView */}
      <View style={styles.cameraContainer}>
        <WebView
          ref={webViewRef}
          source={{ html: cameraHTML }}
          style={styles.webview}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          mediaPlaybackRequiresUserAction={false}
          allowsInlineMediaPlayback={true} // Importante para Android
          onMessage={handleWebViewMessage}
        />
      </View>

      {/* Loading Overlay */}
      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>A processar livro...</Text>
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