// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  await res.revalidate('/') //quando acessar essa rota, a aplicação será forçada a revalidar, independente do tempo que coloquei

  return res.status(200).json({ name: 'John Doe' })
}
