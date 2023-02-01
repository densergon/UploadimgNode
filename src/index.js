const express = require('express');
const path = require('path');
const multer = require('multer');
const uuid = require('uuid');

//Initializations
const app= express();

//Settings

app.set('port',3000);
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//Middlewares
const storage=multer.diskStorage({
    destination:path.join(__dirname,'public/uploads'),
    filename:(req,file,cb)=>{
        cb(null,uuid.v4()+path.extname(file.originalname).toLowerCase()); //se puede modificar por un hash gen
    }
});

app.use(multer({
    storage:storage,
    dest:path.join(__dirname,'/public/uploads'),
    limits:{fileSize:5000000},
    fileFilter:(req,file,cb)=>{
        const filestypes=/jpeg|jpg|png|gif/;
        const mimetype=filestypes.test(file.mimetype);
        const extname = filestypes.test(path.extname(file.originalname));
        if(mimetype && extname){
            return cb(null,true);
        }
        cb("Error: El archivo debe ser una imagen valida")
    }
}).single('img'));

//Routes
app.use(require('./routes/index.routes'));

//Static Files
app.use(express.static(path.join(__dirname,'public')))
//Start server
app.listen(app.get('port'),()=>{
    console.log('Server on port:',app.get('port'));
});