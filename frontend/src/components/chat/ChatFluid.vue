<template>
    <div v-if="chat.getFlagImIn && !chat.getifBanned" class="chat-area flex-1 flex flex-col">
        <div v-if='chat.getActivChatUsr !== ""' class="flex-3">
            <h2 class="text-xl py-1 mb-8 border-b-2 border-gray-200">Chatting with 
                <b>{{chat.getActivChatUsr}}</b>
            </h2>
        </div>

        <!-- Inizio DirectChat -->
        <div v-if="chat.getFriend && chat.getChannelAll != undefined" class="messages flex-1 overflow-auto max-h-[700px]">
            <div v-for="(chMes, index) in chat.getChannelAll?.messages" :key="index">
                <div
                    :class="['message mb-4', chMes.sender.id !== userStore.userId ? 'flex' : 'flex me text-right']">
                    <div v-if="userStore.userId !== chMes.sender.id" class="flex-2">
                        <div class="w-36 h-12 relative">
                            <div class="dropdown dropdown-right">
                                <div class="w-15 rounded-full"  >
                                    <label :onclick="'my_modal_3' + index + '.showModal()'" tabindex="0" class="btn btn-ghost btn-circle avatar indicator">
                                        <img class="w-12 h-12 rounded-full mx-auto" :src="chMes.sender.profilePicture" :alt=chMes.sender.username />
                                        <!-- <span class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span> -->
                                    </label>                                    
                                        <dialog :id="'my_modal_3' + index" class="modal">
                                            <div class="modal-box modal-box-3">
                                            <div class="overflow-x-auto">
                                                <table class="table">
                                                    <!-- head -->
                                                    <thead>
                                                    <tr>                                                       
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <!-- row 1 -->
                                                    <tr>
                                                        <td>
                                                            {{ chMes.sender.username }}                                                            
                                                        </td>
                                                        <th>
                                                            <button class="btn btn-ghost btn-xs">
                                                                <router-link :to="{ name: 'profile', params: { userid: chMes.sender.id },}" class="dropdown-item">
                                                                    Dettagli Profilo
                                                                </router-link>
                                                        </button>
                                                        </th>
                                                    </tr>
                                                    <!-- row 2 -->
                                                    <tr>
                                                        <td>
                                                        Invita a Giocare:                                                    
                                                        </td>                                                       
                                                        <th>
                                                        <button @click="gameInvite(chMes.sender.id)" class="btn btn-ghost btn-xs">Invita</button>
                                                        </th>
                                                    </tr>
                                                    </tbody>
                                                    
                                                </table>
                                                    <form method="dialog" class="modal-backdrop">
                                                    <button>close</button>
                                                    </form>
                                                </div>
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
        <div v-if="chat.getFriend && chat.getChannelAll != undefined" class="flex-2 pt-4 pb-10">
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
            <div @keyup.enter="sendDirect" class="flex-1">
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
                    <button @click="sendDirect"
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
        <!-- Fine DirectChat -->
        <!-- Inizio GroupChat -->
        <div v-if="chat.getGroup && chat.getChannelAll != undefined" class="messages flex-1 overflow-auto max-h-[700px]">
            <div v-for="(chMes, index) in chat.getChannelAll?.messages" :key="index">
                <div
                    :class="['message mb-4', chMes.sender.id !== userStore.userId ? 'flex' : 'flex me text-right']">
                    <div v-if="userStore.userId !== chMes.sender.id" class="flex-2">
                        <div class="w-36 h-12 relative">
                            <div class="dropdown dropdown-right">
                                <div class="w-15 rounded-full" @click="checkFluidBan(chMes.sender.id, chat.getChannelAll.id), onClickMute(chMes.sender.id, chat.getChannelAll.id)" >
                                    <label :onclick="'my_modal_3' + index + '.showModal()'" tabindex="0" class="btn btn-ghost btn-circle avatar indicator">
                                        <img class="w-12 h-12 rounded-full mx-auto" :src="chMes.sender.profilePicture" :alt=chMes.sender.username />
                                        <!-- <span class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span> -->
                                    </label>                                    
                                        <dialog :id="'my_modal_3' + index" class="modal">
                                            <div class="modal-box modal-box-3">
                                            <div class="overflow-x-auto">
                                                <table class="table">
                                                    <!-- head -->
                                                    <thead>
                                                    <tr>                                                       
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                        <th></th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    <!-- row 1 -->
                                                    <tr>
                                                        <td>
                                                            {{ chMes.sender.username }}                                                            
                                                        </td>
                                                        <th>
                                                            <button class="btn btn-ghost btn-xs">
                                                                <router-link :to="{ name: 'profile', params: { userid: chMes.sender.id },}" class="dropdown-item">
                                                                    Dettagli Profilo
                                                                </router-link>
                                                        </button>
                                                        </th>
                                                    </tr>
                                                    <!-- row 2 -->
                                                    <tr>
                                                        <td>
                                                        Invita a Giocare:                                                    
                                                        </td>                                                       
                                                        <th>
                                                        <button @click="gameInvite(chMes.sender.id)" class="btn btn-ghost btn-xs">Invita</button>
                                                        </th>
                                                    </tr>
                                                    <!-- row 3 -->
                                                    <tr v-if="imAdmin()">
                                                      <td>
                                                        Banna Utente:                                                       
                                                        </td>                                                        
                                                        <th>
                                                            <div v-if="chat.getporcovar">
                                                                <input  type="checkbox" class="toggle toggle-error" checked @click="onToggleChange(chMes.sender.id, chat.getChannelAll.id)" />                                                    
                                                            </div>
                                                            <div v-else>
                                                                <input  type="checkbox" class="toggle toggle-error" @click="onToggleChange(chMes.sender.id, chat.getChannelAll.id)" />
                                                            </div>
                                                        </th>
                                                    </tr>
                                                    <!-- row 4 -->
                                                    <tr v-if="imAdmin()">
                                                        <td>
                                                            Muta Utente:                                         
                                                        </td>
                                                        <td>
                                                            <div v-if="hidder || hiddenMute">
                                                                <select class="select w-full max-w-xs" disabled>
                                                                    <option>Non muti un cazzo</option>
                                                                </select>                                                            
                                                            </div>
                                                            <div v-else>
                                                                <select class="select select-warning w-full max-w-xs" v-model="chat.getSelectedValue">
                                                                    <option value="5">5m</option>
                                                                    <option value="10">10m</option>
                                                                    <option value="15">15m</option>
                                                                    <option value="30">30m</option>
                                                                    <option value="60">1h</option>
                                                                    <option value="120">2h</option>
                                                                </select>
                                                            </div>                                                          
                                                        </td>
                                                        <th>
                                                            <div v-if="!hidder && !hiddenMute" @click="convertValue(chat.getSelectedValue, chMes.sender.id, chat.getChannelAll.id)"><button class="btn btn-ghost btn-xs">MUTA!</button></div>                                                            
                                                        </th>
                                                    </tr>
                                                    <!-- row 5 -->
                                                    <tr v-if="imAdmin()">
                                                        <td>
                                                            Kick: 
                                                        </td>
                                                        <td>
                                                            <button @click="kickCh(chMes.sender.id, chat.getChannelAll.id)" class="btn btn-ghost btn-xs">Kicka Utente</button>                                                            
                                                        </td>
                                                    </tr>
                                                    <!-- row 6 -->
                                                    <tr v-if="imAdmin()">
                                                        <td>
                                                            Promote: 
                                                        </td>
                                                        <td>
                                                            <label class="swap swap-flip text-5xl">
                                                                <!-- this hidden checkbox controls the state -->
                                                                <input type="checkbox" />                                                            
                                                                <div v-if="hiddenAdmin" @click="unSetAdminF(chMes.sender.id, chat.getChannelAll.id)" >🤖</div>
                                                                <div v-else @click="setAdmin(chMes.sender.id, chat.getChannelAll.id)" >🫥</div>
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                    
                                                </table>
                                                    <form method="dialog" class="modal-backdrop">
                                                    <button>close</button>
                                                    </form>
                                                </div>
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
        <!-- Inizio Text area group -->
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
    <div v-else-if="!chat.getFlagImIn && !chat.getifBanned && !chat.getIfPrivate" class="chat-area flex-1 flex flex-col">
        <div v-if="chat.getGroup" class="messages flex-1 overflow-auto max-h-[700px]">
            <div class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>Non sei nel gruppo</span>
                <div  v-if="chat.getIsPassOn" >
                    <input v-model="chat.insertedPass" type="text" placeholder="Inserisci Password" class="input input-bordered w-full max-w-xs" />
                </div>
                <div>
                    <button @click="channelJoin(chat.getInsertedPass, false)" class="btn btn-sm btn-primary">Joina ora!</button>
                </div>
            </div>
        </div> 
    </div>
    <div v-else-if="chat.getifBanned" class="chat-area flex-1 flex flex-col">
        <div v-if="chat.getGroup" class="messages flex-1 overflow-auto max-h-[700px]">
            <div class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>SEI BANNATO COGLIONE</span>
            </div>
        </div> 
    </div> 
    <div v-else-if="chat.getIfPrivate && !chat.getFlagImIn" class="chat-area flex-1 flex flex-col">
        <div v-if="chat.getGroup" class="messages flex-1 overflow-auto max-h-[700px]">
            <div class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>CANALE PRIVATO!</span>
            </div>
        </div> 
    </div> 
    <div v-else class="chat-area flex-1 flex flex-col">
        <div v-if="chat.getGroup" class="messages flex-1 overflow-auto max-h-[700px]">
            <div class="alert">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>SELEZIONA UN CANALE PER UNIRTI</span>
            </div>
        </div> 
    </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from "@/stores/currentUser";
