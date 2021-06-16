const { Magic } = require('@magic-sdk/admin');
const faunadb = require('faunadb');

exports.handler = async (event, context) => {
  try {
    console.log("Create function invoked");
    /* Validate user's DID token... */
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
    const didToken = magic.utils.parseAuthorizationHeader(event.headers.authorization);
    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);
    /* ...create user's todo in FaunaDB... */
    const adminClient = new faunadb.Client({
      secret: process.env.FAUNADB_SECRET_KEY
    });
    const q = faunadb.query;
    const todo = JSON.parse(event.body);
    await adminClient.query(
      q.Create(
        q.Collection('todos'), {
          data: {
            title: todo.data
          }
        }
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
    console.log(error)
    return {
      statusCode: 400,
      body: JSON.stringify(error)
    }
  }
}
