import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || '';

const App = () => {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const getResponse = async () => {
        if (!value) {
            setError("Error! Please ask a question!");
            return;
        }
        try {
            const options = {
                method: "POST",
                body: JSON.stringify({
                    history: chatHistory,
                    message: value,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const response = await fetch(`${API_BASE_URL}/api/gemini`, options);
            const data = await response.text();
            console.log(data);
            setChatHistory((oldChatHistory) => [
                ...oldChatHistory,
                {
                    role: "user",
                    parts: [{ text: value }],
                },
                {
                    role: "model",
                    parts: [{ text: data }],
                },
            ]);
            setValue("");
        } catch (error) {
            console.error(error);
            setError("Something went wrong! Please try again later!");
        }
    };

    return (
        <div className="container mt-5">
            <div className="card chat-card">
                <div className="card-header text-center">
                    <h4 className="mb-0">Multi-Turn Chatbot</h4>
                </div>
                <div className="card-body chat-history-container">
                    {chatHistory.map((chatItem, index) => (
                        <div key={index} className={`chat-message ${chatItem.role === 'user' ? 'user-message' : 'gemini-message'}`}>
                            <p className="mb-0">{chatItem.parts[0].text}</p>
                        </div>
                    ))}
                    {error && <div className="alert alert-danger mt-3" role="alert">{error}</div>}
                </div>
                <div className="card-footer chat-input-container">
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Type your message..."
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    getResponse();
                                }
                            }}
                        />
                        <button className="btn btn-primary" onClick={getResponse}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;