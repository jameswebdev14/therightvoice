<template>
<div>
  <div class="loading text-center" v-if="loading">
      <h4>Loading...</h4>
  </div>
  <div class="container-fluid">
    <h5 class="list-title">Threads</h5>
    <ul class="list-group scale-in-ver-top">
      <!--<transition-group class=""> -->
        <li v-for="thread in orderedThreads" :key="thread._id" >
          <div class="card card-body" @click="view(thread._id, thread.title)">
            <router-link :to="'/thread/'+ thread._id">
              <h6 class="title flex-item"><strong>{{ thread.title }}</strong></h6>
            </router-link>
          </div>
          <div class="card card-footer container-fluid">
            <p class="single-thread-footer">created by: <span class="strong">{{ thread.creatorName }}</span>on: <span class="strong">{{ thread.createdOn | moment }}</span></p>
          </div>
        </li>
      <!--</transition-group> -->
    </ul>
  </div>
</div>
</template>
<script>
import moment from "moment";

export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    orderedThreads() {
      return this.$lodash.orderBy(
        this.$store.getters.getThreads,
        ["createdOn"],
        ["desc"]
      );
    }
  },
  methods: {
    view(id, title) {
      this.$store.commit("setThreadId", id);
      this.$store.commit("setThreadName", title);
    },
    beforeUnload() {
      this.$socket.emit("signedOut", this.$store.getters.getUsername);
      sessionStorage.removeItem("accessToken");
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
  created() {
    window.addEventListener("beforeunload", this.beforeUnload);
  },
  mounted() {
    this.loading = true;
    this.$http.get("http://localhost:5000/latestThreads").then(response => {
      this.$store.dispatch("setThreads", response.data);
      this.loading = false;
    });
  }
};
</script>
<style scoped>
.header-section {
  display: flex;
  flex-flow: row;
  justify-content: space-between;
  margin-bottom: 10px;
  height: 35px;
  font-size: 0.8rem;
  padding: 5px;
}

ul {
  margin: 0;
  padding: 0;
  overflow-y: scroll;
  height: 120vh;
}

.single-thread-footer {
  font-size: 0.8rem;
  width: 100%;
}

.view-btn {
  display: inline-block;
  width: 40px;
  height: 30px;
  padding: 4px;
  cursor: pointer;
}

.card-footer {
  margin-bottom: -4px;
}

.list-title {
  margin-top: 10px;
}

.list-group {
  height: 100%;
}

.scale-in-ver-top {
  -webkit-animation: scale-in-ver-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)
    both;
  animation: scale-in-ver-top 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
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

/********************SMALL**********************************/
@media screen and (max-width: 768px) {
  .card {
    width: 100%;
    max-width: 100%;
  }

  .list-title {
    margin: 5px 0 3px 13px;
  }
}
</style>


