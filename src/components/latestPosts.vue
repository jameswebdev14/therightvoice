<template>
  <div class="container-fluid" id="postList">
    <h5 class="list-title">Latest Posts</h5>
    <ul>
      <transition-group tag='li'>
        <li v-for="post in orderedPosts" :key="post._id" class="latestPostsList">
          <div class="card card-body scale-in-ver-top" @click="view(post.threadID, post.threadName)">
            <router-link :to="'/thread/'+ post.threadID">
              <h6 class="title flex-item"><strong>{{ post.title }}</strong></h6>
              <clazy-load src="https://unsplash.it/500" v-if="post.image">
                <img class="postImage img-fluid" :src="'data:image/*;base64,'+ post.image" alt="No Image" />
              </clazy-load>
            </router-link>
          </div>
          <div>
            <div class="card card-footer">
              <p class="single-thread-footer">posted by: <span class="strong">{{ post.postedBy }}</span> on: <span class="strong">{{ post.postedOn | moment }}</span></p>
            </div>
          </div>
        </li>
      </transition-group>
    </ul>
  </div>
</template>
<script>
import moment from "moment";
export default {
  name: "latestPosts",
  data() {
    return {
      contentType: "",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers":
          "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET,POST,DELETE"
      }
    };
  },
  methods: {
    view(id, threadname) {
      this.$store.commit("setThreadId", id);
      this.$store.commit("setThreadName", threadname);
      this.$router.push("/thread/" + id);
    }
  },
  filters: {
    moment: date => {
      return moment(date).format("MMMM Do YYYY");
    },
    toUpperCase: title => {
      return title.toUpperCase();
    }
  },
  mounted() {
    this.$http
      .get("http://localhost:5000/latestPosts", this.headers)
      .then(posts => {
        this.$store.dispatch("setPosts", posts.data);
      })
      .catch(err => {
        console.log("Error retrieving data: " + err);
      });
  },
  computed: {
    orderedPosts: function() {
      if (this.$store.getters.getPosts.length > 0) {
        return this.$lodash.orderBy(
          this.$store.getters.getPosts,
          ["postedOn"],
          ["desc"]
        );
      }
    }
  }
};
</script>

<style scoped>
ul {
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  height: 120vh;
}

li {
  list-style: none;
  margin-bottom: -5px;
  margin-right: 10px;
  padding: 5px;
  margin-top: 2px;
}

.title {
  color: black;
  padding: 5px;
  text-decoration: none;
}

#title {
  padding: 5px;
  color: lightgreen;
  text-align: left;
  font-size: 1rem;
}

.latestPostsList {
  margin-bottom: -10px;
  margin: auto;
}

.enhance {
  color: rgb(197, 45, 45);
  font-size: 0.9rem;
  font-style: italic;
  font-family: "Times New Roman", Times, serif;
  padding-bottom: 2px;
}

.view-btn {
  padding: 5px;
  font-size: 12px;
}

.card-footer {
  justify-content: flex-end;
  margin-bottom: -3px;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}

.content:hover {
  cursor: pointer;
}

router-link:hover {
  text-decoration-style: none;
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

/********************************************************************/
@media screen and (max-width: 768px) {
  .card-footer > .single-thread-footer {
    display: flex;
    justify-content: flex-start;
    margin-left: 2px;
    padding: 2px;
    width: 100%;
    max-width: 100%;
    font-size: 0.7rem;
  }

  .thread-footer {
    display: flex;
    justify-content: flen-start;
    margin: 0;
    padding: -2px 2px 0 2px;
    text-align: left;
  }

  .latestPostsList {
    margin: auto;
  }

  .list-title {
    margin: 5px 0 3px 13px;
  }

  .postImage {
    margin: auto;
  }
}
</style>
