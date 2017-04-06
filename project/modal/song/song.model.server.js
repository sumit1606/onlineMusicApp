/**
 * Created by sumitbhanwala on 4/5/17.
 */
module.exports = function () {

    // expsoing this particular api
    var api = {
        createSong : createSong
    };

    var mongoose = require('mongoose');
    var q = require('q');
    var songSchema = require('./song.schema.server.js')();
    var songModel = mongoose.model('songModel', songSchema);
    return api;

    function createSong (newsong) {
        var q1 = q.defer();
        songModel.create(newsong, function (err, newsong) {
            if (err) {
                q1.reject();
            }
            else {
                q1.resolve(newsong);
            }
        });
        return q1.promise;
    }

    // create album
    // delete an album
    // delete an song from an album  are the possible crud operations


};