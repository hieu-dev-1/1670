const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roles = new Schema({
    name:{ 
        type: String,
        unique: true,
        min: 1,
    }
},{
    timestamps : { currentTime: () => Math.floor(Date.now() / 1000) },
});

const roleModel = mongoose.model('Role', roles);

function initialize() {
     roleModel.estimatedDocumentCount((err, count) => {
        if(!err && count === 0) {
            new roleModel({
                name: 'admin',
            }).save((err)=>{
                if(err) {
                    console.log(err);
                }else {
                    console.log('Add admin role !')
                }
            });
            new roleModel({
                name: 'staff',
            }).save((err)=>{
                if(err) {
                    console.log(err);
                }else {
                    console.log('Add staff role !')
                }
            });
            new roleModel({
                name: 'trainer',
            }).save((err)=>{
                if(err) {
                    console.log(err);
                }else {
                    console.log('Add trainer role !')
                }
            });
            new roleModel({
                name: 'trainee',
            }).save((err)=>{
                if(err) {
                    console.log(err);
                }else {
                    console.log('Add trainee role !')
                }
            });
        }
    })
}

const Roles = {
    model: roleModel,
    initialize: initialize(),
}

module.exports = Roles;
