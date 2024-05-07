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
   /* describe('/register', () => {
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
    }) */
    describe ('/login', () => {
        
        describe('POST', () => {
            it('logs in the user successfully', async () => {
                const credentials = {
                    email: 'bobby@example.com',
                    password: 'passwordy'
                }
                const response = await request(app)
                    .post('/users/login')
                    .send(credentials)
                assert.equal(response.status, 200);
                assert.equal(response.text, '{"user_id":3,"username":"Bobby","email":"bobby@example.com","password":"$2b$12$q.Y5H5XTjGoL5dd1b8SI.eKTwN5DXZoCu9i480Smgkzs2ecTrwnWK","billing_address":"Idk where","phone_number":"1000-0000"}');
            })
            it('returns "Unauthorized" on error', async () => {
                const credentials = {
                    email: 'notreal@email.com',
                    password: 'passwordy'
                }
                const response = await request(app)
                    .post('/users/login')
                    .send(credentials)
                assert.equal(response.status, 401);
                assert.equal(response.text, 'Unauthorized');
            })
        })
    })
})