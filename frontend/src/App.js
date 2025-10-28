import { useState, useEffect } from "react";

function App() {
    const [field, setField] = useState("first_name");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [notFound, setNotFound] = useState(false);

    // Загрузка всех игроков
    const loadAllPlayers = async () => {
        try {
            const response = await fetch("http://localhost:5000/all");
            const data = await response.json();

            let playersArray = [];
            if (Array.isArray(data)) {
                playersArray = data;
            } else if (data && typeof data === "object") {
                if (Array.isArray(data.players)) {
                    playersArray = data.players;
                } else if (Array.isArray(data.data)) {
                    playersArray = data.data;
                }
            }

            setResults(playersArray);
            setNotFound(playersArray.length === 0);
        } catch (error) {
            console.error("Ошибка при загрузке всех игроков:", error);
            setResults([]);
            setNotFound(true);
        }
    };

    //  Поиск игроков
    const search = async () => {
        const trimmedQuery = query.trim();

        // Если поле пустое — просто загружаем всех
        if (!trimmedQuery) {
            await loadAllPlayers();
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5000/search?field=${field}&query=${encodeURIComponent(trimmedQuery)}`
            );
            const data = await response.json();

            let playersArray = [];
            if (Array.isArray(data)) {
                playersArray = data;
            } else if (data && typeof data === "object") {
                if (Array.isArray(data.players)) {
                    playersArray = data.players;
                } else if (Array.isArray(data.data)) {
                    playersArray = data.data;
                }
            }

            setResults(playersArray);
            setNotFound(playersArray.length === 0); // если пусто → показать "не найдено"
        } catch (err) {
            console.error("Ошибка при поиске:", err);
            setResults([]);
            setNotFound(true);
        }
    };

    //  Поиск при нажатии Enter
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            search();
        }
    };

    //  При загрузке страницы выводим всех
    useEffect(() => {
        loadAllPlayers();
    }, []);

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "radial-gradient(circle at top, #111 0%, #000 80%)",
                color: "#fff",
                fontFamily: "'Segoe UI', sans-serif",
                overflow: "auto",
                padding: "40px",
            }}
        >
            <h1
                style={{
                    marginBottom: "30px",
                    fontSize: "3rem",
                    fontWeight: "800",
                    letterSpacing: "1px",
                    background: "linear-gradient(90deg, #00ff84, #10b981)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    textTransform: "uppercase",
                }}
            >
                Спортивная команда
            </h1>

            <div
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    padding: "30px",
                    borderRadius: "20px",
                    minWidth: "800px",
                    boxShadow: "0 0 30px rgba(0, 255, 132, 0.2)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(0,255,132,0.3)",
                    transition: "all 0.3s ease",
                }}
            >

                <div
                    style={{
                        marginBottom: "25px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "10px",
                    }}
                >
                    <select
                        value={field}
                        onChange={(e) => setField(e.target.value)}
                        style={{
                            padding: "10px",
                            borderRadius: "10px",
                            border: "1px solid rgba(0,255,132,0.5)",
                            backgroundColor: "#000",
                            color: "#00ff84",
                            fontWeight: "bold",
                            outline: "none",
                            transition: "0.3s",
                        }}
                    >
                        <option value="first_name">По имени</option>
                        <option value="last_name">По фамилии</option>
                        <option value="city">По городу</option>
                    </select>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Введите запрос"
                        style={{
                            flex: 1,
                            padding: "10px 15px",
                            borderRadius: "10px",
                            border: "1px solid rgba(255,255,255,0.2)",
                            backgroundColor: "#111",
                            color: "#fff",
                            fontSize: "1rem",
                            outline: "none",
                            width: "300px",
                            transition: "border 0.3s",
                        }}
                        onFocus={(e) =>
                            (e.target.style.border = "1px solid #00ff84")
                        }
                        onBlur={(e) =>
                            (e.target.style.border =
                                "1px solid rgba(255,255,255,0.2)")
                        }
                    />

                    <button
                        onClick={search}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "10px",
                            border: "none",
                            background: "linear-gradient(90deg, #00ff84, #10b981)",
                            color: "#000",
                            fontWeight: "800",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                        }
                    >
                        Поиск
                    </button>


                    <button
                        onClick={loadAllPlayers}
                        style={{
                            padding: "10px 20px",
                            borderRadius: "10px",
                            border: "none",
                            background: "rgba(0, 255, 132, 0.2)",
                            color: "#00ff84",
                            fontWeight: "800",
                            cursor: "pointer",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                            (e.target.style.transform = "scale(1.05)")
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.transform = "scale(1)")
                        }
                    >
                        Показать всех
                    </button>
                </div>

                {/* Таблица результатов */}
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        textAlign: "center",
                        color: "#fff",
                        fontSize: "1.1rem",
                    }}
                >
                    <thead>
                    <tr>
                        <th style={thStyle}>Фамилия</th>
                        <th style={thStyle}>Имя</th>
                        <th style={thStyle}>Отчество</th>
                        <th style={thStyle}>Город</th>
                        <th style={thStyle}>Рост</th>
                        <th style={thStyle}>Вес</th>
                    </tr>
                    </thead>
                    <tbody>
                    {notFound ? (
                        <tr>
                            <td
                                colSpan="6"
                                style={{
                                    padding: "20px",
                                    color: "#ff6b6b",
                                    fontWeight: "600",
                                    fontSize: "1.1rem",
                                }}
                            >
                                Игрок с таким запросом не найден 😔
                            </td>
                        </tr>
                    ) : results.length === 0 ? (
                        <tr>
                            <td
                                colSpan="6"
                                style={{ padding: "15px", color: "#999" }}
                            >
                                Загрузка данных...
                            </td>
                        </tr>
                    ) : (
                        results.map((player, index) => (
                            <tr key={player.id || index} style={rowStyle}>
                                <td style={tdStyle}>{player.last_name || ""}</td>
                                <td style={tdStyle}>{player.first_name || ""}</td>
                                <td style={tdStyle}>{player.middle_name || ""}</td>
                                <td style={tdStyle}>{player.city || ""}</td>
                                <td style={tdStyle}>{player.height_cm || ""}</td>
                                <td style={tdStyle}>{player.weight_kg || ""}</td>
                            </tr>
                        ))
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const thStyle = {
    padding: "12px",
    background: "rgba(0, 255, 132, 0.2)",
    color: "#00ff84",
    fontWeight: "700",
    borderBottom: "2px solid rgba(0,255,132,0.3)",
};

const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
};

const rowStyle = {
    transition: "all 0.2s ease",
    cursor: "default",
};

export default App;