import { socket } from '@/plugins/Socket.io';
import { ref, type Ref, watchEffect } from "vue";
import { nextTick } from 'vue';
import { useChatStore } from "@/stores/chat";
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue'
import { useGameStore } from '@/stores/gameInvite';
import GameInviteService from '@/services/GameInviteService';
import { useFriendStore } from '@/stores/friend';
import { useRouter } from 'vue-router';
import type { IUser } from '@/models/IUser';
import UserService from '@/services/UserService';
import axios, { AxiosError } from 'axios';
import type { IError } from '@/models/IError';

const chat = ref(useChatStore());
const userStore = ref(useCurrentUserStore());
const msg = ref('');
const lastMessage: Ref<HTMLDivElement | null> = ref(null);
const hidder = ref(false);
const hiddenMute = ref(false);
const hiddenAdmin = ref(false);


const kickCh = (id: any, channelId: any) => {   
    socket.emit('kickChannel', { uId: id, chId: channelId })
}

// converti valore di selectedvalue in millisecondi
const convertValue = (selectedValue: string, userId: any, channelId: any) => {
    let ret = 0;
    if (selectedValue === '5')
        ret = 15000;
    else if (selectedValue === '10')
        ret = 600000;
    else if (selectedValue === '15')
        ret =  900000;
    else if (selectedValue === '30')
        ret =  1800000;
    else if (selectedValue === '60')
        ret =  3600000;
    else if (selectedValue === '120')
        ret =  7200000;
    else
        ret =  0;
    socket.emit('muteUser', { uId: userId, chId: channelId, time: ret })
    chat.value.setSelectedValue('0');
}



