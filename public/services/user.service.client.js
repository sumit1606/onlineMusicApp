/**
 * Created by sumitbhanwala on 4/4/17.
 */
/**
 * Created by sumitbhanwala on 2/14/17.
 */
// creating a user service which will be invoked when a user hits on the login page with the valid
// credentials and if the username and password are correct than lets the user go to the profile
// page of his and all the fields of the profile populated with his credentials
(function () {
    angular
        .module("WebDevMusicApp")
        .factory("UserService" ,userService)

    function userService($http) {
        var api = {
            "createUser" : createUser,
            "findUserByCredentials" : findUserByCredentials,
            "updateUser" : updateUser,
            "deleteUser" : deleteUser
        }
        return api;

        function createUser(user) {
            console.log("user is" + user);
            return $http.post("/api/user", user);
        }

        function deleteUser(userId) {
            return $http.delete("/api/user/"+userId);
        }

        function findUserById(userId) {
            // calling the api on the server tp fetch data from the server
            // rather that from the local instance
            return $http.get("/api/user/"+userId);
        }

        function findUserByCredentials(username , password) {
            // calling the api on the server tp fetch data from the server
            // rather that from the local instance
            console.log("inside the user service");
            return $http.get("/api/user?username="+username+"&password="+password);
        }

        function updateUser(userId , newUser) {
            // new user is the payload which is passed to the server
            return $http.put("/api/user/"+userId ,newUser);
        }

    }
})();