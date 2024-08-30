let temperatureCelsius = null;
let isCelsius = true;

async function getWeather() {
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Por favor, informe uma cidade.');
        return;
    }

    try {
        const response = await fetch(`/api/weather?city=${city}`);
        if (!response.ok) throw new Error('Cidade não encontrada.');
        const data = await response.json();

        const description = data.weather[0].description;
        temperatureCelsius = data.main.temp;
        const humidity = data.main.humidity;
        const windSpeed = data.wind.speed;
        const precipitation = data.rain ? data.rain['1h'] : 0;

        document.getElementById('description').innerText = description.charAt(0).toUpperCase() + description.slice(1);
        document.getElementById('cityName').innerText = city.charAt(0).toUpperCase() + city.slice(1);
        document.getElementById('humidity').textContent = `${humidity}%`;
        document.getElementById('windSpeed').innerText = `${windSpeed} km/h`;
        document.getElementById('precipitation').textContent = precipitation > 0 ? `${precipitation} mm` : '0 mm';
        document.getElementById('city').value = '';

        document.getElementById('windIcon').style.display = 'inline'; 
        document.getElementById('humidityIcon').style.display = 'inline';
        document.getElementById('cityIcon').style.display = 'inline';
        document.getElementById('precipitationIcon').style.display = 'inline'; 

        const weatherElement = document.getElementById('weather');
        if (!weatherElement.classList.contains('expanded')) {
            weatherElement.classList.add('animate');
        }
        weatherElement.classList.add('expanded');

        document.getElementById('card').style.display = 'block';

        updateWeatherDisplay(temperatureCelsius, true);
        document.getElementById('convertButton').style.display = 'inline-block';

        weatherElement.addEventListener('animationend', () => {
            weatherElement.classList.remove('animate');
        }, { once: true });
    } catch (error) {
        alert(error.message);
    }
}

function updateWeatherDisplay(temperature, isCelsius) {
    const temperatureDisplay = isCelsius 
        ? (temperature < 0 
            ? `-${Math.abs(temperature).toFixed(0)}°` 
            : `${temperature.toFixed(0)}°`)
        : `${(temperature * 9/5 + 32).toFixed(0)}°`;
    
    document.getElementById('result').innerHTML = `<p class="temperature">${temperatureDisplay}</p>`;
}

function toggleTemperatureUnit() {
    if (temperatureCelsius !== null) {
        isCelsius = !isCelsius;
        updateWeatherDisplay(temperatureCelsius, isCelsius);
        document.getElementById('convertButton').textContent = isCelsius ? '°F' : '°C';
    } else {
        alert("Por favor, consulte o clima primeiro.");
    }
}

document.getElementById('city').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getWeather();
    }
});
