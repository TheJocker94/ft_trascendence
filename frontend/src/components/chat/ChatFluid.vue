<template>
    <div v-if="chat.getFlagImIn" class="chat-area flex-1 flex flex-col">
        <div v-if='chat.getActivChatUsr !== ""' class="flex-3">
            <h2 class="text-xl py-1 mb-8 border-b-2 border-gray-200">Chatting with 
                <b>{{chat.getActivChatUsr}}</b>
            </h2>
        </div>
        <!-- Inizio GroupChat -->
        <div v-if="chat.getGroup && chat.getChannelAll != undefined" class="messages flex-1 overflow-auto max-h-[700px]">
            <div v-for="(chMes, index) in chat.getChannelAll?.messages" :key="index">
                <div
                    :class="['message mb-4', chMes.sender.id !== userStore.userId ? 'flex' : 'flex me text-right']">
                    <div v-if="userStore.userId !== chMes.sender.id" class="flex-2">
                        <div class="w-12 h-12 relative">
                            <div class="dropdown dropdown-right">
                                <div class="w-10 rounded-full">
                                    <label onclick="my_modal_3.showModal()" tabindex="0" class="btn btn-ghost btn-circle avatar indicator">
                                        <img class="w-12 h-12 rounded-full mx-auto" :src="chMes.sender.profilePicture" :alt=chMes.sender.username />
                                        <span class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                    </label>                                    
                                        <dialog id="my_modal_3" class="modal">
                                            <div class="modal-box modal-box-3">
                                                <h3 class="font-bold text-lg mb-3">User Info</h3>
                                                <button class="btn btn-block custom-button-width">
                                                    <router-link :to="{ name: 'profile', params: { userid: chMes.sender.id },}" class="dropdown-item">
                                                            {{ chMes.sender.username }}
                                                    </router-link>
                                                </button>
                                                <button class="btn btn-block custom-button-width">Invite</button>
                                                <!--<button v-if="imAdmin()" @click="banUser(chMes.sender.id, channelAll?.id)" class="btn btn-block custom-button-width">Ban</button>
                                                --><div v-if="imAdmin()" class="form-control">
                                                    <label class="label cursor-pointer">
                                                        <span class="label-text">Ban user:</span>
                                                        <input type="checkbox" class="toggle toggle-error" :checked="isActive" @click="onToggleChange(chMes.sender.id, chMes)" />                                                    
                                                    </label>
                                                </div>
                                                <button v-if="imAdmin()" class="btn btn-block custom-button-width">Kick</button>
                                                <!-- <button v-if="imAdmin()" @click="muteUser(chMes.sender.id, chat.getChannelAll?.id)" class="btn btn-block custom-button-width">Mute</button>                                               -->
                                                <button v-if="imAdmin()" class="btn btn-block custom-button-width">Mute</button>                                              
                                            </div>
                                            <form method="dialog" class="modal-backdrop">
                                                <button>close</button>
                                            </form>
                                        </dialog>
                                </div>   
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 px-2">
                        <div :class="[chMes.sender.id !== userStore.userId ? 'bg-gray-300 text-gray-700' : 'bg-blue-600  text-white']"
                            style="max-width: 60%; overflow-wrap: break-word; word-break: break-all; white-space: normal; border: 2px solid transparent; display: inline-block; padding: 0px 12px; border-radius: 25px;">
                            <span>{{ chMes.content }}</span>
                        </div>
                        <div class="pl-4"><small class="text-gray-500">{{ formattedTime(chMes.time)
                        }}</small></div>
                    </div>
                </div>
            </div>
            <div ref="lastMessage"></div>
        </div>
        <!-- Fine GroupChat -->
        <!-- Inizio Select Group/Direct -->
        
        <!-- Fine Select Group/Direct -->
        <!-- Inizio Text area -->
        <div v-if="chat.getGroup && chat.getChannelAll != undefined" class="flex-2 pt-4 pb-10">
            <div class="write bg-white shadow flex rounded-lg">
                <div class="flex-3 flex content-center items-center text-center p-4 pr-0">
                    <span class="block text-center text-gray-400 hover:text-gray-800">
                        <svg fill="none" stroke-linecap="round" stroke-linejoin="round"
                            stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"
                            class="h-6 w-6">
                            <path
                                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
                            </path>
                        </svg>
                    </span>
                </div>
                <div @keyup.enter="sendMessage" class="flex-1">
                    <textarea v-model="msg" name="message"
                        class="w-full block outline-none py-4 px-4 bg-transparent" rows="1"
                        placeholder="Type a message..." autofocus></textarea>
                </div>
                <div class="flex-2 w-32 p-2 flex content-center items-center">
                    <div class="flex-1 text-center">
                        <span class="text-gray-400 hover:text-gray-800">
                            <span class="inline-block align-text-bottom">
                                <svg fill="none" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="2" stroke="currentColor" viewBox="0 0 24 24"
                                    class="w-6 h-6">
                                    <path
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13">
                                    </path>
                                </svg>
                            </span>
                        </span>
                    </div>
                    <div class="flex-1">
                        <button @click="sendMessage"
                            class="bg-blue-400 w-10 h-10 rounded-full inline-block">
                            <span class="inline-block align-text-bottom">
                                <svg fill="none" stroke="currentColor" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                                    class="w-4 h-4 text-white">
                                    <path d="M5 13l4 4L19 7"></path>
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div v-else-if="!chat.getFlagImIn" class="chat-area flex-1 flex flex-col">
        <div v-if="chat.getGroup" class="messages flex-1 overflow-auto max-h-[700px]">
            <div class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Non sei nel gruppo</span>
                <div>
                    <button @click="channelJoin()" class="btn btn-sm btn-primary">Joina ora!</button>
                </div>
            </div>
        </div> 
    </div>
    <div v-else class="chat-area flex-1 flex flex-col">
        <div v-if="chat.getGroup" class="messages flex-1 overflow-auto max-h-[700px]">
            <div class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>SEI BANNATO COGLIONE</span>
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
import { socket } from '@/plugins/Socket.io';
import { ref, type Ref } from "vue";
import { nextTick } from 'vue';
import { useChatStore } from "@/stores/chat";

