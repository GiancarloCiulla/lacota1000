import React, { useState, useEffect } from "react";
import { collection, addDoc } from "firebase/firestore";
import db from "../firebase";

const Game = () => {
  const [carPosition, setCarPosition] = useState({ x: 50, y: 400 });
  const [obstacles, setObstacles] = useState([]);
  const [speed, setSpeed] = useState(5); // Velocidad inicial de los obstáculos
  const [score, setScore] = useState(0); // Puntuación o tiempo de supervivencia
  const [username, setUsername] = useState(""); // Nombre del jugador
  const [isGameActive, setIsGameActive] = useState(false); // Controla si el juego está activo
  const [obstacleInterval, setObstacleInterval] = useState(1500); // Intervalo inicial de generación de obstáculos

  // Función para guardar el puntaje
  const saveScore = async (newScore) => {
    if (!username) return; // No guardar si no hay un nombre de usuario
    try {
      await addDoc(collection(db, "rankings"), {
        name: username,
        score: newScore,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error al guardar la puntuación:", error);
    }
  };

  const handleTouch = (event) => {
    if (!isGameActive) return; // No mover el coche si el juego no está activo
    event.preventDefault(); // Previene el desplazamiento de la pantalla
    const touchX = event.touches[0].clientX;

    setCarPosition((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(window.innerWidth - 50, touchX - 25)), // Asegura que no se salga de los límites
    }));
  };

  useEffect(() => {
    const preventScroll = (event) => {
      event.preventDefault();
    };

    // Deshabilita el desplazamiento al tocar la pantalla
    document.body.addEventListener("touchmove", preventScroll, { passive: false });

    return () => {
      // Limpia el evento al desmontar el componente
      document.body.removeEventListener("touchmove", preventScroll);
    };
  }, []);

  // Generar nuevos obstáculos
  useEffect(() => {
    if (!isGameActive) return; // No generar obstáculos si el juego no está activo
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
  }, [obstacleInterval, isGameActive]);

  // Mover obstáculos y ajustar velocidad
  useEffect(() => {
    if (!isGameActive) return; // No mover obstáculos si el juego no está activo
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev
          .map((obs) => ({ ...obs, y: obs.y + speed }))
          .filter((obs) => obs.y < window.innerHeight) // Filtrar obstáculos fuera de pantalla
      );

      setScore((prev) => prev + 1);
      if (score > 0 && score % 50 === 0) {
        setSpeed((prev) => prev + 1); // Incrementa velocidad cada 50 puntos
        setObstacleInterval((prev) => Math.max(300, prev - 100)); // Reduce el intervalo
      }
    }, 50);

    return () => clearInterval(interval);
  }, [score, speed, isGameActive]);

  // Detectar colisiones
  useEffect(() => {
    if (!isGameActive) return; // No detectar colisiones si el juego no está activo
    obstacles.forEach((obs) => {
      const playerWidth = 40;
      const playerHeight = 20;
      const obstacleWidth = 40;
      const obstacleHeight = 20;

      if (
        carPosition.x < obs.x + obstacleWidth &&
        carPosition.x + playerWidth > obs.x &&
        carPosition.y < obs.y + obstacleHeight &&
        carPosition.y + playerHeight > obs.y
      ) {
        saveScore(score); // Guarda la puntuación en Firebase
        alert(`¡Chocaste! Tu puntuación fue: ${score}`);
        setIsGameActive(false);
        setObstacles([]);
        setScore(0);
      }
    });
  }, [carPosition, obstacles, score, isGameActive]);

  const startGame = () => {
    if (!username.trim()) {
      alert("Por favor, ingresa un nombre de usuario antes de comenzar.");
      return;
    }
    setIsGameActive(true);
    setScore(0);
    setObstacles([]);
    setSpeed(5);
    setObstacleInterval(1500);
  };

  return (
    <div style={styles.container} onTouchMove={handleTouch}>
      {!isGameActive && (
        <div style={styles.startScreen}>
          <h1>Bienvenido al Juego</h1>
          <input
            type="text"
            placeholder="Ingresa tu nombre"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <button onClick={startGame} style={styles.button}>
            Comenzar
          </button>
        </div>
      )}
      {isGameActive && (
        <>
          <h1 style={styles.score}>Puntuación: {score}</h1>
          {obstacles.map((obs, index) => (
            <div
              key={index}
              style={{
                ...styles.obstacle,
                left: obs.x,
                top: obs.y,
              }}
            />
          ))}
          <div style={{ ...styles.skater, left: carPosition.x, top: carPosition.y }} />
        </>
      )}
    </div>
  );
};

