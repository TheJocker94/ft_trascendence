<template>
    <div class="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
        <div class="search flex-2 pb-6 px-2">
            <input type="text"
                class="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200"
                placeholder="Search">
        </div>
        <div class="flex-1 h-full overflow-auto px-2">
            <div v-if="props.isFriendsActive">
                <div v-for="(friend, index) in props.profileFriend" :key="index"
                    :class="['entry', friend.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                    @click="toggleActive(index), $emit('changeDirect', friend.username) ">
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
            <div v-if="props.isGroupsActive">
                <div v-for="(channel, index) in props.channelList" :key="index"
                    :class="['entry', channel.active ? 'border-l-4 border-red-500' : '', 'cursor-pointer', 'transform', 'hover:scale-105', 'duration-300', 'transition-transform', 'bg-white', 'mb-4', 'rounded', 'p-4', 'flex', 'shadow-md']"
                    @click="toggleActive(index), $emit('changeChannel', channel.name, channel.id)">
                    <!-- ,sendUsername(channel.name), getChannel(channel.id) -->
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
import type { IChannel } from '@/models/IChat';
// Props
const props = defineProps({
    isGroupsActive: Boolean,
    isFriendsActive: Boolean,
    channelList: {
            type: Object as () => IChannel[] | undefined, // use the interface as a type
            required: true
        },
    profileFriend: {
            type: Object as () => any[] | undefined, // use the interface as a type
            required: true
        }
});

// functions
const toggleActive = (index: number) => {
  props.profileFriend!.forEach((friend, i) => {
      friend.active = i === index;
  });
  props.channelList!.forEach((channel, i) => {
      channel.active = i === index;
  });
};
</script>

<style scoped>

</style>