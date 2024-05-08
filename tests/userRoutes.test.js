const assert = require('assert');
const request = require('supertest');
const superagent = require('superagent');
const agent = superagent.agent();

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
    /*
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
    }) */
    describe('/logout', () => {
        describe('GET', () => {  
            it ('returns successfully', async () => {
                const response = await request(app)
                    .get('/users/logout');
                assert.equal(response.text, '{"message":"Successfully logged out!"}');
            })
        })
    })
    describe('/profile', () => {
        describe('GET', () => {

            before(done => {
                const credentials = {
                    email: 'bobby@example.com',
                    password: 'passwordy' 
                }
                agent.post('http://localhost:3000/users/login').send(credentials)
                .end((err, res) => {
                    console.log(res.statusCode);
                    if (res.statusCode == 200) {
                        console.log(res.text);
                        return done();
                    }
                    else {
                        return done(new Error("The login is not happening"));
                    }
                }) 
            })

            it('returns the credentials', (done) => {
                agent.get('http://localhost:3000/users/profile').end((err, res) => {
                    console.log(res.text);
                    done();
                })
            })

        })
    })
})