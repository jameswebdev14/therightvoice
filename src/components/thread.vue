<template>
  <div class="container-fluid">
  <!-- New post form  -->
    <section class="row" v-if="this.$store.getters.getLoggedStatus">
      <form id="addPost_form" class="col-sm-12 col-md-8 col-md-offset-2" method="POST" enctype="multipart/form-data">
        <div class="form-group col-md-6 col-xs-12">
          <div id="new-post-text">
            <textarea id="noteText" class="form-control flex-item" placeholder="add post" autofocus rows="4" v-model="postText"></textarea>
          </div>
        </div>
        <div class="form-group col-md-6 col-xs-12">
          <h6 id="uploadText">Upload Image: </h6>
          <input type="file" name="postImage" accept="image/*" class="form-control" ref="imageUpload"/>
          <button type="submit" class="btn btn-primary form-control flex-item" id="submit-btn" style="display:block;"  @click="addPost">Submit</button>
        </div>
      </form>
    </section>
  <!-- Posts List -->
    <section class="container-fluid thread-list">
      <h6 class="list-title" id="title">{{ this.$store.getters.getThreadName }}</h6>
        <ul>
          <transition-group tag='li' name='slide-up'>
            <li v-for="post in orderedPosts" :key="post._id">
              <div class="card card-body">
                <h6 class="title flex-item" style="padding:5px;"><strong>{{ post.title }}</strong></h6>
                <clazy-load src="https://unsplash.it/500" v-if="post.image">
                  <img class="img-fluid postImage" :src="'data:image/jpg;base64,'+ post.image">
                </clazy-load>
              </div>
              <div class="card card-footer">
                <p class="post-footer"><i class="fa fa-thumbs-o-up" @click="voteUp(post._id), post.likes += 1" aria-hidden="true"> {{ post.likes }}</i> <i class="fa fa-thumbs-o-down" @click="voteDown(post._id), post.dislikes += 1" aria-hidden="true"> {{ post.dislikes }}</i></p>
                <p class="post-footer">posted by: {{ post.postedBy | toUpperCase }} : {{ post.postedOn | moment }}</p>
              </div>
            </li>
          </transition-group>
        </ul>
    </section>
  </div>
</template>

<script>
import moment from "moment";
var _ = require("lodash/core");

export default {
  name: "thread",
  data() {
    return {
      posts: {},
      postText: "",
      loggedInUser: false,
      id: this.$store.getters.getThreadId
    };
  },
  mounted() {
    if (sessionStorage.getItem("accessToken")) {
      this.loggedInUser = true;
    }
    this.$http
      .get(
        "http://localhost:5000/threadPosts/" + this.$store.getters.getThreadId
      )
      .then(response => {
        this.posts = response.body;
        this.$store.dispatch("setThreadPosts", response.body);
        this.postText = "";
      })
      .catch(err => {
        console.log("Error retrieving posts");
      });
  },
  methods: {
    addPost(e) {
      e.preventDefault();
      if (!sessionStorage.getItem("accessToken")) {
        console.log("Please log in");
        return;
      }
      let postImage = this.$refs.imageUpload.files[0];

      if (this.postText === "" && !postImage) {
        return;
      }
      if (this.postText == "") {
        this.$store.commit("setMsg", "Post missing");
        return;
      }
      if (!this.$store.getters.getuser) {
        return;
      } else {
        this.$store.commit("setMsg", "");

        // Set up form data
        var formData = new FormData();
        formData.append("postedBy", this.$store.getters.getUsername);
        formData.append("posterId", this.$store.getters.getUserId);
        formData.append(
          "postText",
          this.postText.charAt(0).toUpperCase() + this.postText.slice(1)
        );
        formData.append("threadId", this.$store.getters.getThreadId);
        formData.append("threadName", this.$store.getters.getThreadName);

        if (!postImage) {
          formData.append("image", null);
        } else {
          formData.append("image", postImage);
        }
        formData.append("token", sessionStorage.getItem("accessToken"));
        this.$http
          .post("http://localhost:5000/newPost", formData)
          .then(response => {
            this.$store.commit("setNewPost", response);
            this.$router.push("/latestPosts");
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    voteUp(id) {
      this.$http
        .post("http://localhost:5000/upvote/", { id })
        .then(res => {})
        .catch(err => {});
    },
    voteDown(id) {
      this.$http
        .post("http://localhost:5000/downvote/", { id })
        .then(res => {})
        .catch(err => {});
    }
  },
  computed: {
    orderedPosts: function() {
      return this.$lodash.orderBy(
        this.$store.getters.getThreadPosts,
        ["postedOn"],
        ["desc"]
      );
    }
  },
  filters: {
    moment: date => {
      return moment(date).format("MMMM Do YYYY, h:mm a");
    },
    toUpperCase: title => {
      return title.toUpperCase();
    }
  }
};
</script>

<style scoped>
#threadName {
  color: lightgreen;
  text-align: left;
  font-size: 0.9rem;
}

.threadHeader {
  display: flex;
  justify-content: space-between;
}

.title {
  padding: 5px;
}

ul {
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  /*height: 120vh;*/
}

li {
  list-style: none;
  /*margin-bottom:10px;*/
  margin-right: 6px;
}

.btn-addPost {
  font-size: 0.8rem;
  width: 70px;
  height: 30px;
  padding: 5px;
  align-items: stretch;
}

#addPost_form {
  margin: auto;
  background-color: lightblue;
  padding-top: 20px;
  border: 2px solid green;
  border-radius: 5px;
  overflow: hidden;
  width: 100%;
  display: flex;
  justify-content: center;
  align-content: center;
  margin-bottom: 20px;
}

#noteText {
  overflow-y: auto;
  height: 120px;
  width: 100%;
  margin: 2px;
}

.card-footer {
  margin-bottom: -4px;
}
#newPost {
  display: flex;
  justify-content: center;
  width: 100% !important;
  align-content: center;
  margin-left: 1px;
  margin-right: 1px;
  margin-bottom: 15px;
  background-color: lightblue;
}

