<template>
    <div :class="[chat.getNumDiv != 'is3'? 'menu mt-8': '']">
        <a :class="{
            'block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black': !chat.getFriend,
            'block py-4 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black': chat.getFriend
        }" href="#" @click="$emit('friendsClicked'), changeComponent()">
            <span class="inline-block align-text-bottom mr-2">
                <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="2" viewBox="0 0 24 24" class="w-4 h-4">
                    <path
                        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
                    </path>
                </svg>
            </span>
            Friends
        </a>
        <a :class="{
            'block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black': !chat.getGroup,
            'block py-4 px-12 border-l-4 border-gray-800 bg-gray-300 text-black hover:bg-gray-300 hover:text-black': chat.getGroup
        }" href="#" @click="$emit('groupsClicked'), changeComponent()">
            <span class="inline-block align-text-bottom mr-2">
                <i class="fa-solid fa-people-roof"></i>
            </span>
            Groups
        </a>
        <!-- Open the modal using ID.showModal() method -->

        <a onclick="my_modal_2.showModal()"
            class="cursor-pointer block py-4 px-12 border-l-4 text-gray-600 hover:bg-gray-300 hover:text-black">
            <i class="fa-solid fa-user-group mr-2"></i>Crea canale </a>
        <dialog id="my_modal_2" class="modal">
            <form method="dialog" class="modal-box w-full max-w-sm">
                <!-- inizio copia -->
                <Form @submit="createGroup()" :validation-schema="schema">
                    <div class="md:flex md:items-center mb-6">
                        <div class="md:w-1/3">
                            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                for="channelName">Channel name</label>
                        </div>
                        <div class="md:w-2/3">
                            <Field v-model="credentials.name"
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="channelName" name="channelName" />
                            <ErrorMessage name="channelName" class="text-red-500" />
                        </div>
                    </div>
                    <div class="md:flex md:items-center mb-6">
                        <div class="md:w-1/3">
                            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                for="channelPassword">Password</label>
                        </div>
                        <div class="md:w-2/3">
                            <Field v-model="credentials.password"
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="channelPassword" name="channelPassword" />
                            <ErrorMessage name="channelPassword" class="text-red-500" />
                        </div>
                    </div>
                    <div class="md:flex md:items-center mb-6">
                        <div class="md:w-1/3">
                            <label class="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                                for="channelType">Type</label>
                        </div>
                        <div class="md:w-2/3">
                            <Field v-model="credentials.type"
                                class="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500"
                                id="channelType" name="channelType" as="select">
                                <option value="PUBLIC">Public</option>
                                <option value="PRIVATE">Private</option>
                            </Field>
                            <ErrorMessage name="channelType" class="text-red-500" />
                        </div>
                    </div>
                    <div class=" md:flex md:items-center">
                        <div class="md:w-1/3"></div>
                        <div class=" md:w-2/3">
                            <button
                                class="modal-action shadow bg-purple-500 hover:bg-purple-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded">
                                Create
                            </button>
                        </div>
                    </div>
                </Form>
                <!-- Fine copiua -->
            </form>
            <form method="dialog" class="modal-backdrop">
                <button ref="myButton"></button>
            </form>
        </dialog>
        <!--  -->
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Form, Field, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';
import { useCurrentUserStore } from '@/stores/currentUser';
import { socket } from '@/plugins/Socket.io';
import { useChatStore } from "@/stores/chat";
import { EChat } from '@/models/IChat';

const chat = ref(useChatStore());
// Props

// Variable declaration
const schema = yup.object().shape({
channelName: yup.string().required().label('Channel Name'),
channelPassword: yup.string().notRequired().label('Channel Password'),
channelType: yup.string().required().label('Channel Type')
});
const credentials = reactive({
  name: "",
  password: "",
  type: ""
})
const userStore = ref(useCurrentUserStore());
const myButton = ref<HTMLButtonElement | null>(null);
const changeComponent = () => {
    if (chat.value.getNumDiv === "is1") {
        chat.value.setChatDiv(EChat.GROUP)
    }
};
// Functions
const createGroup = () => {
  if (credentials.name === '') {
      return;
  }
  if (credentials.type === '') {
      return;
  }
  console.log('sto creando il gruppo da frontend')
  myButton.value!.click();
  socket.emit('createGroup', { text: credentials.name, uId: userStore.value.userId, type: credentials.type, password: credentials.password });
  credentials.name = '';
  credentials.type = '';
  credentials.password = '';
  if (chat.value.getGroup === true) {
      socket.emit('channelList');
  }
};
</script>

<style scoped>

</style>
