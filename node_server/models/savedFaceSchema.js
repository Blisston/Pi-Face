const mongoose=require('mongoose');
const saved = mongoose.Schema(
    {
        _id:mongoose.Schema.Types.ObjectId,
        name:String,
        photo:String,
        base64Format: String
        
    }
);
module.exports = mongoose.model('Saved',saved)