import { EChat, type IChannel, type ISingleCh } from '@/models/IChat';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useChatStore = defineStore('chat', () => {
  const isGroupsActive = ref(false)
  const isFriendsActive = ref(true)
  // Getters and Setters IsFriendsActive and IsGroupsActive
  const getFriend = computed(() => isFriendsActive.value);
  const getGroup = computed(() => isGroupsActive.value);
  const setFriend = (val:boolean) => { isFriendsActive.value = val, currentChannelId.value = ''; activChatUsr.value = ''; channelAll.value = undefined;} 
  const setGroup = (val:boolean) => { isGroupsActive.value = val, currentChannelId.value = ''; activChatUsr.value = '';  channelAll.value = undefined;}
  // List of friends and channels
  const profileFriend = ref<any[]>();
  const channelList = ref<IChannel[] | undefined>();
  // Getters and Setters for channelList and profileFriend
  const getProfileFriend = computed(() => profileFriend.value);
  const setProfileFriend = (val:any[]) => { profileFriend.value = val }
  const getChannelList = computed(() => channelList.value);
  const setChannelList = (val:IChannel[]) => { channelList.value = val }
  // Single channel
  const channelAll = ref<ISingleCh>();
  const getChannelAll = computed(() => channelAll.value);
  const setChannelAll = (val:ISingleCh) => { channelAll.value = val }
  // Active chat user and channel name
  const activChatUsr = ref('');
  const currentChannelId = ref('');
  const getActivChatUsr = computed(() => activChatUsr.value);
  const setActivChatUsr = (val:string) => { activChatUsr.value = val }
  const getCurrentChannelId = computed(() => currentChannelId.value);
  const setCurrentChannelId = (val:string) => { currentChannelId.value = val }
  // num div
  const numDiv = ref('');
  const getNumDiv = computed(() => numDiv.value);
  const setNumDiv = (val:string) => { numDiv.value = val }
  // gestore single div mobile
  const chatDiv = ref(EChat.CHAT);
  const getChatDiv = computed(() => chatDiv.value);
  const setChatDiv = (val:EChat) => { chatDiv.value = val }
  return { isGroupsActive, isFriendsActive, getFriend, getGroup, setFriend, setGroup, profileFriend, channelList, channelAll,
          activChatUsr, currentChannelId, setActivChatUsr, setCurrentChannelId, getActivChatUsr, getCurrentChannelId,
          getChannelList, setChannelList, getChannelAll, setChannelAll, setProfileFriend, getProfileFriend,
          numDiv, getNumDiv, setNumDiv, chatDiv, getChatDiv, setChatDiv }
})