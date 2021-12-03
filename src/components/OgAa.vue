<template>
    <span class="choices">
        <!-- <transition name="ogaa" mode="out-in">
            <button class="choice" @click="selection = 1" v-if="selection == 0">??</button>
            <button class="choice" @click="selection = 2" v-else-if="selection == 1">og</button>
            <button class="choice" @click="selection = 1" v-else>å</button>
        </transition> -->
        <button class="choice" :class="{ active: selection == 1 }" @click="selection = 1">og</button>
        <button class="choice" :class="{ active: selection == 2 }" @click="selection = 2">å</button>
    </span>
</template>

<script>
export default {
    data() {
        return {
            selection: 0,
        }
    },
    methods: {

    }
}
</script>

<style scoped>
    .choices {
        display: inline-block;
    }
    .choices > button {
        min-width: 4em;
        padding: .2em;
    }

    .ogaa-enter-from,
    .ogaa-leave-to {
        transform: rotateX(90deg);
    }
    .ogaa-enter-active,
    .ogaa-leave-active {
        transition: all .05s ease;
    }
</style>