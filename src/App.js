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
        const response = await fetch("https://multi-turn-chatbot.vercel.app/api/gemini", options);
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
