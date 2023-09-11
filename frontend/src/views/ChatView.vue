<template>
  <div class="w-full h-screen">
      <div class="flex h-full">
          <div class="hidden xl:block sm:flex-2 w-64 bg-gray-200">
            <SelectChatGroups 
                v-if="chat.getNumDiv === 'is3'"
              @friendsClicked="chat.setFriend(true), chat.setGroup(false)"
              @groupsClicked="chat.setGroup(true), chat.setFriend(false) , getChannelList()"
            />
          </div>
          <div class="flex-1 bg-gray-100 w-full h-full">
              <div class="main-body container m-auto w-11/12 h-full flex flex-col ">
                  <div class="py-4 flex-2 flex flex-row ">
                      <div class="flex-1">
                          <!-- TODO make it clickable -->
                          <div v-if="chat.getNumDiv === 'is2'">
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
                          <div v-if="chat.getNumDiv === 'is1'">
                            <span @click="chat.setChatDiv(EChat.SELECT); console.log('Valore chatDiv', chat.getChatDiv);" class=" inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="w-4 h-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path d="M4 6h16M4 12h16M4 18h16"></path>
                                    </svg>
                                </span>
                            </span>
    
                            <span @click="chat.setChatDiv(EChat.GROUP); console.log('Valore chatDiv ', chat.getChatDiv)" class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                    <svg class="h-4 w-4" fill="none" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="2" stroke="currentColor" viewBox="0 0 24 24">
                                        <path
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                                        </path>
                                    </svg>
                                </span>
                            </span>

                            <span @click="chat.setChatDiv(EChat.CHAT); console.log('Valore chatDiv', chat.getChatDiv);" class=" inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                <span class="block h-6 w-6 ps-1 rounded-full hover:bg-gray-400">
                                  <i class="h-4 w-4  fa-regular fa-comment-dots"></i>
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
                            v-if="(chat.getNumDiv === 'is3' || chat.getNumDiv === 'is2') && middle"
                        />
                        <SelectChatGroups v-else-if="(chat.getNumDiv === 'is3' || chat.getNumDiv === 'is2') && !middle"
                                    @friendsClicked="chat.setFriend(true), chat.setGroup(false), middle=true"
                                    @groupsClicked="chat.setGroup(true), chat.setFriend(false), getChannelList(), middle=true"
                              />
                          <div class="chat-area flex-1 flex flex-col">
                              <ChatFluid 
                                v-if="chat.getChatDiv === EChat.CHAT"
                              />
                              <SelectChatGroups v-if="chat.getChatDiv === EChat.SELECT"
                                @friendsClicked="chat.setFriend(true), chat.setGroup(false)"
                                @groupsClicked="chat.setFriend(false), chat.setGroup(true), getChannelList()"
                              />
                              <GroupFluid
                                v-if="chat.getChatDiv === EChat.GROUP"
                            />
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
import { ref, watchEffect, onMounted, onUnmounted, type Ref } from 'vue';
import { useCurrentUserStore } from "@/stores/currentUser";
import { type IChannel, type ISingleCh, EChat} from '@/models/IChat'
import ChatFluid from "@/components/chat/ChatFluid.vue";
import GroupFluid from "@/components/chat/GroupFluid.vue";
import { nextTick } from 'vue';
import SelectChatGroups from "@/components/chat/SelectChatGroups.vue";



socket.on('gettingSingleChannel', (data: any) => {
  console.log('userstore valore: ' + userStore.value.userId);
  console.log('channelID in getSingle: ' + data);
    socket.emit('isUserInCh', { uId: userStore.value.userId, chId: data });
  })

socket.on ('isUserInChannel', (channelIn: boolean | string) => {
    if (channelIn === 'BANNED')
      chat.value.setifBanned(true);
    else
    {
      chat.value.setFlagImIn(channelIn as boolean);
      chat.value.setifBanned(false);
    }

})
import { useChatStore } from "@/stores/chat";
import AuthService from "@/services/AuthService";
import UserService from "@/services/UserService";
// Gestione responsive
const chat = ref(useChatStore());
const middle = ref(true);
const screenWidth = ref(window.innerWidth);
const handleResize = () => {
  screenWidth.value = window.innerWidth;
}

watchEffect(() => {
  if (screenWidth.value > 1023 && screenWidth.value < 1280) {
    chat.value.setNumDiv('is2')
    chat.value.setChatDiv(EChat.CHAT);
  }
  else if (screenWidth.value < 1024) {
    chat.value.setNumDiv('is1')
    middle.value = true;
  }
  else {
    chat.value.setNumDiv('is3')
    middle.value = true;
    chat.value.setChatDiv(EChat.CHAT);
  }
})

onMounted(() => {
    window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

const lastMessage: Ref<HTMLDivElement | null> = ref(null);
const usernameAlreadySelected = ref(false);
const userStore = ref(useCurrentUserStore());

async function friendPic() {
  const response = await UserService.getUsers();

  chat.value.setProfileFriend(response.map(user => ({ ...user, active: false })).filter(user => user.username !== userStore.value.username));

}
watchEffect(() => {
  friendPic();
});

const getChannelList = () => {
  socket.emit('channelList');
};

socket.on('singleChannelServer', (channel: ISingleCh) => {
  chat.value.setChannelAll(channel);
});

socket.on('groupListServer', (chList: IChannel[]) => {
  chat.value.setChannelList(chList);
});


socket.on('updateChannelList', () => {
  socket.emit('channelList');
});

socket.on('channelAlreadyExists', (text) => {
  alert("Channel '" + text + "' already exists");
})

socket.on('messageFromServer', (idChannel) => {
  socket.emit('getChannel', { chId: idChannel, uId: userStore.value.userId });
  nextTick(() => {
      setTimeout(() => {
          if (lastMessage.value) {
              lastMessage.value.scrollIntoView();
          }
      }, 80);
  });
})

const getChat = (username: string, id: string, mioId: string) => {
	socket.emit('getChannel', {username: username, chatId: id, mioId: mioId });
	if (id === chat.value.getCurrentChannelId) {
		return;
	}
  chat.value.setCurrentChannelId(id);
};


socket.on('messageFromDirect', (data) => {
  socket.emit('getChannel', { chId: data.chId, mioId: data.mioId, chatId: data.chatId });
  getChat(data.username, data.chatId, data.mioId);
  nextTick(() => {
      setTimeout(() => {
          if (lastMessage.value) {
              lastMessage.value.scrollIntoView();
          }
      }, 80);
  });
})

onMounted(async () => {
  await userStore.value.initStore(null, null);
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
      console.log(message);
  });
});
onUnmounted(() => {
  socket.off('connect');
  socket.off('connect_error');
  socket.disconnect();
});

</script>

