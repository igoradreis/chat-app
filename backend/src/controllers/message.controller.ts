import { Request, Response } from 'express';
import { query } from '../models/DB';


const list = async (req: Request, res: Response) => {

   const result = await query(`SELECT id, name FROM users order by id`);  

   if (result.recordset.length === 0) {
      return res.status(400).send({error: 'Nenhum usuário'})
   }  

   const list = result.recordset as UserList[]
   //const token = {id: user.id, name: user.name}

   return res.status(200).json({list: list});
};


const select = async (req: Request, res: Response) => {

  const { user_from, user_to }: { user_from: number, user_to: number } = req.body;

  if (!user_from || !user_to) {
    return res.status(422).json({ error: "Usuários obrigatórios" });
  }

  //const result = await query(`SELECT user_to, user_from, message FROM messages WHERE user_from = '${user_from}' and user_to = '${user_to}'`);
  //const result = await query(`SELECT c.name, b.name, message FROM messages a LEFT JOIN users b ON a.user_from = b.id LEFT JOIN users c ON a.user_to = c.id WHERE user_from = '${user_from}' and user_to = '${user_to}'`);
  const result = await query(`SELECT user_to, user_from, message FROM messages WHERE user_from in ('${user_from}', '${user_to}') and user_to in ('${user_from}', '${user_to}')`);

  if (result.recordset.length === 0) {
    return res.status(400).send({error: 'Usuários inválidos'})
  }  

  const messages = result.recordset as Messages[]

  return res.status(200).json({messages: messages});
};


const insert = async (req: Request, res: Response) => {

  const { user_from, user_to, message } = req.body;
  
  if(!user_from || !user_to || !message) {
    return res.status(400).json({error: "Campos são obrigatórios"})
  }

  await query(`INSERT INTO messages (user_from, user_to, message) VALUES ('${user_from}','${user_to}', '${message}')`)
    .catch((error) => {
        console.log(error)
        return res.status(500).json({error: error})
    })  

  return res.status(201).send({message: 'Mensagem criada com sucesso'})
};


export { list, select, insert };
