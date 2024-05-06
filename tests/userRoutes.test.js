const assert = require('assert');
const request = require('supertest');

const app = require('../Backend/app');

// Root directory
describe('/', () => {
    describe('GET', () => {
        it('Returns status 200', async () => {
            const response = await request(app)
                .get('/')
            assert.equal(response.status, 200);
        })
    })
})

//Users directory
describe('/users', () => {
    describe('/register', () => {
        describe('POST', () => {
            it('creates a new user', async() => {
                const user = {
                    username: 'Bobby' ,
                    email: 'bobby@example.com',
                    password: 'passwordy',
                    billing_address: 'Idk where',
                    phone_number: '1000-0000'
                }
                const response = await request(app)
                    .post('/users/register')
                    .send(user)
                assert.equal(response.status, 201);
                console.log(response.text);
            })
        })
    })
})