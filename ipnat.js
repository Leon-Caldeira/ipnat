//Var declaration
var today = new Date()

//Get resources
var resource = mailContent

//Data treatment
var mimeResource = resource.getContentAsMimeAttachment()
content = mimeResource.content

//Content replacement
content = content.replace("{{reserva}}",requestedBY)
content = content.replace("{{requisitante}}","Requisitante")
content = content.replace("{{data}}",today.toLocaleDateString('pt-br'))
content = content.replace("{{justificativa}}","Justificativa")

//First line
content = content.replace("{{hn01}}",array_in[1,1])
content = content.replace("{{ir01}}",array_in[1,2])
//content = content.replace("{{in01}}",DadosDeSaida[1])
content = content.replace("{{pr01}}",projectName)

//Next Lines & Hostname counter
var hostsCounter = array_in.length

for (var i = 2; i <= hostsCounter; i++)
{
    content = content.replace("{{hn0" + i + "}}",array_in[i,1])
    content = content.replace("{{ir0" + i + "}}",array_in[i,2])
    content = content.replace("{{in0" + i + "}}",DadosDeSaida[i])
    content = content.replace("{{pr0" + i + "}}",projectName)

    //Removes the comment section

    content = content.replace("<!--0" + i,"")
    content = content.replace("0 " + i + "-->","")
}