import { GetStaticPaths, GetStaticProps } from "next"

export default function BlogPost({date}: any) {
  return (
   <h1>Blog date: {date}</h1>
 )
}

//quando o getStaticProps depende de um parâmetro, é precis criar essa nova função getStaticPaths
export const getStaticPaths: GetStaticPaths = async () => {
  return{
    paths: [], // retorna uma lista de quai post quero gerar de uma maneira estática, porém, se tiver muito post, a build vai demorar uma eternidade para carregar tudo. 
    /**
     * Existe duas saídas: deixar vazio, ai vai gerar uma versão estática só quando acessar esse endereço; deixar uma lista dos post com mais acessos, para ja ter a versão estática.
     */
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async () => {

  return {
    props: {
      date: new Date().toISOString()
    }
  }
}