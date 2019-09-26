<template>
    <div id="members-list">
      <h6 class="text-center" id="membersHeading">Members List</h6>
      <p style="font-weight:normal; font-style: italic; margin-bottom:15px;" class="text-center" id="membersSubHeading">(active members in bold)</p>
      <p style="font-weight:normal; font-style: italic; margin-bottom:20px; line-height:0.8" class="text-center" id="subHeading">(click to message)</p>
      <contact v-if="contacting || incomingMessage.message" :receivedMessage='incomingMessage' :name="membersName" :contacting='contacting'
          @messageSent='contacting = false' v-on:messageSent="messageSent"></contact>
      <ul>
        <li v-for="member in orderedMembers" :key="member.username"><p v-if="member.username != $store.getters.getUsername" class="memberName text-center bounce-in-right"
           @click="contactMember(member.username, member.active)"
           :class="{setBold: member.active === true}">
         {{ member.username }}</p>
        </li>
      </ul>
    </div>
</template>

<script>
import contact from "../components/contact.vue";
export default {
  name: "members",
  data() {
    return {
      contacting: false,
      membersName: "",
      name_selected: false,
      incomingMessage: {}
    };
  },
  methods: {
    contactMember(recipientName, status) {
      // Called when member is selected and opens up contact window
      if (this.name_selected === true) {
        return;
      }
      if (!this.$store.getters.getLoggedStatus) {
        this.contacting = false;
        alert("Please log in to contact other members");
      } else {
        if (status === false) {
          this.contacting = false;
          alert(`${recipientName} must be logged in to receive messages`);
        } else {
          this.membersName = recipientName;
          $("#contactBox").css("display", "block");
          this.$store.commit("setMessageRecipient", recipientName);
          console.log("memberName: " + this.membersName);
          this.contacting = true;
        }
      }
    },
    messageSent() {
      this.membersName = "";
    }
  },
  computed: {
    orderedMembers() {
      return this.$lodash.orderBy(this.$store.getters.getAllMembers, [
        "username"
      ]);
    }
  },
  mounted() {
    this.$socket.emit("membersList");
  },
  sockets: {
    messageReceived(data) {
      this.incomingMessage = {
        message: data.message,
        sender: data.sender
      };
      this.contacting = true;
      this.$store.commit("setMessageRecipient", data.sender);
    },
    loadMembers(members) {
      this.$store.dispatch("setAllMembers", members);
    }
  },
  components: {
    contact
  }
};
</script>

<style scoped>
#membersHeading {
  color: green;
  margin-top: 20px;
  font-size: 1.8rem;
  font-weight: bold;
}

#membersSubHeading {
  color: green;
  font-size: 1.2rem;
  font-weight: bold;
}

#subHeading {
  color: rgb(23, 134, 23);
  font-size: 1rem;
}

#members-list {
  margin: 15px;
  padding: 5px;
  background-color: lightblue;
  border: 10px solid deepskyblue;
  border-radius: 6px;
  overflow: hidden;
  height: 100%;
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
}

.memberName {
  margin-bottom: 20px;
  font-style: italic;
  margin: auto auto;
  font-weight: lighter;
  font-size: 1rem;
  cursor: pointer;
  color: navy;
  font-size: 1.4rem;
}

.memberName:hover {
  color: red;
}

ul {
  margin: 0;
  padding: 0;
}

li {
  list-style: none;
}

.setBold {
  font-weight: bolder;
  color: green;
}

.bounce-in-right {
  -webkit-animation: bounce-in-right 1.1s both;
  animation: bounce-in-right 1.1s both;
}

@-webkit-keyframes bounce-in-right {
  0% {
    -webkit-transform: translateX(600px);
    transform: translateX(600px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateX(68px);
    transform: translateX(68px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(32px);
    transform: translateX(32px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}
@keyframes bounce-in-right {
  0% {
    -webkit-transform: translateX(600px);
    transform: translateX(600px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    opacity: 0;
  }
  38% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
    opacity: 1;
  }
  55% {
    -webkit-transform: translateX(68px);
    transform: translateX(68px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  72% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  81% {
    -webkit-transform: translateX(32px);
    transform: translateX(32px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  90% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
  95% {
    -webkit-transform: translateX(8px);
    transform: translateX(8px);
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
    -webkit-animation-timing-function: ease-out;
    animation-timing-function: ease-out;
  }
}

@media screen and (max-width: 768px) {
  #membersList {
    margin: 0;
    padding: 5px;
    border: none;
  }
}
</style>