const chat = ref(useChatStore());
const userStore = ref(useCurrentUserStore());
const msg = ref('');
const lastMessage: Ref<HTMLDivElement | null> = ref(null);
const isActive = ref(false);

const onToggleChange = (id: any, channelId: any) => {    
    console.log(id);
    console.log(channelId);         
  socket.emit('checkIfBan', { uId: id, chId: channelId })
}

socket.on('isBanChan', (id: any, channelId: any, bannato: boolean) => {
    if (bannato) 
    {
        socket.emit('unbanChannel', { uId: id, chId: channelId });
        isActive.value = false;
        console.log('unbannato');
    } 
    else 
    {
        socket.emit('banChannel', { uId: id, chId: channelId });
        isActive.value = true;
        console.log('bannato');
    }            
    console.log(bannato);
});

// Function to format time
const formattedTime = (date: any) => {
    if (typeof date === 'string')
        date = new Date(date);
    if (!(date instanceof Date)) {
        console.log("date is NOT a Date object:", date);
        return "";
    }
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
};
// Function to send message

const sendMessage = () => {
  if (/^[\s\n]*$/.test(msg.value))
      return;
  if (chat.value.getCurrentChannelId == '' || chat.value.getCurrentChannelId == null) {
      alert('Select a channel or direct message to Rohho');
      return;
  }
  socket.emit('messageToServer', { text: msg.value, id: chat.value.getCurrentChannelId, sender: userStore.value.userId });
  msg.value = '';
  nextTick(() => {
      setTimeout(() => {
          if (lastMessage.value) {
              lastMessage.value.scrollIntoView();
          }
      }, 80);
  });
};

const imAdmin = () => {
    const ret = chat.value.getChannelAll?.members.find(member => member.userId === userStore.value.userId);
    if (ret?.role === 'ADMIN' || ret?.role === 'OWNER')
        return true;
    else
        return false;
}


const channelJoin = () => {    
    socket.emit('joinChannel', { id: chat.value.getChannelAll?.id, sender: userStore.value.userId });
    console.log('joinato');
  }

const banUser = (bannedId: any, bannedChlId: any) => {
    socket.emit('banChannel', { uId: bannedId, chId: bannedChlId });
    console.log('bannato');
  }
</script>



<style scoped>
.custom-button-width {
  width: 100px; /* Sostituisci con la larghezza desiderata in pixel o con un'altra unità di misura */
  display: block;
  margin-bottom: 1%;
}
.modal-box-3
{
    width: 30%;
}

</style>