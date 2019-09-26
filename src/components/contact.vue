<template>
<div id="contactBox" v-show="this.$store.getters.getLoggedStatus">
  <!-- message received notification window -->
  <div id="receivedMessageBox"  v-show="receivedMessage.sender">
    <p id="receivedTextNotice">Message received from {{ receivedMessage.sender }}</p>
    <p id="receivedMessageText" style="margin-bottom:5px; color:red;">{{ receivedMessage.message }}</p>
  </div>
  <div class="container-fluid text-center" id="sendMessageBox" v-if="receivedMessage.sender || contacting">
    <div class="row">
      <div class="col-md-12">
        <input type="text" id="messageText" :placeholder='placeholderText' autofocus v-model="message">
      </div>
    </div>
    <div class="row">
      <div class="col-md-12" id="btnContact">
        <button type="close" class="btn btn-warning" style="margin-right:20px height:40px; width:60px; padding:5px" id="cancel_message" @click.prevent="cancelMessage">Cancel</button>
        <button type="submit" class="btn btn-success" id="submit_message" style="height:40px; width:60px; padding:5px;" @click.prevent="submitMessage">Send</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "contact",
  /* name stores initial clicked members name for placeholder text, receivedMessage stores received message text and sender,
      contacting true or false to show/hide contact window, set to true on clicking members name, false on closing contact window */
  props: ["receivedMessage", "name", "contacting"],
  data() {
    return {
      message: "",
      placeholderText: this.setPlaceholderText()
    };
  },
  methods: {
    submitMessage() {
      if (this.message) {
        this.$socket.emit("message", {
          message: this.message,
          recipient: this.$store.getters.getMessageRecipient,
          sender: this.$store.getters.getUsername
        });
        this.$emit("messageSent");
        this.message = "";
      }
    },
    setPlaceholderText() {
      if (this.name) {
        return "type message to " + this.name;
      } else {
        return "type message to " + this.receivedMessage.sender;
      }
    },
    cancelMessage() {
      $("#contactBox").css("display", "none");
    }
  }
};
</script>

<style scoped>
#contactBox {
  margin: auto;
  width: 95%;
  border: 2px solid rgb(57, 90, 57);
  padding: 2px;
  margin-top: 5px;
}

#receivedMessageBox {
  flex-direction: column;
  justify-content: center;
}

#messageText {
  width: 100%;
  padding: 2px;
  margin: auto;
  display: block;
  margin-bottom: 8px;
}

#receivedMessageText {
  color: red;
  margin: 5px;
  text-align: center;
  word-wrap: break-word;
}

#receivedTextNotice {
  color: rgb(112, 31, 31);
  font-size: 0.8rem;
  text-align: center;
  margin: 5px;
  text-decoration: none;
}
</style>
