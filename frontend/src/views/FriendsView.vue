<template>
    <div class="w-full h-screen">
        <div class="flex h-full">
            <div class="hidden xl:block sm:flex-2 w-64 bg-gray-200">

                <div class="menu mt-8">
                    <a :class="{
                        'block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black': !isFriendsActive,
                        'block py-4 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black': isFriendsActive
                    }" href="#" @click="isFriendsActive = true; isGroupsActive = false; showJoined = false;">
                        <span class="inline-block align-text-bottom mr-2">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                                <path
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                                </path>
                            </svg>
                        </span>
                        Friends
                    </a>
                    <a :class="{
                        'block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black': !isGroupsActive,
                        'block py-4 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black': isGroupsActive
                    }" href="#" @click="isGroupsActive = true; isFriendsActive = false; getChannelList()">
                        <span class="inline-block align-text-bottom mr-2">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                                <path
                                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                                </path>
                            </svg>
                        </span>
                        Groups
                    </a>
                    <!-- Open the modal using ID.showModal() method -->

                    <a onclick="my_modal_2.showModal()"
                        class="cursor-pointer block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black">
                        <i class="fa-solid fa-user-group mr-2"></i>Crea canale </a>
                    <dialog id="my_modal_2" class="modal">
                        <form method="dialog" class="modal-box w-full max-w-sm">
                            <!-- inizio copia -->
                            <Form @submit="createGroup()" :validation-schema="schema">
                                <div class="md:flex md:items-center mb-6">
                                    <div class="md:w-1/3">
                                        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                            for="channelName">Channel name</label>
                                    </div>
                                    <div class="md:w-2/3">
                                        <Field v-model="credentials.name"
                                            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="channelName" name="channelName" />
                                        <ErrorMessage name="channelName" class="text-red-500" />
                                    </div>
                                </div>
                                <div class="md:flex md:items-center mb-6">
                                    <div class="md:w-1/3">
                                        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                            for="channelPassword">Password</label>
                                    </div>
                                    <div class="md:w-2/3">
                                        <Field v-model="credentials.password"
                                            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="channelPassword" name="channelPassword" />
                                        <ErrorMessage name="channelPassword" class="text-red-500" />
                                    </div>
                                </div>
                                <div class="md:flex md:items-center mb-6">
                                    <div class="md:w-1/3">
                                        <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                            for="channelType">Type</label>
                                    </div>
                                    <div class="md:w-2/3">
                                        <Field v-model="credentials.type"
                                            class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                            id="channelType" name="channelType" as="select">
                                            <option value="PUBLIC">Public</option>
                                            <option value="PRIVATE">Private</option>
                                        </Field>
                                        <ErrorMessage name="channelType" class="text-red-500" />
                                    </div>
                                </div>
                                <div class=" md:flex md:items-center">
                                    <div class="md:w-1/3"></div>
                                    <div class=" md:w-2/3">
                                        <button
                                            class="modal-action shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </Form>
                            <!-- Fine copiua -->
                        </form>
                        <form method="dialog" class="modal-backdrop">
                            <button ref="myButton"></button>
                        </form>
                    </dialog>
                    <!--  -->
                </div>
            </div>
            <div class="flex-1 bg-gray-100 w-full h-full">
                <div class="main-body container m-auto w-11/12 h-full flex flex-col ">
                    <div class="py-4 flex-2 flex flex-row ">
                        <div class="flex-1">
                            <!-- TODO make it clickable -->
                                        <span class="xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                            <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                                <svg class="w-4 h-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path d="M4 6h16M4 12h16M4 18h16"></path>
                                                </svg>
                                            </span>
                                        </span>
                
                                        <span class="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                            <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                                <svg class="h-4 w-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                                    stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                                    </path>
                                                </svg>
                                            </span>
                                        </span>

                            
                        </div>
                        <!-- <div class="flex-1 text-right">
                            <span class="inline-block text-gray-700">
                                Status: <span
                                    class="inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span>
                                <b>Online</b>
                                <span class="inline-block align-text-bottom">
                                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                                        <path d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </span>
                            </span>

                            <span class="inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                                        <path
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9">
                                        </path>
                                    </svg>
                                </span>
                            </span>
                        </div> -->
                    </div>

                    <div class="main flex-1 flex flex-col ">
                        <div class="hidden lg:block heading flex-2">
                            <h1 class="text-3xl text-gray-700 mb-4">Chat</h1>
                        </div>

                        <div class="flex-1 flex h-full">
                            <div class="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
                                <div class="search flex-2 pb-6 px-2">
                                    <input type="text"
                                        class="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200"
                                        placeholder="Search">
                                </div>
                                <div class="flex-1 h-full overflow-auto px-2">
                                    <div v-if="isFriendsActive">
                                        <div v-for="(friend, index) in profileFriend" :key="index"
                                            :class="['entry', friend.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                                            @click="toggleActive(index), sendUsername(friend.username)">
                                            <div class="flex-2">
                                                <div class="w-12 h-12 relative">
                                                    <img class="w-12 h-12 rounded-full mx-auto" :src="friend.profilePicture"
                                                        :alt="friend.username" />
                                                    <span
                                                        class="absolute w-4 h-4 bg-green-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                                </div>
                                            </div>
                                            <div class="flex-1 px-2">
                                                <div class="truncate w-32"><span class="text-gray-800">{{ friend.username
                                                }}</span></div>
                                                <div><small class="text-gray-600">Yea, Sure!</small></div>
                                            </div>
                                            <div class="flex-2 text-right">
                                                <div><small class="text-gray-500">15 April</small></div>
                                                <div>
                                                    <small
                                                        class="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                                                        23
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div v-if="isGroupsActive">
                                        <div v-for="(channel, index) in channelList" :key="index"
                                            :class="['entry', channel.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                                            @click="toggleActive(index), sendUsername(channel.name), getChannel(channel.id)">
                                            <div class="flex-1 px-2">
                                                <div class="truncate w-32">
                                                    <span class="text-gray-800">
                                                        {{ channel.name }}
                                                    </span>
                                                </div>
                                                <div v-if="channel.messages.length > 0" class="truncate w-32">
                                                    <small class="text-gray-600">
                                                        {{ channel.messages[channel.messages.length - 1].content }}
                                                    </small>
                                                </div>
                                            </div>
                                            <div class="flex-2 text-right">
                                                <div><small class="text-gray-500">15 April</small></div>
                                                <div>
                                                    <small
                                                        class="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                                                        23
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="imIn()" class="chat-area flex-1 flex flex-col">
                                <div class="flex-3">
                                    <h2 class="text-xl py-1 mb-8 border-b-2 border-gray-200">Chatting with <b>{{
                                        activChatUsr }}</b></h2>
                                </div>
                                <div v-if="isGroupsActive" class="messages flex-1 overflow-auto max-h-[700px]">
                                    <div v-for="(chMes, index) in channelAll?.messages" :key="index">
                                        <div :class="['message mb-4', chMes.sender.id !== userStore.userId ? 'flex' : 'flex me text-right']">
                                            <div v-if="userStore.userId !== chMes.sender.id" class="flex-2">
                                                <div class="w-12 h-12 relative">
                                                    <div class="dropdown dropdown-right">
                                                        <div class="w-10 rounded-full">
                                                            <label tabindex="0" class="btn btn-ghost btn-circle avatar indicator">
                                                                <img class="w-12 h-12 rounded-full mx-auto" :src="chMes.sender.profilePicture" :alt=chMes.sender.username />
                                                                <span class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                                            </label>
                                                                <ul tabindex="0" class="menu menu-sm dropdown-content mt-1 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                                                    <li>
                                                                        <router-link :to="{ name: 'profile', params: { userid: chMes.sender.id },}" class="dropdown-item">
                                                                            {{ chMes.sender.username }}
                                                                        </router-link>
                                                                    </li>                                                                    
                                                                    <li>                                                                        
                                                                        Invita
                                                                    </li>
                                                                    <div v-show="imAdmin()">
                                                                        <li>
                                                                            Ban
                                                                        </li>  
                                                                        <li>
                                                                            Kick
                                                                        </li>  
                                                                        <li>                                              
                                                                            Mute
                                                                        </li>
                                                                    </div>                                                                   
                                                            </ul>
                                                        </div>   
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="flex-1 px-2">
                                                <div :class="[chMes.sender.id !== userStore.userId ? 'bg-gray-300 text-gray-700' : 'bg-blue-600  text-white']" style="max-width: 60%; overflow-wrap: break-word; word-break: break-all; white-space: normal; border: 2px solid transparent; display: inline-block; padding: 0px 12px; border-radius: 25px;">
                                                    <span>
                                                        {{ chMes.content }}
                                                    </span>
                                                </div>
                                                <div class="pl-4">
                                                    <small class="text-gray-500">
                                                        {{ formattedTime(chMes.time) }}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div ref="lastMessage"></div>
                                </div>
                                <div v-if="isGroupsActive" class="flex-2 pt-4 pb-10">
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
                            <div v-else-if="showJoined" class="chat-area flex-1 flex flex-col">                                             
                                <div v-if="isGroupsActive" class="messages flex-1 overflow-auto max-h-[700px]">
                                    <div class="alert">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-info shrink-0 w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        <span>Non sei nel gruppo</span>
                                        <div>
                                            <button @click="channelJoin()" class="btn btn-sm btn-primary">Joina ora!</button>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { socket } from "@/plugins/Socket.io";
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { ref, watchEffect, onMounted, onUnmounted, reactive, type Ref, } from 'vue';
import FriendService from "@/services/FriendService";
import { useCurrentUserStore } from "@/stores/currentUser";
import type { IChannel, ISingleCh } from '@/models/IChat'
import ChatFluid from "@/components/chat/ChatFluid.vue";
import { nextTick } from 'vue';
import AuthService from "@/services/AuthService";
const isFriendsActive = ref(false);
const showJoined = ref(false);
const isGroupsActive = ref(false);
const profileFriend = ref<any[]>();
const channelList = ref<IChannel[]>();
const channelAll = ref<ISingleCh>();
const currentChannelId = ref('');
const lastMessage: Ref<HTMLDivElement | null> = ref(null);
const usernameAlreadySelected = ref(false);
const userStore = ref(useCurrentUserStore());
const msg = ref('');
// const groupName = ref('');
const myButton = ref<HTMLButtonElement | null>(null);
const credentials = reactive({
    name: "",
    password: "",
    type: ""
});

