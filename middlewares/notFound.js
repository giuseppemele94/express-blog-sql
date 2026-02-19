//middleware globale, non è errore , non ha err nei parametri 

function notFound(req, res, next) {
    // forziano il code di risposta corretto
    res.status(404)
    //   risposta all'errore
    //blocco la richiesta al posto di inserire next cosi non prosegue e
    //rispondo con un messggio personalizzato
    res.json({
        error: "Not Found",
        message: "Pagina non trovata "
    });
};

module.exports = notFound;