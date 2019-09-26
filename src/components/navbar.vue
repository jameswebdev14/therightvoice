<template>
<div class="container-fluid">
  <nav class="navbar navbar-expand-lg navbar-dark">
    <div class="flex-item d-flex brand-section">
      <a class="navbar-brand" href="#"><span id="span1">the</span><span id="span2">Right</span><span id="span3">Voice</span></a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon m-auto"></span>
      </button>
    </div>
    <div class="collapse navbar-collapse flex-item" id="navbarSupportedContent" ref="mobileForm">
      <ul class="navbar-nav">
        <li class="nav-item active" data-toggle="collapse" data-target="#navbarSupportedContent">
          <router-link to="/latestThreads" class="nav-link"><i class="fa fa-home" aria-hidden="true"></i> Home</router-link>
        </li>
        <li class="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent">
          <router-link to="/latestPosts" class="nav-link"><i class="fa fa-calendar" aria-hidden="true"></i> Latest Posts</router-link>
        </li>
        <li class="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent" v-if='this.$store.getters.getLoggedStatus'>
          <router-link to="/myPosts" class="nav-link"><i class="fa fa-envelope-square" aria-hidden="true"></i> My Posts</router-link>
        </li>
        <li class="nav-item" data-toggle="collapse" data-target="#navbarSupportedContent" v-if='this.$store.getters.getLoggedStatus'>
          <router-link to="/myThreads" class="nav-link"><i class="fa fa-folder-open" aria-hidden="true"></i> My Threads</router-link>
        </li>
        <li class="nav-item d-block d-sm-block d-md-none d-lg-none d-xl-none" data-toggle="collapse" data-target="#navbarSupportedContent" v-if='this.$store.getters.getLoggedStatus'>
          <i class="fa fa-sign-out" aria-hidden="true"></i>
          <button type="button" id="logout-Btn" @click.prevent="logOut">Log Out</button>
        </li>

        <!-- Mobile login/register form section -->
        <div id="mobileLogin-form" v-if="this.$store.getters.getLoggedStatus === false">
          <form class="loginForm text-center">
              <div class="form-group">
                <p class="lead"><span class="text-success">Log In</span></p>
                <input type="text" class="form-control username" name="username" placeholder="user name" v-model="username" required autofocus autocomplete="off">
              </div>
              <div class="form-group">
                <input type="password" class="form-control password" name="password" required="Password required" autocomplete="off" v-model="password" placeholder="password">
              </div>
              <button type="submit" id="mobileLoginBtn" class="btn btn-success btn-block" data-toggle="collapse" data-target="#navbarSupportedContent" @click.prevent="login">Login</button>
              <div style="margin-top:5px;" class="text-center"><p>{{ msg }}</p></div>
          </form>
          <div class="col-sm-12 col-md-6 text-center" id="registrationDiv" style="margin-top:30px;">
              <p class="lead"><span class="text-success">Register</span></p>
              <p class="lead">Register for <span class="text-success">FREE</span></p>
              <ul class="list-unstyled" style="line-height: 2">
                <li><span class="fa fa-check text-success"></span> Start new blogs</li>
                <li><span class="fa fa-check text-success"></span> Add new posts</li>
                <li><span class="fa fa-check text-success"></span> View all your blogs and posts</li>
                <li><span class="fa fa-check text-success"></span> Contact other members</li>
              </ul>
              <hr>
              <form class="form-group registration-form">
                <input type="text" placeholder="user name" name="username" v-model="new_username">
                <input type="text" placeholder="email" name="email" v-model="email">
                <input type="password" placeholder="password (min 6)" name="password" v-model="new_password" min="6" ref="passwordfield">
                <input type="password" placeholder="confirm password" name="confirmPassword" v-model="confirmPassword">
                <p><a href="*" class="btn btn-info btn-block" id="btn-register" @click="register">Register now!</a></p>
              </form>
          </div>
        </div>  <!-- End of mobile form section -->
      </ul>
    </div>
    <ul class="nav navbar-nav navbar-right d-none d-sm-none d-md-none d-lg-block">
      <!-- Login & registration controls -->
      <li v-if="!this.$store.getters.getLoggedStatus" style="width:140px;"><a href="#Modal" data-toggle="modal"><i class="fa fa-sign-in" aria-hidden="true"></i> Sign In/Register</a></li>
      <li v-else style="width:140px;"><i class="fa fa-sign-out" aria-hidden="true"></i><a href="#" @click.prevent="logOut"> Sign Out</a></li>
    </ul>
  </nav>

  <!-- Login/register modal -->
  <div id="Modal" class="modal fade container" ref="modalForm">
    <div class="modal-content modal-dialog">
      <div class="modal-header text-center">
          <h4 class="modal-title" id="myModalLabel"><span style="font-size:1.0rem; color:orange; font-style:italic">the</span><span style="font-size:1.8rem; color:red;">Right</span><span style="font-size:1.8rem; color:green;">Voice</span></h4>
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">×</span><span class="sr-only">Close</span></button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-12 col-md-6" id="loginDiv">
            <div class="well">
              <form class="loginForm text-center">
                  <div class="form-group">
                    <p class="lead"><span class="text-success">Log In</span></p>
                    <label for="username" class="control-label">Username</label>
                    <input type="text" class="form-control username" name="username" title="Please enter you username" v-model="username" required autofocus autocomplete="off">
                  </div>
                  <div class="form-group">
                    <label for="password" class="control-label">Password</label>
                    <input type="password" class="form-control password" name="password" required="Password required" autocomplete="off" v-model="password" title="Please enter your password">
                  </div>
                  <button type="submit" class="btn btn-success btn-block" @click.prevent="login">Login</button>
                  <div style="margin-top:10px;"><p class="error-message" v-if="msg">{{ msg }}</p></div>
              </form>
            </div>
          </div>
          <div class="col-sm-12 col-md-6" id="registrationDiv">
              <p class="lead">Register now for <span class="text-success">FREE</span></p>
              <ul class="list-unstyled" style="line-height: 2">
                <li><span class="fa fa-check text-success"></span> Start new blogs</li>
                <li><span class="fa fa-check text-success"></span> Add new posts</li>
                <li><span class="fa fa-check text-success"></span> View all your blogs and posts</li>
                <li><span class="fa fa-check text-success"></span> Contact other members</li>
              </ul>
              <hr>
              <form class="form-group registration-form">
                <input type="text" placeholder="user name" name="username" v-model="new_username">
                <input type="text" placeholder="email" name="email" v-model="email">
                <input type="password" placeholder="password (min 6)" name="password" v-model="new_password" min="6" ref="passwordfield">
                <input type="password" placeholder="confirm password" name="confirmPassword" v-model="confirmPassword">
                <p><a href="*" class="btn btn-info btn-block" id="btn-register" @click="register">Register now!</a></p>
              </form>
          </div>
        </div>
      </div>
    </div>
  </div> <!-- End of Login/registration model -->
