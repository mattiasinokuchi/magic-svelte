const { Magic } = require('@magic-sdk/admin');
const faunadb = require('faunadb');

exports.handler = async (event, context) => {
  try {
    /* validate user's DID token... */
    const magic = new Magic(process.env.MAGIC_SECRET_KEY);
    const didToken = magic.utils.parseAuthorizationHeader(event.headers.authorization);
    magic.token.validate(didToken);
    const { email, issuer } = await magic.users.getMetadataByToken(didToken);
    const adminClient = new faunadb.Client({
      secret: process.env.FAUNADB_SECRET_KEY
    });
    const q = faunadb.query;
    /* ...and read user's todos from FaunaDB... */
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
    console.log(error);
  }
}
