const MongoClient = require('mongodb').MongoClient
const Mongo = require('mongodb')
const ObjectId = require('mongodb').ObjectID
const dbname = "todo"
const url = "mongodb+srv://learner1:learner1@learnmongo.xpcog.mongodb.net/test?retryWrites=true&w=majority"
const mongoOptions = { useNewUrlParser : true, useUnifiedTopology: true}

const state = { db : null }

const connect = (cb) =>{
    console.log('trying to connect...');
    if(state.db){
        console.log('Already connected...');
        cb()
    }
    else{
        console.log('connecting now...');

        MongoClient.connect(url, mongoOptions, (err, client) =>{
            if(err){
                console.log('there is an error...');
                cb(err)
            }
            else{
                console.log('found no error');
                state.db = client.db(dbname)
                cb()
            }
        })
    }
}

const getPrimaryKey = (_id) => {
    return ObjectId(_id)
}

const getDB = () => {
    return state.db
}

module.exports = {getDB, getPrimaryKey, connect}