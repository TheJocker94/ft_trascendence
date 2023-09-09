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
            <div v-if="chat.getGroup && chat.getChannelList">
                <div v-for="(channel, index) in chat.getChannelList" :key="index"
                    :class="['entry', channel.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                    @click="toggleActiveGroup(index)">
                    <div class="flex-1 px-2">
                        <div class="truncate w-32">
                            <span class="text-gray-800">
                                {{ channel.name }}
                            </span>
                        </div>
                        <div v-if="channel.messages.length > 0" class="truncate w-32" ><small class="text-gray-600 ">{{
                            channel.messages[channel.messages.length -
                                1].content }}</small></div>
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
</template>

<script setup lang="ts">
import { useChatStore } from "@/stores/chat";
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref } from 'vue';
import { socket } from '@/plugins/Socket.io';
import { EChat } from "@/models/IChat";

const chat = ref(useChatStore());
const userStore = ref(useCurrentUserStore());
// Props

// functions
console.log('Sucami il cazzo');
console.log('Channel list is daje: ',chat.value.getChannelList);
console.log('Friend is daje: ',chat.value.getFriend);
console.log('Current group is daje: ',chat.value.getGroup);
const getChannel = (id: string) => {
	socket.emit('getChannel', { id: id });
	if (id === chat.value.getCurrentChannelId) {
		return;
	}
  chat.value.setCurrentChannelId(id);
	socket.emit('enterRoom', { id: id, currentChannelId: chat.value.getCurrentChannelId, sender: userStore.value.userId});
};

const changeChannel = (channelName: string, id: string) => {
  getChannel(id);
  chat.value.setActivChatUsr(channelName);
  socket.emit('isUserInCh', { sender: userStore.value.userId, id: id });
};

const changeDirect = (username: string) => {
    chat.value.setActivChatUsr(username);
};
const toggleActiveGroup = (index: number) => {
    if (chat.value.getChannelList){
    chat.value.getChannelList!.forEach((channel, i) => {
          channel.active = i === index;
      });
      changeChannel(chat.value.getChannelList[index].name, chat.value.getChannelList[index].id);
      if (chat.value.getNumDiv === "is1") {
        chat.value.setChatDiv(EChat.CHAT)
    }
  }
}
const toggleActiveFriend = (index: number) => {
    if (chat.value.getProfileFriend){
        chat.value.getProfileFriend.forEach((friend, i) => {
            friend.active = i === index;
        });
        changeDirect(chat.value.getProfileFriend[index].username);
        if (chat.value.getNumDiv === "is1") {
            chat.value.setChatDiv(EChat.CHAT)
    }
    }


};
</script>

<style scoped>

</style>