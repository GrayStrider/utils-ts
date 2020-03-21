import st, { SuperTest, Test } from 'supertest'
import { ASTNode, print } from 'graphql'
import { flattenGQLResponse } from '../..'

function supertest(app: any, gqlEndpoint = '/graphql') {
	const request = st(app)
	const post = async <T>(query: ASTNode) =>
		request
			.post(gqlEndpoint)
			.send({ query: print(query) })
			.then(res => flattenGQLResponse<T>(res.body.data))

	return { request, post }
}

type Request = ReturnType<typeof supertest>['request']
type Post = ReturnType<typeof supertest>['post']

export { supertest, SuperTest, Test, Post, Request }
