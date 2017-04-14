/**
 * Created by sumitbhanwala on 4/13/17.
 */
/**
 * Created by sumitbhanwala on 4/12/17.
 */
/**
 * Created by Asim on 30-03-2017.
 */
(function() {

    angular
        .module("WebDevMusicApp")
        .controller("SongsInAlbums",SongsInAlbums);

    function SongsInAlbums($location,$routeParams,playListService,Upload,UserService,$timeout,MusicService,$sce,EmailService,$scope ,albumService) {
        var vm = this;
        vm.playing = false;
        // logged in parent user id
        vm.pid = $routeParams.pid;

        // current singer company
        vm.userId = $routeParams.uid;

        // current album id
        vm.albumId = $routeParams.aid;
        vm.playStatus = "Paused...";
        vm.nowPlayingTitle = "";
        vm.trackCount=0;
        vm.noSongFound = null ;
        vm.deletethisSong = deletethisSong
        vm.loadTrack = loadTrack;
        vm.previousSong = previousSong;
        vm.nextSong = nextSong;
        vm.playThisSong = playThisSong;
        vm.sendtoserver = sendtoserver ;
        vm.loadAllMyList = loadAllMyList ;
        vm.availablePlaylist = null ;
        vm.play = play;
        vm.isOwner ;
        vm.index = 0;
        vm.playlist = {};
        vm.addthisSong = addthisSong ;
        vm.addtothisplaylist = addtothisplaylist;
        vm.selectedSong = null ;
        vm.songaddedsuccess = null ;
        function init () {
            findAllSongsForAlbum();
        }

        init();


        function addthisSong(song) {
            }


        function addtothisplaylist (playList) {
            var songId = vm.selectedSong;
            var playListId = playList._id ;
            var promise = playListService.addSongtoPlayList(songId ,playListId);
            promise.success(function(response) {
                if(response){
                    vm.songaddedsuccess = "song added to the playlist";
                    closeModal() ;
                    init();

                }
            }).error(function (err) {
                vm.error = "Unable to add song in your album";
            })
        }

        function loadAllMyList(song) {
            if(vm.pid != null)
            {
                 var promise  = UserService.findAllplayList(vm.pid);
                 promise.success(function (user) {
                    vm.availablePlaylist = user.data ;
                    console.log(vm.availablePlaylist);
                     vm.selectedSong = song._id ;
                })
                promise.error(function (err) {
                    console.log("some error occured " + err);
                    vm.availablePlaylist = null ;
                })
            }
        }

        function deletethisSong(song) {
            var songId = song._id;
            var promise = albumService.deleteSongFromAlbum(vm.albumId ,songId );
            promise.success(function(response) {
                if(response){
                    init();
                }
            }).error(function (err) {
                vm.error = "Unable to delete the song in the album";
            })
        }

        function closeModal() {
            $('.modal').modal('hide');
        }
        function loadMp3Player() {
            if (vm.album && vm.album.songs && vm.album.songs.length > 0) {
                vm.nowPlayingTitle = vm.album.songs[0].title;
                vm.trackCount = vm.album.songs.length;
            }
            vm.audio = angular.element(document.querySelector('#audio1')).bind('play', vm.play).bind('pause', function () {
                vm.playing = false;
                vm.playStatus = "Paused...";
                $scope.$apply();
            }).bind('ended', function () {
                vm.playStatus = "Paused...";
                if ((vm.index + 1) < vm.trackCount) {
                    vm.index++;
                    loadTrack(vm.index);
                    vm.audio.play();
                } else {
                    vm.audio.pause();
                    vm.index = 0;
                    loadTrack(vm.index);
                }
                $scope.$apply();
            }).get(0);
            loadTrack(vm.index);
        }

        function findAllSongsForAlbum() {
            var promise = albumService.findAllSongs(vm.albumId);
            promise.success (function (result) {
                if (result && result.status==='OK' && result.data && result.data.songs.length > 0) {
                    //     console.log(result.data);
                    vm.album = result.data;
                    console.log(vm.album);
                    console.log(vm.userId);
                    if(!vm.pid)
                        vm.isOwner = true ;
                   else if((vm.pid !=null) && (vm.album.albumOwner ===  vm.pid))
                        vm.isOwner = true ;
                    else if( (vm.pid !=null) &&(vm.album.albumOwner !=  vm.pid))
                        vm.isOwner = false ;
                    console.log(vm.isOwner);
                    loadMp3Player();
                }
                else if(result && result.status==='OK' && result.data && result.data.songs.length == 0){
                    if(vm.audio) {
                        vm.audio.pause();
                    }
                    vm.noSongFound = "There are no songs to play in this album";
                }else {
                    vm.error = "Some Error Occurred!! Please try again!";
                }
            }).error(function () {
                vm.error = "Some Error Occurred!! Please try again!";
            });
        }

        // below function is working fine just need to add maybe some extra valdiations and
        // thats it
        function sendtoserver() {
            Upload.upload({
                url: '/api/musicCompany/uploadSong', // web api which will handle the data
                data:{
                    title : vm.song.title,
                    name : vm.song.name,
                    genre : vm.song.genre,
                    userId : vm.userId,
                    albumId : vm.albumId,
                    file:vm.file
                } //pass file as data, should be user ng-model
            }).then(function (updatedalbum) { //upload function returns a promise
                closeModal();
                vm.noSongFound = null ;
                vm.song = {};
                $timeout(function () {
                    // probably will handle the redirection to the
                    // album default page
                    init();
                }, 250);
            }, function (resp) { //catch error
                console.log(resp);
            });
        }

        function play () {
            vm.playing = true;
            vm.playStatus = "Now Playing...";
            $scope.$apply();
            console.log(vm.playing);
            console.log(vm.playStatus);
        }

        function previousSong() {
            if ((vm.index - 1) > -1) {
                vm.index--;
                loadTrack(vm.index);
                if (vm.playing) {
                    vm.audio.play();
                }
            } else {
                vm.audio.pause();
                vm.index = 0;
                loadTrack(vm.index);
            }
        }
        function nextSong() {

            if ((vm.index + 1) < vm.trackCount) {
                vm.index++;
                loadTrack(vm.index);
                if (vm.playing) {
                    vm.audio.play();
                }
            } else {
                vm.audio.pause();
                vm.index = 0;
                loadTrack(vm.index);
            }
        }

        function playThisSong (id) {
            loadTrack(id);
            vm.audio.play();
        }

        function loadTrack(id) {
            //  $('.plSel').removeClass('plSel');
            //  $('#plList li:eq(' + id + ')').addClass('plSel');
            // npTitle.text(tracks[id].name);
            vm.nowPlayingTitle = vm.album.songs[id].title;
            vm.index = id;
            vm.audio.src = $sce.trustAsResourceUrl(vm.album.songs[id].songURL);
        }



    }
})();