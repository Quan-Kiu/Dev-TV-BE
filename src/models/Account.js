const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const accountSchema = new mongoose.Schema(
    {
        // username: {
        //     type: String,
        //     required: true,
        //     min: 5,
        //     max: 25,
        // },
        email: {
            type: String,
            unique: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            min: 6,
            max: 25,
        },
        accountType: {
            type: String,
            enum: ['Candidate','Employer','Admin']
        },
        // gender: {
        //     type: String,
        //     enum: ['male', 'female', 'other'],
        //     default: 'male',
        // },
        status: {
            type: String,
            enum: ['I','A','D'],
            default: 'I',
        },
        accountDetail: {
                type: mongoose.Types.ObjectId,
                refPath: 'accountType',
        },
        // phone: {
        //     type: String,
        // },
    
    },
    {
        timestamps: true,
    }
);

accountSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, 12);
    console.log(this.password);
    next();
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
