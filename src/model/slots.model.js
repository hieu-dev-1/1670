const mongoose = require('mongoose');
const mongooseDelete = require('mongoose-delete');
const Schema = mongoose.Schema;

const slot = new Schema({
    name : { type: String, min: 1, max: 50, unique: true},
    description: { type: String },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
},{
    timestamps : { currentTime: () => Math.floor(Date.now() / 1000) },
});

slot.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true});

const slotsModel = mongoose.model('slots', slot);

function initialize(){
    slotsModel.estimatedDocumentCount((err, count) => {
        if (err || count > 0) {
            return;
        }

        const startTimes = ['07:30', '09:10', '10:50', '12:50', '14:30', '16:10', '17:50', '19:30'];
        const endTimes = ['09:30', '10:40', '12:20', '14:20', '16:00', '17:40', '19:20', '21:00'];

        for (let index = 0; index < 8; index++) {
            new slotsModel({
                name: `Slot ${index + 1}`,
                description: `Slot ${index + 1}`,
                startTime: startTimes[index],
                endTime: endTimes[index]
            }).save((err) => {
                if (err) console.log(err);
                else console.log('Add slot successful !');
            })
        }
    })
}

const Slots = {
    model: slotsModel,
    initialize: initialize(),
};

module.exports = Slots;