import { Magic } from '@magic-sdk/admin';
import { Client, query } from 'faunadb';

export async function handler(event, context) {
  try {
    /* Validate user's DID token... */
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
    const didToken = magic.utils.parseAuthorizationHeader(event.headers.authorization);
    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);
    /* ...delete user's todo in FaunaDB... */
    const adminClient = new Client({
      secret: process.env.FAUNADB_SECRET_KEY
    });
    const q = query;
    const todo = JSON.parse(event.body);
    await adminClient.query(
      q.Delete(
        q.Ref(`classes/todos/${todo.id}`)
      )
    );
    /* ...and read user's todos in FaunaDB */
    const todos = await adminClient.query(
      q.Map(
        q.Paginate(
          q.Match(
            q.Index('todos_by_user'),
            email
          )
        ),
        q.Lambda('userRef', q.Get(q.Var('userRef'))
        )
      )
    );
    return {
      statusCode: 200,
      body: JSON.stringify(todos)
    }
  } catch (error) {
    console.log('error', error)
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }
}
