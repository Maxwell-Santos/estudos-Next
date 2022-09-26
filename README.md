# Sumário
- [Jeito tradicional de fazer um fetch Client Side Render](#jeito-tradicional-de-fazer-um-fetch-client-side-render)
- [Como funciona o Server Side Render](#como-funciona-o-server-side-render)
- [Como funciona o Static Props - Stale While Revalidate (SWR)](#como-funciona-o-static-props---stale-while-revalidate-swr)
  - [O Next chama de ISG - Incremental Static Generation](#o-next-chama-de-isg---incremental-static-generation)
  - [Página com parâmetro da url](#página-com-parâmetro-da-url)
    - [Fallback](#fallback)
  - [Atualização forçada](#atualização-forçada)
- [Páginas com atributos dinâmicos](#páginas-com-atributos-dinâmicos)
- [Páginas com atributos dinâmicos](#páginas-com-atributos-dinâmicos)
- [API Routes](#api-routes)
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
### O Next chama de ISG - Incremental Static Generation
<p>Gerar novamente páginas que são estáticas incrementalmente conforme a necessidade.</p>

<p>O site vai armazenar uma versão dele em cache, por um tempo, para que outras pessoas possam acessá-lo e ele não precise sempre ficar batendo no banco de dados e essas coisas</p>
<i>Isso é bom para quando o site mostra a mesma coisa e tem muitas pessoas acessando ao mesmo tempo, evita desgaste e lentidão por conta das requisições no banco de dados</i>

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
    revalidate: 60 * 60 * 2 //quantos segundos a página vai manter em cache (nesse caso 2h)
  }
}
```
### Página com parâmetro da url
<p>Acessando, uma api que retorna uma lista de objetos json, e são muitos esses objetos, logo a requisição para a API, será paginada, ou seja, vai pegar, por exemplo, 10 objetos para cada página e a requisição só aceita uma página de cada vez.</p>

#### Fallback
<p>
  Quando busca esse parâmetro que não existe na primeira página que foi criada de forma estática pelo Next, ai o opção do <code>fallback</code>, entra em ação <strong>esse atributo é booliano</strong>
</p>

 - fallback: true
  - Quando uma pessoa tentar acessar a rota com um parâmetro que não tinha antes uma página ja gerada de forma estática, ele vai tentar procurar na API, para ver se existe aquela informação ou não. </br> Vai gerar uma nova página estática, (essas páginas estáticas são geradas em tempo de produção, na build do projeto, porém com <code>fallback: true</code>, ele vai fazer uma nova requisição na API, para pode criar essa página de forma estática também, mas em tempo de execução).

- Quando usar: Para produtos de e-commerce, post de blogs, em resumo, aplicações que tem a possibilidade de criar um conteúdo novo, novas informações a todo momento. 

```tsx
//função assíncrona para dar a liberdade ao usuário de poder fazer chamadas API
export const getStaticPaths: GetStaticPaths = async () => {

  const response = await fetch('https://api.github.com/orgs/rocketseat/members')
  const data = await response.json()

  const paths = data.map((member: any) => {
    return { params: {login: member.login} }
  })
  return{
    paths, //tem que retornar um array 
    fallback: true,
  }
}
```
- Gerar uma versão estática daquela página só se o cliente acessar, se não, nem gera
```tsx
export const getStaticPaths: GetStaticPaths = async () => {
  //code
  return{
    paths: [],
    fallback: true,
  }
}
```
- Gerar uma versão estática daquela das páginas mais acessadas (posts mais acessados caso seja um blog, por exemplo)
```tsx
//exemplo fictício
export const getStaticPaths: GetStaticPaths = async () => {
  const posts = [...{post}]

  //vai retornar um array com os posts com mais de 10.000 likes
  const listPosts = posts.filter(post => post.like >= 10000)

  const topsPost = listPosts

  return{
    paths: topPost, 
    fallback: true, //só gera no momento que a rota for acessada
  }
}
```

### Atualização forçada
Basta colocar esse código na route API que você quer que faça a revalidação forçada, antes do tempo pré definido<code>await res.revalidate('/rota')</code>, daí quando acessar essa rota 

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

 - Acessar Banco de Dados
 - Se comunicar com APIs que precisam de segurança (ex: pagamentos)

 ## Middleware
 É um interceptador de requisição ou resposta, no caso do next é um interceptador de resposta

 - Digamos que tenha uma página na aplicação que nunca muda, logo o que vem na cabeça é "fazer um getStaticProps", porém, indo mais a fundo, só pessoas logadas ou autorizadas poderão acessar essa página da aplicação.
 </br>
 O getStaticProps, executa na hora da build, assim, não tem como saber se o cliente tem permissão ou não para acessar aquela página. <strong>Para isso veio o Middleware</strong>

 ### Como funciona
 <ol>
 <li>Criar <code>_middleware.ts</code>, dentro da pasta <code>pages</code></li>
 <li>Exemplo de código</li> 
 </ol>
 
 ```tsx
//Ele intercepta as requisições do usuário e o redireciona dependendo da sua permissão

// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect('/nova-rota-redirecionada')
  //ou
  return NextResponse.next() // pula esse middleware
  //ou
  return NextResponse.rewrite('/acesso-para-outra-rota')

}

 ```
Dependendo da pasta onde você criar um carinha desse, ele só vai ser executado a partir daquela pasta
