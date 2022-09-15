# Aprendendo NEXT

<p>O Next basicamente cria um servicinho node no frontend, tipo um semi backend no frontend, isso é bom para poder fazer requisições no lado do servidor</p>
<p>Ou seja, quando o cliente acessar a página o conteúdo ja vem pronto do servidor, o nome disso é SSR </p>

## Jeito tradicional de fazer um fetch Client Side Render
```tsx
export default function Home(){
  
  const [repo, setRepo] = useState<string[]>([])

  const api = 'https://api.github.com/users/Maxwell-Santos/repos';
  useEffect(() => {
    fetch(api)
    .then(response => response.json())
    .then(data => {
      const repoName = data.map((item: RepoNamesProps) => item.name)

      setRepo(repoName)
    })

  },[])
  return(
    <ul>
      {
        repo.map(item => (
          <li key={item}> {item} </li>
        ))
      }
    </ul>
  )
}
``` 
## Como funciona o Server Side Render 

```tsx

export default function Home({repositories}:any){
  return(
    <ul>
      {
        repositories.map((item: any) => (
          <li key={item}> {item} </li>
        ))
      }
    </ul>
  )
}

/*SSR - Server Side Rendering */

/**
 * O que é curioso é que não tem com acessar o estado do componente, porque esse requisição é feita antes de existir componente. 
 * Então ela não pode executar uma função de att de estado, ela não tem acesso á nenhum contexto do meu componente.
 * Essa função retorna props com qualquer conteúdo dentro
 */
export const getServerSideProps:GetServerSideProps = async () =>{

  const api = await fetch('https://api.github.com/users/Maxwell-Santos/repos')
  const response = await api.json()
  const RepoNames = response.map((item: RepoNamesProps) => item.name) 

  return{
    props: {
      /*Aqui dentro posso retornar o dado que eu quiser*/
      repositories: RepoNames

    }
  }
}

```
## Como funciona o Static Props - Stale While Revalidate (SWR)
### O Next chama de ISR - Incremental Static Regeneration
<p>Gerar novamente páginas que são estáticas incrementalmente conforme a necessidade.</p>

<p>O site vai armazenar uma versão dele em cache, por um tempo, para que outras pessoas possam acessá-lo e ele não precise sempre ficar batendo no banco de dados e essas coisas</p>
<i>Isso é bom para quando o site mostra a mesma coisa e tem muitas pessoas acessando ao mesmo tempo, evita desgaste e lentidão para requisições no banco de dados</i>

```tsx
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
    revalidate: 5 //quantos segundos a página vai manter em cache
  }
}
```

## Páginas com atributos dinâmicos

Exemplo: Num blog existe os posts, e cada post tem seu <code>slug</code>

- Criar página com atributo dinâmico <code>[atributo].tsx</code>
Isso significa que vai querer passar um parâmetro
<br>
<strong>cada pasta ou arquivo dentro de 'pages', vira uma rota</strong>

<strong>Toda pagina do next, que recebe um parâmetro e é também uma pagina estática <code>getStaticProps</code>, precisa criar uma outra função por dentro, a <code>getStaticPath</code></strong>

- O next cria essa versão, estática das páginas no momentos em que executa a build.


## API Routes

São rotas que ao invés de retornar componente React, pode retornar um código que só existiria no backend