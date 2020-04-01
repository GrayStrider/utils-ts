import st, { SuperTest, Test } from 'supertest'
import { ASTNode, print } from 'graphql'
import { flattenGQLResponse } from '../..'

function supertest (
	app: any,
	gqlEndpoint = '/graphql'
) {
	const base = st (app)
	const req = async <T = object, V = object>
	(query: ASTNode, variables?: V) => base
		.post (gqlEndpoint)
		.send ({
			query: print (query),
			variables
		})
	const post = async <T = object, V = object>
	(query: ASTNode, variables?: V) => base
			.post (gqlEndpoint)
			.send ({
				query: print (query),
				variables
			})
			.then (res => flattenGQLResponse<T> (res.body))
	
	return { req, post }
}

type Req = ReturnType<typeof supertest>['req']
type Post = ReturnType<typeof supertest>['post']

export { supertest, SuperTest, Test, Post, Req }
