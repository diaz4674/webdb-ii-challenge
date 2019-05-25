const knex = require('knex');
const router = require('express').Router();


//Configuring knex to sqlite3 database
const knexConfig = {
    client: 'sqlite3',
    connection: {
        filename: './data/lambda.sqlite3',
    },
    useNullAsDefault: true,
    debug:  true    
};

//connecting the database sqlite3 with knex
const db = knex(knexConfig);

//GET
router.get('/', (req,res) => {
    //getting access to the zoos table database
    db('zoos')
    .then(animals => {
        res.status(200).json(animals)
    })
    .catch(err => {
        console.log(err)
        res.status(500).json(err)
    })
})

//GET by ID 
router.get('/:id', (req, res) => {
    //getting zoo database and finding my id with .where
    db('zoos').where({id: req.params.id})
    .first()
    .then(zoo => {
        if(zoo){
            res.status(200).json(zoo)
        } else {
            res.status(404).json({message: 'Zoo not found'})
        }
    })
    .catch(err =>{
        console.log(err)
        res.status(500).json(err)
      })
})

//POST
router.post('/', (req, res) => {
    //checking to see if name body is empty
    if(!req.body.name){
        //if body empty, sending appropriate message
        res.status(400).json({message: 'please provide a name'})
    } else {
        //
        db('zoos').insert(req.body, 'id')
        .then(ids => {
            return db('zoos').where({id: ids[0]})
            .first()
            .then(animal => {
                res.status(201).json(animal)
            })
        })
        .catch(err => {
            console.log(err)
            res.status(500).json(err)
        })
    }
})

//PUT
router.put('/:id', (req, res) =>{
    if(!req.body.name){
        res.status(400).json({message: 'please provide a name'})
    } else {
        db('zoos').where({id: req.params.id }).update(req.body)
        .then(count => {
            if(count > 0){
                res.status(200).json({message: `${count} record updataed.`})
            } else {
                res.status(404).json({message: 'Role doesnt exist'})        
            }
        })
        .catch(err => {
            res.status(500).json(err)
          })
    }
})

//DELETE
router.delete('/:id', (req, res) => {
    db('zoos').where({id: req.params.id}).del()
        .then(count => {
            if(count > 0) {
                res.status(200).json({message: `${count} record updataed.` })
            } else {
                res.status(404).json({message: 'Zoo does not exist'})
            }
        })
        .catch(err => {
            res.status(500).json(err)
          })
})

module.exports = router;