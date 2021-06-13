const { Magic } = require('@magic-sdk/admin');
const faunadb = require('faunadb');

exports.handler = async (req, res) => {
  /* Validate the user's DID token */
  const magic = new Magic(process.env.MAGIC_SECRET_KEY);
  const didToken = magic.utils.parseAuthorizationHeader(req.headers.authorization);
  magic.token.validate(didToken);
  const { email, issuer } = await magic.users.getMetadataByToken(didToken)

  /* Get or create a user's entity in FaunaDB */
  const adminClient = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET_KEY
  });
  const q = faunadb.query;
  const user_id = adminClient.query(
    q.Paginate(
      q.Match(
        q.Index('users_by_email'),
        email
      )
    )
  );
  console.log(user_id);
  res.json({ email: email });
}
