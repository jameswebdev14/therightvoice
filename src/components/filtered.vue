<template>
<div>
    <div v-if="filteredData">
        <!-- Get list of threads filtered by search term -->
        <ul v-if="$store.getters.getSearchType === 'threads'">
        <div v-if="filteredData.length < 1">
          <!--<h6 class="list-title">No threads found for {{ $store.getters.getSearchText }}</h6>-->
        </div>
        <div v-else>
          <h6 class="list-title">Threads found for {{ $store.getters.getSearchText }}</h6>
          <transition-group tag='li' name='slide-up'>
              <li v-for="item in filteredData" :key="item._id">
                  <div class="card card-body" @click="view(item._id, item.title)">
                  <router-link to="'/thread/'+ item._id">
                      <h6 class="title flex-item"><strong>{{ item.title }}</strong></h6>
                  </router-link>
                  </div>
                  <div class="card card-footer">
                    <p class="single-thread-footer">created by: <span class="strong">{{ item.creatorName | toUpperCase }}</span>   on: <span class="strong">{{ item.createdOn | moment }}</span></p>
                  </div>
              </li>
          </transition-group>
        </div>
        </ul>
        <!-- Get list of posts filtered by search term -->
        <ul v-if="$store.getters.getSearchType === 'posts'">
          <div v-if="filteredData.length < 1">
            <!--<h6 class="list-title">No posts found for {{ $store.getters.getSearchText }}</h6>-->
          </div>
          <div v-else>
            <h6 class="list-title">Posts found for {{ $store.getters.getSearchText }}</h6>
            <transition-group tag='li' name='slide-up'>
                <li v-for="item in filteredData" :key="item._id">
                    <div class="card card-body" @click="view(item.threadID, item.threadName)">
                      <router-link :to="'/thread/'+ item.threadID">
                        <h6 class="title flex-item"><strong>{{ item.title }}</strong></h6>
                      </router-link>
                    </div>
                    <div class="card card-footer">
                        <p class="single-thread-footer">created by: <span class="strong">{{ item.postedBy | toUpperCase }}</span>   on: <span class="strong">{{ item.postedOn | moment }}</span></p>
                    </div>
                </li>
            </transition-group>
          </div>
        </ul>
        <!-- Get posts by selected member -->
        <ul v-if="$store.getters.getSearchType === 'member'">
          <div v-if="membersPosts.length < 1">
            <!--<h6 class="list-title">Member not found</h6>-->
          </div>
          <div v-else>
            <h6 class="list-title">Posts by {{ $store.getters.getSearchText }}</h6>
            <transition-group tag='li' name='slide-up'>
                <li v-for="item in membersPosts" :key="item._id">
                    <div class="card card-body" @click="view(item.threadID, item.threadName)">
                      <router-link :to="'/thread/'+ item.threadID">
                        <h6 class="title flex-item"><strong>{{ item.title }}</strong></h6>
                      </router-link>
                    </div>
                    <div class="card-footer">
                      <p class="single-members-footer"><span class="strong">{{ item.threadName }}</span></p>
                    </div>
                </li>
            </transition-group>
          </div>
        </ul>
    </div>
    <div v-else>
        <h3>No search results found..</h3>
    </div>
</div>
</template>

<script>
import moment from "moment";
export default {
  name: "filtered",
  methods: {
    view(id, title) {
      this.$store.commit("setThreadId", id);
      this.$store.commit("setThreadName", title);
    }
  },
  computed: {
    filteredData() {
      return this.$store.getters.getFilteredData;
    },
    membersPosts() {
      return this.$store.getters.getFilteredData;
    }
  },
  filters: {
    moment: date => {
      return moment(date).format("MMMM Do YYYY");
    },
    toUpperCase: title => {
      return title.toUpperCase();
    }
  }
};
</script>

<style scoped>
h6 {
  text-align: left;
  margin-left: 0;
  color: black;
  margin-bottom: 20px;
}

.card-footer {
  display: flex;
  justify-content: flex-end;
  font-size: 0.8rem;
  font-style: italic;
  margin: 0;
}

.slide-up-enter-active,
.fade-leave-active {
  transition: opacity 1.5s;
}
.slide-up-enter,
.fade-leave-to {
  opacity: 0;
}

.list-title {
  color: lightgreen;
  text-align: left;
  font-size: 0.9rem;
  margin: 20px 0 5px 16px;
}

@media screen and (max-width: 768px) {
  .single-members-footer {
    display: flex;
    justify-content: flex-start;
    margin-left: 0;
    padding: 2px;
    width: 100%;
    max-width: 100%;
    font-size: 0.8rem;
  }

  .single-thread-footer {
    font-size: 0.8rem;
    padding-left: 2px;
  }
}
</style>
