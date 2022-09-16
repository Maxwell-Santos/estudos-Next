// import { Container } from './styles';

import { GetStaticPaths, GetStaticProps } from "next"
import { useRouter } from "next/router"

export default function Member({user}: any) {
  //ja que não estou mais acessando um parâmetro que vem la da rota e sim fazendo chamada api, não precisa de query
  // const {query} = useRouter()

  //pega o momento de loading para quando o cliente acessas uma rota que não foi gerada na build
  const {isFallback} = useRouter()

  if(isFallback){
    return <p>Carregando...</p>
  }
  
  return (
   <div>
    <img src={user.avatar_url} alt={user.name} width='80' style={{borderRadius: 40}} /> 
    <h1>{user.name}</h1>
    <span>{user.bio}</span>
   </div>
 )
}

//função assíncrona para dar a liberdade ao usuário de poder fazer chamadas API
export const getStaticPaths: GetStaticPaths = async () => {

  const response = await fetch('https://api.github.com/orgs/rocketseat/members')
  const data = await response.json()

  const paths = data.map((member: any) => {
    return { params: {login: member.login} }
  })
  return{
    paths, //tem que retornar um array 
    fallback: false,
  }
}

//quando a página depende de um parâmetro, precisa criar o getStaticPaths, que ele define qual será o array de dados que será formado de forma estática
//daí quando acessarem essa página, já terá a informações prontas

//Esse parâmetro é justamente o valor dinâmico, por exemplo qual é o membro
export const getStaticProps: GetStaticProps = async (context) => {
  //dentro desse context.params, consigo ter acesso aos parâmetro que vem de dentro da rota
  const { login }: any = context.params

  const response = await fetch(`https://api.github.com/users/${login}`)
  const data = await response.json()

  return{
    props:{
      user: data,

    }
  }
}