.fa {
  margin: 0 8px;
}

.fa-thumbs-o-down {
  color: red;
}

.fa:hover {
  cursor: pointer;
}

#uploader {
  display: flex;
}

#uploadText {
  padding: 0;
  margin: 4px 10px 10px 0;
  font-size: 1rem;
  font-weight: bold;
  text-align: left;
  display: inline-block;
  padding-left: 2px;
  color: green;
}

#imageUploader {
  display: inline;
  padding-left: 4px;
  padding-bottom: 5px;
  padding-top: 5px;
}

#submit-btn {
  display: block;
  margin-top: 11px;
  background-color: green;
  color: white;
  font-family: "Times New Roman", Times, serif;
  border: none;
}

#submit-btn:hover {
  cursor: pointer;
  color: red;
}

.postImage {
  max-width: 400px;
}

/*****************************************************************************/
@media screen and (max-width: 768px) {
  * {
    margin: 0;
    padding: 0;
  }

  #addPost_form {
    width: 88%;
    flex-direction: column;
    margin: auto auto;
  }

  .threadList {
    margin-top: 30px;
  }

  #noteText {
    height: 80px;
    padding: 3px;
    width: 90%;
    margin: auto;
  }

  .form-group input {
    width: 90%;
    margin: auto;
    border: none;
  }

  ul > li {
    margin: 0;
  }

  #title {
    font-size: 1rem;
    text-align: center;
    padding: 10px;
    margin-bottom: 10px;
  }

  #submit-btn {
    display: block;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 15px;
    width: 80%;
  }

  #imageUploader {
    font-size: 0.7rem;
    margin-left: 5px;
  }

  #uploadText {
    padding: 0;
    margin-left: 8px;
    font-size: 0.8rem;
    font-weight: bold;
    text-align: left;
    display: inline-block;
    padding-left: 2px;
    color: green;
  }

  .body-section {
    margin: 0;
    width: 100%;
  }

  .card-body {
    width: 95%;
    margin: auto;
  }

  .card-footer {
    display: flex;
    justify-content: flex-start;
    flex-direction: row;
    width: 95%;
    margin: auto;
    margin-bottom: 10px;
  }

  .post-footer {
    text-align: left;
    font-size: 0.6rem;
    margin-left: 1px;
    padding-top: 2px;
  }

  .post-image {
    display: block;
    width: 95%;
    margin: auto;
    min-width: 200px;
    min-height: 200px;
    max-width: 100%;
    max-height: 100vh;
  }

  .fa {
    margin: 0 3px;
    padding-top: 3px;
    font-size: 0.7rem;
  }

  .fa:hover {
    cursor: pointer;
  }

  #addPost_form {
    margin-bottom: 20px;
  }
}
</style>




<!--

<div class="row">
        <div class="col-md-12">
          <h6 class="list-title" id="title">{{ this.$store.getters.getThreadName }}</h6>
          <ul>
            <transition-group tag='li' name='slide-up'>
              <li v-for="post in orderedPosts" :key="post._id">
                <div class="card card-body">
                  <h6 class="title flex-item" style="padding:5px; height:auto; min-height:35px; overflox-x:auto"><strong>{{ post.title }}</strong></h6>
                  <img v-if="post.image" :src="'data:image/jpg;base64,'+ post.image" class="img-fluid post-image">
                </div>
                <div class="card card-footer">
                  <p><i class="fa fa-thumbs-o-up" @click="voteUp(post._id), post.likes += 1" aria-hidden="true"> {{ post.likes }}</i> <i class="fa fa-thumbs-o-down" @click="voteDown(post._id), post.dislikes += 1" aria-hidden="true"> {{ post.dislikes }}</i></p>
                  <p class="post-footer">posted by: <strong class="postedByText">{{ post.postedBy | toUpperCase }}</strong>on: <strong>{{ post.postedOn | moment }}</strong></p>
                </div>
              </li>
            </transition-group>
          </ul>
        </div>
      </div>

-->
