const gameDb = require('../db/user');
const jsMD5 = require('js-md5');

exports.getUserData = (req, res, next) => {
    if(req.query.id != null){
        gameDb.query('SELECT id, user_name, first_name, last_name, created_date FROM game.USER WHERE id=$1', [req.query.id]).then(result => {
            if(result.rows.length > 0){
                res.status(200).json({user:[result.rows[0]]});
            }else{
                res.status(404).send("User not found!");
            }
        }).catch(error => {
            res.status(404).send("User not found!");
            console.log(error);
        });
    }else if(req.query.user_name != null && req.query.password != null){
        gameDb.query('SELECT id, user_name, first_name, last_name, created_date FROM game.USER WHERE user_name=$1 AND password=$2', [req.query.user_name, jsMD5(req.query.password)]).then(result => {
            res.status(200).json({user:[result.rows[0]]});
            console.log(req.query.user_name, jsMD5(req.query.password));
        }).catch(error => {
            res.status(404).send("User not found!");
            console.log(error);
        });
    }else{
        res.status(400).send("Invalid request!");
    }
}

exports.postUserData = (req, res, next) => {
    if(req.body.user_name == null || req.body.password == null || req.body.first_name == null || req.body.last_name == null){
        res.status(400).send("Invalid request!");
    }
    gameDb.query('INSERT INTO game.USER (USER_NAME, PASSWORD, FIRST_NAME, LAST_NAME) VALUES ($1, $2, $3, $4) RETURNING id', [req.body.user_name, jsMD5(req.body.password), req.body.first_name, req.body.last_name]).then(result => {
        res.status(200).json(result.rows[0]);
    }).catch(err => {
        console.log(err);
        res.status(400).send('Invalid request');
    });
};

exports.putUserData = (req, res, next) => {
    if(req.body.id == null || req.body.password == null || req.body.first_name == null || req.body.last_name == null){
        res.status(400).send("Invalid request!");
    }
    gameDb.query('UPDATE game.USER SET password=$1, first_name=$2, last_name=$3 WHERE id=$4', [jsMD5(req.body.password), req.body.first_name, req.body.last_name, req.body.id]).then(result => {
        if (result.rowCount == 1) {
            res.status(200).send();
        } else {
            res.status(404).send("User not found!");
        }
    }).catch(err => {
        console.log(err);
        res.status(404).send('Invalid');});
}