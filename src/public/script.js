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
            ? `-${Math.abs(temperature).toFixed(0)}°` 
            : `${temperature.toFixed(0)}°`)
        : `${(temperature * 9/5 + 32).toFixed(0)}°`;
    
    document.getElementById('result').innerHTML = `<p class="temperature">${temperatureDisplay}</p>`;
}

function updateWeatherBackground(description) {
    const weatherElement = document.getElementById('weather');
    
    const weatherConditions = {
        'céu limpo': 'linear-gradient(to bottom, #87CEEB, #4682B4)',
        'nublado': 'linear-gradient(to bottom, #B0C4DE, #696969)',
        'chuva': 'linear-gradient(to bottom, #4682B4, #00008B)',
        'neve': 'linear-gradient(to bottom, #FFFFFF, #D3D3D3)',
        'nevoeiro': 'linear-gradient(to bottom, #D3D3D3, #A9A9A9)'
    };

    const backgroundGradient = Object.keys(weatherConditions).find(condition => description.includes(condition)) 
        ? weatherConditions[description]
        : 'linear-gradient(to bottom, #FFFFFF, #D3D3D3)';

    weatherElement.style.background = backgroundGradient;
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
