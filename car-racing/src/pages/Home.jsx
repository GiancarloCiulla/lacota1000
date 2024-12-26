import React, { useState, useEffect } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import db from "../firebase";

const Home = ({ onStart }) => {
  const [ranking, setRanking] = useState([]);

  const fetchRanking = async () => {
    try {
      const q = query(collection(db, "rankings"), orderBy("score", "desc"), limit(10));
      const querySnapshot = await getDocs(q);
      const rankingData = querySnapshot.docs.map((doc) => doc.data());
      setRanking(rankingData);
    } catch (error) {
      console.error("Error al obtener el ranking:", error);
    }
  };

  useEffect(() => {
    fetchRanking(); // Obtener el ranking al cargar la página de inicio
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Bienvenido a la cota🤙🏼!</h1>
      <button style={styles.button} onClick={onStart}>
        Esquiva los obstáculos
      </button>
      <div style={styles.ranking}>
        <h2>Top 10 jugadores</h2>
        <ol style={styles.rankingList}>
          {ranking.map((player, index) => (
            <li key={index} style={styles.rankingItem}>
              {index + 1}. {player.name}: {player.score}
            </li>
          ))}
        </ol>
      </div>
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
    marginBottom: "20px",
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
    marginBottom: "20px",
  },
  ranking: {
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fondo semitransparente
    padding: "15px",
    borderRadius: "8px",
    color: "#fff",
    width: "80%",
    maxWidth: "400px",
    textAlign: "center",
  },
  rankingList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
  },
  rankingItem: {
    fontSize: "16px",
    margin: "5px 0",
  },
};

export default Home;
