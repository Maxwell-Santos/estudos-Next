import { GetStaticProps } from "next"
// import { GetServerSideProps } from "next"

type RepoNamesProps = {
  name: string;
}

/**
 * Qual o problema com esse código ?
 * Bom, basicamente o usuário essa chamada http, só é executada, depois que o site ja carregou
 * o nome disso é CSR Client Side Rendering - porque está buscando os dados da API e construindo a interface com esses dados a nível de execução
 * 
 * Se desabilitar o js no navegador, a aplicação não funciona
 */
export default function Home({ repositories, date }: any) {
  return (
    <>
    <h1>{date}</h1>
      <ul>
        {
          repositories.map((item: any) => (
            <li key={item}> {item} </li>
          ))
        }
      </ul>
    </>
  )
}

/*SSR - Server Side Rendering */

/**
 * O que é curioso é que não tem com acessar o estado do componente, porque esse requisição é feita antes de existir componente. Então ela não pode executar uma função de att de estado, ela não tem acesso á nenhum contexto do meu componente.
 * Essa função retorna props
 */
// export const getServerSideProps: GetServerSideProps = async () => {

//   const api = await fetch('https://api.github.com/users/Maxwell-Santos/repos')
//   const response = await api.json()
//   const repoNames = response.map((item: RepoNamesProps) => item.name)

//   return {
//     props: {
//       /*Aqui dentro posso retornar o dado que eu quiser*/
//       repositories: repoNames

//     }
//   }
// }

//=======================================================================================================

/*SSG - Static Side Generation */
/**
 * Caso tenham muitos acessos na aplicação ao mesmo tempo, e fazendo várias requisições http ou bd, para cada usuário e mostrar a mesma coisa, provavelmente derrubará a aplicação.
 * 
 * Exemplo de caso de uso: a primeira pessoa, das muitas que acessarão a plicação, vai la e faz busca no bd normal;
 * após isso, vai gerar uma versão da página em cache, e guarda o html de forma estática;
 * daí as próximas pessoas que forem acessar o site, ja pegam esse pronto e usa ele também, não faz uma nova chamada no bd, ja que o conteúdo é o mesmo para as pessoas
 * 
 * A revalidação estática não funciona em ambiente de desenvolvimento
 */

export const getStaticProps: GetStaticProps = async () => {

  const api = await fetch('https://api.github.com/users/Maxwell-Santos/repos')
  const response = await api.json()
  const repoNames = response.map((item: RepoNamesProps) => item.name)

  /*
  Meu código que quero que seja revalidado a cada tempo escolhido 
  O 'revalidate', é um atributo que tem o valor em segundos de cada vez que a página terá conteúdos novos
  */
  return {
    props: {
      /*Aqui dentro posso retornar o dado que eu quiser*/
      repositories: repoNames,
      date: new Date().toISOString() //vai pegar a data do servidor (serve para ver os momentos em que a página será revalidada)
    },
    revalidate: 60 * 60 * 2 //quantos segundos a página vai manter em cache - nesse caso 2h
  }
}


