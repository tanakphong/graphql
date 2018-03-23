const express = require('express')
const graphqlMiddleware = require('express-graphql')
const { buildSchema } = require('graphql')
const customers = require('./personal')
const app = express()

const schema = buildSchema(`
	type Query {
		customer(id: ID!): Customer
		customers(limit: Int = 5, gender: String, age: AGE): [Customer]
	}

	type Customer {
		id: Int
		first_name: String
		last_name: String
		age: Int
		gender: String
		company: String
		email: String
	}

	enum AGE{
		YOUNG
		OLD
	}
	`);

const resolver = {
	customer(args) {
		return customers.find(c => c.id == args.id)
	},
	customers(args) {
		let result = [].concat(customers)
		
		if(args.gender){
			result = result.filter(c => c.gender == args.gender)
		}

		if (args.age) {
			result = args.age == 'YOUNG' ? result.filter(c => c.age <= 25) : result.filter(c => c.age > 25)
		}

		return result.slice(0, args.limit)
	}
}

app.use(graphqlMiddleware( {
	schema: schema,
	rootValue: resolver,
	graphiql: true,
}))

app.listen(3005)
console.log('Running server on port 3005')