const activChatUsr = ref('');
function sendUsername(user: string) {
    activChatUsr.value = user;
}
const schema = yup.object().shape({
    channelName: yup.string().required().label('Channel Name'),
    channelPassword: yup.string().notRequired().label('Channel Password'),
    channelType: yup.string().required().label('Channel Type')
});
// const currentUser = ref(useCurrentUserStore());
async function friendPic() {
    const response = await FriendService.getFriendList();
    profileFriend.value = response.map(friend => ({ ...friend, active: false }));
}
watchEffect(() => {
    friendPic();
});
const toggleActive = (index: number) => {
    profileFriend.value!.forEach((friend, i) => {
        friend.active = i === index;
    });
    channelList.value!.forEach((channel, i) => {
        channel.active = i === index;
    });
    showJoined.value = true;
};

const formattedTime = (date: any) => {
    if (typeof date === 'string') {
        date = new Date(date);
    }
    if (!(date instanceof Date)) {
        return "";
    }

    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;

    return formattedTime;
};

const sendMessage = () => {
    if (/^[\s\n]*$/.test(msg.value))
        return;
    if (currentChannelId.value == '' || currentChannelId.value == null) {
        alert('Select a channel or direct message to Rohho');
        return;
    }
    socket.emit('messageToServer', { text: msg.value, id: currentChannelId.value, sender: userStore.value.userId });
    msg.value = '';
    nextTick(() => {
        setTimeout(() => {
            if (lastMessage.value) {
                lastMessage.value.scrollIntoView();
            }
        }, 80);
    });
};

