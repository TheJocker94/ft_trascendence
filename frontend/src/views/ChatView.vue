<template>
  <div class="w-full h-screen">
      <div class="flex h-full">
          <div class="hidden xl:block sm:flex-2 w-64 bg-gray-200">
            <SelectChatGroups 
              :isGroupsActive="isGroupsActive" :isFriendsActive="isFriendsActive"
              @friendsClicked="isFriendsActive = true, isGroupsActive = false"
              @groupsClicked="isGroupsActive = true, isFriendsActive = false, getChannelList()"
            />
          </div>
          <div class="flex-1 bg-gray-100 w-full h-full">
              <div class="main-body container m-auto w-11/12 h-full flex flex-col ">
                  <div class="py-4 flex-2 flex flex-row ">
                      <div class="flex-1">
                          <!-- TODO make it clickable -->
                          <div v-if="numDiv === 'is2'">
                            <span class=" inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </span>
                            </span>
    
                            <span class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
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
                          <div v-if="numDiv === 'is1'">
                            <span class=" inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </span>
                            </span>
    
                            <span class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
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
                      </div>
                  </div>

                  <div class="main flex-1 flex flex-col ">
                      <div class="hidden lg:block heading flex-2">
                          <h1 class="text-3xl text-gray-700 mb-4">Chat</h1>
                      </div>

                      <div class="flex-1 flex h-full">
                          <GroupFluid 
                            :isGroupsActive="isGroupsActive" :isFriendsActive="isFriendsActive" :channelList="channelList" :profileFriend="profileFriend"
                            @changeDirect="sendUsername($event.name)"
                          />
                          <div class="chat-area flex-1 flex flex-col">
                              <div class="flex-3">
                                  <h2 class="text-xl py-1 mb-8 border-b-2 border-gray-200">{{screenWidth}}Chatting with <b>{{
                                      activChatUsr }}</b></h2>
                              </div>
                              <ChatFluid :channelAll="channelAll" :isGroupsActive="isGroupsActive" />
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
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { socket } from "@/plugins/Socket.io";
import { ref, watchEffect, onMounted, onUnmounted, type Ref, } from 'vue';
import FriendService from "@/services/FriendService";
import { useCurrentUserStore } from "@/stores/currentUser";
import type { IChannel, ISingleCh } from '@/models/IChat'
import ChatFluid from "@/components/chat/ChatFluid.vue";
import GroupFluid from "@/components/chat/GroupFluid.vue";
import { nextTick } from 'vue';
import SelectChatGroups from "@/components/chat/SelectChatGroups.vue";

// Gestione responsive
const numDiv = ref('');
const screenWidth = ref(window.innerWidth);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
}

watchEffect(() => {
  if (screenWidth.value > 1023 && screenWidth.value < 1280) {
    numDiv.value = 'is2'
    console.log(numDiv.value)
  }
  else if (screenWidth.value < 1024) {
    numDiv.value = 'is1'
    console.log(numDiv.value)
  }
  else {
    numDiv.value = 'is3'
    console.log(numDiv.value)
  }
})

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

// Fine gestione responsive
const isFriendsActive = ref(false);
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

const activChatUsr = ref('');
function sendUsername(user: string) {
  activChatUsr.value = user;
}

async function friendPic() {
  // if (props.idProfile !== currentUser.value.userId)
  const response = await FriendService.getFriendList();
  profileFriend.value = response.map(friend => ({ ...friend, active: false }));
  // else
  //     profileFriend.value = await FriendService.getFriendList(currentUser.value.userId!);
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
};

const formattedTime = (date: any) => {
  if (typeof date === 'string') {
      date = new Date(date);
  }
  if (!(date instanceof Date)) {
      console.log("date is NOT a Date object:", date);
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
  console.log(channel);
  channelAll.value = channel;
});
socket.on('groupListServer', (chList: IChannel[]) => {
  console.log(chList);
  channelList.value = chList;
});

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
  await userStore.value.initStore(null, null, null);
  const username = userStore.value.username;
  socket.auth = { username };
  socket.connect();
  socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
          usernameAlreadySelected.value = false;
      }
  });
  socket.on('welcome', (message: string) => {
      console.log(message);
  });
});
onUnmounted(() => {
  socket.off('connect');
  socket.off('connect_error');
  socket.disconnect();
});

// const isModalOpen = ref(false);

// // const openModal = () => {
// // 	isModalOpen.value = true;
// // };

// const closeModal = () => {
// 	isModalOpen.value = false;
// };

</script>

