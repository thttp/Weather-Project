let temperatureCelsius = null;
let isCelsius = true;
let isDarkTheme = false;

async function getWeather() {
    const apiKey = '8ee77a33ad92a9aa53ea5a4db2684db2';
    const city = document.getElementById('city').value.trim();

    if (!city) {
        alert('Por favor, informe uma cidade.');
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&lang=pt_br&units=metric`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Cidade não encontrada.');
        const data = await response.json();
        
        const description = data.weather[0].description;
        temperatureCelsius = data.main.temp;
        
        document.getElementById('cityName').innerText = city.charAt(0).toUpperCase() + city.slice(1);
        document.getElementById('description').innerText = description.charAt(0).toUpperCase() + description.slice(1);
        document.getElementById('city').value = '';
        
        document.getElementById('weather').classList.add('expanded');
        updateWeatherDisplay(temperatureCelsius, true);
        updateWeatherBackground(description);
        document.getElementById('convertButton').style.display = 'inline-block';
    } catch (error) {
        alert(error.message);
    }
}

function updateWeatherDisplay(temperature, isCelsius) {
    const temperatureDisplay = isCelsius ? `${temperature.toFixed(1)}°C` : `${(temperature * 9/5 + 32).toFixed(1)}°F`;
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