const getChannelList = () => {
    socket.emit('channelList');
};
const getChannel = (id: string) => {
    socket.emit('getChannel', { id: id });
    currentChannelId.value = id;
};

socket.on('singleChannelServer', (channel: ISingleCh) => {
    channelAll.value = channel;
});
socket.on('groupListServer', (chList: IChannel[]) => {
    channelList.value = chList;
});

const createGroup = () => {
    if (credentials.name === '') {
        return;
    }
    if (credentials.type === '') {
        return;
    }
    myButton.value!.click();
    socket.emit('createGroup', { text: credentials.name, sender: userStore.value.userId, type: credentials.type, password: credentials.password });
    credentials.name = '';
    credentials.type = '';
    credentials.password = '';
    showJoined.value = false;
    socket.emit('channelList');
};
const channelJoin = () => {    
    socket.emit('joinChannel', { id: channelAll.value?.id, sender: userStore.value.userId });
    getChannel(channelAll.value?.id!);
    showJoined.value = false;
    imIn.value;
}
socket.on ('joinChannelServer', (channel: ISingleCh) => {
    channelAll.value = channel;    
    showJoined.value = false;
    imIn.value;
})

socket.on('channelAlreadyExists', (text) => {
    alert("Channel '" + text + "' already exists");
})

socket.on('messageFromServer', (idChannel) => {
    socket.emit('getChannel', { id: idChannel });
    nextTick(() => {
        setTimeout(() => {
            if (lastMessage.value) {
                lastMessage.value.scrollIntoView();
            }
        }, 80);
    });
})
onMounted(async () => {
    await userStore.value.initStore(null, null,);
    AuthService.online();
    const username = userStore.value.username;
    socket.auth = { username };
    socket.connect();
    socket.on("connect_error", (err) => {
        if (err.message === "invalid username") {
            usernameAlreadySelected.value = false;
        }
    });
    socket.on('welcome', (message: string) => {
        // console.log(message);
    });
});
onUnmounted(() => {
    socket.off('connect');
    socket.off('connect_error');
    socket.disconnect();
});

const imAdmin = () => {
    const ret = channelAll.value?.members.find(member => member.userId === userStore.value.userId);
    if (ret?.role === 'ADMIN' || ret?.role === 'OWNER')
        return true;
    else
        return false;
}

const imIn = ref(() => {   
    const ret = channelAll.value?.members.find(member => member.userId === userStore.value.userId);
    if (ret)
        return true;
    else
        return false;
})
</script>
  
  