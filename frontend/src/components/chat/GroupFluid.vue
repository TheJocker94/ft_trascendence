<template>
    <div :class=" ['sidebar lg:flex flex-2 flex-col pr-6',  chat.getNumDiv !== 'is1' ? 'w-1/3 ' : '']">
        <div class="search flex-2 pb-6 px-2">
            <input type="text"
                class="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200"
                placeholder="Search">
        </div>
        <div class="flex-1 h-full overflow-auto px-2">
            <div v-if="chat.getFriend && chat.getProfileFriend">
                <div v-for="(friend, index) in chat.getProfileFriend" :key="index"
                    :class="['entry', friend.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                    @click="toggleActiveFriend(index)">
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
                    </div>
                    
                </div>
            </div>
            <div v-if="chat.getGroup && chat.getChannelList">
                <div v-for="(channel, index) in chat.getChannelList" :key="index"
                    :class="['entry', channel.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                    @click="toggleActiveGroup(index), checkPrivChan(channel.id), checkPassera(channel.id)">
                        <div class="flex-1 px-2">
                            <div class="truncate w-32">
                                <span class="text-gray-800">
                                    {{ channel.name }}
                                </span>
                            </div>
                            <div v-if="imInChan(channel)">
                                <button @click="LeaveCh(userStore.userId, channel.id)" class="btn btn-ghost btn-xs">Lascia il Canale</button>                                                            
                            </div>
                            <div v-else-if="!imInChan(channel)">
                                <button @click="channelJoin(chat.getInsertedPass, false)" class="btn btn-ghost btn-xs">Joina ora!</button>
                            </div>
                            <div v-else>

                            </div>
                            <!-- <button v-if="imAdmin(channel.members)" class="btn btn-ghost btn-xs">Lascia il Canale</button>                                                             -->
                            <ChatSearchBar :channel="channel" :index="index" v-if="imAdmin(channel!)"/>
                            <!-- @friendsClicked="chat.setFriend(true), chat.setGroup(false)                                                             -->
                        </div>
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref, computed } from 'vue';
import { socket } from '@/plugins/Socket.io';
import { EChat, type IChannel, type IMember, type ISingleCh } from "@/models/IChat";
import ChatSearchBar from "./ChatSearchBar.vue"

const chat = ref(useChatStore());
const userStore = ref(useCurrentUserStore());

const imAdmin =  ((channel: IChannel | undefined) => {
if (channel === undefined || channel.members === undefined)
    return false;
const ret = channel.members.find(member => member.userId === userStore.value.userId);
  if (ret?.role === 'ADMIN' || ret?.role === 'OWNER')
      return true;
  else
      return false;
})

const imInChan =  ((channel: IChannel | undefined) => {
if (channel === undefined || channel.members === undefined)
    return false;
const ret = channel.members.find(member => member.userId === userStore.value.userId);
  if (ret)
      return true;
  else
      return false;
})
// Props


const channelJoin = (password: any, invited: boolean) => {    
    socket.emit('joinChannel', { chId: chat.value.getChannelAll?.id, uId: userStore.value.userId, password: password, invited: invited });

    chat.value.setInsertedPass('');
}

const   directJoin = () => {    
    socket.emit('joinDirect', { chId: chat.value.getChannelAll?.id, uId: userStore.value.userId});
    chat.value.setInsertedPass('');
}


const getChannel = (id: string) => {
	socket.emit('getChannel', { chId: id });
	if (id === chat.value.getCurrentChannelId) {
		return;
	}
  chat.value.setCurrentChannelId(id);
socket.emit('enterRoom', { chId: id, currentChannelId: chat.value.getCurrentChannelId, uId: userStore.value.userId});
};

const changeChannel = (channelName: string, id: string) => {
  getChannel(id);
  chat.value.setActivChatUsr(channelName);
  socket.emit('isUserInCh', { uId: userStore.value.userId, chId: id });
  socket.emit('checkIfPassword', {chId: id })
};

const LeaveCh = (id: any, channelId: any) => {   
    socket.emit('kickChannel', { uId: id, chId: channelId })
}

const checkPassera = (channelId: any) => {         
    socket.emit('checkIfPassword', {chId: channelId })
}

const checkPrivChan = (channelId: any) => {         
    socket.emit('checkIfPrivate', {chId: channelId })
}
const getChat = (username: string, id: string, mioId: string) => {
	socket.emit('getChannel', {username: username, chatId: id, mioId: mioId });
	if (id === chat.value.getCurrentChannelId) {
		return;
	}
  chat.value.setCurrentChannelId(id);
  socket.emit('enterRoom', { chId: chat.value.getChannelAll?.id, currentChannelId: chat.value.getCurrentChannelId, uId: userStore.value.userId});
};

const changeDirect = (username: string, chatId: string, mioId: string) => {
    getChat(username, chatId, mioId);
    chat.value.setActivChatUsr(username);
    chat.value.setFlagImIn(true);
    chat.value.setifBanned(false);
};
const toggleActiveGroup = (index: number) => {
    if (chat.value.getChannelList){
    chat.value.getChannelList!.forEach((channel, i) => {
          channel.active = i === index;
      });
      changeChannel(chat.value.getChannelList[index].name, chat.value.getChannelList[index].id);
  }
}
const toggleActiveFriend = (index: number) => {
    if (chat.value.getProfileFriend){
        chat.value.getProfileFriend.forEach((friend, i) => {
            friend.active = i === index;
        });
        changeDirect(chat.value.getProfileFriend[index].username, chat.value.getProfileFriend[index].id, userStore.value.userId);
    }
    directJoin();
};
</script>

<style scoped>

</style>
