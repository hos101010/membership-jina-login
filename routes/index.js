var express = require('express');
var router = express.Router();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const uuidv1 = require('uuid/v1');


db.defaults({ users:[], matching:[] })
    .write();


router.use('/id_duplication_check', function(req, res, next) {
    if (db.get('users').find({'id':req.body.id}).value()){
        res.json({unique: false});
        return;
    }
    res.json({unique: true});
});

router.use('/main', function(req, res, next) {
    let found_user = db.get('users').find({ id:req.body.signin_id}).value();
    let id;
    let username;
    let session_id;

    //자동 로그인
    if (db.get('matching').find({'session_id':req.cookies.session_id}).value()){
        id = db.get('matching').find({'session_id':req.cookies.session_id}).value().id;
        username = db.get('users').find({'id':id}).value().username;
        res.render('page', {username: username});
        return;
    }


    //회원가입 버튼을 통한 로그인
    if (req.body.id) {
        id = req.body.id;
        username = req.body.name;
        insert_into_user_DB(req.body);
    }

    //로그인 버튼을 통한 로그인
    else {
        if (!found_user || found_user.password != req.body.signin_password){
            res.redirect('/signin_error');
            return;
        }
        id = found_user.id;
        username = found_user.username;
    }

    

    if (req.cookies.session_id){
        session_id = req.cookies.session_id;
    } else {
        session_id = uuidv1();
        insert_into_matching_DB(id, session_id);
    }
    res.cookie('session_id', session_id, {
        maxAge: 900000    //1000 : 1초 -> 900000 : 15분동안 미접속시 자동로그인 해제
    }
    );
    res.render('page', {username: username});
});


router.use('/sign_out', function(req, res, next) {
    if (db.get('matching').find({'session_id':req.cookies.session_id}).value()){
        db.get('matching')
            .remove({'session_id':req.cookies.session_id})
            .write();
    }
    res.redirect('/');
});


router.use('/signin_error', function(req, res, next) {
    next();
});

router.use('/sign_up', function(req, res, next) {
    res.render('page');
});

router.use('/', function(req, res, next) {
    if (db.get('matching').find({'session_id':req.cookies.session_id}).value()){
        res.redirect('/main');
        return;
    }
    res.render('page');
});


function insert_into_user_DB(data){
    db.get('users').push({
        'id' : data.id,
        'password' : data.password,
        'username' : data.name,
        'year' : data.year,
        'month' : data.month,
        'date' : data.date,
        'gender' : data.gender,
        'email' : data.email,
        'number' : data.number,
        'interest' : JSON.parse(data.interests).interests
    }).write();
}

function insert_into_matching_DB(id, session_id){
    //db에 해당 id있으면 session id값 변경
    if (db.get('matching').find({'id':id}).value()){
        db.get('matching')
            .find({'id':id})
            .assign({'session_id' : session_id})
            .write();
        return;
    }

    //없으면 추가
    db.get('matching').push({
        'session_id' : session_id,
        'id' : id
    }).write();
}

module.exports = router;

