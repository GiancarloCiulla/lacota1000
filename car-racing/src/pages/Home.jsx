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
    fetchRanking(); 
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>¡Bienvenido a la cota!</h1>
      <button style={styles.button} onClick={onStart}>
        Esquiva los obstáculos
      </button>
      <div style={styles.ranking}>
        <h2>Top 10 Jugadores</h2>
        <ol style={styles.rankingList}>
          {ranking.map((player, index) => (
            <li
              key={index}
              style={
                index === 0
                  ? styles.firstPlace
                  : index === 1
                  ? styles.secondPlace
                  : index === 2
                  ? styles.thirdPlace
                  : styles.rankingItem
              }
            >
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
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  title: {
    fontSize: "36px",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "18px",
    borderRadius: "5px",
    cursor: "pointer",
    backgroundColor: "#ff5722",
    color: "#fff",
    border: "none",
    boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
    marginBottom: "20px",
  },
  ranking: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
  firstPlace: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "gold",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    margin: "10px 0",
  },
  secondPlace: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "silver",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    margin: "8px 0",
  },
  thirdPlace: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#cd7f32", // Bronce
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.8)",
    margin: "6px 0",
  },
  rankingItem: {
    fontSize: "14px",
    margin: "5px 0",
    color: "#fff",
  },
};

export default Home;
