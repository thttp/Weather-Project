import requests

api_key = "8ee77a33ad92a9aa53ea5a4db2684db2"

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

        print(f'{descricao.capitalize()}, {temperatura:.1f}°C, humidade: {humidade}%, ventos de {vento:.1f} km/h')
    else:
        print("Cidade não encontrada.")
except requests.exceptions.RequestException as e:
    print(f"Erro ao fazer a requisição: {e}")
