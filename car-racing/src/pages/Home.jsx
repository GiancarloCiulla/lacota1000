import React from "react";

const Home = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Bienvenido a la cota!</h1>
      <button style={styles.button} onClick={onStart}>
        Esquiva los obstáculos
      </button>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundImage: "url('/images/fondo.jpg')", // Ruta de la imagen de fondo
    backgroundSize: "cover", // Ajusta la imagen al tamaño completo del contenedor
    backgroundRepeat: "no-repeat", // No repetir la imagen
    backgroundPosition: "center", // Centrar la imagen
  },
  title: {
    fontSize: "36px",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)", // Agrega un sombreado al texto
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#ff5722", // Color de fondo del botón
    color: "#fff", // Color del texto del botón
    border: "none", // Sin borde
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Sombras
  },
};

export default Home;
