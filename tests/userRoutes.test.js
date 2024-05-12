const assert = require('assert');
const pool = require('../Backend/database');


jest.mock('../Backend/database', () => ({
    query: jest.fn(),
}))

//Importing functions that require auth
const {getUserProfile, updateUserProfile, changeRole, changePassword, logoutUser} = require('../Backend/controllers/userController');
const { query } = require('express');

//mock user request
const adminUser = {
    user_id: 1,
    username: "Expak12",
    email: "sample@gmail.com",
    password: "$2b$12$ffkP.YE6YTo.kmMLXJOyxOmVm/FB8h8dydV32ii5EGMA//mjGJ9ve",
    billing_address: "IDKwhere this is",
    phone_number: "1234-5678",
    role: 'admin'
}
// Root directory

//Users directory
describe('/users', () => {
    // describe('/register', () => {
    //     describe('POST', () => {
    //         it('creates a new user', async() => {
    //             const user = {
    //                 username: 'Robert' ,
    //                 email: 'Robert@example.com',
    //                 password: 'passwordy',
    //                 billing_address: 'Idk where',
    //                 phone_number: '1000-0000'
    //             }
    //             const response = await request(app)
    //                 .post('/users/register')
    //                 .send(user)
    //             assert.equal(response.status, 201);
    //             console.log(response.text);
    //         })
    //     })
    // }) 
    
    // describe ('/login', () => {
        
    //     describe('POST', () => {
    //         it('logs in the user successfully', async () => {
    //             const credentials = {
    //                 email: 'bobby@example.com',
    //                 password: 'passwordy'
    //             }
    //             const response = await request(app)
    //                 .post('/users/login')
    //                 .send(credentials)
    //             assert.equal(response.status, 200);
    //             assert.equal(JSON.parse(response.text).message, "Login successful");
    //         })
    //         it('returns "Unauthorized" on error', async () => {
    //             const credentials = {
    //                 email: 'notreal@email.com',
    //                 password: 'passwordy'
    //             }
    //             const response = await request(app)
    //                 .post('/users/login')
    //                 .send(credentials)
    //             assert.equal(response.status, 401);
    //             assert.equal(response.text, 'Unauthorized');
    //         })
    //     })
    // }) 
    // describe('/logout', () => {
    //     describe('GET', () => {  
    //         it ('returns successfully', async () => {
    //             const response = await request(app)
    //                 .get('/users/logout');
    //             assert.equal(response.text, '{"message":"Successfully logged out!"}');
    //         })
    //     })
    // })
    describe('/profile', () => {
        describe('GET', () => {
            it ('returns the user object', async () => {
                pool.query.mockResolvedValue({rows: [adminUser]});

                const req = {user: {user_id: 1}};
                const res = {status: jest.fn(() => res), json: jest.fn()};
                const next = jest.fn();

                await getUserProfile(req, res, next);

                expect(res.status).toHaveBeenCalledWith(200);
                expect(res.json).toHaveBeenCalledWith(adminUser);
                expect(next).not.toHaveBeenCalled();
            })
            
        })
    })
})