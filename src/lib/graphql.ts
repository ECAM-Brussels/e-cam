'use server'

import { GraphQLClient } from 'graphql-request'

const client = new GraphQLClient('http://localhost:8000')
export const request = client.request
