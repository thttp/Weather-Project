import requests
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv('API_KEY')

if not api_key:
    raise ValueError("A variável de ambiente API_KEY não está definida")

cidade = input('Informe uma cidade: ')
unidade = input('Digite "C" para Celsius ou "F" para Fahrenheit: ').strip().upper()

unidade_param = 'metric' if unidade == 'C' else 'imperial'
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

        print(f'{descricao.capitalize()}, {temperatura:.1f}°{unidade}, humidade: {humidade}%, ventos de {vento:.1f} km/h')
    else:
        print("Cidade não encontrada.")
except requests.exceptions.RequestException as e:
    print(f"Erro ao fazer a requisição: {e}")
