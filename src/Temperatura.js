import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import JustGage from 'justgage';

const Temperatura = () => {
    const accessToken = "042a3803627d73635a76c369fe055346618db7e5";
    const deviceID = "0a10aced202194944a0593e8";
    const url = `https://api.particle.io/v1/devices/${deviceID}/gradosC`;

    const gCelsiusRef = useRef(null);
    const gFahrenheitRef = useRef(null);

    useEffect(() => {
        document.body.style.backgroundColor = "#FFFFFF";

        if (!gCelsiusRef.current) {
            gCelsiusRef.current = new JustGage({
                id: "gaugeC",
                value: 0,
                min: 0,
                max: 350,
                title: "Temperatura (°C)",
                gaugeWidthScale: 0.6,
                levelColors: ["#0000FF", "#FFA500", "#FF0000"]
            });
        }

        if (!gFahrenheitRef.current) {
            gFahrenheitRef.current = new JustGage({
                id: "gaugeF",
                value: 0,
                min: 0,
                max: 650,
                title: "Temperatura (°F)",
                gaugeWidthScale: 0.6,
                levelColors: ["#0000FF", "#FFA500", "#FF0000"]
            });
        }

        const changeBackgroundColor = (tempC) => {
            if (tempC < 20) {
                document.body.style.backgroundColor = "#ADD8E6";
            } else if (tempC >= 30 && tempC < 40) {
                document.body.style.backgroundColor = "#FFD580";
            } else if (tempC >= 40) {
                document.body.style.backgroundColor = "#FFB6C1";
            }
        };

        const getReading = () => {
            $.get(url, { access_token: accessToken })
                .done((data) => {
                    const tempC = parseFloat(data.result).toFixed(2);
                    const tempF = (tempC * 1.8 + 32).toFixed(2);

                    gCelsiusRef.current.refresh(tempC);
                    gFahrenheitRef.current.refresh(tempF);
                    changeBackgroundColor(tempC); 
                })
                .fail(() => {
                    alert("Hubo un problema con la solicitud.");
                });
        };

        getReading();
        const intervalId = setInterval(getReading, 1000);

        return () => clearInterval(intervalId);
    }, [url]);

    return (
        <div
            className="gauge-container"
            style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                padding: '20px',
                width: '100%',
                minHeight: '100vh',
                boxSizing: 'border-box',
            }}
        >
            <div style={{ textAlign: 'center', width: '50%', padding: '20px' }}>
                <h2 style={{ color: '#000000' }}>Temperatura (°C)</h2>
                <div id="gaugeC" style={{ width: '100%', height: '500px' }}></div>
            </div>
            <div style={{ textAlign: 'center', width: '50%', padding: '20px' }}>
                <h2 style={{ color: '#000000' }}>Temperatura (°F)</h2>
                <div id="gaugeF" style={{ width: '100%', height: '500px' }}></div>
            </div>
        </div>
    );
};

export default Temperatura;
