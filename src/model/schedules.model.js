const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const slotModel = require('./slots.model').model;
const courseModel = require('./courses.model').model;
const Schema = mongoose.Schema;

const schedule = new Schema({
    idSlot: {type: Schema.Types.ObjectId, ref: 'slots',  required: true},
    idCourse : {type: Schema.Types.ObjectId, ref: 'courses', required: true},
    date : {type: Date, required: true},
    idPresent: [{type: Number, ref: 'user', default: []}],
    idAbsent: [{type: Number, ref: 'user', default: []}]
},{
    timestamps : { currentTime: () => Math.floor(Date.now() / 1000) },
});

schedule.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true});

const schedulesModel = mongoose.model('schedules', schedule);

async function initialize(){
    schedulesModel.estimatedDocumentCount(async (err, count) => {
        if (err || count > 0) {
            return ;
        }

        const slots = (await slotModel.find({})).map(slot => slot._id);
        const courses = (await courseModel.find({})).map(course => course._id);

        await new schedulesModel({
            idSlot: slots[0],
            idCourse: courses[0],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });

        await new schedulesModel({
            idSlot: slots[1],
            idCourse: courses[1],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });

        await new schedulesModel({
            idSlot: slots[1],
            idCourse: courses[3],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });

        await new schedulesModel({
            idSlot: slots[3],
            idCourse: courses[4],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });

        await new schedulesModel({
            idSlot: slots[6],
            idCourse: courses[0],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });

        await new schedulesModel({
            idSlot: slots[7],
            idCourse: courses[4],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });

        await new schedulesModel({
            idSlot: slots[0],
            idCourse: courses[0],
            date: new Date()
        }).save((err) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log("Add schedule successful!");
        });
    })
}

const Schedules = {
    model: schedulesModel,
    initialize: initialize(),
};

module.exports = Schedules;

