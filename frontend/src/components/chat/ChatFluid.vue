<template>
    <!-- Inizio GroupChat -->
    <div v-if="props.isGroupsActive" class="messages flex-1 overflow-auto max-h-[700px]">
        <div v-for="(chMes, index) in props.channelAll?.messages" :key="index">
            <div
                :class="['message mb-4', chMes.sender.id !== userStore.userId ? 'flex' : 'flex me text-right']">
                <div v-if="userStore.userId !== chMes.sender.id" class="flex-2">
                    <div class="w-12 h-12 relative">
                        <img class="w-12 h-12 rounded-full mx-auto"
                            :src="chMes.sender.profilePicture" :alt=chMes.sender.username />
                        <span
                            class="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
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
</template>

<script setup lang="ts">
import  { type ISingleCh } from '@/models/IChat'
import { useCurrentUserStore } from "@/stores/currentUser";
import { ref } from "vue";

const userStore = ref(useCurrentUserStore());
const props = defineProps({
        channelAll: {
            type: Object as () => ISingleCh | undefined, // use the interface as a type
            required: true
        },
        isGroupsActive: Boolean
    });
// Function to format time
const formattedTime = (date: any) => {
    if (typeof date === 'string')
        date = new Date(date);
    if (!(date instanceof Date)) {
        console.log("date is NOT a Date object:", date);
        return "";
    }
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`;
    return formattedTime;
};
</script>

<style scoped>

</style>