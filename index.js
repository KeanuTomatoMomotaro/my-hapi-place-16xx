'use strict';

const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({ port: 8000, host: 'localhost' });


var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'project_guestbook'
});

server.route({
    method: 'GET',
    path: '/get-all-guest-comments',
    handler: function (request, reply) {
        
        connection.query('SELECT * FROM guest_comments', function (error, results, fields) {
            if (error) throw error;
            reply(results);
            
        });
    }
});

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});