const Axios = require('axios')
const JwtToken = 'token'
const BASE_URL = 'http://localhost:3001'

const api = Axios.create({
	baseURL: BASE_URL,
	headers: {
		Authorization: `Bearer ${JwtToken}`,
		'Access-Control-Allow-Origin': '*'
	}
})
