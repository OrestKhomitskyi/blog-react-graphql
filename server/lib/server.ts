import * as express from 'express';
import orm from './firebase';
import * as uuid from 'uuid';
import * as bodyparser from 'body-parser';
import * as moment from 'moment';
import * as graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';
import * as _ from 'lodash';



const database = orm.database();

function writePost(creatorName, title, body, date = new Date()): void {
    const postId = uuid.v1();

    database.ref('posts/' + postId).set({
        creatorName,
        title,
        body,
        date: moment(date).format('YYYY-MM-DD')
    });
}

function deletePost(id){
    return database.ref('posts/' + id).set(null);
}

function getPosts() {
    return database.ref('posts').once('value');
}

(function listen() {
    database.ref('posts').on('value', snapshot => {
        // console.log(snapshot.val());
    })
})();

var app = express();

var schema = buildSchema(`
    type Query {
        post(postId: String): Post
        posts: [Post]
    },
    type Post {
        postId: String
        creatorName: String
        title: String
        body: String
        date: String
    }
`);


app.use(bodyparser.json());

app.get('/', (rq, rs) => {
    rs.status(200);
    rs.send('Blog-React-GraphQl');
})

const getRootVal = (data) => {
    const objects = [];
    data.forEach(el => {
        objects.push({ postId: el.key, ...el.val() });
    });

    return {
        posts: () => objects,
        post: (params) => _.find(objects, obj => {
            return obj.postId === params.postId;
        })
    }
}

app.use('/posts', graphqlHTTP(async (req, res) => {
    const data = await getPosts();
    return {
        schema,
        rootValue: getRootVal(data),
        graphiql: true
    }
}))

app.post('/post_create', (rq, rs) => {
    const { creatorName, title, text } = rq.body;
    writePost(creatorName, title, text);
    rs.send('Ok');
});

app.delete('/post_delete/:id', async(rq, rs) => {
    const id = rq.params.id;
    const resp = await deletePost(id);
    rs.status(200);
    rs.send('Success');
})

app.listen(3000, () => {
    console.log('server is working');
})