const styles = {
  container: { position: "relative", width: "100%", height: "100vh", background: "#ccc", overflow: "hidden" },
  skater: {
    position: "absolute",
    width: "50px",
    height: "100px",
    backgroundImage: "url('/images/longboard.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  obstacle: {
    position: "absolute",
    width: "50px",
    height: "50px",
    backgroundImage: "url('/images/hole.png')",
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
  },
  score: { position: "absolute", top: "10px", left: "10px", fontSize: "20px", color: "white" },
  startScreen: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    backgroundColor: "#ccc",
  },
  input: { padding: "10px", fontSize: "16px", marginBottom: "20px" },
  button: { padding: "10px 20px", fontSize: "18px", cursor: "pointer" },
};

export default Game;



// import React, { useState, useEffect } from "react";


// const Game = () => {
//   const [carPosition, setCarPosition] = useState({ x: 50, y: 400 });
//   const [obstacles, setObstacles] = useState([]);
//   const [speed, setSpeed] = useState(5); // Velocidad inicial de los obstáculos
//   const [score, setScore] = useState(0); // Puntuación o tiempo de supervivencia
//   const [obstacleInterval, setObstacleInterval] = useState(1500); // Intervalo inicial de generación de obstáculos

//   const handleTouch = (event) => {
//     event.preventDefault(); // Previene el desplazamiento de la pantalla
//     const touchX = event.touches[0].clientX;

//     setCarPosition((prev) => ({
//       ...prev,
//       x: Math.max(0, Math.min(window.innerWidth - 50, touchX - 25)), // Asegura que no se salga de los límites
//     }));
//   };

//   useEffect(() => {
//     const preventScroll = (event) => {
//       event.preventDefault();
//     };

//     // Deshabilita el desplazamiento al tocar la pantalla
//     document.body.addEventListener("touchmove", preventScroll, { passive: false });

//     return () => {
//       // Limpia el evento al desmontar el componente
//       document.body.removeEventListener("touchmove", preventScroll);
//     };
//   }, []);

//   // Generar nuevos obstáculos
//   useEffect(() => {
//     const generateObstacle = () => {
//       setObstacles((prev) => [
//         ...prev,
//         {
//           x: Math.random() * (window.innerWidth - 50), // Posición aleatoria
//           y: -50, // Empieza fuera de la pantalla
//         },
//       ]);
//     };

//     const interval = setInterval(generateObstacle, obstacleInterval);
//     return () => clearInterval(interval);
//   }, [obstacleInterval]);

