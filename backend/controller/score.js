const gameDb = require('../db/pool')

exports.getScore = (req, res, next) =>{
    if(req.query.user_id == null){
        gameDb.query('SELECT * FROM game.SCORE ORDER BY score DESC').then(result => {
            res.status(200).json({"scores": result.rows});
        }).catch(err => {
            console.log(err);
            res.status(404).send('Invalid');
        });
    }else{
        gameDb.query('SELECT * FROM game.SCORE WHERE user_id = $1', [req.query.user_id]).then(result => {
            if(result.rowCount == 0){
                res.status(404).send('Invalid');
            }else{
                res.status(200).json(result.rows[0]);
            }
        }).catch(err => res.status(404).send('Invalid'));
    }
};

exports.postScore = (req, res, next) => {
    if(req.body.score == null || req.body.user_id == null){
        res.status(400).send("Bad request")
    }
    if(!(gameDb.query('SELECT * FROM game.SCORE WHERE user_id = $1', [req.body.user_id]))){
        gameDb.query('INSERT INTO game.SCORE score VALUES $1 WHERE user_id = $2', [req.body.score, req.body.user_id]).then(result => {
            res.status(200).json(result.rows);
        }).catch(err => {
            res.status(404).send("Invalid");
        });
    }else{
        gameDb.query('UPDATE game.SCORE SET score = $1 WHERE user_id = $2 AND score < $3', [req.body.score, req.body.user_id, req.body.score]).then(result => {
            res.status(200).json(result.rows);
        }).catch(err => {
            res.status(404).send("Invalid");
        });
    }
};