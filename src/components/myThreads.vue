<template>
<div class="container-fluid">
    <div class="row" v-if="this.$store.getters.getLoggedStatus">
      <div class="col-md-12">
        <newThread></newThread>
      </div>
    </div>
    <div class="row">
      <div class="col-md-12">
        <h5 class="list-title">My Threads</h5>
        <h5 v-if="this.$store.getters.getMyThreads.length < 1" id="noThreadsMsg" class="text-center">You have not started any threads</h5>
        <ul>
          <transition-group tag='li' name='slide-up' class="slide-up">
            <li v-for="thread in threads" :key="thread._id">
              <div class="card card-body" @click="view(thread._id, thread.title)">
                <router-link :to="'/thread/'+ thread._id">
                  <h6 class="title flex-item"><strong>{{ thread.title }}</strong></h6>
                </router-link>
              </div>
              <div class="card card-footer">
                <p class="single-thread-footer">created on: <strong>{{ thread.createdOn | moment }}</strong></p>
              </div>
            </li>
          </transition-group>
        </ul>
      </div>
    </div>
</div>
</template>

<script>
import newThread from "./newThread.vue";
import moment from "moment";

export default {
  name: "myThreads",
  data() {
    return {
      threads: {},
      id: ""
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
    this.id = this.$store.getters.getUserId;
    if (!this.id) {
      this.msg = "Please log in to view your threads";
      this.$router.push("/latestThreads");
    } else {
      this.$http
        .get("http://localhost:5000/myThreads/" + this.id)
        .then(response => {
          this.threads = response.body;
          this.$store.dispatch("setMyThreads", this.threads);
        })
        .catch(err => {
          this.msg = "Error retreiving your threads";
        });
    }
  },
  filters: {
    moment: date => {
      return moment(date).format("MMMM Do YYYY, h:mm a");
    },
    toUpperCase: title => {
      return title.toUpperCase();
    }
  },
  components: {
    newThread
  },
  methods: {
    view(id, title) {
      this.$store.commit("setThreadId", id);
      this.$store.commit("setThreadName", title);
    }
  }
};
</script>

<style scoped>
#listHeader {
  text-align: left;
  font-size: 0.9rem;
  color: lightgreen;
  margin-bottom: 15px;
}

.title {
  padding: 5px;
}

.thread-footer,
.card-footer {
  display: flex;
  justify-content: flex-end;
}

.card-footer {
  margin-bottom: -4px;
}

#noThreadsMsg {
  color: red;
  margin-top: 30px;
}

.slide-up {
  -webkit-animation: slide-top 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
  animation: slide-top 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

@-webkit-keyframes slide-up {
  0% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
  100% {
    -webkit-transform: translateY(-100px);
    transform: translateY(-100px);
  }
}

@keyframes slide-up {
  0% {
    -webkit-transform: translateY(600px);
    transform: translateY(600px);
  }
  100% {
    -webkit-transform: translateY(0);
    transform: translateY(0);
  }
}
</style>