//   // Mover obstáculos y ajustar velocidad
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setObstacles((prev) =>
//         prev
//           .map((obs) => ({ ...obs, y: obs.y + speed }))
//           .filter((obs) => obs.y < window.innerHeight) // Filtrar obstáculos fuera de pantalla
//       );

//       setScore((prev) => prev + 1);
//       if (score > 0 && score % 50 === 0) {
//         setSpeed((prev) => prev + 1); // Incrementa velocidad cada 50 puntos
//         setObstacleInterval((prev) => Math.max(300, prev - 100)); // Reduce el intervalo
//       }
//     }, 50);

//     return () => clearInterval(interval);
//   }, [score, speed]);

//   // Detectar colisiones
//   useEffect(() => {
//     obstacles.forEach((obs) => {
//       const playerWidth = 40;
//       const playerHeight = 20;
//       const obstacleWidth = 40;
//       const obstacleHeight = 20;

//       if (
//         carPosition.x < obs.x + obstacleWidth &&
//         carPosition.x + playerWidth > obs.x &&
//         carPosition.y < obs.y + obstacleHeight &&
//         carPosition.y + playerHeight > obs.y
//       ) {
//         alert(`¡Chocaste! Tu puntuación fue: ${score}`);
//         window.location.reload();
//       }
//     });
//   }, [carPosition, obstacles,score]);

//   return (
//     <div style={styles.container} onTouchMove={handleTouch}>
//       <h1 style={styles.score}>Puntuación: {score}</h1>
//       {obstacles.map((obs, index) => (
//         <div
//           key={index}
//           style={{
//             ...styles.obstacle,
//             left: obs.x,
//             top: obs.y,
//           }}
//         />
//       ))}
//       <div style={{ ...styles.skater, left: carPosition.x, top: carPosition.y }} />
//     </div>
//   );
// };

// const styles = {
//   container: { position: "relative", width: "100%", height: "100vh", background: "#ccc", overflow: "hidden" },
//   skater: {
//     position: "absolute",
//     width: "50px",
//     height: "100px",
//     backgroundImage: "url('/images/longboard.png')",
//     backgroundSize: "contain",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//   },
//   obstacle: {
//     position: "absolute",
//     width: "50px",
//     height: "50px",
//     backgroundImage: "url('/images/hole.png')",
//     backgroundSize: "contain",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//   },
//   score: { position: "absolute", top: "10px", left: "10px", fontSize: "20px", color: "white" },
// };

// export default Game;












// import React, { useState, useEffect } from "react";

// const Game = () => {
//   const [carPosition, setCarPosition] = useState({ x: 50, y: 400 });
//   const [obstacles, setObstacles] = useState([]);
//   const [speed, setSpeed] = useState(5); // Velocidad inicial de los obstáculos
//   const [score, setScore] = useState(0); // Puntuación o tiempo de supervivencia
//   const [obstacleInterval, setObstacleInterval] = useState(1500); // Intervalo inicial de generación de obstáculos

//   const handleTouch = (event) => {
//     const touchX = event.touches[0].clientX;
//     setCarPosition((prev) => ({ ...prev, x: touchX }));
//   };

//   // Generar nuevos obstáculos a intervalos regulares
//   useEffect(() => {
//     const generateObstacle = () => {
//       setObstacles((prev) => [
//         ...prev,
//         {
//           x: Math.random() * (window.innerWidth - 50), // Posición aleatoria
//           y: -50, // Empieza fuera de la pantalla
//         },
//       ]);
//     };

//     const interval = setInterval(generateObstacle, obstacleInterval);
//     return () => clearInterval(interval);
//   }, [obstacleInterval]);

//   // Mover obstáculos y aumentar la velocidad con el tiempo
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setObstacles((prev) =>
//         prev
//           .map((obs) => ({ ...obs, y: obs.y + speed }))
//           .filter((obs) => obs.y < window.innerHeight) // Filtrar obstáculos fuera de pantalla
//       );

//       // Incrementar puntuación y ajustar velocidad y frecuencia
//       setScore((prev) => prev + 1);
//       if (score > 0 && score % 50 === 0) {
//         setSpeed((prev) => prev + 1); // Aumenta la velocidad cada 50 puntos
//         setObstacleInterval((prev) => Math.max(300, prev - 100)); // Reduce el intervalo, mínimo 300ms
//       }
//     }, 50); // Movimiento constante cada 50 ms
//     return () => clearInterval(interval);
//   }, [score, speed]);

//   // Detectar colisiones
//   useEffect(() => {
//     obstacles.forEach((obs) => {
//       // Ajuste de las dimensiones de colisión
//       const playerWidth = 40; // Ancho virtual del jugador (reduce el tamaño real)
//       const playerHeight = 50; // Altura virtual del jugador
//       const obstacleWidth = 40; // Ancho virtual del obstáculo
//       const obstacleHeight = 40; // Altura virtual del obstáculo
  
//       if (
//         carPosition.x < obs.x + obstacleWidth && // Derecha del jugador con izquierda del obstáculo
//         carPosition.x + playerWidth > obs.x && // Izquierda del jugador con derecha del obstáculo
//         carPosition.y < obs.y + obstacleHeight && // Abajo del jugador con arriba del obstáculo
//         carPosition.y + playerHeight > obs.y // Arriba del jugador con abajo del obstáculo
//       ) {
//         alert(`¡Chocaste! Tu puntuación fue: ${score}`);
//         window.location.reload();
//       }
//     });
//   }, [carPosition, obstacles, score]);
  

//   return (
//     <div style={styles.container} onTouchMove={handleTouch}>
//       <h1 style={styles.score}>Puntuación: {score}</h1>
//       {obstacles.map((obs, index) => (
//         <div
//           key={index}
//           style={{
//             ...styles.obstacle,
//             left: obs.x,
//             top: obs.y,
//           }}
//         />
//       ))}
//       <div style={{ ...styles.skater, left: carPosition.x, top: carPosition.y }} />
//     </div>
//   );
// };

// const styles = {
//   container: { position: "relative", width: "100%", height: "100vh", background: "#ccc", overflow: "hidden" },
//   skater: {
//     position: "absolute",
//     width: "50px",
//     height: "100px",
//     backgroundImage: "url('/images/longboard.png')", // Cambia el nombre por tu imagen
//     backgroundSize: "contain",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//   },
//   obstacle: {
//     position: "absolute",
//     width: "50px",
//     height: "50px",
//     backgroundImage: "url('/images/hole.png')", // Ruta de la imagen del obstáculo
//     backgroundSize: "contain", // Ajusta la imagen al contenedor
//     backgroundRepeat: "no-repeat", // No repetir la imagen
//     backgroundPosition: "center", // Centrar la imagen
//   },
//   score: { position: "absolute", top: "10px", left: "10px", fontSize: "20px", color: "white" },
// };

// export default Game;




// import React, { useState, useEffect } from "react";

// const Game = () => {
//   const [carPosition, setCarPosition] = useState({ x: 50, y: 400 });
//   const [obstacles, setObstacles] = useState([]);
//   const [speed, setSpeed] = useState(5); // Velocidad inicial de los obstáculos
//   const [score, setScore] = useState(0); // Puntuación o tiempo de supervivencia
//   const [obstacleInterval, setObstacleInterval] = useState(1500); // Intervalo inicial de generación de obstáculos

//   const handleTouch = (event) => {
//     const touchX = event.touches[0].clientX;
//     setCarPosition((prev) => ({ ...prev, x: touchX }));
//   };

//   // Generar nuevos obstáculos a intervalos regulares
//   useEffect(() => {
//     const generateObstacle = () => {
//       setObstacles((prev) => [
//         ...prev,
//         {
//           x: Math.random() * (window.innerWidth - 50), // Posición aleatoria
//           y: -50, // Empieza fuera de la pantalla
//         },
//       ]);
//     };

//     const interval = setInterval(generateObstacle, obstacleInterval);
//     return () => clearInterval(interval);
//   }, [obstacleInterval]);

//   // Mover obstáculos y aumentar la velocidad con el tiempo
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setObstacles((prev) =>
//         prev
//           .map((obs) => ({ ...obs, y: obs.y + speed }))
//           .filter((obs) => obs.y < window.innerHeight) // Filtrar obstáculos fuera de pantalla
//       );

//       // Incrementar puntuación y ajustar velocidad y frecuencia
//       setScore((prev) => prev + 1);
//       if (score > 0 && score % 50 === 0) {
//         setSpeed((prev) => prev + 1); // Aumenta la velocidad cada 50 puntos
//         setObstacleInterval((prev) => Math.max(300, prev - 100)); // Reduce el intervalo, mínimo 300ms
//       }
//     }, 50); // Movimiento constante cada 50 ms
//     return () => clearInterval(interval);
//   }, [score, speed]);

//   // Detectar colisiones
//   useEffect(() => {
//     obstacles.forEach((obs) => {
//       if (
//         carPosition.x < obs.x + 50 &&
//         carPosition.x + 50 > obs.x &&
//         carPosition.y < obs.y + 50 &&
//         carPosition.y + 100 > obs.y
//       ) {
//         alert(`¡Chocaste! Tu puntuación fue: ${score}`);
//         window.location.reload();
//       }
//     });
//   }, [carPosition, obstacles, score]);

//   return (
//     <div style={styles.container} onTouchMove={handleTouch}>
//       <h1 style={styles.score}>Puntuación: {score}</h1>
//       {obstacles.map((obs, index) => (
//         <div key={index} style={{ ...styles.obstacle, left: obs.x, top: obs.y }} />
//       ))}
//       <div style={{ ...styles.car, left: carPosition.x, top: carPosition.y }} />
//     </div>
//   );
// };

// const styles = {
//   container: { position: "relative", width: "100%", height: "100vh", background: "#ccc", overflow: "hidden" },
//   car: { position: "absolute", width: "50px", height: "100px", background: "red", borderRadius: "10px" },
//   obstacle: { position: "absolute", width: "50px", height: "50px", background: "black", borderRadius: "5px" },
//   score: { position: "absolute", top: "10px", left: "10px", fontSize: "20px", color: "white" },
// };

// export default Game;