</div>
</template>

<script>
export default {
  name: "navbar",
  data() {
    return {
      username: "",
      password: "",
      new_username: "",
      new_password: "",
      confirmPassword: "",
      email: "",
      msg: "",
      alert: false,
      searchType: "threads",
      searchText: ""
    };
  },
  computed: {},
  methods: {
    register(e) {
      e.preventDefault();
      this.alert = false;
      this.msg = "";
      if (!this.new_password || !this.new_username || !this.email) {
        this.msg = "No username, password or email provided";
        this.alert = true;
        return;
      }
      if (this.new_password != this.confirmPassword) {
        this.msg = "Passwords do not match";
        this.alert = true;
        this.password = "";
        this.confirmPassword = "";
        this.$refs.passwordfield.focus();
        return;
      }

      this.$http
        .post("http://localhost:5000/register", {
          username: this.new_username,
          password: this.new_password,
          email: this.email
        })
        .then(function(data) {
          if (data) {
            if (data === "Username not available") {
              this.msg = "Username already in use";
              this.alert = true;
              return;
            }
            if (
              data === "Email already registered. Already have an acccount?"
            ) {
              this.msg = "Email already registered. Already have an account?";
              this.alert = true;
              return;
            }
            if (data) {
              $("#Modal").modal("hide");
              this.mobileLogin = false;
              this.$socket.emit("joined", data.username);
            }
          }
        })
        .catch(function(err) {
          this.msg = "No Server Response. Please try again later";
        });
    },
    // LOGIN
    login() {
      if (this.username === "" || this.password === "") {
        return;
      }
      this.$http
        .post("http://localhost:5000/login", {
          username: this.username,
          password: this.password
        })
        .then(function(response) {
          if (!response) {
            this.msg = "Login details not found";
          } else {
            const user = {
              username: response.body.username,
              email: response.body.email,
              userId: response.body.userId
            };
            sessionStorage.setItem("accessToken", response.body.token);
            this.$store.commit("setUser", response.body);
            this.$socket.emit("signedIn", user.username);
            $("#Modal").modal("hide");
          }
        })
        .catch(function(err) {
          console.log(err);
        });
    },
    // LOGOUT
    logOut() {
      sessionStorage.removeItem("accessToken");
      this.$socket.emit("signedOut", this.$store.getters.getUsername);
      this.$store.commit(
        "SOCKET_SET_MEMBER_NOT_ACTIVE",
        this.$store.getters.getUsername
      );
      this.$store.commit("setUserNone");
      this.$router.push("/latestThreads");
    }
  },
  sockets: {
    joined(members) {
      if (members) {
      }
      this.$socket.emit("membersList");
    },
    userLeft(members) {
      if (members) {
      }
    }
  }
};
</script>

