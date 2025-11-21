<template>
    <fieldset class="flex flex-col align-middle rounded-xl">
        <label :for="id" class="py-2 text-md text-gray-700 font-bold" :class="{'flex justify-between': isPasswordTab}">
            <span v-if="isPasswordTab">{{label}}</span>
            <button v-if="isPasswordTab" type="button" @click="togglePasswordVisibility" class="cursor-pointer text-sm px-3">
              <font-awesome-icon v-if="!passwordVisible" icon="fa-solid fa-eye" class="text-cyan-700"/>
              <font-awesome-icon v-else icon="fa-solid fa-eye-slash" class="text-cyan-700" />
            </button>
            <div v-else>{{ label }}</div>
        </label>
        <input class="bg-white border-gray-400 border-2 h-12 p-2 rounded-sm" 
            :type="passwordVisible? 'text': type" 
            :id="id"
            :value="model"
            @input="model = $event.target.value"
            >
    </fieldset>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    id: {type: String, required: false},
    label: {type: String, required: false},
    type: {type: String, required: true},
    isPasswordTab: {type: Boolean, required: true},
    modelValue: {type: [String, Number], required: true}
});
const model = defineModel({type: String, required: true});
const emit = defineEmits(['update:modelValue'])

const passwordVisible = ref(false);
const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
  console.log(passwordVisible.value);
}
</script>
