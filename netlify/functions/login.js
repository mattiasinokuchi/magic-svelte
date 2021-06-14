const { Magic } = require('@magic-sdk/admin');
const faunadb = require('faunadb');

exports.handler = async (event, context) => {
  /* Validates the user's DID token... */
  const magic = new Magic(process.env.MAGIC_SECRET_KEY);
  const didToken = magic.utils.parseAuthorizationHeader(event.headers.authorization);
  magic.token.validate(didToken);
  const { email, issuer } = await magic.users.getMetadataByToken(didToken)

  const adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET_KEY
  });
  const q = faunadb.query;
  /* ...searches for user in FaunaDB... */
  const user_id = await adminClient.query(
    q.Paginate(
      q.Match(
        q.Index('users_by_email'),
        email
      )
    )
  );
  if (user_id.data.length === 0) {
    /* ...creates a user in FaunaDB and returns an empty array if missing... */
    await adminClient.query(
      q.Create(
        q.Collection("users"),
        {
          data: { email }
        }
      )
    )
    return {
      statusCode: 200,
      body: JSON.stringify(user_id.data)
    }
  } else {
    /* ...or searches and returns with documents of the user from FaunaDB... */
    q.Map(
      q.Paginate(q.Match(q.Index('all_todos'))),
      q.Lambda('todo_ref', {
        id: q.Select(['ref', 'id'], q.Get(q.Var('todo_ref'))),
        title: q.Select(['data', 'title'], q.Get(q.Var('todo_ref'))),
        completed: q.Select(['data', 'completed'], q.Get(q.Var('todo_ref'))),
      })
    )
    return {
      statusCode: 200,
      body: JSON.stringify(user_id.data.length)
    }
  }
}
