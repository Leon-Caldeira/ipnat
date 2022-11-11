import json
import requests



def addHostNextIpAvailable (context, inputs):

    #Valida as informacoes de conexao com o o Infoblox
    requests.packages.urllib3.disable_warnings()
    usr = inputs["usr"]
    pwd = inputs["pwd"]
    niosServer = inputs["niosServer"]
    hostname = inputs["hostname"]
    cidr = inputs["cidr"]
    networkView = inputs["networkView"]
    data = inputs["data"]
    projectName = inputs["projectName"]
    solicitante = inputs["solicitante"]
    alocado_por = inputs["alocado_por"]

    #Ignora certificado caso self-signed
    requests.packages.urllib3.disable_warnings()

    #Monta url de altenticacao
    infobloxAuth = requests.auth.HTTPBasicAuth(usr,pwd)

    #Parametro headers
    headers = {'Content-Type':"application/json"}

    #Monta URL para o comando de POST
    urlpost = 'https://'+niosServer+'/wapi/v2.11/record:host?_return_as_object=1'

    #Monta estrutura do payload para o POST
    payload = '{"name": "'+hostname+'","configure_for_dns": false,"view": "'+networkView+'","ipv4addrs": [{"ipv4addr":"func:nextavailableip:'+cidr+','+networkView+'"}]}'

    #Executa comando POST
    postHost = requests.post(urlpost,auth=infobloxAuth,data=payload,headers=headers,verify=False)

    #Valida execucao com sucesso ou nao
    #result = ''
    ipAddr = ''
    if (postHost.status_code != 201):
        print(postHost.status_code)
        error = json.loads(postHost.text)
        print(error['text'])
        raise Exception("Falha ao alocar o proximo IP disponivel,  favor validar informacoes fornecidas!")
    else:
        print("Next IP available Status Code",postHost.status_code)
        result = json.loads(postHost.text)
        result = result['result']
        #Monta URL com o nome do resource criado.
        urlget = 'https://'+niosServer+'/wapi/v2.11/'+result
        #Utiliza o camando GET executado para capturar a informacao do IP designado para a VM conforme o resource
        getHost = requests.get(urlget,auth=infobloxAuth,headers=headers,verify=False)
        #Captura a informacao do IP Address designado
        infoHost = json.loads(getHost.content)
        infoHost = infoHost['ipv4addrs']
        infoHost = infoHost[0]
        ipAddr = infoHost['ipv4addr']


    ## URL get com paramentro (record+name)
    urlget2 = 'https://'+niosServer+'/wapi/v2.11/record:host?name='+hostname
    print(urlget2)

    ## Get API
    getrecord2 = requests.get(urlget2, auth=infobloxAuth, headers=headers, verify=False)

    ## Ler o get em json
    result2 = json.loads(getrecord2.content)
    #print(result)

    ## Busca _ref dentro do json
    referencia2 = result2[0]
    referencia2 = referencia2 ['_ref']
    #print(referencia)


    ## Endpoint para o put
    urlput2 = ("https://"+niosServer+"/wapi/v2.11/"+referencia2)
    #print(urlput)

    ## payload
    payload2 = '{"extattrs":{"Solicitante": {"value":"'+solicitante+'"},"Projeto/Juncao" : {"value": "'+projectName+'"}, "Data_VRA": {"value" : "'+data+'"}, "Alocado por" : {"value" : "'+alocado_por+'"},"Hostname": {"value":"'+hostname+'"}}}'

    ## Executa o put no endpoint
    putHost = requests.put(urlput2, auth=infobloxAuth,data=payload2, headers=headers,verify=False)
    #Valida execucao com sucesso ou nao
    #result = ''

    addAttr = ''
    if (putHost.status_code != 200):
        print(postHost.status_code)
        #Payload
        payload = '[{"method": "STATE:ASSIGN","data":{"host_name":"'+hostname+'"}},{"method":"GET","object": "record:host","data":{"name":"##STATE:host_name:##"},"assign_state": {"host_ref": "_ref"},"enable_substitution": true,"discard": true},{"method": "DELETE", "object": "##STATE:host_ref:##","enable_substitution": true,"discard": true},{"method":"STATE:DISPLAY"}]'

        #URL com o recurso para o post
        urlPost = "https://"+niosServer+"/wapi/v2.11/request"

        #Post API para deletar Host Record
        postdelete = requests.post(urlPost, auth= infobloxAuth, data= payload, verify= False)
        print("Reclaim IP "+ipAddr+" Status Code ", postdelete.status_code)
        raise Exception(" Falha ao adicionar atributos extensiveis!!! ")

    else:
        print(" Atributos extensiveis Status Code ",putHost.status_code)


    #Retorna o IP assignado.
    print("Next IP available ", ipAddr)
    #ipAddr = "Hostname: "+hostname+" e seu ip é: "+ipAddr
    return ipAddr