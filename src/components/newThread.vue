<template>
  <div style="margin-bottom:20px;">
    <form class='form-group fade-in' id="newThreadForm" @click.prevent="submit">
        <div class="col-md-12">
            <p class="text-center newThreadHeader">Create New Thread:</p>
            <input type="text" placeholder="New Thread Title" class="form-control flex-item" id="newTitle" v-model="newTitle" required>
            <textarea type="textarea" rows="3" placeholder="First Post (optional)" class="form-control flex-item" id="firstPost" v-model="firstPost"></textarea>
            <button type="submit" id="newThreadSubmit" class="flex-item btn btn-primary">Submit</button>
        </div>
    </form>
  </div>
</template>

<script>
export default {
  name: "newThread",
  data() {
    return {
      newTitle: "",
      firstPost: ""
    };
  },
  methods: {
    submit(e) {
      if (this.newTitle) {
        const id = this.$store.getters.getUserId;
        const name = this.$store.getters.getUsername;
        const title =
          this.newTitle.charAt(0).toUpperCase() + this.newTitle.slice(1);
        this.$http
          .post("http://localhost:5000/newThread", {
            title: title,
            Id: id,
            Name: name,
            post: this.firstPost
          })
          .then(function(data) {
            if (data) {
              this.$store.dispatch("setThreads", data);
              this.newTitle = "";
              this.$router.push("/latestThreads");
            }
          })
          .catch(function(err) {
            console.log(err);
          });
      }
    }
  }
};
</script>

<style scoped>
#newThreadForm {
  margin: auto auto;
  margin-top: 20px;
  border: 2px solid navy;
  background-color: lightblue;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 50%;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  width: 80%;
}

.newThreadHeader {
  color: green;
  font-size: 1rem;
}

#newTitle {
  width: 80%;
  font-size: 0.9rem;
  padding: 10px;
  height: 40px;
  margin: auto;
  margin-bottom: 10px;
}

#firstPost {
  width: 80%;
  margin: auto;
}

#newThreadSubmit {
  font-size: 1rem;
  color: white;
  background-color: green;
  display: block;
  width: 80%;
  margin: auto;
  margin-top: 10px;
}

#newThreadSubmit:hover {
  cursor: pointer;
  color: blue;
  background-color: red;
}

.fade-in {
	-webkit-animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
	        animation: fade-in 1.2s cubic-bezier(0.390, 0.575, 0.565, 1.000) both;
}

/* ----------------------------------------------
 * Generated by Animista on 2019-7-9 13:31:24
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation fade-in
 * ----------------------------------------
 */
@-webkit-keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}




/***************MOBILE VIEW*******************/
@media screen and (max-width: 769px) {
  #newThreadForm {
    width: 100%;
    padding: 10px;
    font-size: 1rem;
    border-radius: 5px;
  }

  #newTitle {
    width: 100%;
    font-size: 0.9rem;
    padding: 10px;
    height: 40px;
    margin-bottom: 10px;
  }

  #firstPost {
    width: 100%;
  }
}
</style>
