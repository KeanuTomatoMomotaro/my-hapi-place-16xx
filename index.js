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

server.route([{
    method: 'GET',
    path: '/get-all-guest-comments',
    config: {
        cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    },
    handler: function (request, reply) {
            connection.query('SELECT * FROM guest_comments', function (error, results, fields) {
                if (error) throw error;
                reply(results);
                
            });
        }
    },
    {
        method: 'GET',
        path: '/get-guest-comments/{id}',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: function (request, reply) {
            let comment_id = request.params.id
            connection.query('SELECT * FROM guest_comments where guest_comments.id =?', comment_id,function (error, results, fields) {
                if (error) throw error;
                reply(results);       
            });
        }
    },
    {
        method: 'POST',
        path: '/post-new-comment',
        config: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['cache-control', 'x-requested-with']
            }
        },
        handler: function (request, reply) {
            let comment_id = request.payload.id
            let comment_title = request.payload.title
            let comment_author = request.payload.author
            let comment_content = request.payload.content

            connection.query(`INSERT INTO guest_comments (id, comment_title, comment_author, comment_content) VALUES (?, ?, ?, ?)`, [comment_id, comment_title,comment_author, comment_content],function (error, results, fields) {
                if (error) throw error;
                reply(results);       
            });
        }
    }
]);

server.start((err) => {

    if (err) {
        throw err;
    }
    console.log(`Server running at: ${server.info.uri}`);
});