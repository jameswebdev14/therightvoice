<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-sm-12">
        <h4 v-if=loading>Loading...</h4>
        <h5 class="list-title">My Posts</h5>
        <h5 v-if="this.$store.getters.getMyPosts.length < 1" id="noPostsMsg" class="text-center">You have not posted anything yet</h5>
        <ul v-else>
          <transition-group tag='li' name='slide-top'>
            <li v-for="post in orderedPosts" :key="post._id">
              <div class="card card-body scale-in-ver-top" @click="view(post.threadID, post.threadName)">
                <router-link :to="'/thread/'+ post.threadID">
                  <h6 class="title flex-item"><strong>{{ post.title }}</strong></h6>
                  <img class="postImage img-fluid" v-if="post.image" :src="'data:image/*;base64,'+ post.image" alt="No Image" />
                </router-link>
              </div>
              <div class="card card-footer">
                <p class="thread-footer">thread: <span>{{ post.threadName }}</span></p>
                <p class="thread-footer">created on: <span>{{ post.createdOn | moment }}</span></p>
              </div>
            </li>
          </transition-group>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "myposts",
  data() {
    return {
      posts: {},
      loading: true
    };
  },
  beforeMount() {
    if (
      !this.$store.getters.getLoggedStatus ||
      !sessionStorage.getItem("accessToken")
    ) {
      this.$router.push("/latestThreads");
    }
  },
  mounted() {
    let id = this.$store.getters.getUserId;
    if (!id) {
      this.$router.push("/latestThreads");
    } else {
      this.$http
        .get("http://localhost:5000/myPosts/" + id)
        .then(response => {
          if (!response) {
          } else {
            this.$store.dispatch("setMyPosts", response.data);
          }
          this.loading = false;
        })
        .catch(err => {
          console.log("Error retreiving your posts");
        });
    }
  },
  methods: {
    view(id, name) {
      this.$store.commit("setThreadId", id);
      this.$store.commit("setThreadName", name);
      if (id) {
        this.$http
          .get("http://localhost:5000/threadPosts/" + id)
          .then(response => {
            this.$store.dispatch("setMyPosts", response.data);
          })
          .catch(err => {
            console.log("Error loading threads");
          });
      }
    }
  },
  computed: {
    orderedPosts: function() {
      return this.$lodash.orderBy(
        this.$store.getters.getMyPosts,
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
#listHeader {
  text-align: left;
  font-size: 0.9rem;
  color: lightgreen;
}

.title {
  padding: 5px;
}

.postImage {
  padding-left: 20px;
  margin: 20px 0 !important;
}

.enhance {
  color: rgb(197, 45, 45);
  font-size: 0.9rem;
  font-style: italic;
  font-family: "Times New Roman", Times, serif;
}

.card-body {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.card-footer {
  margin-bottom: -4px;
}

#noPostsMsg {
  color: red;
  margin-top: 15%;
}

.scale-in-ver-top {
  -webkit-animation: scale-in-ver-top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: scale-in-ver-top 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
}

@-webkit-keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}
@keyframes scale-in-ver-top {
  0% {
    -webkit-transform: scaleY(0);
    transform: scaleY(0);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scaleY(1);
    transform: scaleY(1);
    -webkit-transform-origin: 100% 0%;
    transform-origin: 100% 0%;
    opacity: 1;
  }
}


/******************************************************************** */
@media screen and (min-width: 768px) {
  .postImage {
    margin: auto;
  }
}
</style>
