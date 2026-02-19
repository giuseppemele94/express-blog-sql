// importo i dati dei post
const postsArr = require('./../data/postsArr');

// Importiamo il file di connessione al database
const connection = require('./../data/db');


function index(req, res) {

    //inizialmente, il blog filtrato corrisponde a quello originale
    let filteredPost = postsArr;

    //se la richiesta contiene un filtro, allora filtro l'array
    if (req.query.tags) {
        filteredPost = postsArr.filter(
            blog => blog.tags.includes(req.query.tags)
        );
    }

    //creo un nuovo oggetto con le propr che mi servono
    const oggettoBlog = {
        numeroPost: postsArr.length,
        listaPost: filteredPost
    }
    res.json(oggettoBlog);
}

function show(req, res) {

    //recupero l'id e lo trasformo in numero ( il parametro dinamico)
    const idNum = parseInt(req.params.id)

    // introduciamo un errore a caso per test middelware err 500
    // throw new Error("Errore di test middleware");

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

    //restituisco sotto forma di JSON 
    res.json(post)
}
//CREATE
function store(req, res) {

    //const newId = Date.now();
    //creo un id 
    const newId = postsArr[postsArr.length - 1].id + 1;

    //creiamo nuovo oggetto post
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }

    //aggiungo il nuovo post al blog
    postsArr.push(newPost);

    console.log(postsArr);

    //restituisco stato created e il nuovo post
    res.status(201);
    res.json(newPost);

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
        if(req.body[prop] !== undefined) {
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
    const idNum = parseInt(req.params.id);

    //cerco il post tramite id
    const post = postsArr.find(blog => blog.id === idNum)

    //controllo se trova l'item
    if (!post) {

        res.status(404);

        //risposta con messaggio di eerrore
        return res.json({
            error: "Not found",
            message: "Post non trovato"
        })
    }
    //rimuovo il post dal blog 
    postsArr.splice(postsArr.indexOf(post), 1);

    //risposta 
    res.sendStatus(204);

}

// esportiamo tutto
module.exports = { index, show, store, update, modify, destroy }