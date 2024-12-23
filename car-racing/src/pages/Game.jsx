


import React, { useState, useEffect } from "react";

const Game = () => {
  const [carPosition, setCarPosition] = useState({ x: 50, y: 400 });
  const [obstacles, setObstacles] = useState([]);
  const [speed, setSpeed] = useState(5); // Velocidad inicial de los obstáculos
  const [score, setScore] = useState(0); // Puntuación o tiempo de supervivencia
  const [obstacleInterval, setObstacleInterval] = useState(1500); // Intervalo inicial de generación de obstáculos

  const handleTouch = (event) => {
    const touchX = event.touches[0].clientX;
    setCarPosition((prev) => ({ ...prev, x: touchX }));
  };

  // Generar nuevos obstáculos a intervalos regulares
  useEffect(() => {
    const generateObstacle = () => {
      setObstacles((prev) => [
        ...prev,
        {
          x: Math.random() * (window.innerWidth - 50), // Posición aleatoria
          y: -50, // Empieza fuera de la pantalla
        },
      ]);
    };

    const interval = setInterval(generateObstacle, obstacleInterval);
    return () => clearInterval(interval);
  }, [obstacleInterval]);

  // Mover obstáculos y aumentar la velocidad con el tiempo
  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, y: obs.y + speed }))
          .filter((obs) => obs.y < window.innerHeight) // Filtrar obstáculos fuera de pantalla
      );

      // Incrementar puntuación y ajustar velocidad y frecuencia
      setScore((prev) => prev + 1);
      if (score > 0 && score % 50 === 0) {
        setSpeed((prev) => prev + 1); // Aumenta la velocidad cada 50 puntos
        setObstacleInterval((prev) => Math.max(300, prev - 100)); // Reduce el intervalo, mínimo 300ms
      }
    }, 50); // Movimiento constante cada 50 ms
    return () => clearInterval(interval);
  }, [score, speed]);

  // Detectar colisiones
  useEffect(() => {
    obstacles.forEach((obs) => {
      if (
        carPosition.x < obs.x + 50 &&
        carPosition.x + 50 > obs.x &&
        carPosition.y < obs.y + 50 &&
        carPosition.y + 100 > obs.y
      ) {
        alert(`¡Chocaste! Tu puntuación fue: ${score}`);
        window.location.reload();
      }
    });
  }, [carPosition, obstacles, score]);

  return (
    <div style={styles.container} onTouchMove={handleTouch}>
      <h1 style={styles.score}>Puntuación: {score}</h1>
      {obstacles.map((obs, index) => (
        <div key={index} style={{ ...styles.obstacle, left: obs.x, top: obs.y }} />
      ))}
      <div style={{ ...styles.car, left: carPosition.x, top: carPosition.y }} />
    </div>
  );
};

const styles = {
  container: { position: "relative", width: "100%", height: "100vh", background: "#ccc", overflow: "hidden" },
  car: { position: "absolute", width: "50px", height: "100px", background: "red", borderRadius: "10px" },
  obstacle: { position: "absolute", width: "50px", height: "50px", background: "black", borderRadius: "5px" },
  score: { position: "absolute", top: "10px", left: "10px", fontSize: "20px", color: "white" },
};

export default Game;
