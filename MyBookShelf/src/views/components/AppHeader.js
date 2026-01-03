import React from 'react';
import { View, Text, StyleSheet, StatusBar, Platform, SafeAreaView } from 'react-native';

const AppHeader = ({ title = "MyBookShelf", subtitle }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Configura a barra de status (bateria, wifi) para ficar com letras brancas */}
      <StatusBar backgroundColor="#254E70" barStyle="light-content" />

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* Só mostra o subtítulo se ele for passado como propriedade */}
        {subtitle && (
          <Text style={styles.subtitle}>{subtitle}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#254E70', // O Azul escuro da tua imagem
    width: '100%',
    paddingTop: Platform.OS === 'android' ? 20 : 0, // Ajuste para Android
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 0, 
    borderBottomRightRadius: 0,
    // Se quiseres dar uma pequena sombra em baixo:
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },
  content: {
    marginTop: 10,
  },
  title: {
    fontSize: 28, // Tamanho grande como na foto
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4, // Espaço entre o título e o subtítulo
  },
  subtitle: {
    fontSize: 16,
    color: '#E0E0E0', // Branco um pouco mais suave
    fontWeight: '400',
  }
});

export default AppHeader;