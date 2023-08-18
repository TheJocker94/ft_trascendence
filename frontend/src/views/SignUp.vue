<template>
    <div class="row">
        <div class="col">
            <button @click="startChat()" class="btn btn-primary">Start Chat</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useChatStore } from '@/stores/chat';
import { useCurrentUserStore } from '@/stores/currentUser';
import { ref } from 'vue';
const chatStore = ref(useChatStore());
const userStore = ref(useCurrentUserStore())
async function startChat() {
    await chatStore.value.setUsername(userStore.value.username);
    await chatStore.value.socketJoin(userStore.value.username);
}

</script>