const onToggleChange = (id: any, channelId: any) => {     
    socket.emit('checkIfBan', { uId: id, chId: channelId })
}

socket.on('isBanChan', (id: any, channelId: any, bannato: boolean) => {
    if (bannato) 
    {
        socket.emit('unbanChannel', { uId: id, chId: channelId });
        chat.value.setIsActive(false);
        hidder.value = false;
    } 
    else 
    {
        socket.emit('banChannel', { uId: id, chId: channelId });
        chat.value.setIsActive(true);
        hidder.value = true;
    }            
});


const onClickMute = (id: any, channelId: any) => {         
    socket.emit('checkIfMute', { uId: id, chId: channelId })
}

socket.on('isPassOn', (pass: boolean) => {
    if (pass) 
    {
        chat.value.setIsPassOn(true);
    } 
    else 
    {
        chat.value.setIsPassOn(false);
    }
});

socket.on('isPrivOn', (priv: boolean) => {
    if (priv) 
    {
        chat.value.setIfPrivate(true);
    } 
    else 
    {
        chat.value.setIfPrivate(false);
    }
});

socket.on('isMuteChan', (muted: boolean) => {
    if (muted) 
    {
        hiddenMute.value = true;
    } 
    else 
    {
        hiddenMute.value = false;
    }
});

