import { EChat, type IChannel, type ISingleCh } from '@/models/IChat';
import { useCurrentUserStore } from './currentUser';
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { bool } from 'yup';

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
  const channelAll = ref<ISingleCh>() || undefined;
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

  // flag im in channel
  const flagImIn = ref(false);
  const getFlagImIn = computed(() => flagImIn.value);
  const setFlagImIn = (val:boolean) => {flagImIn.value = val, console.log('flagImIn', flagImIn.value) };

  const ifBanned = ref(false);
  const getifBanned = computed(() => ifBanned.value);
  const setifBanned = (val:boolean) => {ifBanned.value = val, console.log('ifBanned', ifBanned.value) };

  const isActive = ref(false);
  const getIsActive = computed(() => isActive.value);
  const setIsActive = (val:boolean) => {isActive.value = val, console.log('isActive', isActive.value) };

  const porcovar = ref(false);
  const getporcovar = computed(() => porcovar.value);
  const setporcovar = (val:boolean) => {porcovar.value = val, console.log('porcovar', porcovar.value) };

const isPassOn = ref(false);
const getIsPassOn = computed(() => isPassOn.value);
const setIsPassOn = (val:boolean) => {isPassOn.value = val, console.log('isPassOn', isPassOn.value) };

const insertedPass = ref('');
const getInsertedPass = computed(() => insertedPass.value);
const setInsertedPass = (val:string) => {insertedPass.value = val, console.log('insertedPass', insertedPass.value) };

const selectedValue = ref('5');
const getSelectedValue = computed(() => selectedValue.value);
const setSelectedValue = (val:string) => {selectedValue.value = val, console.log('selectedValue', selectedValue.value) };

const ifPrivate = ref(false);
const getIfPrivate = computed(() => ifPrivate.value);
const setIfPrivate = (val:boolean) => {ifPrivate.value = val, console.log('ifPrivate', ifPrivate.value) };


  return { isGroupsActive, isFriendsActive, getFriend, getGroup, setFriend, setGroup, profileFriend, channelList, channelAll,
          activChatUsr, currentChannelId, setActivChatUsr, setCurrentChannelId, getActivChatUsr, getCurrentChannelId,
          getChannelList, setChannelList, getChannelAll, setChannelAll, setProfileFriend, getProfileFriend,
          numDiv, getNumDiv, setNumDiv, chatDiv, getChatDiv, setChatDiv, flagImIn, getFlagImIn, setFlagImIn, 
          ifBanned, getifBanned, setifBanned, isActive, getIsActive, setIsActive, porcovar, getporcovar, setporcovar,
          isPassOn, getIsPassOn, setIsPassOn, insertedPass, getInsertedPass, setInsertedPass,
          selectedValue, getSelectedValue, setSelectedValue, ifPrivate, getIfPrivate, setIfPrivate}
})
