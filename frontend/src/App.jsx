import { useState } from 'react';

function App() {
    const [field, setField] = useState('name');
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);

    const search = async () => {
        const res = await fetch(`http://localhost:5000/search?field=${field}&query=${query}`);
        const data = await res.json();
        setResults(data);
    };

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial' }}>
            <h2>Поиск игроков спортивной команды</h2>

            <select value={field} onChange={e => setField(e.target.value)}>
                <option value="name">ФИО</option>
                <option value="city">Город</option>
            </select>

            <input
                type="text"
                placeholder="Введите запрос..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                style={{ marginLeft: '10px' }}
            />

            <button onClick={search} style={{ marginLeft: '10px' }}>Поиск</button>

            <table border="1" cellPadding="6" style={{ marginTop: '20px', borderCollapse: 'collapse' }}>
                <thead>
                <tr>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Город</th>
                    <th>Рост</th>
                    <th>Вес</th>
                </tr>
                </thead>
                <tbody>
                {results.map((r, i) => (
                    <tr key={i}>
                        <td>{r.last_name}</td>
                        <td>{r.first_name}</td>
                        <td>{r.middle_name}</td>
                        <td>{r.city}</td>
                        <td>{r.height_cm}</td>
                        <td>{r.weight_kg}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default App;