<style scoped>
/******************DEFAULT LARGE******************************************/
.navbar {
  margin-top: 30px;
  width: 100%;
  padding: 0;
  background-color: transparent;
  margin-bottom: 30px;
  color: green;
  align-items: baseline;
}

.navbar-brand {
  padding: 0;
  margin-left: 30px;
}


.brand-section {
  justify-content: flex-start;
}

.nav-item {
  margin-right: 0;
}

.nav-link {
  font-weight:bold;
  color:lightgreen !important;
}

#span1 {
  font-size: 1rem;
  color: orange;
  margin: 0;
}

#span2 {
  font-size: 2.4rem;
  color: red;
  margin: 0;
}

#span3 {
  font-size: 2.4rem;
  color: green;
  margin: 0;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}

.modal-dialog {
  margin: auto auto;
  border-radius: 15px !important;
  background-color: lightblue;
}

#modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.modal-header,
.modal-body {
  background-color: lightblue;
  color: black;
}

.modal-title {
  margin: auto;
}

.form-group > input {
  width: 80%;
  border-radius: 5px;
  margin: auto;
  margin-bottom: 5px;
  padding: 5px;
}

.registration-form > input {
  width: 100% !important;
  margin: auto auto;
  margin-bottom: 5px;
}

#registrationDiv loginDiv {
  background-color: #f5f5f5;
  width: 100%;
  margin: 5px;
}

.fa fa-users .fa fa-user-circle {
  background-color: red;
}

.searchForm {
  margin-right: 50px;
}

#btn-register {
  color: navy;
  font-weight: bold;
  margin-top: 10px;
}

#selectText {
  font-style: italic;
  color: grey;
  font-size: 1rem;
}

#mobileLogin-form {
  display: none;
  margin: auto;
}

/*************MOBILE VIEW**************************/
@media screen and (max-width: 768px) {
  .container-fluid {
    margin: 0;
    padding: 0;
  }

  .navbar {
    margin: 10px 10px;
    padding: 0;
    width: 100%;
  }

  .navbar-brand {
    margin: auto;
  }

  .brand-section {
    padding: 0;
    width: 100%;
  }

  .navbar-toggler {
    margin-right: 30px;
    border: none;
    padding: 0;
  }

  #span1 {
    font-size: 1.1rem;
    color: orange;
    font-style: italic;
    padding-left: 30px;
  }

  #span2 {
    font-size: 1.9rem;
    color: red;
  }

  #span3 {
    font-size: 1.9rem;
    color: green;
  }

  #logout-Btn {
    color: red;
    background-color: transparent;
    border: none;
    margin-bottom: 15px;
  }

  .registration-form > input {
    width: 100% !important;
    margin: auto auto;
  }

  #mobileLogin-form {
    display: block;
    background-color: rgba(36, 64, 109, 0.6);
    border-radius: 8px;
    padding: 5px;
    width: 280px;
    margin: auto;
  }

  #mobileLoginBtn:hover {
    cursor: pointer;
  }
}

/****************MEDIUM VIEW***********************/
@media screen and (min-width: 769px) and (max-width: 1000px) {
  .brand-section {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
