<template>
  <div class="w-full h-screen">
      <div class="flex h-full">
          <div class="hidden xl:block sm:flex-2 w-64 bg-gray-200">
            <SelectChatGroups 
                v-if="numDiv === 'is3'"
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
                            <span @click="middle=false" class=" inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </span>
                            </span>
    
                            <span @click="middle=true" class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
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
                            <span @click="chatDiv = EChat.SELECT" class=" inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </span>
                            </span>
    
                            <span @click="chatDiv = EChat.GROUP" class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="h-4 w-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                        </path>
                                    </svg>
                                </span>
                            </span>

                            <span @click="chatDiv = EChat.CHAT" class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
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

                      <div class="flex-1 flex h-full overflow-auto max-h-[700px]">
                        <GroupFluid
                            v-if="(numDiv === 'is3' || numDiv === 'is2') && middle"
                            :isGroupsActive="isGroupsActive" 
                            :isFriendsActive="isFriendsActive" 
                            :channel-list="channelList"
                            :profileFriend="profileFriend"
                            v-bind:changeChannel="changeChannel" 
                            @changeChannel="changeChannel"
                            :changeDirect="changeDirect" 
                            @changeDirect="changeDirect"
                        />
                        <SelectChatGroups v-else-if="(numDiv === 'is3' || numDiv === 'is2') && !middle"
                                    :isGroupsActive="isGroupsActive" :isFriendsActive="isFriendsActive"
                                    @friendsClicked="isFriendsActive = true, isGroupsActive = false"
                                    @groupsClicked="isGroupsActive = true, isFriendsActive = false, getChannelList()"
                              />
                          <div class="chat-area flex-1 flex flex-col">
                              <ChatFluid 
                                v-if="chatDiv === EChat.CHAT" 
                                :channelAll="channelAll" :isGroupsActive="isGroupsActive" :activChatUsr="activChatUsr" :currentChannelId="currentChannelId"
                              />
                              <GroupFluid v-else-if="chatDiv === EChat.GROUP" 
                                :isGroupsActive="isGroupsActive" 
                                :isFriendsActive="isFriendsActive" 
                                :channel-list="channelList"
                                :profileFriend="profileFriend"
                                v-bind:changeChannel="changeChannel" 
                                @changeChannel="changeChannel"
                                :changeDirect="changeDirect" 
                                @changeDirect="changeDirect"
                              />
                              <SelectChatGroups v-else-if="chatDiv === EChat.SELECT"
                                    :isGroupsActive="isGroupsActive" :isFriendsActive="isFriendsActive"
                                    @friendsClicked="isFriendsActive = true, isGroupsActive = false"
                                    @groupsClicked="isGroupsActive = true, isFriendsActive = false, getChannelList()"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</template>
props.activChatUsr
<script setup lang="ts">
import { socket } from "@/plugins/Socket.io";
import { ref, watchEffect, watch, onMounted, onUnmounted, type Ref, } from 'vue';
import FriendService from "@/services/FriendService";
import { useCurrentUserStore } from "@/stores/currentUser";
import { type IChannel, type ISingleCh, EChat} from '@/models/IChat'
import ChatFluid from "@/components/chat/ChatFluid.vue";
import GroupFluid from "@/components/chat/GroupFluid.vue";
import { nextTick } from 'vue';
import SelectChatGroups from "@/components/chat/SelectChatGroups.vue";

// Gestione responsive
const numDiv = ref('');
const middle = ref(true);
const chatDiv = ref(EChat.CHAT);
const screenWidth = ref(window.innerWidth);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
}

watchEffect(() => {
  if (screenWidth.value > 1023 && screenWidth.value < 1280) {
    numDiv.value = 'is2'
    chatDiv.value = EChat.CHAT;
    console.log(numDiv.value)
  }
  else if (screenWidth.value < 1024) {
    numDiv.value = 'is1'
    middle.value = true;
    console.log(numDiv.value)
  }
  else {
    numDiv.value = 'is3'
    middle.value = true;
    chatDiv.value = EChat.CHAT;
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
const isFriendsActive = ref(true);
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
// Quando si clicca su un gruppo o un utente, si cambia il valore di activChatUsr a
watch(isFriendsActive, (newValue, oldValue) => {
    currentChannelId.value = '';
    activChatUsr.value = '';
});

// Watch for changes to isGroupsActive
watch(isGroupsActive, (newValue, oldValue) => {
    currentChannelId.value = '';
    activChatUsr.value = '';
});
// const changeToNull = (flg: number) => {
//     if (flg === 1)
//         currentChannelId.value = '';
//     else if (flg === 2)
//         activChatUsr.value = '';
// }
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

const changeChannel = (channelName: string, id: string) => {
  getChannel(id);
  sendUsername(channelName);
};

const changeDirect = (username: string) => {
  sendUsername(username);
};

</script>

