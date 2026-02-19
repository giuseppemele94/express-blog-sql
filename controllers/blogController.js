// importo i dati dei post
//const postsArr = require('./../data/postsArr');

// Importiamo il file di connessione al database
const connection = require('./../data/db');


function index(req, res) {

    //query
    const sql = 'SELECT * FROM posts';

    //eseguo la query
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
        // console.log(results);
    });
}

function show(req, res) {

    //recupero l'id e lo trasformo in numero ( il parametro dinamico)
    const id = parseInt(req.params.id)


    //query
    const sql = 'SELECT * FROM posts WHERE id = ?';

    //query per i tags nello show del post 
    const tagsSql = `SELECT tags.label
    FROM posts 
    JOIN post_tag ON posts.id = post_tag.post_id 
    JOIN tags ON post_tag.tag_id = tags.id
    WHERE posts.id = ? `;

    //eseguo la query
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0)
            return res.status(404).json({
                error: 'Post not found'
            });

        //recuppero il post
        const post = results[0];

        //faccio partire la seconda query se la prima ha avuto successp
        connection.query(tagsSql, [id], (err, tagsResults) => {
            if (err) return res.status(500).json({ error: 'Database query failed' });

            //aggiungo i tags al post 
            post.tags = tagsResults;
            res.json(post);
        })
        

    });

}
//CREATE
function store(req, res) {

     //recuperiamo i dati dal corpo della richiesta
    const { title,content,image } = req.body;

    //preparo la query 
    const sql = ' INSERT INTO posts (title,content,image) VALUES (?,?,?) ';
    
    //eseguo la query 
    connection.query(
        sql,
        [title,content, image],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to insert pizza' });
            res.status(201); // status corretto
            console.log(results)
            res.json({ id: results.insertId }); // restituiamo l'id assegnato dal DB
        }
    );
    
}

//modifica totale PUT 
function update(req, res) {


    //recupero l'id e lo trasformo in numero ( il parametro dinamico)
    const idNum = parseInt(req.params.id)

    //cerco il post tramite id
    const post = postsArr.find(blog => blog.id === idNum);

    //controllo se trova l'item
    if (!post) {

        res.status(404);

        //risposta con messaggio di eerrore
        return res.json({
            error: "Not found",
            message: "Post non trovato"
        })
    }

    //aggiorniamo il post 
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    //controlliamo il post
    console.log(postsArr);

    //restituisamo il post aggiornato
    res.json(post);

}

//modifica parziale del post PATCH
function modify(req, res) {

    //campi che possono essere modificati 
    const propEditabili = ["title", "content", "image", "tags"];

    //recupero l'id e lo trasformo in numero ( il parametro dinamico)
    const idNum = parseInt(req.params.id)

    //cerco il post tramite id
    const post = postsArr.find(blog => blog.id === idNum);

    //controllo se trova l'item
    if (!post) {

        res.status(404);

        //risposta con messaggio di eerrore
        return res.json({
            error: "Not found",
            message: "Post non trovato"
        })
    }

    //aggiorniamo il post in base al campo inserito

    //iterazione su ogni campo editabile
    propEditabili.forEach((prop) => {

        // se il campo è presenta nel body della richiesta
        if (req.body[prop] !== undefined) {
            //aggiorno la proprietà 
            //equivale a es post.title = req.body.title    
            post[prop] = req.body[prop];
        }
    })
    // req.body.title ? post.title = req.body.title : post.title = post.title;
    // req.body.content ? post.content = req.body.content : post.content = post.content;
    // req.body.image ? post.image = req.body.image : post.image = post.image;
    // req.body.tags ? post.tags = req.body.tags : post.tags = post.tags;


    //restituisamo il post aggiornato
    res.json(post);

}

function destroy(req, res) {

    //recupero l'id e lo trasformo in numero
    const id = parseInt(req.params.id);

    const sql = 'DELETE FROM posts WHERE id = ?';

    //elimino il post dal db
    connection.query(sql, [id], (err) => {
        if (err)
            return res.status(500).json({
                error: 'Failed to delete post'
            })
        res.sendStatus(204)
    });

}

// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy }