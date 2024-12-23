import React from "react";

const Home = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <h1>¡Bienvenido a la cota!</h1>
      <button style={styles.button} onClick={onStart}>
        Iniciar Carrera
      </button>
    </div>
  );
};

const styles = {
  container: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100vh" },
  button: { padding: "10px 20px", fontSize: "18px", borderRadius: "5px", cursor: "pointer" }
};

export default Home;