const setAdmin = (id: any, channelId: any) => {   
    socket.emit('setAdmin', { uId: id, chId: channelId })
}
const unSetAdminF = (id: any, channelId: any) => {     
    socket.emit('unSetAdmin', { uId: id, chId: channelId })
}

const getChat = (username: string, id: string, mioId: string) => {
	socket.emit('getChannel', {username: username, chatId: id, mioId: mioId });
	if (id === chat.value.getCurrentChannelId) {
		return;
	}
  chat.value.setCurrentChannelId(id);
};

const refreshChat = (chanId: string) =>
{
    socket.emit("refreshDirectChat", {chanId: chanId});
}

socket.on('isAdminChan', (muted: boolean) => {
    if (muted) 
    {
        hiddenAdmin.value = true;
    } 
    else 
    {
        hiddenAdmin.value = false;
    }
});


socket.on('isBanFluidRet', (bannato: boolean) => {
    chat.value.setporcovar(bannato);
});

const checkFluidBan = (id: any, channelId: any) => {   
    socket.emit('isBanFluid', { uId: id, chId: channelId })
}

// Function to format time
const formattedTime = (date: any) => {
    if (typeof date === 'string')
        date = new Date(date);
    if (!(date instanceof Date)) {
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
  socket.emit('messageToServer', { text: msg.value, chId: chat.value.getCurrentChannelId, uId: userStore.value.userId });
  msg.value = '';
  nextTick(() => {
      setTimeout(() => {
          if (lastMessage.value) {
              lastMessage.value.scrollIntoView();
          }
      }, 80);
  });
};

const sendDirect = () => {
  if (/^[\s\n]*$/.test(msg.value))
      return;
  if (chat.value.getCurrentChannelId == '' || chat.value.getCurrentChannelId == null) {
      alert('Select a channel or direct message to Rohho');
      return;
  }
socket.emit('messageToDirect', { text: msg.value, chatId: chat.value.getCurrentChannelId, mioId: userStore.value.userId, chId: chat.value.getChannelAll?.id});
    refreshChat(chat.value.getChannelAll?.id as string);
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

const channelJoin = (password: any, invited: boolean) => {    
    socket.emit('joinChannel', { chId: chat.value.getChannelAll?.id, uId: userStore.value.userId, password: password, invited: invited });
    chat.value.setInsertedPass('');
  }

const banUser = (bannedId: any, bannedChlId: any) => {
    socket.emit('banChannel', { uId: bannedId, chId: bannedChlId });
  }














  // -------------------------------------- NIZZ --------------------------------------
const router = useRouter();
const leaveQ = ref(false);

onMounted(async () => {
    await userStore.value.initStore(null, null);
});


const currentUser = ref(useCurrentUserStore());
const friendStore = ref(useFriendStore());
const gameInviteStore = ref(useGameStore());

const createGame = () => {
  leaveQ.value = true;
}

const props = defineProps({
	idProfile: String,
});

const profile = ref<IUser>();

async function fetchUsers() {
  profile.value = await UserService.getUserById(props.idProfile!);

}

watchEffect(async () => {
  await fetchUsers();
  friendStore.value.friends;
  friendStore.value.pending;
  friendStore.value.sent;
  friendStore.value.blocked;
  gameInviteStore.value.getWaiting;

});


async function gameInvite(userId: string) {
  try {
    await GameInviteService.sendGameInvite(userId);
    // Update the state after the API call
    friendStore.value.updatePendings(currentUser.value.userId);
    friendStore.value.updateFriends();
    friendStore.value.updateSent(currentUser.value.userId);
	createGame();
  } catch (err) {
    const e = err as AxiosError<IError>;
		if (axios.isAxiosError(e)) return e.response?.data;
	}
}

// -------------------------------------- NIZZ --------------------------------------
</script>



<style scoped>
.modal-box-3
{
    max-width: 60rem;
}

</style>
