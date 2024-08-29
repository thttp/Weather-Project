import requests
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("API_KEY")

cidade = input('Informe uma cidade: ')

unidade_param = 'metric'
link = f"https://api.openweathermap.org/data/2.5/weather?q={cidade}&appid={api_key}&lang=pt_br&units={unidade_param}"

try:
    requisicao = requests.get(link)
    requisicao.raise_for_status() 
    dicionario_requisicao = requisicao.json()
    
    if requisicao.status_code == 200:
        descricao = dicionario_requisicao['weather'][0]['description']
        temperatura = dicionario_requisicao['main']['temp']
        humidade = dicionario_requisicao['main']['humidity']
        vento = dicionario_requisicao['wind']['speed']
        
        precipitação = dicionario_requisicao.get('rain', {}).get('1h', 0)
        if precipitação == 0:
            precipitação = dicionario_requisicao.get('snow', {}).get('1h', 0)

        print(f'{descricao.capitalize()}, {temperatura:.1f}°C, humidade: {humidade}%, ventos de {vento:.1f} km/h, precipitação: {precipitação:.1f} mm')
    else:
        print("Cidade não encontrada.")
except requests.exceptions.RequestException as e:
    print(f"Erro ao fazer a requisição: {e}")
