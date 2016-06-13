"use strict"

module.exports = {

    index: (message) => {
        return function (req, res) {
            
            res.send(message)
        };
    }
    
    
};
