import React, { useEffect, useRef } from 'react';
import $ from 'jquery';
import JustGage from 'justgage';

const Temperatura = () => {
    const accessToken = "042a3803627d73635a76c369fe055346618db7e5";
    const deviceID = "0a10aced202194944a0593e8";
    const url = `https://api.particle.io/v1/devices/${deviceID}/gradosC`;

    // Referencias para los medidores
    const gCelsiusRef = useRef(null);
    const gFahrenheitRef = useRef(null);

    useEffect(() => {
        // Inicializa los medidores solo si aún no han sido creados
        if (!gCelsiusRef.current) {
            gCelsiusRef.current = new JustGage({
                id: "gaugeC",
                value: 0,
                min: 0,
                max: 350,
                title: "Temperatura (°C)"
            });
        }

        if (!gFahrenheitRef.current) {
            gFahrenheitRef.current = new JustGage({
                id: "gaugeF",
                value: 0,
                min: 0,
                max: 650,
                title: "Temperatura (°F)"
            });
        }

        const changeBackgroundColor = (tempC) => {
            if (tempC < 20) {
                document.body.style.backgroundColor = "#0000FF";
            } else if (tempC > 20 && tempC < 40) {
                document.body.style.backgroundColor = "#FFA500";
            } else if (tempC > 40) {
                document.body.style.backgroundColor = "#FF0000";
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
                    alert("There was a problem with the request.");
                });
        };

        getReading();
        const intervalId = setInterval(getReading, 1000);

        // Limpia el intervalo al desmontar el componente
        return () => clearInterval(intervalId);
    }, [url]);

    return (
        <div className="gauge-container" style={{ display: 'flex', justifyContent: 'center', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
                <h2>Temperatura (°C)</h2>
                <div id="gaugeC" style={{ width: '800px', height: '760px' }}></div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <h2>Temperatura (°F)</h2>
                <div id="gaugeF" style={{ width: '800px', height: '760px' }}></div>
            </div>
        </div>
    );
};

export default Temperatura;
