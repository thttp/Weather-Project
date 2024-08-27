let temperatureCelsius = null;
let isCelsius = true;
let isDarkTheme = false;

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

        document.getElementById('description').innerText = description.charAt(0).toUpperCase() + description.slice(1);
        document.getElementById('cityName').innerText = city.charAt(0).toUpperCase() + city.slice(1);
        document.getElementById('humidity').innerText = `Umidade: ${humidity}%`;
        document.getElementById('windSpeed').innerText = `Ventos: ${windSpeed} km/h`;
        document.getElementById('city').value = '';

        const weatherElement = document.getElementById('weather');
        if (!weatherElement.classList.contains('expanded')) {
            weatherElement.classList.add('animate');
        }
        weatherElement.classList.add('expanded');

        updateWeatherDisplay(temperatureCelsius, true);
        updateWeatherBackground(description);
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
            ? `-${Math.abs(temperature).toFixed(1)}°C` 
            : `${temperature.toFixed(1)}°C`)
        : `${(temperature * 9/5 + 32).toFixed(1)}°F`;
    
    document.getElementById('result').innerHTML = `<p class="temperature">${temperatureDisplay}</p>`;
}


function updateWeatherBackground(description) {
    const weatherElement = document.getElementById('weather');
    const weatherConditions = {
        'céu limpo': '#87CEEB',
        'nublado': '#B0C4DE',
        'chuva': '#4682B4',
        'neve': '#FFFFFF',
        'nevoeiro': '#D3D3D3'
    };

    const backgroundColor = Object.keys(weatherConditions).find(condition => description.includes(condition)) || '#FFFFFF';
    weatherElement.style.backgroundColor = weatherConditions[backgroundColor];
}

function toggleTemperatureUnit() {
    if (temperatureCelsius !== null) {
        isCelsius = !isCelsius;
        updateWeatherDisplay(temperatureCelsius, isCelsius);
        document.getElementById('convertButton').textContent = isCelsius ? 'Converter para °F' : 'Converter para °C';
    } else {
        alert("Por favor, consulte o clima primeiro.");
    }
}

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme', isDarkTheme);
    document.getElementById('themeToggle').setAttribute('aria-label', isDarkTheme ? 'Modo Claro' : 'Modo Escuro');
    document.getElementById('weather').classList.toggle('dark-theme', isDarkTheme);
}

document.getElementById('city').addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        getWeather();
    }
});
